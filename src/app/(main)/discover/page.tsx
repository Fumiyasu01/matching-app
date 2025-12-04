'use client'

import { useState, useMemo } from 'react'
import { SwipeCard, MatchModal, SwipeButtons } from '@/components/discover'
import { useDiscoverProfiles } from '@/hooks/use-discover-profiles'
import { useSwipe, directionToAction } from '@/hooks/use-swipe'
import type { SwipeDirection } from '@/hooks/use-swipe'
import { Loader2, Users } from 'lucide-react'
import type { Profile } from '@/types/database'

export default function DiscoverPage() {
  const { data: profiles, isLoading, error } = useDiscoverProfiles()
  const swipeMutation = useSwipe()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null)
  const [showMatchModal, setShowMatchModal] = useState(false)

  const currentProfile = profiles?.[currentIndex]

  // 表示するカードをメモ化（パフォーマンス最適化）
  const visibleProfiles = useMemo(() => {
    if (!profiles) return []
    // 現在のカードと次のカードのみ表示（スタック順序のため逆順）
    return profiles.slice(currentIndex, currentIndex + 2).reverse()
  }, [profiles, currentIndex])

  const handleSwipe = async (direction: SwipeDirection, profile: Profile) => {
    const action = directionToAction(direction)

    try {
      const result = await swipeMutation.mutateAsync({
        swipedId: profile.id,
        action,
      })

      if (result.matched && result.matchedProfile) {
        setMatchedProfile(result.matchedProfile)
        setShowMatchModal(true)
      }
    } catch (err) {
      console.error('Swipe failed:', err)
    }
  }

  const handleCardLeftScreen = () => {
    setCurrentIndex((prev) => prev + 1)
  }

  const handleButtonSwipe = (direction: SwipeDirection) => {
    if (!currentProfile) return
    handleSwipe(direction, currentProfile)
    handleCardLeftScreen()
  }

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

  const hasMoreProfiles = profiles && currentIndex < profiles.length

  if (!hasMoreProfiles) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Users className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">すべてチェックしました</h2>
        <p className="text-muted-foreground text-center max-w-xs">
          新しいユーザーが登録されるまでお待ちください
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center px-4 py-6">
      <h1 className="text-xl font-bold mb-6">仲間を探す</h1>

      <div className="relative w-full max-w-sm h-[500px]">
        {visibleProfiles.map((profile) => (
          <SwipeCard
            key={profile.id}
            profile={profile}
            onSwipe={(dir) => handleSwipe(dir, profile)}
            onCardLeftScreen={handleCardLeftScreen}
          />
        ))}
      </div>

      <SwipeButtons
        onPass={() => handleButtonSwipe('left')}
        onLike={() => handleButtonSwipe('right')}
        disabled={swipeMutation.isPending}
      />

      <MatchModal
        open={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        matchedProfile={matchedProfile}
      />
    </div>
  )
}
