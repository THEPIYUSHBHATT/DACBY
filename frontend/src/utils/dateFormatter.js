/**
 * Formats an absolute timestamp or absolute date string into a relative time.
 * If the string format cannot be parsed (e.g. older static "3 hours ago" entries),
 * it returns the original string as-is.
 * 
 * @param {string} dateStr - Date string, ISO string, or space-separated Hacker News timestamp (e.g. "YYYY-MM-DDTHH:MM:SS UNIX_TIMESTAMP")
 * @returns {string} Relative time string (e.g. "10m ago", "3h ago") or the fallback original string.
 */
export const formatRelativeTime = (dateStr) => {
  if (!dateStr) return ''

  let date
  const parts = dateStr.trim().split(' ')
  if (parts.length === 2 && !isNaN(parts[1])) {
    // parts[1] is a UNIX timestamp in seconds
    date = new Date(parseInt(parts[1], 10) * 1000)
  } else {
    date = new Date(dateStr)
  }

  if (isNaN(date.getTime())) {
    return dateStr
  }

  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}
