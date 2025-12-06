'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { LOOKING_FOR_LABELS } from '@/lib/constants'
import { useUpdateProfile } from '@/hooks/use-profile'
import { useTagList } from '@/hooks/use-tag-list'
import { AvatarUpload } from './AvatarUpload'
import { TagInputCard } from './TagInputCard'
import { toast } from 'sonner'
import type { Profile } from '@/types/database'

const profileSchema = z.object({
  display_name: z.string().min(1, '表示名を入力してください').max(50, '50文字以内で入力してください'),
  bio: z.string().max(500, '500文字以内で入力してください').optional(),
  location: z.string().max(100, '100文字以内で入力してください').optional(),
  looking_for: z.enum(['work', 'volunteer', 'both']),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileFormProps {
  profile: Profile
  onCancel: () => void
  onSuccess: () => void
}

export function ProfileForm({ profile, onCancel, onSuccess }: ProfileFormProps) {
  const updateProfile = useUpdateProfile()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url)

  const skillsTag = useTagList(profile.skills || [])
  const interestsTag = useTagList(profile.interests || [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: profile.display_name,
      bio: profile.bio || '',
      location: profile.location || '',
      looking_for: profile.looking_for,
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile.mutateAsync({
        ...data,
        avatar_url: avatarUrl,
        skills: skillsTag.tags,
        interests: interestsTag.tags,
      })
      toast.success('プロフィールを更新しました')
      onSuccess()
    } catch (error) {
      toast.error('更新に失敗しました')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar Upload */}
      <Card>
        <CardHeader>
          <CardTitle>プロフィール写真</CardTitle>
        </CardHeader>
        <CardContent>
          <AvatarUpload
            userId={profile.id}
            currentUrl={avatarUrl}
            displayName={profile.display_name}
            onUpload={(url) => setAvatarUrl(url || null)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display_name">表示名 *</Label>
            <Input
              id="display_name"
              {...register('display_name')}
              placeholder="表示名を入力"
            />
            {errors.display_name && (
              <p className="text-sm text-destructive">{errors.display_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">自己紹介</Label>
            <Textarea
              id="bio"
              {...register('bio')}
              placeholder="自己紹介を入力"
              rows={4}
            />
            {errors.bio && (
              <p className="text-sm text-destructive">{errors.bio.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">場所</Label>
            <Input
              id="location"
              {...register('location')}
              placeholder="例: 東京都渋谷区"
            />
          </div>

          <div className="space-y-2">
            <Label>探しているもの</Label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(LOOKING_FOR_LABELS) as Array<keyof typeof LOOKING_FOR_LABELS>).map((key) => (
                <label key={key} className="cursor-pointer">
                  <input
                    type="radio"
                    value={key}
                    {...register('looking_for')}
                    className="sr-only peer"
                  />
                  <Badge
                    variant="outline"
                    className="peer-checked:bg-primary peer-checked:text-primary-foreground cursor-pointer"
                  >
                    {LOOKING_FOR_LABELS[key]}
                  </Badge>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <TagInputCard
        title="スキル"
        placeholder="スキルを追加"
        tags={skillsTag.tags}
        inputValue={skillsTag.inputValue}
        onInputChange={skillsTag.setInputValue}
        onAdd={skillsTag.addTag}
        onRemove={skillsTag.removeTag}
      />

      <TagInputCard
        title="興味・関心"
        placeholder="興味・関心を追加"
        tags={interestsTag.tags}
        inputValue={interestsTag.inputValue}
        onInputChange={interestsTag.setInputValue}
        onAdd={interestsTag.addTag}
        onRemove={interestsTag.removeTag}
      />

      <div className="flex gap-3">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          キャンセル
        </Button>
        <Button type="submit" className="flex-1" disabled={updateProfile.isPending}>
          {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          保存
        </Button>
      </div>
    </form>
  )
}
