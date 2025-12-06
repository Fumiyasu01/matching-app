import { USE_MOCK_DATA } from './config'

/**
 * Execute either mock or real data fetching based on config
 *
 * @param mockFn - Function that returns mock data (can be sync or async)
 * @param realFn - Function that returns real data from API/database (must be async)
 * @returns Promise of the data
 *
 * @example
 * ```typescript
 * queryFn: async () => withDataSource(
 *   () => mockStore.getProfiles(),
 *   async () => {
 *     const { data } = await supabase.from('profiles').select('*')
 *     return data || []
 *   }
 * )
 * ```
 */
export async function withDataSource<T>(
  mockFn: () => T | Promise<T>,
  realFn: () => Promise<T>
): Promise<T> {
  if (USE_MOCK_DATA) {
    return mockFn()
  }
  return realFn()
}

/**
 * Synchronous version for simple data access
 *
 * @param mockFn - Function that returns mock data
 * @param realFn - Function that returns real data
 * @returns The data
 *
 * @example
 * ```typescript
 * const isTyping = withDataSourceSync(
 *   () => mockStore.isTyping(matchId),
 *   () => false
 * )
 * ```
 */
export function withDataSourceSync<T>(
  mockFn: () => T,
  realFn: () => T
): T {
  if (USE_MOCK_DATA) {
    return mockFn()
  }
  return realFn()
}
