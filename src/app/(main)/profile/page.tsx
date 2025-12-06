'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Settings } from 'lucide-react'
import { useProfile } from '@/hooks/use-profile'
import { ProfileView, ProfileForm } from '@/components/profile'
import { LoadingState } from '@/components/ui/loading-state'
import { ErrorState } from '@/components/ui/error-state'
import { Button } from '@/components/ui/button'

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">
          {isEditing ? 'プロフィール編集' : 'プロフィール'}
        </h1>
        {!isEditing && (
          <Link href="/settings">
            <Button variant="ghost" size="lg" className="p-2 bg-cyan-50 hover:bg-cyan-100">
              <Settings className="h-7 w-7 text-cyan-600" />
            </Button>
          </Link>
        )}
      </div>

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
