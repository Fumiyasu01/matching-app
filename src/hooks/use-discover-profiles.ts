'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'

export function useDiscoverProfiles() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['discover-profiles'],
    queryFn: async (): Promise<Profile[]> => {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) throw new Error('認証エラーが発生しました')
      if (!user) throw new Error('ログインが必要です')

      // 自分がスワイプ済みのユーザーIDを取得
      const { data: swipedIds, error: swipeError } = await supabase
        .from('swipes')
        .select('swiped_id')
        .eq('swiper_id', user.id)

      if (swipeError) throw new Error('データの取得に失敗しました')

      const excludeIds = [
        user.id,
        ...(swipedIds?.map(s => s.swiped_id) || [])
      ]

      // 未スワイプのユーザーを取得
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .not('id', 'in', `(${excludeIds.join(',')})`)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw new Error('ユーザー情報の取得に失敗しました')
      return data || []
    },
    staleTime: 30 * 1000, // 30秒
    retry: 2,
  })
}
