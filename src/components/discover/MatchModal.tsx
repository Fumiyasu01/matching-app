'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import type { Profile } from '@/types/database'

interface MatchModalProps {
  open: boolean
  onClose: () => void
  matchedProfile: Profile | null
}

export function MatchModal({ open, onClose, matchedProfile }: MatchModalProps) {
  const router = useRouter()

  if (!matchedProfile) return null

  const handleSendMessage = () => {
    onClose()
    router.push('/matches')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            マッチしました!
          </DialogTitle>
          <DialogDescription className="text-center">
            {matchedProfile.display_name}さんとマッチしました
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center py-6">
          <Avatar className="h-32 w-32 border-4 border-primary shadow-lg">
            <AvatarImage
              src={matchedProfile.avatar_url || undefined}
              alt={matchedProfile.display_name}
            />
            <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
              {matchedProfile.display_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={handleSendMessage} className="w-full">
            メッセージを送る
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            スワイプを続ける
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
