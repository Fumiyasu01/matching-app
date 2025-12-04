'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { ensureAuthenticated } from '@/lib/auth'
import { queryKeys } from '@/lib/query-keys'
import type { Profile } from '@/types/database'

export type SwipeDirection = 'left' | 'right'
export type SwipeAction = 'like' | 'pass'

interface SwipeResult {
  matched: boolean
  matchedProfile: Profile | null
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
      const user = await ensureAuthenticated()

      // スワイプを保存
      const { error: swipeError } = await supabase
        .from('swipes')
        .insert({
          swiper_id: user.id,
          swiped_id: swipedId,
          action,
        })

      if (swipeError) throw new Error('スワイプの保存に失敗しました')

      // likeの場合、マッチングをチェック
      if (action === 'like') {
        const { data: match, error: matchError } = await supabase
          .from('matches')
          .select('id')
          .or(`and(user1_id.eq.${user.id},user2_id.eq.${swipedId}),and(user1_id.eq.${swipedId},user2_id.eq.${user.id})`)
          .maybeSingle()

        if (matchError) {
          console.error('Match check error:', matchError)
        }

        if (match) {
          // マッチした相手のプロフィールを取得
          const { data: matchedProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', swipedId)
            .single()

          if (matchedProfile) {
            return { matched: true, matchedProfile }
          }
        }
      }

      return { matched: false, matchedProfile: null }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.discoverProfiles })
      queryClient.invalidateQueries({ queryKey: queryKeys.matches })
    },
  })
}

export function directionToAction(direction: SwipeDirection): SwipeAction {
  return direction === 'right' ? 'like' : 'pass'
}
