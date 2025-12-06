import type { Profile } from '@/types/database'

export type NotificationType = 'match' | 'message' | 'like' | 'system'

export interface NotificationPayload {
  type: NotificationType
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  data?: Record<string, unknown>
  onClick?: () => void
}

/**
 * 通知を表示する汎用関数
 * 許可状態とタブのフォーカス状態を自動的にチェック
 */
export function showNotification(payload: NotificationPayload): Notification | null {
  // サーバーサイドではスキップ
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null
  }

  // 許可されていない場合はスキップ
  if (Notification.permission !== 'granted') {
    return null
  }

  try {
    const notification = new Notification(payload.title, {
      body: payload.body,
      icon: payload.icon || '/icon-192.png',
      badge: payload.badge || '/icon-96.png',
      tag: payload.tag,
      data: payload.data,
      requireInteraction: false,
    })

    // クリック時のハンドラ
    notification.onclick = () => {
      window.focus()
      if (payload.onClick) {
        payload.onClick()
      }
      notification.close()
    }

    return notification
  } catch (error) {
    console.error('通知の表示に失敗しました:', error)
    return null
  }
}

/**
 * マッチ通知を表示
 */
export function notifyMatch(profile: Profile): Notification | null {
  return showNotification({
    type: 'match',
    title: '新しいマッチ!',
    body: `${profile.display_name}さんとマッチしました`,
    icon: profile.avatar_url || '/icon-192.png',
    tag: `match-${profile.id}`,
    data: {
      type: 'match',
      profileId: profile.id,
    },
    onClick: () => {
      window.location.href = '/matches'
    },
  })
}

/**
 * メッセージ通知を表示
 * タブがアクティブな場合は通知しない
 */
export function notifyMessage(
  senderName: string,
  message: string,
  matchId?: string,
  senderAvatarUrl?: string
): Notification | null {
  // タブがアクティブな場合は通知を表示しない
  if (!document.hidden) {
    return null
  }

  return showNotification({
    type: 'message',
    title: `${senderName}から新しいメッセージ`,
    body: message.length > 100 ? `${message.substring(0, 100)}...` : message,
    icon: senderAvatarUrl || '/icon-192.png',
    tag: matchId ? `message-${matchId}` : 'message',
    data: {
      type: 'message',
      matchId,
    },
    onClick: () => {
      if (matchId) {
        window.location.href = `/chat/${matchId}`
      }
    },
  })
}

/**
 * いいね通知を表示
 */
export function notifyLike(profile: Profile): Notification | null {
  return showNotification({
    type: 'like',
    title: '新しいいいね!',
    body: `${profile.display_name}さんがあなたに興味を持っています`,
    icon: profile.avatar_url || '/icon-192.png',
    tag: `like-${profile.id}`,
    data: {
      type: 'like',
      profileId: profile.id,
    },
    onClick: () => {
      window.location.href = '/discover'
    },
  })
}

/**
 * システム通知を表示
 */
export function notifySystem(title: string, message: string): Notification | null {
  return showNotification({
    type: 'system',
    title,
    body: message,
    tag: 'system',
    data: {
      type: 'system',
    },
  })
}

/**
 * 通知許可状態を取得
 */
export function getNotificationPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied'
  }
  return Notification.permission
}

/**
 * 通知許可をリクエスト
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied'
  }

  try {
    const permission = await Notification.requestPermission()
    return permission
  } catch (error) {
    console.error('通知の許可リクエストに失敗しました:', error)
    return 'denied'
  }
}

/**
 * 通知がサポートされているかチェック
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}
