'use client'

import TinderCard from 'react-tinder-card'
import { MapPin } from 'lucide-react'
import { LOOKING_FOR_LABELS } from '@/lib/constants'
import type { Profile } from '@/types/database'
import type { SwipeDirection } from '@/hooks/use-swipe'

interface SwipeCardProps {
  profile: Profile
  onSwipe: (direction: SwipeDirection) => void
  onCardLeftScreen: () => void
}

// Generate a consistent gradient based on user ID
function getGradient(id: string): string {
  const gradients = [
    'from-cyan-400 via-sky-500 to-blue-600',
    'from-violet-400 via-purple-500 to-indigo-600',
    'from-rose-400 via-pink-500 to-fuchsia-600',
    'from-amber-400 via-orange-500 to-red-500',
    'from-emerald-400 via-teal-500 to-cyan-600',
    'from-lime-400 via-green-500 to-emerald-600',
  ]
  const index = id.charCodeAt(0) % gradients.length
  return gradients[index]
}

export function SwipeCard({ profile, onSwipe, onCardLeftScreen }: SwipeCardProps) {
  const handleSwipe = (direction: string) => {
    if (direction === 'left' || direction === 'right') {
      onSwipe(direction)
    }
  }

  const gradient = getGradient(profile.id)
  const initials = profile.display_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <TinderCard
      className="absolute w-full h-full"
      onSwipe={handleSwipe}
      onCardLeftScreen={onCardLeftScreen}
      preventSwipe={['up', 'down']}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing animate-card-enter">
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

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          {/* Location Badge */}
          {profile.location && (
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full glass text-sm mb-3">
              <MapPin className="h-3.5 w-3.5" />
              <span>{profile.location}</span>
            </div>
          )}

          {/* Name */}
          <h2 className="text-3xl font-bold mb-1 drop-shadow-lg">
            {profile.display_name}
          </h2>

          {/* Looking For */}
          <p className="text-white/80 text-sm mb-3">
            {LOOKING_FOR_LABELS[profile.looking_for]}
          </p>

          {/* Bio */}
          {profile.bio && (
            <p className="text-white/90 text-sm mb-4 line-clamp-2 leading-relaxed">
              {profile.bio}
            </p>
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
