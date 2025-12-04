'use client'

import { useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { useMessages, useSendMessage, useMarkAsRead, useChatPartner } from '@/hooks/use-messages'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { MessageInput } from '@/components/chat/MessageInput'
import { LoadingState } from '@/components/ui/loading-state'
import { ErrorState } from '@/components/ui/error-state'

export default function ChatPage() {
  const params = useParams()
  const matchId = params.matchId as string

  const { data: messages, isLoading: messagesLoading } = useMessages(matchId)
  const { data: partner, isLoading: partnerLoading, error: partnerError } = useChatPartner(matchId)
  const sendMessage = useSendMessage(matchId)
  const { mutate: markAsRead } = useMarkAsRead(matchId)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasMarkedAsRead = useRef(false)

  // 新しいメッセージが来たらスクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 画面を開いたら既読にする（1回のみ）
  useEffect(() => {
    if (messages && messages.length > 0 && !hasMarkedAsRead.current) {
      markAsRead()
      hasMarkedAsRead.current = true
    }
  }, [messages, markAsRead])

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

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages?.length === 0 && (
          <div className="text-center text-muted-foreground py-10">
            <p>メッセージはまだありません</p>
            <p className="text-sm mt-1">最初のメッセージを送りましょう！</p>
          </div>
        )}
        {messages?.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSend={handleSend} disabled={sendMessage.isPending} />
    </div>
  )
}
