'use client'

import { useMatches } from '@/hooks/use-matches'
import { MatchCard } from '@/components/matches/MatchCard'
import { LoadingState } from '@/components/ui/loading-state'
import { ErrorState } from '@/components/ui/error-state'
import { EmptyState } from '@/components/ui/empty-state'
import { Heart } from 'lucide-react'

export default function MatchesPage() {
  const { data: matches, isLoading, error } = useMatches()

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error instanceof Error ? error : null} />
  }

  if (!matches || matches.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="まだマッチがありません"
        description="スワイプして気になる人にいいねを送りましょう"
      />
    )
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-bold mb-6">マッチ一覧</h1>
      <div className="space-y-3">
        {matches.map((matchData) => (
          <MatchCard key={matchData.match.id} data={matchData} />
        ))}
      </div>
    </div>
  )
}
