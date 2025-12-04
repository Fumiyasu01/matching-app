'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Flame, Mail, Lock, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
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
          仕事・ボランティア仲間を見つけよう
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-sm animate-card-enter" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/10 p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            おかえりなさい
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-sm text-red-600 animate-card-enter">
                {error}
              </div>
            )}

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
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
                         flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  ログイン
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400">または</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Sign Up Link */}
          <Link
            href="/signup"
            className="block w-full py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl text-center
                       hover:border-rose-300 hover:text-rose-500 transition-all duration-200"
          >
            新規アカウントを作成
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-6">
          ログインすることで、利用規約に同意したものとみなされます
        </p>
      </div>
    </div>
  )
}
