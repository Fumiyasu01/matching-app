'use client'

import { useMatches } from '@/hooks/use-matches'
import { MatchCard } from '@/components/matches/MatchCard'
import { LoadingState } from '@/components/ui/loading-state'
import { ErrorState } from '@/components/ui/error-state'
import { Heart, Search } from 'lucide-react'

export default function MatchesPage() {
  const { data: matches, isLoading, error } = useMatches()

  if (isLoading) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)] items-center justify-center">
        <LoadingState />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)] items-center justify-center">
        <ErrorState error={error instanceof Error ? error : null} />
      </div>
    )
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold gradient-text">チャット</h1>
          <button className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <Search className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center mb-6 animate-float">
            <Heart className="h-10 w-10 text-rose-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">まだマッチがありません</h2>
          <p className="text-gray-500 text-center text-sm">
            スワイプして<br />気になる人にいいねを送りましょう
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <h1 className="text-2xl font-bold gradient-text">チャット</h1>
        <button className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <Search className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Match Count */}
      <div className="px-4 mb-2">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          {matches.length}件のマッチ
        </span>
      </div>

      {/* Chat List */}
      <div className="flex-1 px-2">
        {matches.map((matchData) => (
          <MatchCard key={matchData.match.id} data={matchData} />
        ))}
      </div>
    </div>
  )
}
