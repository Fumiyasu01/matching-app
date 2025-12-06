/**
 * Sanitize user input to prevent various attacks
 */
export function sanitizeUserInput(input: string): string {
  return input
    .trim()
    // Remove null bytes
    .replace(/\x00/g, '')
    // Remove unicode direction override characters (prevent text direction attacks)
    .replace(/[\u202A-\u202E\u2066-\u2069]/g, '')
    // Limit consecutive whitespace to prevent layout breaking
    .replace(/\s{10,}/g, ' '.repeat(10))
    // Remove zero-width characters (except zero-width space which may be intentional)
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
}

/**
 * Sanitize display name
 */
export function sanitizeDisplayName(name: string): string {
  return sanitizeUserInput(name)
    .slice(0, 50) // Max 50 characters
    .replace(/[<>]/g, '') // Remove potential HTML tags
}

/**
 * Sanitize message content
 */
export function sanitizeMessage(content: string): string {
  return sanitizeUserInput(content)
    .slice(0, 5000) // Max 5000 characters
}

/**
 * Sanitize array of strings (e.g., skills, interests)
 */
export function sanitizeStringArray(arr: string[], maxItems: number = 20, maxLength: number = 50): string[] {
  return arr
    .slice(0, maxItems)
    .map(item => sanitizeUserInput(item).slice(0, maxLength))
    .filter(item => item.length > 0)
}

/**
 * Sanitize URL - only allow http/https protocols
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const trimmed = url.trim()
    if (!trimmed) return null

    const parsed = new URL(trimmed)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null
    }
    return trimmed
  } catch {
    return null
  }
}
