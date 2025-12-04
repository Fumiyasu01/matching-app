import { describe, it, expect } from 'vitest'
import { queryKeys } from '../query-keys'

describe('queryKeys', () => {
  it('should have correct profile key', () => {
    expect(queryKeys.profile).toEqual(['profile'])
  })

  it('should have correct discoverProfiles key', () => {
    expect(queryKeys.discoverProfiles).toEqual(['discover-profiles'])
  })

  it('should have correct matches key', () => {
    expect(queryKeys.matches).toEqual(['matches'])
  })

  it('should have correct currentUser key', () => {
    expect(queryKeys.currentUser).toEqual(['current-user'])
  })

  it('should generate correct messages key with matchId', () => {
    const matchId = 'test-match-123'
    expect(queryKeys.messages(matchId)).toEqual(['messages', 'test-match-123'])
  })

  it('should generate correct chatPartner key with matchId', () => {
    const matchId = 'test-match-456'
    expect(queryKeys.chatPartner(matchId)).toEqual(['chat-partner', 'test-match-456'])
  })

  it('should generate different keys for different matchIds', () => {
    const key1 = queryKeys.messages('match-1')
    const key2 = queryKeys.messages('match-2')
    expect(key1).not.toEqual(key2)
  })
})
