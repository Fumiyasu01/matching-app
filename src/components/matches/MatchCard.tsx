'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from '@/lib/date-utils'
import type { MatchWithProfile } from '@/hooks/use-matches'

interface MatchCardProps {
  data: MatchWithProfile
}

export function MatchCard({ data }: MatchCardProps) {
  const { match, profile, lastMessage, unreadCount } = data

  return (
    <Link href={`/chat/${match.id}`}>
      <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-14 w-14">
              <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.display_name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {profile.display_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {unreadCount > 0 && (
              <Badge
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                variant="destructive"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold truncate">{profile.display_name}</h3>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {formatDistanceToNow(lastMessage?.created_at || match.created_at)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {lastMessage?.content || 'マッチしました！メッセージを送りましょう'}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  )
}
