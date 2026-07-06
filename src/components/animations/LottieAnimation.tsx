import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── LottieAnimation ────────────────────────────────────────────────────────
// We use a Framer Motion-based animation since Lottie requires external
// JSON asset files. This gives an equivalent smooth micro-animation.

interface LottieAnimationProps {
  isVisible: boolean
  type?: 'addToCart' | 'success' | 'star'
  size?: number
  onComplete?: () => void
}

export const LottieAnimation: React.FC<LottieAnimationProps> = ({
  isVisible,
  type = 'addToCart',
  size = 48,
  onComplete,
}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isVisible && onComplete) {
      timerRef.current = setTimeout(onComplete, 800)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isVisible])

  const icons = {
    addToCart: '🛒',
    success: '✅',
    star: '⭐',
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 0 }}
          animate={{
            scale: [0, 1.4, 1.1, 1],
            opacity: [0, 1, 1, 0],
            y: [0, -12, -20, -32],
          }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            duration: 0.75,
            times: [0, 0.3, 0.6, 1],
            ease: 'easeOut',
          }}
          style={{ width: size, height: size }}
          className="flex items-center justify-center pointer-events-none select-none"
        >
          <span style={{ fontSize: size * 0.6 }}>{icons[type]}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── AddToCartBurst — particle burst on add to cart ─────────────────────────

interface AddToCartBurstProps {
  isVisible: boolean
  x?: number
  y?: number
}

export const AddToCartBurst: React.FC<AddToCartBurstProps> = ({
  isVisible,
  x = 0,
  y = 0,
}) => {
  const particles = ['🌟', '✨', '💫', '⭐']

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          className="fixed pointer-events-none z-[999]"
          style={{ left: x, top: y }}
        >
          {particles.map((particle, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: 0,
                scale: 1,
                x: (Math.cos((i * Math.PI * 2) / particles.length) * 40),
                y: (Math.sin((i * Math.PI * 2) / particles.length) * 40) - 20,
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.04,
                ease: 'easeOut',
              }}
              className="absolute text-lg select-none"
            >
              {particle}
            </motion.span>
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}
