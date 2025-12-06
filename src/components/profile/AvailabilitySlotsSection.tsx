'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Home, Plus, Pencil, Trash2 } from 'lucide-react'
import {
  useAvailabilitySlots,
  useAddAvailabilitySlot,
  useUpdateAvailabilitySlot,
  useDeleteAvailabilitySlot,
} from '@/hooks/use-availability-slots'
import { AvailabilitySlotModal } from './AvailabilitySlotModal'
import { formatDateJa } from '@/lib/utils/format'
import {
  TIME_SLOT_LABELS,
  LOCATION_TYPE_LABELS,
  AVAILABILITY_TYPE_LABELS,
  AVAILABILITY_TYPE_COLORS,
} from '@/lib/constants'
import type { AvailabilitySlot } from '@/types/database'

export function AvailabilitySlotsSection() {
  const { data: slots = [], isLoading } = useAvailabilitySlots()
  const addMutation = useAddAvailabilitySlot()
  const updateMutation = useUpdateAvailabilitySlot()
  const deleteMutation = useDeleteAvailabilitySlot()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null)

  const openSlots = slots.filter(s => s.status === 'open')

  const handleAdd = () => {
    setEditingSlot(null)
    setIsModalOpen(true)
  }

  const handleEdit = (slot: AvailabilitySlot) => {
    setEditingSlot(slot)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('この募集を削除しますか？')) {
      await deleteMutation.mutateAsync(id)
    }
  }

  const handleSubmit = async (data: Omit<AvailabilitySlot, 'id' | 'user_id' | 'created_at'>) => {
    if (editingSlot) {
      await updateMutation.mutateAsync({ id: editingSlot.id, updates: data })
    } else {
      await addMutation.mutateAsync(data)
    }
    setIsModalOpen(false)
    setEditingSlot(null)
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cyan-600" />
              募集中
              {openSlots.length > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({openSlots.length}件)
                </span>
              )}
            </CardTitle>
            <Button size="sm" onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-1" />
              追加
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground text-center py-4">読み込み中...</p>
          ) : openSlots.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-3">
                募集がありません
              </p>
              <p className="text-xs text-muted-foreground">
                「追加」ボタンから、対応可能な日時を登録しましょう
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {openSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="p-3 bg-gray-50 rounded-lg space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {formatDateJa(slot.date)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {TIME_SLOT_LABELS[slot.time_slot]}
                        </span>
                        {slot.time_detail && (
                          <span className="text-xs text-muted-foreground">
                            ({slot.time_detail})
                          </span>
                        )}
                      </div>
                      <p className="font-medium">{slot.title}</p>
                      {slot.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {slot.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className={`px-2 py-0.5 rounded-full ${AVAILABILITY_TYPE_COLORS[slot.type]}`}>
                          {AVAILABILITY_TYPE_LABELS[slot.type]}
                        </span>
                        <span className="flex items-center gap-1">
                          <Home className="h-3 w-3" />
                          {LOCATION_TYPE_LABELS[slot.location]}
                          {slot.area && ` (${slot.area})`}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleEdit(slot)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(slot.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AvailabilitySlotModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingSlot(null)
        }}
        onSubmit={handleSubmit}
        slot={editingSlot}
        isLoading={addMutation.isPending || updateMutation.isPending}
      />
    </>
  )
}
