import { QueryClient } from '@tanstack/react-query'
import { queryKeys } from './query-keys'

/**
 * Centralized query invalidation helpers for consistent cache management
 * across all mutation hooks
 */

/**
 * Invalidate queries after a swipe action
 * - Refreshes discover profiles to remove swiped profile
 * - Refreshes matches list in case of new match
 */
export function invalidateAfterSwipe(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.discoverProfiles })
  queryClient.invalidateQueries({ queryKey: queryKeys.matches })
}

/**
 * Invalidate queries after sending a message
 * - Refreshes messages for the specific match
 * - Refreshes matches list to update last message timestamp
 */
export function invalidateAfterMessage(queryClient: QueryClient, matchId: string) {
  queryClient.invalidateQueries({ queryKey: queryKeys.messages(matchId) })
  queryClient.invalidateQueries({ queryKey: queryKeys.matches })
}

/**
 * Invalidate queries after profile update
 * - Refreshes current user profile
 * - Refreshes current user data
 */
export function invalidateAfterProfileUpdate(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.profile })
  queryClient.invalidateQueries({ queryKey: queryKeys.currentUser })
}

/**
 * Invalidate queries after blocking a user
 * - Refreshes discover profiles to remove blocked user
 * - Refreshes blocked users list
 * - Uses 'profiles' for backward compatibility
 */
export function invalidateAfterBlock(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.discoverProfiles })
  queryClient.invalidateQueries({ queryKey: ['profiles'] })
  queryClient.invalidateQueries({ queryKey: queryKeys.blockedUsers })
}

/**
 * Invalidate queries after unblocking a user
 * - Refreshes discover profiles to potentially show unblocked user
 * - Refreshes blocked users list
 * - Uses 'profiles' for backward compatibility
 */
export function invalidateAfterUnblock(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.discoverProfiles })
  queryClient.invalidateQueries({ queryKey: ['profiles'] })
  queryClient.invalidateQueries({ queryKey: queryKeys.blockedUsers })
}

/**
 * Invalidate queries after marking messages as read
 * - Refreshes matches list to update unread count
 */
export function invalidateAfterMarkAsRead(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.matches })
}

/**
 * Invalidate queries after availability slot changes
 * - Refreshes availability slots list
 */
export function invalidateAfterAvailabilitySlotChange(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.availabilitySlots })
}

/**
 * Invalidate queries after settings update
 * - Refreshes user settings
 */
export function invalidateAfterSettingsUpdate(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.settings })
}
