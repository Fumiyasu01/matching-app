'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArrowLeft, UserX, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

// ダミーデータ（実際にはSupabaseから取得）
interface BlockedUser {
  id: string
  name: string
  avatar?: string
  blockedAt: Date
}

const MOCK_BLOCKED_USERS: BlockedUser[] = [
  // 空の配列でテスト（実際にはSupabaseから取得）
]

export default function BlockedUsersPage() {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>(MOCK_BLOCKED_USERS)
  const [selectedUser, setSelectedUser] = useState<BlockedUser | null>(null)
  const [showUnblockDialog, setShowUnblockDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleUnblock = async () => {
    if (!selectedUser) return

    setLoading(true)
    try {
      // 実際にはSupabaseでブロック解除処理を行う
      // await supabase.from('blocked_users').delete().eq('id', selectedUser.id)

      setBlockedUsers(blockedUsers.filter(user => user.id !== selectedUser.id))
      toast.success(`${selectedUser.name}さんのブロックを解除しました`)
      setShowUnblockDialog(false)
      setSelectedUser(null)
    } catch (error) {
      toast.error('ブロック解除に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const openUnblockDialog = (user: BlockedUser) => {
    setSelectedUser(user)
    setShowUnblockDialog(true)
  }

  return (
    <div className="space-y-6 pb-8">
      {/* ヘッダー */}
      <div className="flex items-center gap-4">
        <Link href="/settings">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">ブロックしたユーザー</h1>
          <p className="text-sm text-muted-foreground">
            {blockedUsers.length}人をブロック中
          </p>
        </div>
      </div>

      {/* ブロックリスト */}
      {blockedUsers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="p-4 rounded-full bg-gray-100 mb-4">
              <UserX className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              ブロックしたユーザーはいません
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              ブロックしたユーザーがここに表示されます
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {blockedUsers.map((user) => (
            <Card key={user.id}>
              <CardContent className="flex items-center gap-4 py-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-cyan-600 text-white">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{user.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(user.blockedAt).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}にブロック
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openUnblockDialog(user)}
                  className="shrink-0"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  解除
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ブロック解除確認ダイアログ */}
      <Dialog open={showUnblockDialog} onOpenChange={setShowUnblockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ブロックを解除</DialogTitle>
            <DialogDescription>
              {selectedUser?.name}さんのブロックを解除しますか?
              解除後は再びお互いのプロフィールが表示されます。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUnblockDialog(false)}
              disabled={loading}
            >
              キャンセル
            </Button>
            <Button
              onClick={handleUnblock}
              disabled={loading}
            >
              解除する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
