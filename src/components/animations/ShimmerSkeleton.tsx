import React from 'react'
import { motion } from 'framer-motion'

const SHIMMER_DURATION = 5.4
const SHIMMER_DELAY_CYCLE = 9.6

// ── Reusable shimmer line ────────────────────────────────────────────────

const ShimmerLine: React.FC<{
  width?: string
  height?: string
  rounded?: string
  delay?: number
}> = ({ width = 'w-full', height = 'h-4', rounded = 'rounded-lg', delay = 0 }) => (
  <div className={`${width} ${height} ${rounded} bg-gray-200 dark:bg-gray-700 overflow-hidden relative`}>
    <motion.div
      animate={{ x: ['-100%', '200%'] }}
      transition={{
        duration: SHIMMER_DURATION,
        repeat: Infinity,
        repeatDelay: SHIMMER_DELAY_CYCLE,
        ease: [0.4, 0, 0.6, 1],
        delay,
      }}
      className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
    />
  </div>
)

// ── Menu Card Skeleton ────────────────────────────────────────────────────

export const ShimmerSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm"
        >
          {/* Image */}
          <div className="relative w-full aspect-[4/3] bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{
                duration: SHIMMER_DURATION,
                repeat: Infinity,
                repeatDelay: SHIMMER_DELAY_CYCLE,
                ease: [0.4, 0, 0.6, 1],
                delay: index * 0.1,
              }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
            />
          </div>
          {/* Content */}
          <div className="p-3 space-y-2">
            <ShimmerLine width="w-14" height="h-4" rounded="rounded-full" delay={0.1} />
            <ShimmerLine width="w-4/5" height="h-4" delay={0.15} />
            <ShimmerLine width="w-full" height="h-3" delay={0.2} />
            <ShimmerLine width="w-3/4" height="h-3" delay={0.25} />
            <div className="flex items-center justify-between pt-1">
              <ShimmerLine width="w-16" height="h-5" delay={0.3} />
              <ShimmerLine width="w-8" height="h-8" rounded="rounded-full" delay={0.35} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ── Category Nav Skeleton ─────────────────────────────────────────────────

export const CategoryNavSkeleton: React.FC = () => {
  return (
    <div className="bg-[#1a237e] dark:bg-[#0d1257] w-full">
      <div className="flex items-stretch">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center justify-center px-4 py-4 gap-2"
          >
            {/* Icon shimmer */}
            <div className="w-8 h-8 rounded-xl bg-white/10 overflow-hidden relative">
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{
                  duration: SHIMMER_DURATION,
                  repeat: Infinity,
                  repeatDelay: SHIMMER_DELAY_CYCLE,
                  ease: [0.4, 0, 0.6, 1],
                  delay: i * 0.1,
                }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
            </div>
            {/* Label shimmer */}
            <div className="w-12 h-2.5 rounded-full bg-white/10 overflow-hidden relative">
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{
                  duration: SHIMMER_DURATION,
                  repeat: Infinity,
                  repeatDelay: SHIMMER_DELAY_CYCLE,
                  ease: [0.4, 0, 0.6, 1],
                  delay: i * 0.1 + 0.1,
                }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Sub-Category Nav Skeleton ────────────────────────────────────────────

export const SubCategoryNavSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 flex items-center justify-center py-3 px-3"
          >
            <div className="w-14 h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{
                  duration: SHIMMER_DURATION,
                  repeat: Infinity,
                  repeatDelay: SHIMMER_DELAY_CYCLE,
                  ease: [0.4, 0, 0.6, 1],
                  delay: i * 0.08,
                }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Admin List Row Skeleton ───────────────────────────────────────────────

export const AdminListSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-3 flex items-center gap-3 shadow-sm"
        >
          {/* Thumb */}
          <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 flex-shrink-0 overflow-hidden relative">
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{
                duration: SHIMMER_DURATION,
                repeat: Infinity,
                repeatDelay: SHIMMER_DELAY_CYCLE,
                ease: [0.4, 0, 0.6, 1],
                delay: i * 0.07,
              }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
            />
          </div>
          {/* Lines */}
          <div className="flex-1 space-y-2">
            <ShimmerLine width="w-2/3" height="h-3.5" delay={i * 0.07 + 0.1} />
            <ShimmerLine width="w-1/2" height="h-2.5" delay={i * 0.07 + 0.15} />
          </div>
          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{
                  duration: SHIMMER_DURATION,
                  repeat: Infinity,
                  repeatDelay: SHIMMER_DELAY_CYCLE,
                  ease: [0.4, 0, 0.6, 1],
                  delay: 0.2,
                }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
              />
            </div>
            <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{
                  duration: SHIMMER_DURATION,
                  repeat: Infinity,
                  repeatDelay: SHIMMER_DELAY_CYCLE,
                  ease: [0.4, 0, 0.6, 1],
                  delay: 0.25,
                }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ── Analytics Card Skeleton ──────────────────────────────────────────────

export const AnalyticsCardSkeleton: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{
                  duration: SHIMMER_DURATION,
                  repeat: Infinity,
                  repeatDelay: SHIMMER_DELAY_CYCLE,
                  ease: [0.4, 0, 0.6, 1],
                  delay: i * 0.1,
                }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
              />
            </div>
            <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative">
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{
                  duration: SHIMMER_DURATION,
                  repeat: Infinity,
                  repeatDelay: SHIMMER_DELAY_CYCLE,
                  ease: [0.4, 0, 0.6, 1],
                  delay: i * 0.1 + 0.1,
                }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
              />
            </div>
            <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative">
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{
                  duration: SHIMMER_DURATION,
                  repeat: Infinity,
                  repeatDelay: SHIMMER_DELAY_CYCLE,
                  ease: [0.4, 0, 0.6, 1],
                  delay: i * 0.1 + 0.15,
                }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
              />
            </div>
          </div>
        ))}
      </div>
      {/* Chart skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative">
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{
              duration: SHIMMER_DURATION,
              repeat: Infinity,
              repeatDelay: SHIMMER_DELAY_CYCLE,
              ease: [0.4, 0, 0.6, 1],
              delay: 0.2,
            }}
            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
          />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative">
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{
                  duration: SHIMMER_DURATION,
                  repeat: Infinity,
                  repeatDelay: SHIMMER_DELAY_CYCLE,
                  ease: [0.4, 0, 0.6, 1],
                  delay: i * 0.06,
                }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
              />
            </div>
            <div className={`h-5 ${['w-3/4', 'w-1/2', 'w-2/3', 'w-1/3', 'w-1/2'][i]} rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden relative`}>
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{
                  duration: SHIMMER_DURATION,
                  repeat: Infinity,
                  repeatDelay: SHIMMER_DELAY_CYCLE,
                  ease: [0.4, 0, 0.6, 1],
                  delay: i * 0.06 + 0.1,
                }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
              />
            </div>
            <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative">
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{
                  duration: SHIMMER_DURATION,
                  repeat: Infinity,
                  repeatDelay: SHIMMER_DELAY_CYCLE,
                  ease: [0.4, 0, 0.6, 1],
                  delay: i * 0.06 + 0.15,
                }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
