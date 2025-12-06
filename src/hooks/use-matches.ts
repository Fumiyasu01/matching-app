'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { ensureAuthenticated } from '@/lib/auth'
import { queryKeys } from '@/lib/query-keys'
import { mockStore, type MatchWithProfile } from '@/lib/mock-data'
import { withDataSource } from '@/lib/data-source'
import type { Match, Message } from '@/types/database'

export type { MatchWithProfile }

export function useMatches() {
  const supabase = createClient()

  return useQuery({
    queryKey: queryKeys.matches,
    queryFn: async (): Promise<MatchWithProfile[]> =>
      withDataSource(
        () => mockStore.getMatchesWithProfiles(),
        async () => {
          const user = await ensureAuthenticated()

          // マッチ一覧を取得
          const { data: matches, error: matchError } = await supabase
            .from('matches')
            .select('*')
            .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
            .order('created_at', { ascending: false })

          if (matchError) throw new Error('マッチ一覧の取得に失敗しました')
          if (!matches || matches.length === 0) return []

          // 相手のプロフィールIDを取得
          const partnerIds = matches.map(m =>
            m.user1_id === user.id ? m.user2_id : m.user1_id
          )

          // プロフィールを取得
          const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .in('id', partnerIds)

          if (profileError) throw new Error('プロフィールの取得に失敗しました')

          // 各マッチの最新メッセージを取得
          const matchIds = matches.map(m => m.id)
          const { data: messages } = await supabase
            .from('messages')
            .select('*')
            .in('match_id', matchIds)
            .order('created_at', { ascending: false })

          // 未読メッセージ数を取得
          const { data: unreadMessages } = await supabase
            .from('messages')
            .select('match_id')
            .in('match_id', matchIds)
            .neq('sender_id', user.id)
            .is('read_at', null)

          // マッチごとの最新メッセージと未読数をマップ
          const lastMessageMap = new Map<string, Message>()
          const unreadCountMap = new Map<string, number>()

          messages?.forEach(msg => {
            if (!lastMessageMap.has(msg.match_id)) {
              lastMessageMap.set(msg.match_id, msg)
            }
          })

          unreadMessages?.forEach(msg => {
            const count = unreadCountMap.get(msg.match_id) || 0
            unreadCountMap.set(msg.match_id, count + 1)
          })

          // プロフィールをマップ化
          const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])

          // 結果を組み立て
          return matches
            .map(match => {
              const partnerId = match.user1_id === user.id ? match.user2_id : match.user1_id
              const profile = profileMap.get(partnerId)
              if (!profile) return null

              return {
                match,
                profile,
                lastMessage: lastMessageMap.get(match.id) || null,
                unreadCount: unreadCountMap.get(match.id) || 0,
              }
            })
            .filter((item): item is MatchWithProfile => item !== null)
            .sort((a, b) => {
              const aTime = a.lastMessage?.created_at || a.match.created_at
              const bTime = b.lastMessage?.created_at || b.match.created_at
              return new Date(bTime).getTime() - new Date(aTime).getTime()
            })
        }
      ),
    staleTime: 30 * 1000,
  })
}
