'use client'

import TinderCard from 'react-tinder-card'
import { Card, CardContent } from '@/components/ui/card'
import { ProfileAvatar } from '@/components/ui/profile-avatar'
import { Badge } from '@/components/ui/badge'
import { MapPin, Briefcase } from 'lucide-react'
import { LOOKING_FOR_LABELS } from '@/lib/constants'
import type { Profile } from '@/types/database'
import type { SwipeDirection } from '@/hooks/use-swipe'

interface SwipeCardProps {
  profile: Profile
  onSwipe: (direction: SwipeDirection) => void
  onCardLeftScreen: () => void
}

export function SwipeCard({ profile, onSwipe, onCardLeftScreen }: SwipeCardProps) {
  const handleSwipe = (direction: string) => {
    if (direction === 'left' || direction === 'right') {
      onSwipe(direction)
    }
  }

  return (
    <TinderCard
      className="absolute w-full"
      onSwipe={handleSwipe}
      onCardLeftScreen={onCardLeftScreen}
      preventSwipe={['up', 'down']}
    >
      <Card className="w-full max-w-sm mx-auto overflow-hidden shadow-xl cursor-grab active:cursor-grabbing">
        <div className="relative h-80 bg-gradient-to-br from-primary/20 to-primary/5">
          <div className="absolute inset-0 flex items-center justify-center">
            <ProfileAvatar
              src={profile.avatar_url}
              name={profile.display_name}
              size="xl"
              className="border-4 border-white shadow-lg"
            />
          </div>
        </div>

        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-center mb-2">
            {profile.display_name}
          </h2>

          {profile.location && (
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-3">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{profile.location}</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-4">
            <Briefcase className="h-4 w-4" />
            <span>{LOOKING_FOR_LABELS[profile.looking_for]}</span>
          </div>

          {profile.bio && (
            <p className="text-sm text-center text-muted-foreground mb-4 line-clamp-3">
              {profile.bio}
            </p>
          )}

          {profile.skills.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1">
              {profile.skills.slice(0, 5).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {profile.skills.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{profile.skills.length - 5}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </TinderCard>
  )
}
