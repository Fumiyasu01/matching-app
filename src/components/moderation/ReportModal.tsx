'use client'

import { useState } from 'react'
import { BaseModal } from '@/components/ui/base-modal'
import { DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useReportUser } from '@/hooks/use-moderation'
import { REPORT_REASON_LABELS } from '@/lib/constants'
import type { ReportReason } from '@/types/moderation'
import { toast } from 'sonner'

interface ReportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  userName: string
}

export function ReportModal({
  open,
  onOpenChange,
  userId,
  userName,
}: ReportModalProps) {
  const [reason, setReason] = useState<ReportReason>('spam')
  const [description, setDescription] = useState('')
  const reportUserMutation = useReportUser()

  const handleSubmit = async () => {
    try {
      await reportUserMutation.mutateAsync({
        userId,
        reason,
        description: description.trim() || undefined,
      })

      toast.success('報告を送信しました', {
        description: 'ご報告ありがとうございます。内容を確認いたします。',
      })

      // Reset form and close modal
      setReason('spam')
      setDescription('')
      onOpenChange(false)
    } catch (error) {
      toast.error('報告の送信に失敗しました', {
        description: 'もう一度お試しください。',
      })
    }
  }

  return (
    <BaseModal
      open={open}
      onClose={() => onOpenChange(false)}
      title="ユーザーを報告"
      description={`${userName}さんを報告する理由を選択してください`}
      className="sm:max-w-[500px]"
    >
      <div className="space-y-6 py-4">
        <div className="space-y-3">
          <Label>報告理由</Label>
          <RadioGroup value={reason} onValueChange={(value) => setReason(value as ReportReason)}>
            {Object.entries(REPORT_REASON_LABELS).map(([key, label]) => (
              <div key={key} className="flex items-center space-x-2">
                <RadioGroupItem value={key} id={`reason-${key}`} />
                <Label htmlFor={`reason-${key}`} className="font-normal cursor-pointer">
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">詳細（任意）</Label>
          <Textarea
            id="description"
            placeholder="具体的な内容を入力してください..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={reportUserMutation.isPending}
        >
          キャンセル
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={reportUserMutation.isPending}
        >
          {reportUserMutation.isPending ? '送信中...' : '報告する'}
        </Button>
      </DialogFooter>
    </BaseModal>
  )
}
