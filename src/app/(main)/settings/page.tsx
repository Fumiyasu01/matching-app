'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useSettingsStore } from '@/stores/settings-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Bell,
  Lock,
  UserX,
  Info,
  LogOut,
  Trash2,
  ChevronRight,
  MapPin,
  Wifi
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const {
    notifications,
    privacy,
    updateNotifications,
    updatePrivacy,
  } = useSettingsStore()

  // ユーザー情報を取得
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase.auth])

  const handleLogout = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      toast.success('ログアウトしました')
      router.push('/login')
    } catch (error) {
      toast.error('ログアウトに失敗しました')
    } finally {
      setLoading(false)
      setShowLogoutDialog(false)
    }
  }

  const handleDeleteAccount = () => {
    // 実際には削除しない（確認ダイアログのみ）
    toast.info('アカウント削除機能は準備中です')
    setShowDeleteDialog(false)
  }

  return (
    <div className="space-y-6 pb-8">
      {/* ヘッダー */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">設定</h1>
        <p className="text-muted-foreground">
          アプリの設定を管理します
        </p>
      </div>

      {/* アカウント */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600">
              <LogOut className="h-4 w-4 text-white" />
            </div>
            アカウント
          </CardTitle>
          <CardDescription>アカウント情報とログアウト</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <Label className="text-sm font-medium">メールアドレス</Label>
              <p className="text-sm text-muted-foreground">
                {user?.email || '読み込み中...'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => setShowLogoutDialog(true)}
            disabled={loading}
          >
            ログアウト
            <LogOut className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* 通知設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600">
              <Bell className="h-4 w-4 text-white" />
            </div>
            通知
          </CardTitle>
          <CardDescription>通知の設定を管理します</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="match-notifications" className="text-sm font-medium">
                マッチ通知
              </Label>
              <p className="text-xs text-muted-foreground">
                新しいマッチがあったときに通知を受け取る
              </p>
            </div>
            <Switch
              id="match-notifications"
              checked={notifications.matchNotifications}
              onCheckedChange={(checked) =>
                updateNotifications({ matchNotifications: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between py-2 border-t">
            <div className="space-y-0.5">
              <Label htmlFor="message-notifications" className="text-sm font-medium">
                メッセージ通知
              </Label>
              <p className="text-xs text-muted-foreground">
                新しいメッセージがあったときに通知を受け取る
              </p>
            </div>
            <Switch
              id="message-notifications"
              checked={notifications.messageNotifications}
              onCheckedChange={(checked) =>
                updateNotifications({ messageNotifications: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* プライバシー設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600">
              <Lock className="h-4 w-4 text-white" />
            </div>
            プライバシー
          </CardTitle>
          <CardDescription>プライバシー設定を管理します</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label htmlFor="show-distance" className="text-sm font-medium">
                  距離を表示
                </Label>
                <p className="text-xs text-muted-foreground">
                  プロフィールに距離情報を表示する
                </p>
              </div>
            </div>
            <Switch
              id="show-distance"
              checked={privacy.showDistance}
              onCheckedChange={(checked) =>
                updatePrivacy({ showDistance: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between py-2 border-t">
            <div className="space-y-0.5 flex items-center gap-2">
              <Wifi className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label htmlFor="show-online-status" className="text-sm font-medium">
                  オンライン状態を表示
                </Label>
                <p className="text-xs text-muted-foreground">
                  他のユーザーにオンライン状態を表示する
                </p>
              </div>
            </div>
            <Switch
              id="show-online-status"
              checked={privacy.showOnlineStatus}
              onCheckedChange={(checked) =>
                updatePrivacy({ showOnlineStatus: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* ブロックしたユーザー */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600">
              <UserX className="h-4 w-4 text-white" />
            </div>
            ブロックしたユーザー
          </CardTitle>
          <CardDescription>ブロックしたユーザーを管理します</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/settings/blocked">
            <Button variant="outline" className="w-full justify-between">
              ブロックリストを表示
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* アプリについて */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600">
              <Info className="h-4 w-4 text-white" />
            </div>
            アプリについて
          </CardTitle>
          <CardDescription>アプリの情報とリンク</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between py-2">
            <Label className="text-sm font-medium">バージョン</Label>
            <p className="text-sm text-muted-foreground">1.0.0</p>
          </div>
          <div className="border-t pt-2 space-y-2">
            <Button variant="ghost" className="w-full justify-between" asChild>
              <a href="/terms" target="_blank">
                利用規約
                <ChevronRight className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-between" asChild>
              <a href="/privacy" target="_blank">
                プライバシーポリシー
                <ChevronRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 危険ゾーン */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <div className="p-2 rounded-lg bg-destructive/10">
              <Trash2 className="h-4 w-4 text-destructive" />
            </div>
            危険ゾーン
          </CardTitle>
          <CardDescription>アカウントの削除</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => setShowDeleteDialog(true)}
          >
            アカウントを削除
          </Button>
        </CardContent>
      </Card>

      {/* ログアウト確認ダイアログ */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ログアウト</DialogTitle>
            <DialogDescription>
              本当にログアウトしますか?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              disabled={loading}
            >
              キャンセル
            </Button>
            <Button
              onClick={handleLogout}
              disabled={loading}
            >
              ログアウト
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* アカウント削除確認ダイアログ */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">アカウントを削除</DialogTitle>
            <DialogDescription>
              この操作は取り消せません。本当にアカウントを削除しますか?
              すべてのデータが完全に削除されます。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
            >
              削除する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
