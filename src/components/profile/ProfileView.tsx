'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ProfileAvatar } from '@/components/ui/profile-avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Briefcase, Pencil } from 'lucide-react'
import { LOOKING_FOR_LABELS } from '@/lib/constants'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { AvailabilitySlotsSection } from './AvailabilitySlotsSection'
import type { Profile } from '@/types/database'

interface ProfileViewProps {
  profile: Profile
  onEdit: () => void
}

export function ProfileView({ profile, onEdit }: ProfileViewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center">
            <ProfileAvatar
              src={profile.avatar_url}
              name={profile.display_name}
              size="lg"
              className="mb-4"
            />

            <h2 className="text-xl font-bold mb-1">{profile.display_name}</h2>
            <p className="text-sm text-muted-foreground mb-3">{profile.email}</p>

            {profile.location && (
              <div className="flex items-center gap-1 text-muted-foreground mb-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{profile.location}</span>
              </div>
            )}

            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
              <Briefcase className="h-4 w-4" />
              <span>{LOOKING_FOR_LABELS[profile.looking_for]}</span>
            </div>

            {profile.bio && (
              <p className="text-sm text-center text-muted-foreground max-w-sm">
                {profile.bio}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <AvailabilitySlotsSection />

      {profile.skills.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">スキル</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {profile.interests.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">興味・関心</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <Badge key={interest} variant="outline">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <Button onClick={onEdit} className="w-full" variant="outline">
          <Pencil className="mr-2 h-4 w-4" />
          プロフィールを編集
        </Button>
        <LogoutButton />
      </div>
    </div>
  )
}
