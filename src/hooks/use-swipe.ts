'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
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
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) throw new Error('認証エラーが発生しました')
      if (!user) throw new Error('ログインが必要です')

      // スワイプを保存
      const { error: swipeError } = await supabase
        .from('swipes')
        .insert({
          swiper_id: user.id,
          swiped_id: swipedId,
          action,
        })

      if (swipeError) throw new Error('スワイプの保存に失敗しました')

      // likeの場合、マッチングをチェック（1クエリで取得）
      if (action === 'like') {
        // matchesテーブルのトリガーでマッチが作成されている可能性をチェック
        // profilesとjoinして1クエリで取得
        const { data: matchWithProfile, error: matchError } = await supabase
          .from('matches')
          .select(`
            id,
            profiles!matches_user1_id_fkey(id, display_name, avatar_url, bio, skills, location, looking_for),
            profiles!matches_user2_id_fkey(id, display_name, avatar_url, bio, skills, location, looking_for)
          `)
          .or(`and(user1_id.eq.${user.id},user2_id.eq.${swipedId}),and(user1_id.eq.${swipedId},user2_id.eq.${user.id})`)
          .maybeSingle()

        if (matchError) {
          console.error('Match check error:', matchError)
        }

        if (matchWithProfile) {
          // マッチ相手のプロフィールを抽出
          const profile1 = matchWithProfile.profiles as unknown as Profile | null
          const profile2 = (matchWithProfile as any).profiles as unknown as Profile | null

          // 相手のプロフィールを特定
          const matchedProfile = profile1?.id === swipedId
            ? profile1
            : profile2?.id === swipedId
              ? profile2
              : null

          if (matchedProfile) {
            return { matched: true, matchedProfile }
          }
        }
      }

      return { matched: false, matchedProfile: null }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discover-profiles'] })
      queryClient.invalidateQueries({ queryKey: ['matches'] })
    },
  })
}

export function directionToAction(direction: SwipeDirection): SwipeAction {
  return direction === 'right' ? 'like' : 'pass'
}
