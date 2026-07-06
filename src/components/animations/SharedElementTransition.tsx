import React, { useState } from 'react'
import { motion } from 'framer-motion'

// ── SharedImage uses Framer Motion layoutId for the shared element effect ──
// The same layoutId on the card image and the detail image creates
// a smooth morph transition between them.

interface SharedImageProps {
  src: string
  alt: string
  layoutId: string
  className?: string
  onError?: () => void
}

export const SharedImage: React.FC<SharedImageProps> = ({
  src,
  alt,
  layoutId,
  className = '',
  onError,
}) => {
  return (
    <motion.img
      layoutId={layoutId}
      src={src}
      alt={alt}
      className={className}
      onError={onError}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }}
    />
  )
}

// ── SharedContainer — wraps any element with a shared layoutId ─────────────

interface SharedContainerProps {
  children: React.ReactNode
  layoutId: string
  className?: string
}

export const SharedContainer: React.FC<SharedContainerProps> = ({
  children,
  layoutId,
  className = '',
}) => {
  return (
    <motion.div
      layoutId={layoutId}
      className={className}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }}
    >
      {children}
    </motion.div>
  )
}

// ── useSharedTransition hook ───────────────────────────────────────────────
// Generates a stable layoutId from an item id

export const useSharedTransition = (itemId: string) => {
  const imageLayoutId = `item-image-${itemId}`
  const cardLayoutId = `item-card-${itemId}`
  return { imageLayoutId, cardLayoutId }
}
