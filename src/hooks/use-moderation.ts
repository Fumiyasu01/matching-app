import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mockStore } from '@/lib/mock-data'
import { invalidateAfterBlock, invalidateAfterUnblock } from '@/lib/query-invalidation'
import type { ReportReason } from '@/types/moderation'

// Block user
export function useBlockUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      mockStore.blockUser(userId)
      return userId
    },
    onSuccess: () => {
      invalidateAfterBlock(queryClient)
    },
  })
}

// Unblock user
export function useUnblockUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      mockStore.unblockUser(userId)
      return userId
    },
    onSuccess: () => {
      invalidateAfterUnblock(queryClient)
    },
  })
}

// Report user
export function useReportUser() {
  return useMutation({
    mutationFn: async ({
      userId,
      reason,
      description,
    }: {
      userId: string
      reason: ReportReason
      description?: string
    }) => {
      return mockStore.reportUser(userId, reason, description)
    },
  })
}

// Get blocked users
export function useBlockedUsers() {
  return useQuery({
    queryKey: ['blocked-users'],
    queryFn: async () => {
      return mockStore.getBlockedUsers()
    },
  })
}
