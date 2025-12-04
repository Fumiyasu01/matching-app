'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProfileAvatar } from '@/components/ui/profile-avatar'
import { ChevronLeft } from 'lucide-react'
import type { Profile } from '@/types/database'

interface ChatHeaderProps {
  profile: Profile
}

export function ChatHeader({ profile }: ChatHeaderProps) {
  return (
    <header className="flex items-center gap-3 p-4 border-b bg-background">
      <Button variant="ghost" size="icon" asChild>
        <Link href="/matches">
          <ChevronLeft className="h-6 w-6" />
        </Link>
      </Button>

      <ProfileAvatar
        src={profile.avatar_url}
        name={profile.display_name}
        size="sm"
      />

      <div className="flex-1 min-w-0">
        <h1 className="font-semibold truncate">{profile.display_name}</h1>
      </div>
    </header>
  )
}
