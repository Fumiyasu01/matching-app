'use client'

import { useState } from 'react'
import { useProfile } from '@/hooks/use-profile'
import { ProfileView, ProfileForm } from '@/components/profile'
import { LoadingState } from '@/components/ui/loading-state'
import { ErrorState } from '@/components/ui/error-state'

export default function ProfilePage() {
  const { data: profile, isLoading, error } = useProfile()
  const [isEditing, setIsEditing] = useState(false)

  if (isLoading) {
    return <LoadingState />
  }

  if (error || !profile) {
    return <ErrorState error={error instanceof Error ? error : null} />
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
