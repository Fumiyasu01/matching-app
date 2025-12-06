'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { ensureAuthenticated } from '@/lib/auth'
import { queryKeys } from '@/lib/query-keys'
import { mockStore } from '@/lib/mock-data'
import { withDataSource } from '@/lib/data-source'
import type { ProfileWithDetails } from '@/types/database'
import type { DiscoverFilters } from './use-discover-filters'

interface UseDiscoverProfilesOptions {
  filters?: DiscoverFilters
  userLocation?: { latitude: number; longitude: number } | null
}

export function useDiscoverProfiles(options?: UseDiscoverProfilesOptions) {
  const supabase = createClient()
  const { filters, userLocation } = options || {}

  return useQuery({
    queryKey: [...queryKeys.discoverProfiles, filters, userLocation],
    queryFn: async (): Promise<ProfileWithDetails[]> =>
      withDataSource(
        () => mockStore.getUnswipedProfiles({
          lookingFor: filters?.lookingFor,
          skills: filters?.skills,
          maxDistance: filters?.maxDistance,
          userLocation,
        }),
        async () => {
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

          // Build query with filters
          let query = supabase
            .from('profiles')
            .select('*')
            .not('id', 'in', `(${excludeIds.join(',')})`)

          // Apply looking_for filter
          if (filters?.lookingFor && filters.lookingFor.length > 0) {
            query = query.in('looking_for', filters.lookingFor)
          }

          // Apply skills filter (profiles that have ANY of the selected skills)
          if (filters?.skills && filters.skills.length > 0) {
            query = query.overlaps('skills', filters.skills)
          }

          // Note: Distance filtering in production would require PostGIS or similar
          // For now, we'll fetch all and filter client-side if needed
          query = query.order('created_at', { ascending: false }).limit(20)

          const { data, error } = await query

          if (error) throw new Error('ユーザー情報の取得に失敗しました')

          let profiles = data || []

          // Client-side distance filtering if needed
          if (filters?.maxDistance && userLocation) {
            profiles = profiles.filter(p => {
              if (!p.latitude || !p.longitude) return false
              const R = 6371 // Earth radius in km
              const dLat = (p.latitude - userLocation.latitude) * Math.PI / 180
              const dLon = (p.longitude - userLocation.longitude) * Math.PI / 180
              const a =
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(userLocation.latitude * Math.PI / 180) *
                Math.cos(p.latitude * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2)
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
              const distance = R * c
              return distance <= filters.maxDistance!
            })
          }

          return profiles
        }
      ),
    staleTime: 30 * 1000,
    retry: 2,
  })
}
