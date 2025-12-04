'use client'

import { useState } from 'react'
import { useProfile } from '@/hooks/use-profile'
import { ProfileView, ProfileForm } from '@/components/profile'
import { Loader2 } from 'lucide-react'

export default function ProfilePage() {
  const { data: profile, isLoading, error } = useProfile()
  const [isEditing, setIsEditing] = useState(false)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">読み込み中...</p>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-destructive">エラーが発生しました</p>
        <p className="text-sm text-muted-foreground mt-2">
          {error instanceof Error ? error.message : 'プロフィールを取得できませんでした'}
        </p>
      </div>
    )
  }

  return (
    <div className="py-6">
      <h1 className="text-xl font-bold mb-6">
        {isEditing ? 'プロフィール編集' : 'プロフィール'}
      </h1>

      {isEditing ? (
        <ProfileForm
          profile={profile}
          onCancel={() => setIsEditing(false)}
          onSuccess={() => setIsEditing(false)}
        />
      ) : (
        <ProfileView profile={profile} onEdit={() => setIsEditing(true)} />
      )}
    </div>
  )
}
