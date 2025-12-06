'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MapPin, Clock, Briefcase, Heart, ExternalLink, X, MoreHorizontal, Ban, Flag } from 'lucide-react'
import {
  LOOKING_FOR_LABELS,
} from '@/lib/constants'
import type { ProfileWithDetails } from '@/types/database'
import { useBlockUser } from '@/hooks/use-moderation'
import { ReportModal } from '@/components/moderation/ReportModal'
import { AvailabilitySlotCard } from './AvailabilitySlotCard'
import { toast } from 'sonner'

interface ProfileDetailModalProps {
  open: boolean
  onClose: () => void
  profile: ProfileWithDetails | null
}

export function ProfileDetailModal({ open, onClose, profile }: ProfileDetailModalProps) {
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const blockUserMutation = useBlockUser()

  if (!profile) return null

  const openSlots = profile.availability_slots?.filter(s => s.status === 'open') || []

  const handleBlockUser = async () => {
    try {
      await blockUserMutation.mutateAsync(profile.id)
      toast.success('ユーザーをブロックしました', {
        description: `${profile.display_name}さんは今後表示されません。`,
      })
      onClose()
    } catch (error) {
      toast.error('ブロックに失敗しました', {
        description: 'もう一度お試しください。',
      })
    }
  }

  const handleReportUser = () => {
    setReportModalOpen(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-w-md p-0 gap-0 max-h-[90vh] overflow-hidden bg-white">
          <DialogTitle className="sr-only">{profile.display_name}のプロフィール</DialogTitle>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Menu button */}
          <div className="absolute top-3 right-14 z-20">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleBlockUser} className="text-red-600 cursor-pointer">
                  <Ban className="mr-2 h-4 w-4" />
                  ユーザーをブロック
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleReportUser} className="cursor-pointer">
                  <Flag className="mr-2 h-4 w-4" />
                  ユーザーを報告
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        <ScrollArea className="max-h-[90vh]">
          {/* Header with photo */}
          <div className="relative h-64">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                <span className="text-6xl font-bold text-white/30">
                  {profile.display_name.slice(0, 2)}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Name overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h2 className="text-2xl font-bold">{profile.display_name}</h2>
              {profile.headline && (
                <p className="text-white/90 text-sm mt-1">「{profile.headline}」</p>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-6">
            {/* Basic Info */}
            <div className="flex flex-wrap gap-2">
              {profile.location && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm">
                  <MapPin className="h-3.5 w-3.5 text-gray-500" />
                  <span>{profile.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 rounded-full text-sm text-cyan-700">
                <Briefcase className="h-3.5 w-3.5" />
                <span>{LOOKING_FOR_LABELS[profile.looking_for]}</span>
              </div>
              {profile.availability_hours && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm">
                  <Clock className="h-3.5 w-3.5 text-gray-500" />
                  <span>{profile.availability_hours}</span>
                </div>
              )}
            </div>

            {/* Availability Slots */}
            {openSlots.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  募集中 ({openSlots.length}件)
                </h3>
                <div className="space-y-3">
                  {openSlots.map(slot => (
                    <AvailabilitySlotCard key={slot.id} slot={slot} />
                  ))}
                </div>
              </div>
            )}

            {/* Bio */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">自己紹介</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                {profile.detailed_bio || profile.bio}
              </p>
            </div>

            {/* Skills */}
            {profile.skills.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">スキル</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="space-y-3 text-sm">
              {profile.preferred_style && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">希望する関わり方</span>
                  <span className="text-gray-900">{profile.preferred_style}</span>
                </div>
              )}
              {profile.portfolio_url && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">ポートフォリオ</span>
                  <a
                    href={profile.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
                  >
                    <span>リンク</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Interests */}
            {profile.interests.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-500" />
                  興味・関心
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map(interest => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Spacer for bottom padding */}
            <div className="h-4" />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>

      <ReportModal
        open={reportModalOpen}
        onOpenChange={setReportModalOpen}
        userId={profile.id}
        userName={profile.display_name}
      />
    </>
  )
}
