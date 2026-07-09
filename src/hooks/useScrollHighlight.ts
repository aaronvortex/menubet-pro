import { useEffect } from 'react'

/**
 * Scrolls the element with id `${prefix}-${targetId}` into view and applies a
 * temporary highlight ring, whenever targetId changes to a non-null value.
 *
 * Used by the Home page's universal search to jump to a matched item. The
 * target card can be hidden behind a shimmer loading skeleton for several
 * seconds after navigation, so this POLLS for the element to appear instead
 * of trying once too early and silently failing.
 */
export const useScrollHighlight = (prefix: string, targetId: string | null) => {
  useEffect(() => {
    if (!targetId) return

    const elementId = `${prefix}-${targetId}`
    const pollIntervalMs = 150
    const maxWaitMs = 12000 // covers the worst-case 10s first-load shimmer delay
    let elapsed = 0
    let highlightTimeout: ReturnType<typeof setTimeout> | null = null

    const poll = setInterval(() => {
      const el = document.getElementById(elementId)

      if (el) {
        clearInterval(poll)
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.add(
          'ring-4', 'ring-blue-500', 'ring-offset-2',
          'dark:ring-offset-gray-900', 'rounded-2xl', 'transition-shadow'
        )
        highlightTimeout = setTimeout(() => {
          el.classList.remove('ring-4', 'ring-blue-500', 'ring-offset-2', 'dark:ring-offset-gray-900')
        }, 2200)
        return
      }

      elapsed += pollIntervalMs
      if (elapsed >= maxWaitMs) {
        clearInterval(poll)
      }
    }, pollIntervalMs)

    return () => {
      clearInterval(poll)
      if (highlightTimeout) clearTimeout(highlightTimeout)
    }
  }, [targetId, prefix])
}