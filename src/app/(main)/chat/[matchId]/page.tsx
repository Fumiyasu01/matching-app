'use client'

import { useEffect, useRef, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { useSendMessage, useMarkAsRead, useChatPartner } from '@/hooks/use-messages'
import { useRealtimeMessages } from '@/hooks/use-realtime-messages'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { MessageInput } from '@/components/chat/MessageInput'
import { TypingIndicator } from '@/components/chat/TypingIndicator'
import { DateDivider } from '@/components/chat/DateDivider'
import { LoadingState } from '@/components/ui/loading-state'
import { ErrorState } from '@/components/ui/error-state'

// Helper to group messages by date
function groupMessagesByDate(messages: any[]) {
  const groups: { date: string; messages: any[] }[] = []
  let currentDate = ''

  messages.forEach((message) => {
    const messageDate = new Date(message.created_at).toDateString()

    if (messageDate !== currentDate) {
      currentDate = messageDate
      groups.push({ date: message.created_at, messages: [message] })
    } else {
      groups[groups.length - 1].messages.push(message)
    }
  })

  return groups
}

export default function ChatPage() {
  const params = useParams()
  const matchId = params.matchId as string

  const { messages, isTyping, isLoading: messagesLoading } = useRealtimeMessages(matchId)
  const { data: partner, isLoading: partnerLoading, error: partnerError } = useChatPartner(matchId)
  const sendMessage = useSendMessage(matchId)
  const { mutate: markAsRead } = useMarkAsRead(matchId)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasMarkedAsRead = useRef(false)
  const messageContainerRef = useRef<HTMLDivElement>(null)
  const previousMessageCount = useRef(0)

  // Group messages by date
  const messageGroups = useMemo(() => groupMessagesByDate(messages), [messages])

  // Auto-scroll to bottom when new messages arrive or typing indicator appears
  useEffect(() => {
    const shouldScroll =
      messages.length > previousMessageCount.current ||
      isTyping

    if (shouldScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }

    previousMessageCount.current = messages.length
  }, [messages.length, isTyping])

  // Mark messages as read when chat opens
  useEffect(() => {
    if (messages.length > 0 && !hasMarkedAsRead.current) {
      markAsRead()
      hasMarkedAsRead.current = true
    }
  }, [messages.length, markAsRead])

  const handleSend = (content: string) => {
    sendMessage.mutate(content)
  }

  const isLoading = messagesLoading || partnerLoading

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <LoadingState />
      </div>
    )
  }

  if (partnerError || !partner) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <ErrorState
          title="チャット相手が見つかりません"
          error={partnerError instanceof Error ? partnerError : null}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader profile={partner} />

      <div
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto p-4"
      >
        {messages.length === 0 && !isTyping && (
          <div className="text-center text-muted-foreground py-10">
            <p>メッセージはまだありません</p>
            <p className="text-sm mt-1">最初のメッセージを送りましょう！</p>
          </div>
        )}

        {messageGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <DateDivider date={group.date} />
            <div className="space-y-3">
              {group.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="mt-3">
            <TypingIndicator name={partner.display_name} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSend={handleSend} disabled={sendMessage.isPending} />
    </div>
  )
}
