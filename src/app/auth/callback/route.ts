import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Allowed redirect paths (whitelist)
const ALLOWED_PATHS = ['/discover', '/matches', '/profile', '/chat']

function isValidRedirectPath(path: string): boolean {
  // Must start with / and not with // (prevent protocol-relative URLs)
  if (!path.startsWith('/') || path.startsWith('//')) {
    return false
  }
  // Check against whitelist or allow paths starting with allowed prefixes
  return ALLOWED_PATHS.some(allowed => path === allowed || path.startsWith(`${allowed}/`))
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/discover'

  // Validate redirect path to prevent open redirect attacks
  const redirectPath = isValidRedirectPath(next) ? next : '/discover'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${redirectPath}`)
    }
  }

  // エラー時はログインページへ
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
