import { describe, it, expect } from 'vitest'
import { LOOKING_FOR_LABELS } from '../constants'

describe('constants', () => {
  describe('LOOKING_FOR_LABELS', () => {
    it('should have work label', () => {
      expect(LOOKING_FOR_LABELS.work).toBe('仕事を探している')
    })

    it('should have volunteer label', () => {
      expect(LOOKING_FOR_LABELS.volunteer).toBe('ボランティアを探している')
    })

    it('should have both label', () => {
      expect(LOOKING_FOR_LABELS.both).toBe('仕事・ボランティア両方')
    })

    it('should have exactly 3 keys', () => {
      expect(Object.keys(LOOKING_FOR_LABELS)).toHaveLength(3)
    })
  })
})
