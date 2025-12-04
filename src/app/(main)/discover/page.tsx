'use client'

import { useState, useMemo } from 'react'
import { SwipeCard, MatchModal, SwipeButtons } from '@/components/discover'
import { useDiscoverProfiles } from '@/hooks/use-discover-profiles'
import { useSwipe, directionToAction } from '@/hooks/use-swipe'
import type { SwipeDirection } from '@/hooks/use-swipe'
import { LoadingState } from '@/components/ui/loading-state'
import { ErrorState } from '@/components/ui/error-state'
import { EmptyState } from '@/components/ui/empty-state'
import { Users } from 'lucide-react'
import type { Profile } from '@/types/database'

export default function DiscoverPage() {
  const { data: profiles, isLoading, error } = useDiscoverProfiles()
  const swipeMutation = useSwipe()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null)
  const [showMatchModal, setShowMatchModal] = useState(false)

  const currentProfile = profiles?.[currentIndex]

  const visibleProfiles = useMemo(() => {
    if (!profiles) return []
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
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error instanceof Error ? error : null} />
  }

  const hasMoreProfiles = profiles && currentIndex < profiles.length

  if (!hasMoreProfiles) {
    return (
      <EmptyState
        icon={Users}
        title="すべてチェックしました"
        description="新しいユーザーが登録されるまでお待ちください"
      />
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
