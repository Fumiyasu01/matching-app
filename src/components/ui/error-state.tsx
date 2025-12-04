import { AlertCircle } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  message?: string
  error?: Error | null
}

export function ErrorState({
  title = 'エラーが発生しました',
  message,
  error
}: ErrorStateProps) {
  const displayMessage = message || (error instanceof Error ? error.message : '予期しないエラーが発生しました')

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <p className="text-destructive font-medium">{title}</p>
      <p className="text-sm text-muted-foreground mt-2 text-center max-w-xs">
        {displayMessage}
      </p>
    </div>
  )
}
