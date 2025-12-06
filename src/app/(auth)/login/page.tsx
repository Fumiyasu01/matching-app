'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Briefcase, Mail, Lock, ArrowRight } from 'lucide-react'

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
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 shadow-lg shadow-cyan-500/30 mb-4">
          <Briefcase className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          Matching
        </h1>
        <p className="text-gray-500 mt-2">
          仕事・ボランティア仲間を見つけよう
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-sm animate-card-enter" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-6">
            ログイン
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-600 animate-card-enter">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                パスワード
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-semibold rounded-xl
                         shadow-md shadow-cyan-500/25 hover:shadow-lg hover:shadow-cyan-500/30 hover:from-cyan-600 hover:to-teal-700
                         active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  ログイン
                  <ArrowRight className="w-4 h-4" />
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
            className="block w-full py-3 border border-gray-200 text-gray-700 font-medium rounded-xl text-center
                       hover:border-cyan-300 hover:text-cyan-600 hover:bg-cyan-50/50 transition-all duration-200"
          >
            新規アカウントを作成
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-6">
          ログインすることで、
          <Link href="/terms" className="text-cyan-600 hover:underline">
            利用規約
          </Link>
          に同意したものとみなされます
        </p>
      </div>
    </div>
  )
}
