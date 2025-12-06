'use client'

import { useState, useEffect, useCallback } from 'react'

export type NotificationPermissionStatus = 'default' | 'granted' | 'denied'

/**
 * 通知の許可状態を管理するフック
 * 通知の表示には lib/notifications.ts の関数を使用
 */
export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermissionStatus>('default')
  const [isSupported, setIsSupported] = useState(false)

  // ブラウザが通知をサポートしているかチェック
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true)
      setPermission(Notification.permission as NotificationPermissionStatus)
    }
  }, [])

  // 通知の許可をリクエスト
  const requestPermission = useCallback(async (): Promise<NotificationPermissionStatus> => {
    if (!isSupported) {
      return 'denied'
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result as NotificationPermissionStatus)
      return result as NotificationPermissionStatus
    } catch (error) {
      console.error('通知の許可リクエストに失敗しました:', error)
      return 'denied'
    }
  }, [isSupported])

  return {
    permission,
    isSupported,
    requestPermission,
  }
}
