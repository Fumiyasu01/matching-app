import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface ProfileAvatarProps {
  src?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'h-10 w-10',
  md: 'h-14 w-14',
  lg: 'h-24 w-24',
  xl: 'h-40 w-40',
}

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
  xl: 'text-4xl',
}

export function ProfileAvatar({ src, name, size = 'md', className }: ProfileAvatarProps) {
  const initial = name.charAt(0).toUpperCase()

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={src ?? undefined} alt={name} />
      <AvatarFallback className={cn('bg-primary text-primary-foreground', textSizeClasses[size])}>
        {initial}
      </AvatarFallback>
    </Avatar>
  )
}
