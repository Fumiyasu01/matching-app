'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export function useCurrentUser() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['current-user'],
    queryFn: async (): Promise<User> => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      if (!user) throw new Error('Not authenticated')
      return user
    },
    staleTime: 5 * 60 * 1000, // 5分
  })
}
