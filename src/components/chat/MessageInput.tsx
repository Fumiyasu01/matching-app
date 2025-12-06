'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

interface MessageInputProps {
  onSend: (content: string) => void
  disabled?: boolean
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // モバイル判定
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth < 768
      )
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const MAX_MESSAGE_LENGTH = 5000

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const trimmed = message.trim()
    if (!trimmed) return
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      alert(`メッセージは${MAX_MESSAGE_LENGTH}文字以内で入力してください`)
      return
    }
    onSend(trimmed)
    setMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // モバイルの場合はEnterで改行のみ（送信ボタンで送信）
    if (isMobile) return

    // PCの場合
    if (e.key === 'Enter') {
      // IME変換中は何もしない（日本語確定用）
      if (e.nativeEvent.isComposing) return

      // Shift+Enterは改行
      if (e.shiftKey) return

      // Enterのみで送信
      e.preventDefault()
      handleSubmit()
    }
  }

  // テキストエリアの高さを自動調整
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }, [message])

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 p-4 border-t bg-background">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="メッセージを入力..."
        disabled={disabled}
        rows={1}
        className="flex-1 resize-none rounded-xl border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
      />
      <Button
        type="submit"
        size="icon"
        disabled={disabled || !message.trim()}
        className="rounded-full h-10 w-10 flex-shrink-0"
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  )
}
