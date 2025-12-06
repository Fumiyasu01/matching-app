'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface BaseModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  showCloseButton?: boolean
  titleClassName?: string
}

export function BaseModal({
  open,
  onClose,
  title,
  description,
  children,
  className,
  showCloseButton = true,
  titleClassName,
}: BaseModalProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={className} showCloseButton={showCloseButton}>
        <DialogHeader>
          <DialogTitle className={titleClassName}>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
