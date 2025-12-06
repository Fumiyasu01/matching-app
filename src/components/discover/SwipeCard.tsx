'use client'

import { useRef, useState } from 'react'
import TinderCard from 'react-tinder-card'
import { MapPin, Calendar, Home, Heart, X } from 'lucide-react'
import { LOOKING_FOR_LABELS, TIME_SLOT_LABELS, LOCATION_TYPE_LABELS } from '@/lib/constants'
import { formatDateJa } from '@/lib/utils/format'
import { getGradientByUserId, getInitials } from '@/lib/utils'
import type { ProfileWithDetails } from '@/types/database'
import type { SwipeDirection } from '@/hooks/use-swipe'

interface SwipeCardProps {
  profile: ProfileWithDetails
  onSwipe: (direction: SwipeDirection) => void
  onCardLeftScreen: () => void
  onTap: () => void
  distance?: number | null // Distance in km
}

// Threshold for distinguishing tap from swipe
const TAP_THRESHOLD_DISTANCE = 10
const TAP_THRESHOLD_TIME = 300

// Threshold for showing indicator
const INDICATOR_THRESHOLD = 30

// Format distance for display
function formatDistanceDisplay(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m先`
  }
  if (km < 10) {
    return `${km.toFixed(1)}km先`
  }
  return `${Math.round(km)}km先`
}

export function SwipeCard({ profile, onSwipe, onCardLeftScreen, onTap, distance }: SwipeCardProps) {
  const pointerStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const [swipeOffset, setSwipeOffset] = useState(0)

  const handleSwipe = (direction: string) => {
    if (direction === 'left' || direction === 'right') {
      onSwipe(direction)
    }
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    }
    setSwipeOffset(0)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerStartRef.current) return
    const dx = e.clientX - pointerStartRef.current.x
    setSwipeOffset(dx)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!pointerStartRef.current) return

    const { x, y, time } = pointerStartRef.current
    const dx = Math.abs(e.clientX - x)
    const dy = Math.abs(e.clientY - y)
    const dt = Date.now() - time

    // If movement is small and time is short, treat as tap
    if (dx < TAP_THRESHOLD_DISTANCE && dy < TAP_THRESHOLD_DISTANCE && dt < TAP_THRESHOLD_TIME) {
      onTap()
    }

    pointerStartRef.current = null
    setSwipeOffset(0)
  }

  // Calculate indicator opacity based on swipe distance
  const indicatorOpacity = Math.min(Math.abs(swipeOffset) / 100, 0.8)
  const showLike = swipeOffset > INDICATOR_THRESHOLD
  const showNope = swipeOffset < -INDICATOR_THRESHOLD

  const gradient = getGradientByUserId(profile.id)
  const initials = getInitials(profile.display_name)

  // Get first open availability slot
  const openSlots = profile.availability_slots?.filter(s => s.status === 'open') || []
  const nextSlot = openSlots[0]

  return (
    <TinderCard
      className="absolute w-full h-full"
      onSwipe={handleSwipe}
      onCardLeftScreen={onCardLeftScreen}
      preventSwipe={['up', 'down']}
    >
      <div
        className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing animate-card-enter"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => setSwipeOffset(0)}
      >
        {/* Background - Avatar or Gradient */}
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.display_name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[120px] font-bold text-white/30 select-none">
                {initials}
              </span>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 card-gradient-overlay" />

        {/* Swipe Indicators */}
        {showLike && (
          <div
            className="absolute top-8 left-6 pointer-events-none"
            style={{ opacity: indicatorOpacity }}
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-emerald-400 bg-emerald-500/20 backdrop-blur-sm">
              <Heart className="w-6 h-6 text-emerald-400 fill-emerald-400" />
              <span className="text-emerald-400 font-bold text-lg">LIKE</span>
            </div>
          </div>
        )}
        {showNope && (
          <div
            className="absolute top-8 right-6 pointer-events-none"
            style={{ opacity: indicatorOpacity }}
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-red-400 bg-red-500/20 backdrop-blur-sm">
              <X className="w-6 h-6 text-red-400" />
              <span className="text-red-400 font-bold text-lg">NOPE</span>
            </div>
          </div>
        )}

        {/* Tap hint */}
        <div className="absolute top-4 right-4">
          <div className="px-3 py-1.5 rounded-full glass text-white/80 text-xs">
            タップで詳細
          </div>
        </div>

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          {/* Location & Distance Badge */}
          <div className="flex flex-wrap gap-2 mb-3">
            {distance != null && (
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full glass text-sm">
                <MapPin className="h-3.5 w-3.5" />
                <span>{formatDistanceDisplay(distance)}</span>
              </div>
            )}
            {profile.location && (
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full glass text-sm">
                <span>{profile.location}</span>
              </div>
            )}
          </div>

          {/* Name */}
          <h2 className="text-3xl font-bold mb-1 drop-shadow-lg">
            {profile.display_name}
          </h2>

          {/* Headline or Looking For */}
          <p className="text-white/80 text-sm mb-3">
            {profile.headline || LOOKING_FOR_LABELS[profile.looking_for]}
          </p>

          {/* Availability Slot */}
          {nextSlot && (
            <div className="mb-4 p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-white/70">募集中</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4" />
                <span>{formatDateJa(nextSlot.date)}</span>
                <span className="text-white/70">{TIME_SLOT_LABELS[nextSlot.time_slot]}</span>
              </div>
              <p className="text-sm mt-1 text-white/90 line-clamp-1">{nextSlot.title}</p>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-white/70">
                <Home className="h-3 w-3" />
                <span>{LOCATION_TYPE_LABELS[nextSlot.location]}</span>
              </div>
              {openSlots.length > 1 && (
                <p className="text-xs text-white/60 mt-2">
                  他 {openSlots.length - 1} 件の募集あり
                </p>
              )}
            </div>
          )}

          {/* Skills Tags */}
          {profile.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
              {profile.skills.length > 4 && (
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs">
                  +{profile.skills.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </TinderCard>
  )
}
