import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MenuCategory } from '../types/menu'
import { useLanguage } from '../contexts/LanguageContext'
import { translateCategory } from '../data/categoryTranslations'
import { ServiceCategoryIcon } from './ServiceCategoryIcon'

interface CategoryNavProps {
  categories: MenuCategory[]
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  const { language } = useLanguage()
  const scrollRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current
      const active = activeRef.current
      const containerRect = container.getBoundingClientRect()
      const activeRect = active.getBoundingClientRect()
      const offset =
        activeRect.left -
        containerRect.left -
        containerRect.width / 2 +
        activeRect.width / 2
      container.scrollBy({ left: offset, behavior: 'smooth' })
    }
  }, [activeCategory])

  if (categories.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-[#1a237e] dark:bg-[#0d1257] w-full"
    >
      <div
        ref={scrollRef}
        className="flex items-stretch overflow-x-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category, index) => {
          const isActive = category.id === activeCategory
          const displayName = translateCategory(category.id, category.name, language)

          return (
            <motion.button
              key={category.id}
              ref={isActive ? activeRef : null}
              onClick={() => onCategoryChange(category.id)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.25 }}
              whileTap={{ scale: 0.94 }}
              className="relative flex flex-col items-center justify-center flex-shrink-0 px-5 py-4 min-w-[80px] transition-all duration-200"
              style={{
                flex: categories.length <= 5 ? '1 1 0%' : undefined,
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryCard"
                  className="absolute inset-2 rounded-2xl bg-[#3949ab] dark:bg-[#303f9f]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              <motion.div
                className="relative z-10 mb-1.5"
                animate={isActive ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ServiceCategoryIcon categoryId={category.id} fallbackEmoji={category.icon} size="sm" />
              </motion.div>

              <span
                className={`relative z-10 text-xs leading-tight text-center font-semibold whitespace-nowrap transition-colors duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-blue-200 dark:text-blue-300'
                }`}
              >
                {displayName}
              </span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
