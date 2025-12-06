'use client'

import { useState, useMemo, useCallback } from 'react'
import { SwipeCard, MatchModal, SwipeButtons, ProfileDetailModal, LocationUpdater, FilterModal } from '@/components/discover'
import { useDiscoverProfiles } from '@/hooks/use-discover-profiles'
import { useDiscoverFilters } from '@/hooks/use-discover-filters'
import { useSwipe, directionToAction } from '@/hooks/use-swipe'
import { useProfile } from '@/hooks/use-profile'
import { calculateDistance } from '@/hooks/use-geolocation'
import type { SwipeDirection } from '@/hooks/use-swipe'
import { LoadingState } from '@/components/ui/loading-state'
import { ErrorState } from '@/components/ui/error-state'
import { Badge } from '@/components/ui/badge'
import { Users, SlidersHorizontal } from 'lucide-react'
import type { ProfileWithDetails } from '@/types/database'

export default function DiscoverPage() {
  const { filters, getActiveFilterCount } = useDiscoverFilters()
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)

  const { data: profiles, isLoading, error } = useDiscoverProfiles({
    filters,
    userLocation,
  })
  const { data: currentUserProfile } = useProfile()
  const swipeMutation = useSwipe()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [matchedProfile, setMatchedProfile] = useState<ProfileWithDetails | null>(null)
  const [showMatchModal, setShowMatchModal] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<ProfileWithDetails | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)

  const activeFilterCount = getActiveFilterCount()

  const handleLocationUpdate = useCallback((coords: { latitude: number; longitude: number }) => {
    setUserLocation(coords)
  }, [])

  // Calculate distance to a profile
  const getDistanceToProfile = useCallback((profile: ProfileWithDetails): number | null => {
    if (!userLocation || !profile.latitude || !profile.longitude) {
      return null
    }
    return calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      profile.latitude,
      profile.longitude
    )
  }, [userLocation])

  const currentProfile = profiles?.[currentIndex]

  const visibleProfiles = useMemo(() => {
    if (!profiles) return []
    return profiles.slice(currentIndex, currentIndex + 2).reverse()
  }, [profiles, currentIndex])

  const handleSwipe = async (direction: SwipeDirection, profile: ProfileWithDetails) => {
    const action = directionToAction(direction)

    try {
      const result = await swipeMutation.mutateAsync({
        swipedId: profile.id,
        action,
      })

      if (result.matched && result.matchedProfile) {
        setMatchedProfile(result.matchedProfile as ProfileWithDetails)
        setShowMatchModal(true)
      }
    } catch (err) {
      console.error('Swipe failed:', err)
    }
  }

  const handleTapCard = (profile: ProfileWithDetails) => {
    setSelectedProfile(profile)
    setShowDetailModal(true)
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
        <div className="flex items-center gap-2">
          <LocationUpdater onLocationUpdate={handleLocationUpdate} />
          <button
            onClick={() => setShowFilterModal(true)}
            className="relative h-10 w-10 rounded-full bg-white border-2 border-gray-200 hover:border-cyan-500 flex items-center justify-center shadow-sm transition-colors"
          >
            <SlidersHorizontal className="h-5 w-5 text-gray-700" />
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-cyan-500 text-white text-xs"
              >
                {activeFilterCount}
              </Badge>
            )}
          </button>
        </div>
      </div>

      {/* Card Area */}
      <div className="flex-1 relative px-2 pb-4">
        <div className="relative w-full h-full max-w-md mx-auto">
          {visibleProfiles.map((profile) => (
            <SwipeCard
              key={profile.id}
              profile={profile as ProfileWithDetails}
              onSwipe={(dir) => handleSwipe(dir, profile as ProfileWithDetails)}
              onCardLeftScreen={handleCardLeftScreen}
              onTap={() => handleTapCard(profile as ProfileWithDetails)}
              distance={getDistanceToProfile(profile as ProfileWithDetails)}
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

      <ProfileDetailModal
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        profile={selectedProfile}
      />

      <FilterModal
        open={showFilterModal}
        onClose={() => setShowFilterModal(false)}
      />
    </div>
  )
}
