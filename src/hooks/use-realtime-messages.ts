'use client'

import { useQuery } from '@tanstack/react-query'
import { mockStore } from '@/lib/mock-data'
import { USE_MOCK_DATA } from '@/lib/config'
import { withDataSource, withDataSourceSync } from '@/lib/data-source'
import { queryKeys } from '@/lib/query-keys'
import type { Message } from '@/types/database'

export interface RealtimeMessage extends Message {
  isOwn: boolean
}

export interface RealtimeMessagesResult {
  messages: RealtimeMessage[]
  isTyping: boolean
  isLoading: boolean
}

/**
 * Real-time messages hook with polling and typing indicator
 * Polls mockStore every 500ms for new messages and typing status
 */
export function useRealtimeMessages(matchId: string): RealtimeMessagesResult {
  const messagesQuery = useQuery({
    queryKey: queryKeys.messages(matchId),
    queryFn: async (): Promise<RealtimeMessage[]> =>
      withDataSource(
        () => {
          const messages = mockStore.getMessages(matchId)
          return messages.map(msg => ({
            ...msg,
            isOwn: msg.sender_id === 'current-user',
          }))
        },
        async () => {
          // Real Supabase implementation would go here
          return []
        }
      ),
    staleTime: 0, // Always consider data stale for real-time updates
    refetchInterval: USE_MOCK_DATA ? 500 : false, // Poll every 500ms for mock data
  })

  const typingQuery = useQuery({
    queryKey: [...queryKeys.messages(matchId), 'typing'],
    queryFn: async (): Promise<boolean> =>
      withDataSource(
        () => mockStore.isTyping(matchId),
        async () => false
      ),
    staleTime: 0,
    refetchInterval: USE_MOCK_DATA ? 500 : false,
  })

  return {
    messages: messagesQuery.data || [],
    isTyping: typingQuery.data || false,
    isLoading: messagesQuery.isLoading,
  }
}
