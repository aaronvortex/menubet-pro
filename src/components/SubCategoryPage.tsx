import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Tag } from 'lucide-react'
import { MenuItem, CartItem, MenuCategory } from '../types/menu'
import { MenuCard } from './MenuCard'
import { StaggeredGrid } from './animations/StaggeredGrid'
import { ShimmerSkeleton } from './animations/ShimmerSkeleton'
import { useLanguage } from '../contexts/LanguageContext'
import { useScrollHighlight } from '../hooks/useScrollHighlight'

interface SubCategoryPageProps {
  category: MenuCategory | null
  subCategory: string | null
  items: MenuItem[]
  isLoading: boolean
  onBack: () => void
  onItemClick: (item: MenuItem) => void
  onAddToCart: (item: CartItem) => void
  onToggleFavorite: (itemId: string) => void
  highlightItemId?: string | null
}

export const SubCategoryPage: React.FC<SubCategoryPageProps> = ({
  category,
  subCategory,
  items,
  isLoading,
  onBack,
  onItemClick,
  onAddToCart,
  onToggleFavorite,
  highlightItemId = null,
}) => {
  const { t } = useLanguage()

  // Scrolls to + briefly highlights the item matched by Home's universal search
  useScrollHighlight('menu-item', highlightItemId)

  const displayItems = subCategory
    ? items.filter(i => i.subCategory === subCategory)
    : items

  const gridKey = `sub-${category?.id}-${subCategory || 'all'}`

  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -32 }}
      transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      {/* ── Header bar ── */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </motion.button>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          {category && (
            <span className="text-xl">{category.icon}</span>
          )}
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white leading-tight truncate">
              {subCategory
                ? subCategory.charAt(0).toUpperCase() + subCategory.slice(1)
                : category?.name || t.menu}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
              {displayItems.length} {displayItems.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>

        {subCategory && (
          <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full flex-shrink-0">
            <Tag className="w-3 h-3 text-blue-500" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 capitalize">
              {subCategory}
            </span>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="pb-24">
        {isLoading ? (
          <ShimmerSkeleton count={4} />
        ) : displayItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 px-4"
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
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="mt-5 flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.back}
            </motion.button>
          </motion.div>
        ) : (
          <div className="px-4 pt-4">
            <StaggeredGrid gridKey={gridKey} columns={2} gap={3}>
              {displayItems.map(item => (
                <div key={item.id} id={`menu-item-${item.id}`}>
                  <MenuCard
                    item={item}
                    onAddToCart={onAddToCart}
                    onItemClick={onItemClick}
                    onToggleFavorite={onToggleFavorite}
                  />
                </div>
              ))}
            </StaggeredGrid>
          </div>
        )}
      </div>
    </motion.div>
  )
}