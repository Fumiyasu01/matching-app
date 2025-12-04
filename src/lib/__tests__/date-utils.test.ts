import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatDistanceToNow, formatMessageTime } from '../date-utils'

describe('date-utils', () => {
  describe('formatDistanceToNow', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should return "たった今" for dates less than 60 seconds ago', () => {
      const date = new Date('2024-01-15T11:59:30Z').toISOString()
      expect(formatDistanceToNow(date)).toBe('たった今')
    })

    it('should return minutes ago for dates less than 60 minutes ago', () => {
      const date = new Date('2024-01-15T11:30:00Z').toISOString()
      expect(formatDistanceToNow(date)).toBe('30分前')
    })

    it('should return hours ago for dates less than 24 hours ago', () => {
      const date = new Date('2024-01-15T09:00:00Z').toISOString()
      expect(formatDistanceToNow(date)).toBe('3時間前')
    })

    it('should return days ago for dates less than 7 days ago', () => {
      const date = new Date('2024-01-12T12:00:00Z').toISOString()
      expect(formatDistanceToNow(date)).toBe('3日前')
    })

    it('should return formatted date for dates more than 7 days ago', () => {
      const date = new Date('2024-01-01T12:00:00Z').toISOString()
      const result = formatDistanceToNow(date)
      // Locale-specific format, just check it's not a relative time
      expect(result).not.toContain('前')
      expect(result).not.toBe('たった今')
    })
  })

  describe('formatMessageTime', () => {
    it('should format time in HH:mm format', () => {
      const date = new Date('2024-01-15T14:30:00Z').toISOString()
      const result = formatMessageTime(date)
      // Result depends on timezone, just verify it matches HH:MM pattern
      expect(result).toMatch(/^\d{1,2}:\d{2}$/)
    })
  })
})
