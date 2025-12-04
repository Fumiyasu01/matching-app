import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthError, ensureAuthenticated, getCurrentUser } from '../auth'
import { createClient } from '@/lib/supabase/client'

vi.mock('@/lib/supabase/client')

describe('auth', () => {
  const mockSupabase = {
    auth: {
      getUser: vi.fn(),
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(createClient).mockReturnValue(mockSupabase as any)
  })

  describe('AuthError', () => {
    it('should create an error with correct name', () => {
      const error = new AuthError('test message')
      expect(error.name).toBe('AuthError')
      expect(error.message).toBe('test message')
    })

    it('should be an instance of Error', () => {
      const error = new AuthError('test')
      expect(error).toBeInstanceOf(Error)
    })
  })

  describe('ensureAuthenticated', () => {
    it('should return user when authenticated', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' }
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const user = await ensureAuthenticated()
      expect(user).toEqual(mockUser)
    })

    it('should throw AuthError when there is an auth error', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: new Error('Auth failed'),
      })

      await expect(ensureAuthenticated()).rejects.toThrow(AuthError)
      await expect(ensureAuthenticated()).rejects.toThrow('認証エラーが発生しました')
    })

    it('should throw AuthError when user is null', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      await expect(ensureAuthenticated()).rejects.toThrow(AuthError)
      await expect(ensureAuthenticated()).rejects.toThrow('ログインが必要です')
    })
  })

  describe('getCurrentUser', () => {
    it('should return user when authenticated', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' }
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const user = await getCurrentUser()
      expect(user).toEqual(mockUser)
    })

    it('should return null when not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const user = await getCurrentUser()
      expect(user).toBeNull()
    })
  })
})
