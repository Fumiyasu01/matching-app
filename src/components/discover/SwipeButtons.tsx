'use client'

import { X, Heart, RotateCcw } from 'lucide-react'

interface SwipeButtonsProps {
  onPass: () => void
  onLike: () => void
  disabled?: boolean
}

export function SwipeButtons({ onPass, onLike, disabled }: SwipeButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-6">
      {/* Pass Button */}
      <button
        onClick={onPass}
        disabled={disabled}
        className="group relative h-16 w-16 rounded-full bg-white shadow-lg shadow-red-500/20
                   border-2 border-red-100 transition-all duration-200
                   hover:scale-110 hover:shadow-xl hover:shadow-red-500/30
                   active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <X className="h-8 w-8 mx-auto text-red-500 transition-transform group-hover:rotate-90" />
      </button>

      {/* Undo Button (smaller) */}
      <button
        disabled={disabled}
        className="h-12 w-12 rounded-full bg-white shadow-md shadow-amber-500/10
                   border-2 border-amber-100 transition-all duration-200
                   hover:scale-110 hover:shadow-lg hover:shadow-amber-500/20
                   active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RotateCcw className="h-5 w-5 mx-auto text-amber-500" />
      </button>

      {/* Like Button */}
      <button
        onClick={onLike}
        disabled={disabled}
        className="group relative h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500
                   shadow-lg shadow-cyan-500/30 transition-all duration-200
                   hover:scale-110 hover:shadow-xl hover:shadow-cyan-500/40
                   active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Heart className="h-8 w-8 mx-auto text-white fill-white transition-transform group-hover:scale-110" />
      </button>
    </div>
  )
}
