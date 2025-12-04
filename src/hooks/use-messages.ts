'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ensureAuthenticated, getCurrentUser } from '@/lib/auth'
import { queryKeys } from '@/lib/query-keys'
import type { Message, Profile } from '@/types/database'

export interface ChatMessage extends Message {
  isOwn: boolean
}

export function useMessages(matchId: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: queryKeys.messages(matchId),
    queryFn: async (): Promise<ChatMessage[]> => {
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
  })

  // Realtimeサブスクリプション
  useEffect(() => {
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
