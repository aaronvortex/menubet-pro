import { useState, useCallback } from 'react'

export const usePageTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false)

  const startTransition = useCallback(() => {
    setIsTransitioning(true)
  }, [])

  const completeTransition = useCallback(() => {
    setIsTransitioning(false)
  }, [])

  return {
    isTransitioning,
    startTransition,
    completeTransition,
  }
}
