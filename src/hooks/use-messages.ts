'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Message, Profile } from '@/types/database'

export interface ChatMessage extends Message {
  isOwn: boolean
}

export function useMessages(matchId: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['messages', matchId],
    queryFn: async (): Promise<ChatMessage[]> => {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) throw new Error('認証エラーが発生しました')
      if (!user) throw new Error('ログインが必要です')

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
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['messages', matchId] })
          queryClient.invalidateQueries({ queryKey: ['matches'] })
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
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) throw new Error('認証エラーが発生しました')
      if (!user) throw new Error('ログインが必要です')

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
      queryClient.invalidateQueries({ queryKey: ['messages', matchId] })
      queryClient.invalidateQueries({ queryKey: ['matches'] })
    },
  })
}

export function useMarkAsRead(matchId: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('match_id', matchId)
        .neq('sender_id', user.id)
        .is('read_at', null)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] })
    },
  })
}

export function useChatPartner(matchId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['chat-partner', matchId],
    queryFn: async (): Promise<Profile> => {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) throw new Error('認証エラーが発生しました')
      if (!user) throw new Error('ログインが必要です')

      // マッチを取得
      const { data: match, error: matchError } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single()

      if (matchError || !match) throw new Error('マッチが見つかりません')

      // 相手のIDを特定
      const partnerId = match.user1_id === user.id ? match.user2_id : match.user1_id

      // プロフィールを取得
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
