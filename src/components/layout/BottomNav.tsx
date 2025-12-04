'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Flame, MessageCircle, User } from 'lucide-react'

const navItems = [
  { href: '/discover', icon: Flame, label: '探す' },
  { href: '/matches', icon: MessageCircle, label: 'チャット' },
  { href: '/profile', icon: User, label: 'マイページ' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100">
      <div className="container mx-auto max-w-lg">
        <div className="flex justify-around py-2 px-4">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className="relative flex flex-col items-center gap-1 px-6 py-2 transition-all duration-200"
              >
                <div className={`relative p-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg shadow-cyan-500/30'
                    : 'hover:bg-gray-100'
                }`}>
                  <Icon className={`h-5 w-5 transition-colors ${
                    isActive ? 'text-white' : 'text-gray-400'
                  }`} />
                </div>
                <span className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-cyan-600' : 'text-gray-400'
                }`}>
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
      {/* Safe area for iOS */}
      <div className="h-safe-area-inset-bottom bg-white/80" />
    </nav>
  )
}
