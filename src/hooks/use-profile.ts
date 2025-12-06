'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { ensureAuthenticated } from '@/lib/auth'
import { queryKeys } from '@/lib/query-keys'
import { sanitizeDisplayName, sanitizeUserInput, sanitizeStringArray } from '@/lib/sanitize'
import { invalidateAfterProfileUpdate } from '@/lib/query-invalidation'
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

      // Sanitize user inputs before saving
      const sanitizedUpdates: ProfileUpdate = {
        ...updates,
        display_name: updates.display_name ? sanitizeDisplayName(updates.display_name) : undefined,
        bio: updates.bio ? sanitizeUserInput(updates.bio).slice(0, 500) : updates.bio,
        location: updates.location ? sanitizeUserInput(updates.location).slice(0, 100) : updates.location,
        skills: updates.skills ? sanitizeStringArray(updates.skills) : undefined,
        interests: updates.interests ? sanitizeStringArray(updates.interests) : undefined,
      }

      const { error } = await supabase
        .from('profiles')
        .update(sanitizedUpdates)
        .eq('id', user.id)

      if (error) throw new Error('プロフィールの更新に失敗しました')
    },
    onSuccess: () => {
      invalidateAfterProfileUpdate(queryClient)
    },
  })
}
