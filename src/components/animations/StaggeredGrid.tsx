import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface StaggeredGridProps {
  children: React.ReactNode[]
  gridKey: string
  columns?: 2 | 3 | 4
  gap?: number
}

export const StaggeredGrid: React.FC<StaggeredGridProps> = ({
  children,
  gridKey,
  columns = 2,
  gap = 3,
}) => {
  const colClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[columns]

  const gapClass = {
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
  }[gap] || 'gap-3'

  return (
    <motion.div
      key={gridKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={`grid ${colClass} ${gapClass}`}
    >
      <AnimatePresence mode="popLayout">
        {React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            layout
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            transition={{
              delay: index * 0.07,
              duration: 0.3,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {child}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
