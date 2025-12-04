'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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

      <Avatar className="h-10 w-10">
        <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.display_name} />
        <AvatarFallback className="bg-primary text-primary-foreground">
          {profile.display_name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h1 className="font-semibold truncate">{profile.display_name}</h1>
      </div>
    </header>
  )
}
