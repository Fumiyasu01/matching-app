import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export async function ensureAuthenticated(): Promise<User> {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    throw new AuthError('認証エラーが発生しました')
  }

  if (!user) {
    throw new AuthError('ログインが必要です')
  }

  return user
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
