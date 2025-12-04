'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { ensureAuthenticated } from '@/lib/auth'
import { queryKeys } from '@/lib/query-keys'
import { mockStore } from '@/lib/mock-data'
import { USE_MOCK_DATA } from '@/lib/config'
import type { Profile } from '@/types/database'

export function useDiscoverProfiles() {
  const supabase = createClient()

  return useQuery({
    queryKey: queryKeys.discoverProfiles,
    queryFn: async (): Promise<Profile[]> => {
      // Return mock data if enabled
      if (USE_MOCK_DATA) {
        return mockStore.getUnswipedProfiles()
      }

      const user = await ensureAuthenticated()

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
    staleTime: 30 * 1000,
    retry: 2,
  })
}
