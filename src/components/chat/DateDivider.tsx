'use client'

import { formatDateDivider } from '@/lib/date-utils'

interface DateDividerProps {
  date: string
}

export function DateDivider({ date }: DateDividerProps) {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="bg-muted px-3 py-1 rounded-full">
        <span className="text-xs text-muted-foreground font-medium">
          {formatDateDivider(date)}
        </span>
      </div>
    </div>
  )
}
