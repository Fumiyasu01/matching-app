'use client'

import Link from 'next/link'
import { formatDistanceToNow } from '@/lib/date-utils'
import type { MatchWithProfile } from '@/hooks/use-matches'

interface MatchCardProps {
  data: MatchWithProfile
}

// Generate a consistent gradient based on user ID
function getGradient(id: string): string {
  const gradients = [
    'from-cyan-400 to-blue-500',
    'from-violet-400 to-purple-500',
    'from-rose-400 to-pink-500',
    'from-amber-400 to-orange-500',
    'from-emerald-400 to-teal-500',
    'from-lime-400 to-green-500',
  ]
  const index = id.charCodeAt(0) % gradients.length
  return gradients[index]
}

export function MatchCard({ data }: MatchCardProps) {
  const { match, profile, lastMessage, unreadCount } = data
  const gradient = getGradient(profile.id)
  const initials = profile.display_name.charAt(0).toUpperCase()
  const hasUnread = unreadCount > 0

  return (
    <Link href={`/chat/${match.id}`}>
      <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 hover:bg-gray-50 active:scale-[0.98] ${hasUnread ? 'bg-cyan-50/50' : ''}`}>
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow-md"
            />
          ) : (
            <div className={`h-14 w-14 rounded-full bg-gradient-to-br ${gradient} ring-2 ring-white shadow-md flex items-center justify-center`}>
              <span className="text-xl font-bold text-white">{initials}</span>
            </div>
          )}
          {/* Online Indicator */}
          <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-400 ring-2 ring-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-semibold truncate ${hasUnread ? 'text-gray-900' : 'text-gray-700'}`}>
              {profile.display_name}
            </h3>
            <span className={`text-xs flex-shrink-0 ${hasUnread ? 'text-cyan-600 font-medium' : 'text-gray-400'}`}>
              {formatDistanceToNow(lastMessage?.created_at || match.created_at)}
            </span>
          </div>
          <p className={`text-sm truncate ${hasUnread ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
            {lastMessage?.content || 'マッチしました！メッセージを送りましょう'}
          </p>
        </div>

        {/* Unread Badge */}
        {hasUnread && (
          <div className="flex-shrink-0">
            <div className="h-6 min-w-6 px-2 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600 flex items-center justify-center shadow-md shadow-cyan-500/30">
              <span className="text-xs font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}
