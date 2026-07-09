import { useEffect } from 'react'

/**
 * Scrolls the element with id `${prefix}-${targetId}` into view and applies a
 * temporary highlight ring, whenever targetId changes to a non-null value.
 * Used by the universal search on Home to jump straight to a matched item.
 */
export const useScrollHighlight = (prefix: string, targetId: string | null) => {
  useEffect(() => {
    if (!targetId) return
    const el = document.getElementById(`${prefix}-${targetId}`)
    if (!el) return

    const t1 = setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add(
        'ring-4', 'ring-blue-500', 'ring-offset-2',
        'dark:ring-offset-gray-900', 'rounded-2xl', 'transition-shadow'
      )
    }, 350)

    const t2 = setTimeout(() => {
      el.classList.remove('ring-4', 'ring-blue-500', 'ring-offset-2', 'dark:ring-offset-gray-900')
    }, 2500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [targetId])
}