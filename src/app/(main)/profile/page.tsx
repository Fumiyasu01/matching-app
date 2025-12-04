import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LogoutButton } from '@/components/auth/LogoutButton'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">プロフィール</h1>
      <div className="rounded-lg border p-4">
        <p className="font-medium">{profile?.display_name || 'ゲスト'}</p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
      <LogoutButton />
    </div>
  )
}
