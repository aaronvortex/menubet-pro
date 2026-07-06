import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PageTransitionProps {
  children: React.ReactNode
  transitionKey: string
  type?: 'fade' | 'slideUp' | 'slideLeft'
}

const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.22, ease: 'easeInOut' },
  },
  slideUp: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
    transition: { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] },
  },
  slideLeft: {
    initial: { opacity: 0, x: 32 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -32 },
    transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
  },
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  transitionKey,
  type = 'fade',
}) => {
  const v = variants[type]
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        initial={v.initial}
        animate={v.animate}
        exit={v.exit}
        transition={v.transition}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// ── Standalone wrapper for page-level transitions ──────────────────────────

interface PageWrapperProps {
  children: React.ReactNode
  pageKey: string
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  pageKey,
}) => (
  <motion.div
    key={pageKey}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
    className="w-full"
  >
    {children}
  </motion.div>
)
