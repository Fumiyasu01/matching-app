'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Profile, ProfileUpdate } from '@/types/database'

export function useProfile() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<Profile> => {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) throw new Error('認証エラーが発生しました')
      if (!user) throw new Error('ログインが必要です')

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw new Error('プロフィールの取得に失敗しました')
      if (!data) throw new Error('プロフィールが見つかりません')

      return data
    },
    staleTime: 60 * 1000, // 1分
  })
}

export function useUpdateProfile() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: ProfileUpdate) => {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) throw new Error('認証エラーが発生しました')
      if (!user) throw new Error('ログインが必要です')

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) throw new Error('プロフィールの更新に失敗しました')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
