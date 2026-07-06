import React, { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MenuItem } from '../types/menu'
import { useLanguage } from '../contexts/LanguageContext'
import { translateSubCategory } from '../data/categoryTranslations'

interface SubCategoryNavProps {
  activeCategory: string
  activeSubCategory: string | null
  items: MenuItem[]
  onSubCategoryChange: (subCategory: string | null) => void
}

export const SubCategoryNav: React.FC<SubCategoryNavProps> = ({
  activeCategory,
  activeSubCategory,
  items,
  onSubCategoryChange,
}) => {
  const { t, language } = useLanguage()
  const scrollRef = useRef<HTMLDivElement>(null)

  const subCategories = Array.from(
    new Set(
      items
        .filter(item => item.category === activeCategory && item.subCategory)
        .map(item => item.subCategory as string)
    )
  )

  if (subCategories.length === 0) return null

  const allItems = [
    { id: null, label: t.allItems },
    ...subCategories.map(s => ({
      id: s,
      label: translateSubCategory(s, language),
    })),
  ]

  return (
    <AnimatePresence>
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
        className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div
            ref={scrollRef}
            className="flex items-center overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {allItems.map((item, index) => {
              const isActive = item.id === activeSubCategory

              return (
                <motion.button
                  key={item.id ?? 'all'}
                  onClick={() => onSubCategoryChange(item.id)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.04 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative flex flex-col items-center justify-center flex-shrink-0 py-3 px-4 transition-all duration-200"
                  style={{
                    flex: allItems.length <= 5 ? '1 1 0%' : undefined,
                    minWidth: allItems.length <= 5 ? 0 : 80,
                  }}
                >
                  <span
                    className={`text-sm font-semibold whitespace-nowrap leading-tight transition-colors duration-200 ${
                      isActive
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {item.label}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="activeSubCategoryLine"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-gray-900 dark:bg-white rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
