'use client'

interface TypingIndicatorProps {
  name: string
}

export function TypingIndicator({ name }: TypingIndicatorProps) {
  return (
    <div className="flex justify-start">
      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 max-w-[75%]">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{name}が入力中</span>
          <div className="flex gap-1">
            <div
              className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
              style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
            />
            <div
              className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
              style={{ animationDelay: '200ms', animationDuration: '1.4s' }}
            />
            <div
              className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
              style={{ animationDelay: '400ms', animationDuration: '1.4s' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
