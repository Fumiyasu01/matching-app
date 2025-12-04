'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Flame, Mail, Lock, User, Sparkles } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push('/discover')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      {/* Logo & Branding */}
      <div className="mb-8 text-center animate-card-enter">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/90 shadow-xl shadow-rose-500/20 mb-4">
          <Flame className="w-10 h-10 text-rose-500" />
        </div>
        <h1 className="text-4xl font-bold text-white drop-shadow-lg tracking-tight">
          Matching
        </h1>
        <p className="text-white/80 mt-2 text-lg">
          新しい出会いを始めよう
        </p>
      </div>

      {/* Signup Card */}
      <div className="w-full max-w-sm animate-card-enter" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/10 p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
            アカウント作成
          </h2>
          <p className="text-gray-500 text-center text-sm mb-6">
            無料で始められます
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-sm text-red-600 animate-card-enter">
                {error}
              </div>
            )}

            {/* Display Name Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="displayName"
                type="text"
                placeholder="ニックネーム"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl text-gray-800 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl text-gray-800 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                placeholder="パスワード（6文字以上）"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl text-gray-800 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white font-bold rounded-2xl
                         shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 hover:scale-[1.02]
                         active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  はじめる
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-500 text-sm mt-6">
            既にアカウントをお持ちですか？{' '}
            <Link href="/login" className="text-rose-500 font-semibold hover:underline">
              ログイン
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-6 px-4">
          登録することで、利用規約とプライバシーポリシーに同意したものとみなされます
        </p>
      </div>
    </div>
  )
}
