'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ensureAuthenticated, getCurrentUser } from '@/lib/auth'
import { queryKeys } from '@/lib/query-keys'
import { mockStore, mockProfiles } from '@/lib/mock-data'
import { USE_MOCK_DATA } from '@/lib/config'
import { withDataSource } from '@/lib/data-source'
import { notifyMessage } from '@/lib/notifications'
import { invalidateAfterMessage, invalidateAfterMarkAsRead } from '@/lib/query-invalidation'
import type { Message, Profile } from '@/types/database'

// ============================================================================
// Types
// ============================================================================
export interface ChatMessage extends Message {
  isOwn: boolean
}

// ============================================================================
// Hook: useMessages
// Fetches and subscribes to messages for a specific match
// ============================================================================
export function useMessages(matchId: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const lastMessageCountRef = useRef(0)

  const query = useQuery({
    queryKey: queryKeys.messages(matchId),
    queryFn: async (): Promise<ChatMessage[]> =>
      withDataSource(
        () => {
          const messages = mockStore.getMessages(matchId)
          return messages.map(msg => ({
            ...msg,
            isOwn: msg.sender_id === 'current-user',
          }))
        },
        async () => {
          const user = await ensureAuthenticated()

          const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('match_id', matchId)
            .order('created_at', { ascending: true })

          if (error) throw new Error('メッセージの取得に失敗しました')

          return (data || []).map(msg => ({
            ...msg,
            isOwn: msg.sender_id === user.id,
          }))
        }
      ),
    staleTime: 10 * 1000,
    refetchInterval: USE_MOCK_DATA ? 1000 : false, // Poll for mock auto-replies
  })

  // Check for new messages in mock mode (for auto-replies)
  useEffect(() => {
    if (USE_MOCK_DATA && query.data) {
      const currentCount = query.data.length
      if (currentCount > lastMessageCountRef.current && lastMessageCountRef.current > 0) {
        // New message arrived, invalidate matches to update unread count
        queryClient.invalidateQueries({ queryKey: queryKeys.matches })

        // 最新メッセージが自分のものでない場合は通知を表示
        const latestMessage = query.data[query.data.length - 1]
        if (latestMessage && !latestMessage.isOwn) {
          // 送信者のプロフィールを取得して通知
          const partnerData = queryClient.getQueryData<Profile>(
            queryKeys.chatPartner(matchId)
          )
          if (partnerData) {
            notifyMessage(
              partnerData.display_name,
              latestMessage.content,
              matchId,
              partnerData.avatar_url || undefined
            )
          }
        }
      }
      lastMessageCountRef.current = currentCount
    }
  }, [query.data, queryClient, matchId])

  // Realtimeサブスクリプション (only for real mode)
  useEffect(() => {
    if (USE_MOCK_DATA) return

    const channel = supabase
      .channel(`messages:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        async (payload) => {
          // 新しいメッセージを取得
          const newMessage = payload.new as Message

          // 自分のメッセージでない場合は通知を表示
          const user = await getCurrentUser()
          if (user && newMessage.sender_id !== user.id) {
            // 送信者のプロフィールを取得して通知
            const partnerData = queryClient.getQueryData<Profile>(
              queryKeys.chatPartner(matchId)
            )
            if (partnerData) {
              notifyMessage(
                partnerData.display_name,
                newMessage.content,
                matchId,
                partnerData.avatar_url || undefined
              )
            }
          }

          invalidateAfterMessage(queryClient, matchId)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [matchId, supabase, queryClient])

  return query
}

// ============================================================================
// Hook: useSendMessage
// Sends a new message in a match
// ============================================================================
export function useSendMessage(matchId: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (content: string) =>
      withDataSource(
        () => {
          mockStore.addMessage(matchId, content, 'current-user')
        },
        async () => {
          const user = await ensureAuthenticated()

          const { error } = await supabase
            .from('messages')
            .insert({
              match_id: matchId,
              sender_id: user.id,
              content,
            })

          if (error) throw new Error('メッセージの送信に失敗しました')
        }
      ),
    onSuccess: () => {
      invalidateAfterMessage(queryClient, matchId)
    },
  })
}

// ============================================================================
// Hook: useMarkAsRead
// Marks all unread messages in a match as read
// ============================================================================
export function useMarkAsRead(matchId: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const mutate = useCallback(async () => {
    await withDataSource(
      () => {
        mockStore.markAsRead(matchId)
        invalidateAfterMarkAsRead(queryClient)
      },
      async () => {
        const user = await getCurrentUser()
        if (!user) return

        await supabase
          .from('messages')
          .update({ read_at: new Date().toISOString() })
          .eq('match_id', matchId)
          .neq('sender_id', user.id)
          .is('read_at', null)

        invalidateAfterMarkAsRead(queryClient)
      }
    )
  }, [matchId, supabase, queryClient])

  return { mutate }
}

// ============================================================================
// Hook: useChatPartner
// Fetches the profile of the chat partner in a match
// ============================================================================
export function useChatPartner(matchId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: queryKeys.chatPartner(matchId),
    queryFn: async (): Promise<Profile> =>
      withDataSource(
        () => {
          const match = mockStore.getMatch(matchId)
          if (!match) throw new Error('マッチが見つかりません')

          const partnerId = match.user1_id === 'current-user' ? match.user2_id : match.user1_id
          const profile = mockProfiles.find(p => p.id === partnerId)

          if (!profile) throw new Error('プロフィールが見つかりません')
          return profile
        },
        async () => {
          const user = await ensureAuthenticated()

          const { data: match, error: matchError } = await supabase
            .from('matches')
            .select('*')
            .eq('id', matchId)
            .single()

          if (matchError || !match) throw new Error('マッチが見つかりません')

          const partnerId = match.user1_id === user.id ? match.user2_id : match.user1_id

          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', partnerId)
            .single()

          if (profileError || !profile) throw new Error('プロフィールが見つかりません')

          return profile
        }
      ),
    staleTime: 5 * 60 * 1000,
  })
}
