'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { ensureAuthenticated } from '@/lib/auth'
import { queryKeys } from '@/lib/query-keys'
import type { Profile, ProfileUpdate } from '@/types/database'

export function useProfile() {
  const supabase = createClient()

  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: async (): Promise<Profile> => {
      const user = await ensureAuthenticated()

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw new Error('プロフィールの取得に失敗しました')
      if (!data) throw new Error('プロフィールが見つかりません')

      return data
    },
    staleTime: 60 * 1000,
  })
}

export function useUpdateProfile() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: ProfileUpdate) => {
      const user = await ensureAuthenticated()

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) throw new Error('プロフィールの更新に失敗しました')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile })
    },
  })
}
