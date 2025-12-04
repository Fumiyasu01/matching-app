'use client'

import { Button } from '@/components/ui/button'
import { X, Heart } from 'lucide-react'

interface SwipeButtonsProps {
  onPass: () => void
  onLike: () => void
  disabled?: boolean
}

export function SwipeButtons({ onPass, onLike, disabled }: SwipeButtonsProps) {
  return (
    <div className="flex justify-center gap-8 mt-6">
      <Button
        variant="outline"
        size="lg"
        className="h-16 w-16 rounded-full border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
        onClick={onPass}
        disabled={disabled}
      >
        <X className="h-8 w-8" />
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="h-16 w-16 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
        onClick={onLike}
        disabled={disabled}
      >
        <Heart className="h-8 w-8" />
      </Button>
    </div>
  )
}
