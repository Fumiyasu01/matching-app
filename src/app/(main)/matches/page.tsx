'use client'

import { useMatches } from '@/hooks/use-matches'
import { MatchCard } from '@/components/matches/MatchCard'
import { Loader2, Heart } from 'lucide-react'

export default function MatchesPage() {
  const { data: matches, isLoading, error } = useMatches()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">読み込み中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-destructive">エラーが発生しました</p>
        <p className="text-sm text-muted-foreground mt-2">
          {error instanceof Error ? error.message : '予期しないエラーが発生しました'}
        </p>
      </div>
    )
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Heart className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">まだマッチがありません</h2>
        <p className="text-muted-foreground text-center max-w-xs">
          スワイプして気になる人にいいねを送りましょう
        </p>
      </div>
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
