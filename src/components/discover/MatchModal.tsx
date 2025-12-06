'use client'

import { useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Heart, MessageCircle, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getGradientByUserId, getInitials } from '@/lib/utils'
import { notifyMatch } from '@/lib/notifications'
import type { Profile } from '@/types/database'

interface MatchModalProps {
  open: boolean
  onClose: () => void
  matchedProfile: Profile | null
  currentUserProfile?: Profile | null
}

export function MatchModal({ open, onClose, matchedProfile, currentUserProfile }: MatchModalProps) {
  const router = useRouter()

  // マッチしたときに通知を表示
  useEffect(() => {
    if (open && matchedProfile) {
      notifyMatch(matchedProfile)
    }
  }, [open, matchedProfile])

  if (!matchedProfile) return null

  const handleSendMessage = () => {
    onClose()
    router.push('/matches')
  }

  const matchedGradient = getGradientByUserId(matchedProfile.id)
  const currentGradient = currentUserProfile ? getGradientByUserId(currentUserProfile.id) : 'from-gray-400 to-gray-600'

  const matchedInitials = getInitials(matchedProfile.display_name)
  const currentInitials = currentUserProfile ? getInitials(currentUserProfile.display_name) : '?'

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm border-0 bg-gradient-to-b from-cyan-50 to-white p-0 overflow-hidden">
        <DialogTitle className="sr-only">マッチしました</DialogTitle>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-md hover:bg-white transition-colors"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>

        <div className="px-6 pt-10 pb-8">
          {/* Overlapping Avatars */}
          <div className="relative flex justify-center items-center h-40 mb-6">
            {/* Left Avatar (Current User) */}
            <div className="absolute left-1/2 -translate-x-[70%] animate-match-pop">
              <div className={`h-28 w-28 rounded-2xl bg-gradient-to-br ${currentGradient} shadow-xl rotate-[-8deg] overflow-hidden border-4 border-white`}>
                {currentUserProfile?.avatar_url ? (
                  <img
                    src={currentUserProfile.avatar_url}
                    alt="You"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-white/70">{currentInitials}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Avatar (Matched User) */}
            <div className="absolute left-1/2 -translate-x-[30%] animate-match-pop" style={{ animationDelay: '0.1s' }}>
              <div className={`h-28 w-28 rounded-2xl bg-gradient-to-br ${matchedGradient} shadow-xl rotate-[8deg] overflow-hidden border-4 border-white`}>
                {matchedProfile.avatar_url ? (
                  <img
                    src={matchedProfile.avatar_url}
                    alt={matchedProfile.display_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-white/70">{matchedInitials}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Heart Icon */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 z-10 animate-heart-pulse">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-white fill-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold gradient-text mb-2">
              マッチしました!
            </h2>
            <p className="text-gray-500 text-sm">
              {matchedProfile.display_name}さんもあなたに興味があります
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSendMessage}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600 text-white font-semibold
                         shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all
                         flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              メッセージを送る
            </button>
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-full bg-gray-100 text-gray-700 font-medium
                         hover:bg-gray-200 transition-colors"
            >
              スワイプを続ける
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
