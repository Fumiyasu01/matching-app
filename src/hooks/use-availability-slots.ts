'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockStore } from '@/lib/mock-data'
import { withDataSource } from '@/lib/data-source'
import { queryKeys } from '@/lib/query-keys'
import { invalidateAfterAvailabilitySlotChange } from '@/lib/query-invalidation'
import type { AvailabilitySlot } from '@/types/database'

export type AvailabilitySlotInput = Omit<AvailabilitySlot, 'id' | 'user_id' | 'created_at'>

export function useAvailabilitySlots() {
  return useQuery({
    queryKey: queryKeys.availabilitySlots,
    queryFn: async (): Promise<AvailabilitySlot[]> =>
      withDataSource(
        () => mockStore.getUserAvailabilitySlots(),
        async () => {
          // TODO: Implement real API call
          return []
        }
      ),
    staleTime: 30 * 1000,
  })
}

export function useAddAvailabilitySlot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (slot: AvailabilitySlotInput): Promise<AvailabilitySlot> =>
      withDataSource(
        () => mockStore.addAvailabilitySlot(slot),
        async () => {
          // TODO: Implement real API call
          throw new Error('Not implemented')
        }
      ),
    onSuccess: () => {
      invalidateAfterAvailabilitySlotChange(queryClient)
    },
  })
}

export function useUpdateAvailabilitySlot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AvailabilitySlot> }): Promise<AvailabilitySlot | null> =>
      withDataSource(
        () => mockStore.updateAvailabilitySlot(id, updates),
        async () => {
          // TODO: Implement real API call
          throw new Error('Not implemented')
        }
      ),
    onSuccess: () => {
      invalidateAfterAvailabilitySlotChange(queryClient)
    },
  })
}

export function useDeleteAvailabilitySlot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<boolean> =>
      withDataSource(
        () => mockStore.deleteAvailabilitySlot(id),
        async () => {
          // TODO: Implement real API call
          throw new Error('Not implemented')
        }
      ),
    onSuccess: () => {
      invalidateAfterAvailabilitySlotChange(queryClient)
    },
  })
}
