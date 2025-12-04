'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'

export function useDiscoverProfiles() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['discover-profiles'],
    queryFn: async (): Promise<Profile[]> => {
      // 現在のユーザーを取得
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // 自分がスワイプ済みのユーザーIDを取得
      const { data: swipedIds } = await supabase
        .from('swipes')
        .select('swiped_id')
        .eq('swiper_id', user.id)

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

      if (error) throw error
      return data || []
    },
  })
}
