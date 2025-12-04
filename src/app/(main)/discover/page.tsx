'use client'

import { useState, useMemo } from 'react'
import { SwipeCard, MatchModal, SwipeButtons } from '@/components/discover'
import { useDiscoverProfiles } from '@/hooks/use-discover-profiles'
import { useSwipe, directionToAction } from '@/hooks/use-swipe'
import { useProfile } from '@/hooks/use-profile'
import type { SwipeDirection } from '@/hooks/use-swipe'
import { LoadingState } from '@/components/ui/loading-state'
import { ErrorState } from '@/components/ui/error-state'
import { Users, Sparkles } from 'lucide-react'
import type { Profile } from '@/types/database'

export default function DiscoverPage() {
  const { data: profiles, isLoading, error } = useDiscoverProfiles()
  const { data: currentUserProfile } = useProfile()
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

  const hasMoreProfiles = profiles && currentIndex < profiles.length

  if (!hasMoreProfiles) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)] items-center justify-center px-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center mb-6 animate-float">
          <Users className="h-10 w-10 text-cyan-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">すべてチェックしました</h2>
        <p className="text-gray-500 text-center text-sm">
          新しいユーザーが登録されるまで<br />お待ちください
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-3">
        <h1 className="text-2xl font-bold gradient-text">Matching</h1>
        <button className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-md">
          <Sparkles className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Card Area */}
      <div className="flex-1 relative px-2 pb-4">
        <div className="relative w-full h-full max-w-md mx-auto">
          {visibleProfiles.map((profile) => (
            <SwipeCard
              key={profile.id}
              profile={profile}
              onSwipe={(dir) => handleSwipe(dir, profile)}
              onCardLeftScreen={handleCardLeftScreen}
            />
          ))}
        </div>
      </div>

      {/* Swipe Buttons */}
      <div className="py-4">
        <SwipeButtons
          onPass={() => handleButtonSwipe('left')}
          onLike={() => handleButtonSwipe('right')}
          disabled={swipeMutation.isPending}
        />
      </div>

      <MatchModal
        open={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        matchedProfile={matchedProfile}
        currentUserProfile={currentUserProfile}
      />
    </div>
  )
}
