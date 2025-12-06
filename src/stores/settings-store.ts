import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SettingsState {
  // 通知設定
  notifications: {
    matchNotifications: boolean
    messageNotifications: boolean
  }

  // プライバシー設定
  privacy: {
    showDistance: boolean
    showOnlineStatus: boolean
  }

  // アクション
  updateNotifications: (notifications: Partial<SettingsState['notifications']>) => void
  updatePrivacy: (privacy: Partial<SettingsState['privacy']>) => void
  resetSettings: () => void
}

const defaultSettings = {
  notifications: {
    matchNotifications: true,
    messageNotifications: true,
  },
  privacy: {
    showDistance: true,
    showOnlineStatus: true,
  },
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      updateNotifications: (notifications) =>
        set((state) => ({
          notifications: {
            ...state.notifications,
            ...notifications,
          },
        })),

      updatePrivacy: (privacy) =>
        set((state) => ({
          privacy: {
            ...state.privacy,
            ...privacy,
          },
        })),

      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'matching-settings-storage',
    }
  )
)
