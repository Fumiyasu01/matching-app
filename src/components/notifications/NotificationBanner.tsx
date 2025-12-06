'use client'

import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'
import { useNotifications } from '@/hooks/use-notifications'

const STORAGE_KEY = 'notification-banner-dismissed'

export function NotificationBanner() {
  const { permission, isSupported, requestPermission } = useNotifications()
  const [isDismissed, setIsDismissed] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  // コンポーネントマウント時にlocalStorageをチェック
  useEffect(() => {
    if (typeof window === 'undefined') return

    const dismissed = localStorage.getItem(STORAGE_KEY)
    setIsDismissed(dismissed === 'true')
  }, [])

  // 通知がサポートされていない、または既に許可/拒否されている場合は表示しない
  const shouldShow = isSupported && permission === 'default' && !isDismissed

  const handleEnable = async () => {
    setIsLoading(true)
    try {
      const result = await requestPermission()
      if (result === 'granted') {
        // 許可された場合はバナーを非表示
        setIsDismissed(true)
        localStorage.setItem(STORAGE_KEY, 'true')
      } else if (result === 'denied') {
        // 拒否された場合もバナーを非表示
        setIsDismissed(true)
        localStorage.setItem(STORAGE_KEY, 'true')
      }
    } catch (error) {
      console.error('通知の有効化に失敗しました:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem(STORAGE_KEY, 'true')
  }

  if (!shouldShow) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100">
      <div className="container mx-auto max-w-lg px-4 py-3">
        <div className="flex items-start gap-3">
          {/* アイコン */}
          <div className="flex-shrink-0 mt-0.5">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-sm">
              <Bell className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* コンテンツ */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              通知を有効にしましょう
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              マッチやメッセージをリアルタイムで受け取れるようになります
            </p>

            {/* ボタン */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleEnable}
                disabled={isLoading}
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-xs font-medium
                           shadow-sm hover:shadow-md hover:from-cyan-600 hover:to-cyan-700 transition-all
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '処理中...' : '有効にする'}
              </button>
              <button
                onClick={handleDismiss}
                disabled={isLoading}
                className="px-4 py-1.5 rounded-full bg-white text-gray-600 text-xs font-medium
                           border border-gray-200 hover:bg-gray-50 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                後で
              </button>
            </div>
          </div>

          {/* 閉じるボタン */}
          <button
            onClick={handleDismiss}
            disabled={isLoading}
            className="flex-shrink-0 h-6 w-6 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="閉じる"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  )
}
