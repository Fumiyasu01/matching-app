'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ensureAuthenticated, getCurrentUser } from '@/lib/auth'
import { queryKeys } from '@/lib/query-keys'
import { mockStore, mockProfiles } from '@/lib/mock-data'
import { USE_MOCK_DATA } from '@/lib/config'
import type { Message, Profile } from '@/types/database'

export interface ChatMessage extends Message {
  isOwn: boolean
}

export function useMessages(matchId: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const lastMessageCountRef = useRef(0)

  const query = useQuery({
    queryKey: queryKeys.messages(matchId),
    queryFn: async (): Promise<ChatMessage[]> => {
      // Use mock data if enabled
      if (USE_MOCK_DATA) {
        const messages = mockStore.getMessages(matchId)
        return messages.map(msg => ({
          ...msg,
          isOwn: msg.sender_id === 'current-user',
        }))
      }

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
    },
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
      }
      lastMessageCountRef.current = currentCount
    }
  }, [query.data, queryClient])

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
        () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.messages(matchId) })
          queryClient.invalidateQueries({ queryKey: queryKeys.matches })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [matchId, supabase, queryClient])

  return query
}

export function useSendMessage(matchId: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (content: string) => {
      // Use mock data if enabled
      if (USE_MOCK_DATA) {
        mockStore.addMessage(matchId, content, 'current-user')
        return
      }

      const user = await ensureAuthenticated()

      const { error } = await supabase
        .from('messages')
        .insert({
          match_id: matchId,
          sender_id: user.id,
          content,
        })

      if (error) throw new Error('メッセージの送信に失敗しました')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages(matchId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.matches })
    },
  })
}

export function useMarkAsRead(matchId: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const mutate = useCallback(async () => {
    // Use mock data if enabled
    if (USE_MOCK_DATA) {
      mockStore.markAsRead(matchId)
      queryClient.invalidateQueries({ queryKey: queryKeys.matches })
      return
    }

    const user = await getCurrentUser()
    if (!user) return

    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('match_id', matchId)
      .neq('sender_id', user.id)
      .is('read_at', null)

    queryClient.invalidateQueries({ queryKey: queryKeys.matches })
  }, [matchId, supabase, queryClient])

  return { mutate }
}

export function useChatPartner(matchId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: queryKeys.chatPartner(matchId),
    queryFn: async (): Promise<Profile> => {
      // Use mock data if enabled
      if (USE_MOCK_DATA) {
        const match = mockStore.getMatch(matchId)
        if (!match) throw new Error('マッチが見つかりません')

        const partnerId = match.user1_id === 'current-user' ? match.user2_id : match.user1_id
        const profile = mockProfiles.find(p => p.id === partnerId)

        if (!profile) throw new Error('プロフィールが見つかりません')
        return profile
      }

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
    },
    staleTime: 5 * 60 * 1000,
  })
}
