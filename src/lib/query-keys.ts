export const queryKeys = {
  // Profile
  profile: ['profile'] as const,

  // Discover
  discoverProfiles: ['discover-profiles'] as const,

  // Matches
  matches: ['matches'] as const,

  // Messages
  messages: (matchId: string) => ['messages', matchId] as const,
  chatPartner: (matchId: string) => ['chat-partner', matchId] as const,

  // Current user
  currentUser: ['current-user'] as const,
} as const
