import { useState, useEffect, useRef } from 'react'

const visitedKeys = new Set<string>()
let isVeryFirstLoad = true

export const useShimmerTimer = (key: string) => {
  const alreadyVisited = visitedKeys.has(key)
  const [ready, setReady] = useState(alreadyVisited)
  const keyRef = useRef(key)

  useEffect(() => {
    if (alreadyVisited) return
    const delayMs = isVeryFirstLoad ? 10000 : 4000
    isVeryFirstLoad = false
    const t = setTimeout(() => {
      visitedKeys.add(keyRef.current)
      setReady(true)
    }, delayMs)
    return () => clearTimeout(t)
  }, [])

  return ready
}
