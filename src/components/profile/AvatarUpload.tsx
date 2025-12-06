'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Camera, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { getInitials } from '@/lib/utils'

interface AvatarUploadProps {
  userId: string
  currentUrl: string | null
  displayName: string
  onUpload: (url: string) => void
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export function AvatarUpload({ userId, currentUrl, displayName, onUpload }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const initials = getInitials(displayName)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('JPEG、PNG、WebP、GIF形式の画像を選択してください')
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error('ファイルサイズは5MB以下にしてください')
      return
    }

    setUploading(true)

    try {
      // Create preview
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      onUpload(publicUrl)
      toast.success('プロフィール写真をアップロードしました')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('アップロードに失敗しました')
      setPreviewUrl(currentUrl)
    } finally {
      setUploading(false)
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = async () => {
    if (!currentUrl) return

    setUploading(true)

    try {
      // Extract file path from URL
      const urlParts = currentUrl.split('/avatars/')
      if (urlParts[1]) {
        await supabase.storage
          .from('avatars')
          .remove([urlParts[1]])
      }

      setPreviewUrl(null)
      onUpload('')
      toast.success('プロフィール写真を削除しました')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('削除に失敗しました')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
          <AvatarImage src={previewUrl || undefined} alt={displayName} />
          <AvatarFallback className="text-2xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white">
            {initials}
          </AvatarFallback>
        </Avatar>

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Camera className="h-4 w-4" />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Camera className="h-4 w-4 mr-2" />
          )}
          写真を変更
        </Button>

        {previewUrl && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={uploading}
            className="text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4 mr-1" />
            削除
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        JPEG, PNG, WebP, GIF (最大5MB)
      </p>
    </div>
  )
}
