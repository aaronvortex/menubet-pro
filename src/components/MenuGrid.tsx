import React from 'react'
import { motion } from 'framer-motion'
import { MenuItem, CartItem } from '../types/menu'
import { MenuCard } from './MenuCard'
import { StaggeredGrid } from './animations/StaggeredGrid'
import { ShimmerSkeleton } from './animations/ShimmerSkeleton'
import { useLanguage } from '../contexts/LanguageContext'
import { useShimmerTimer } from '../hooks/useShimmerTimer'

interface MenuGridProps {
  items: MenuItem[]
  isLoading: boolean
  activeCategory: string
  activeSubCategory: string | null
  onAddToCart: (item: CartItem) => void
  onItemClick: (item: MenuItem) => void
  onToggleFavorite: (itemId: string) => void
}

export const MenuGrid: React.FC<MenuGridProps> = ({
  items,
  isLoading,
  activeCategory,
  activeSubCategory,
  onAddToCart,
  onItemClick,
  onToggleFavorite,
}) => {
  const { t } = useLanguage()
  const shimmerKey = activeSubCategory ? activeCategory + '-' + activeSubCategory : activeCategory
  const shimmerReady = useShimmerTimer(shimmerKey)

  // Show shimmer while timer hasn't elapsed OR data is still loading
  if (!shimmerReady || isLoading) {
    return <ShimmerSkeleton count={12} />
  }

  // Empty state
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center py-20 px-4"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
          className="text-6xl mb-5"
        >
          🍽️
        </motion.span>
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center font-medium">
          {t.noItems}
        </p>
      </motion.div>
    )
  }

  // Grid
  const gridKey = `${activeCategory}-${activeSubCategory || 'all'}`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="px-4 pt-4 pb-28"
    >
      <StaggeredGrid gridKey={gridKey} columns={2} gap={3}>
        {items.map(item => (
          <MenuCard
            key={item.id}
            item={item}
            onAddToCart={onAddToCart}
            onItemClick={onItemClick}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </StaggeredGrid>
    </motion.div>
  )
}
