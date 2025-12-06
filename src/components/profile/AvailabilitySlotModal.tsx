'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  TIME_SLOT_LABELS,
  LOCATION_TYPE_LABELS,
  AVAILABILITY_TYPE_LABELS,
} from '@/lib/constants'
import type { AvailabilitySlot, TimeSlot, AvailabilityType, LocationType, AvailabilityStatus } from '@/types/database'

interface AvailabilitySlotModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (slot: Omit<AvailabilitySlot, 'id' | 'user_id' | 'created_at'>) => void
  slot?: AvailabilitySlot | null
  isLoading?: boolean
}

const defaultFormData = {
  date: '',
  time_slot: 'afternoon' as TimeSlot,
  time_detail: '',
  type: 'both' as AvailabilityType,
  title: '',
  description: '',
  location: 'remote' as LocationType,
  area: '',
  status: 'open' as AvailabilityStatus,
}

export function AvailabilitySlotModal({
  open,
  onClose,
  onSubmit,
  slot,
  isLoading,
}: AvailabilitySlotModalProps) {
  const [formData, setFormData] = useState(defaultFormData)
  const isEditing = !!slot

  useEffect(() => {
    if (slot) {
      setFormData({
        date: slot.date,
        time_slot: slot.time_slot,
        time_detail: slot.time_detail || '',
        type: slot.type,
        title: slot.title,
        description: slot.description || '',
        location: slot.location,
        area: slot.area || '',
        status: slot.status,
      })
    } else {
      // Set default date to tomorrow
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      setFormData({
        ...defaultFormData,
        date: tomorrow.toISOString().split('T')[0],
      })
    }
  }, [slot, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      date: formData.date,
      time_slot: formData.time_slot,
      time_detail: formData.time_detail || undefined,
      type: formData.type,
      title: formData.title,
      description: formData.description || undefined,
      location: formData.location,
      area: formData.area || undefined,
      status: formData.status,
    })
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? '募集を編集' : '新しい募集を追加'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">日付 *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Time Slot */}
          <div className="space-y-2">
            <Label>時間帯 *</Label>
            <Select
              value={formData.time_slot}
              onValueChange={(value: TimeSlot) => setFormData({ ...formData, time_slot: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TIME_SLOT_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Detail (optional) */}
          <div className="space-y-2">
            <Label htmlFor="time_detail">具体的な時間（任意）</Label>
            <Input
              id="time_detail"
              type="text"
              placeholder="例: 10:00-15:00"
              value={formData.time_detail}
              onChange={(e) => setFormData({ ...formData, time_detail: e.target.value })}
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>種類 *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: AvailabilityType) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(AVAILABILITY_TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">タイトル *</Label>
            <Input
              id="title"
              type="text"
              placeholder="例: Webサイトデザイン"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              maxLength={50}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">詳細説明（任意）</Label>
            <Textarea
              id="description"
              placeholder="どんな作業ができるか、条件などを記載"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              maxLength={300}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label>場所 *</Label>
            <Select
              value={formData.location}
              onValueChange={(value: LocationType) => setFormData({ ...formData, location: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LOCATION_TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Area (if onsite or both) */}
          {(formData.location === 'onsite' || formData.location === 'both') && (
            <div className="space-y-2">
              <Label htmlFor="area">対応エリア</Label>
              <Input
                id="area"
                type="text"
                placeholder="例: 東京都内"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              キャンセル
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? '保存中...' : isEditing ? '更新する' : '追加する'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
