/**
 * Format date string to Japanese format (e.g., "12/7(土)")
 */
export function formatDateJa(dateString: string): string {
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]
  return `${month}/${day}(${dayOfWeek})`
}

/**
 * Get date string relative to today
 */
export function getDateFromNow(daysFromNow: number): string {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date.toISOString().split('T')[0]
}
