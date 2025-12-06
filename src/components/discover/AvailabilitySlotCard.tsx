'use client'

import { Calendar, Home } from 'lucide-react'
import {
  TIME_SLOT_LABELS,
  LOCATION_TYPE_LABELS,
  AVAILABILITY_TYPE_LABELS,
} from '@/lib/constants'
import { formatDateJa } from '@/lib/utils/format'
import type { AvailabilitySlot } from '@/types/database'

interface AvailabilitySlotCardProps {
  slot: AvailabilitySlot
}

export function AvailabilitySlotCard({ slot }: AvailabilitySlotCardProps) {
  const typeColor = slot.type === 'work'
    ? 'bg-blue-100 text-blue-700'
    : slot.type === 'volunteer'
    ? 'bg-green-100 text-green-700'
    : 'bg-purple-100 text-purple-700'

  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{formatDateJa(slot.date)}</span>
          <span className="text-gray-500">{TIME_SLOT_LABELS[slot.time_slot]}</span>
          {slot.time_detail && (
            <span className="text-sm text-gray-400">({slot.time_detail})</span>
          )}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${typeColor}`}>
          {AVAILABILITY_TYPE_LABELS[slot.type]}
        </span>
      </div>

      <h4 className="font-semibold text-gray-900">{slot.title}</h4>

      {slot.description && (
        <p className="text-sm text-gray-600">{slot.description}</p>
      )}

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Home className="h-3.5 w-3.5" />
        <span>{LOCATION_TYPE_LABELS[slot.location]}</span>
        {slot.area && <span className="text-gray-400">({slot.area})</span>}
      </div>
    </div>
  )
}
