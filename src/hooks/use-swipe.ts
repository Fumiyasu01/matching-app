'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'

type SwipeAction = 'like' | 'pass'

interface SwipeResult {
  matched: boolean
  matchedProfile?: Profile
}

export function useSwipe() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      swipedId,
      action
    }: {
      swipedId: string
      action: SwipeAction
    }): Promise<SwipeResult> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // スワイプを保存
      const { error: swipeError } = await supabase
        .from('swipes')
        .insert({
          swiper_id: user.id,
          swiped_id: swipedId,
          action,
        })

      if (swipeError) throw swipeError

      // likeの場合、マッチングをチェック
      if (action === 'like') {
        const { data: match } = await supabase
          .from('matches')
          .select('*')
          .or(`and(user1_id.eq.${user.id},user2_id.eq.${swipedId}),and(user1_id.eq.${swipedId},user2_id.eq.${user.id})`)
          .single()

        if (match) {
          // マッチした相手のプロフィールを取得
          const { data: matchedProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', swipedId)
            .single()

          return { matched: true, matchedProfile: matchedProfile || undefined }
        }
      }

      return { matched: false }
    },
    onSuccess: () => {
      // プロフィール一覧を再取得
      queryClient.invalidateQueries({ queryKey: ['discover-profiles'] })
    },
  })
}
