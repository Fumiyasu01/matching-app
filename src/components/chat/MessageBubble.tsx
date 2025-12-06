'use client'

import { cn } from '@/lib/utils'
import { formatMessageTime } from '@/lib/date-utils'
import { Check, CheckCheck } from 'lucide-react'
import type { ChatMessage } from '@/hooks/use-messages'

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        'flex',
        message.isOwn ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2',
          message.isOwn
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-muted rounded-bl-md'
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        <div
          className={cn(
            'flex items-center gap-1 mt-1',
            message.isOwn ? 'justify-end' : 'justify-start'
          )}
        >
          <span
            className={cn(
              'text-[10px]',
              message.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
            )}
          >
            {formatMessageTime(message.created_at)}
          </span>
          {message.isOwn && (
            <div className="ml-1">
              {message.read_at ? (
                <CheckCheck
                  className={cn(
                    'h-3 w-3',
                    'text-primary-foreground/70'
                  )}
                />
              ) : (
                <Check
                  className={cn(
                    'h-3 w-3',
                    'text-primary-foreground/50'
                  )}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
