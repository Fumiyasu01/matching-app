import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a consistent gradient based on user ID
 */
const AVATAR_GRADIENTS = [
  'from-cyan-400 via-sky-500 to-blue-600',
  'from-violet-400 via-purple-500 to-indigo-600',
  'from-rose-400 via-pink-500 to-fuchsia-600',
  'from-amber-400 via-orange-500 to-red-500',
  'from-emerald-400 via-teal-500 to-cyan-600',
  'from-lime-400 via-green-500 to-emerald-600',
]

export function getGradientByUserId(id: string): string {
  const index = id.charCodeAt(0) % AVATAR_GRADIENTS.length
  return AVATAR_GRADIENTS[index]
}

/**
 * Get initials from display name (max 2 characters)
 */
export function getInitials(displayName: string): string {
  return displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
