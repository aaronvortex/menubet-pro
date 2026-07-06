import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, AlertCircle, Tag } from 'lucide-react'
import { ServiceItem } from '../types/service'
import { MenuCategory } from '../types/menu'
import { useLanguage } from '../contexts/LanguageContext'

interface ServiceDetailModalProps {
  item: ServiceItem | null
  isOpen: boolean
  onClose: () => void
  actionLabel: string
  onActionClick: () => void
  fields: MenuCategory[]
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  actionLabel,
  onActionClick,
  fields,
}) => {
  const [imageError, setImageError] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    if (isOpen) setImageError(false)
  }, [isOpen, item?.id])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!item) return null

  const category = fields.find(c => c.id === item.categoryId)

  return (
    <AnimatePresence>
      {isOpen && item && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
          />

          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.9 }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-white dark:bg-gray-900 rounded-t-3xl overflow-hidden max-h-[92vh] flex flex-col shadow-2xl"
          >
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>

            <div className="overflow-y-auto flex-1">

              <div className="relative w-full aspect-[16/9] bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                {!imageError && item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-7xl">{item.icon}</span>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none" />

                {!item.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                    <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-full">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-bold text-red-500">{t.unavailable}</span>
                    </div>
                  </div>
                )}

                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center z-10"
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>
              </div>

              <div className="px-5 pt-2 pb-6">

                <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight mb-2">
                  {item.name}
                </h2>

                {item.available && (
                  <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    ✓ {t.available}
                  </span>
                )}

                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-5">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {item.estimatedTime && (
                    <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-full">
                      <Clock className="w-3.5 h-3.5 text-orange-500" />
                      <span className="text-xs font-semibold text-orange-700 dark:text-orange-400">
                        {item.estimatedTime}
                      </span>
                    </div>
                  )}
                  {category && (
                    <div className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-full">
                      <Tag className="w-3.5 h-3.5 text-purple-500" />
                      <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">
                        {category.icon} {category.name}
                      </span>
                    </div>
                  )}
                </div>

                {item.notes && (
                  <div className="mb-5">
                    <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-2">
                      {t.goodToKnow}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
                      {item.notes}
                    </p>
                  </div>
                )}

                <div className="h-px bg-gray-100 dark:bg-gray-800 mb-5" />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{t.priceLabel}</span>
                  {item.price !== undefined ? (
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      {item.price.toLocaleString()}{' '}
                      <span className="text-base font-semibold text-gray-500 dark:text-gray-400">{t.birr}</span>
                    </span>
                  ) : (
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {t.complimentary}
                    </span>
                  )}
                </div>

              </div>
            </div>

            <div className="flex-shrink-0 px-5 py-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              <motion.button
                onClick={onActionClick}
                disabled={!item.available}
                whileHover={item.available ? { scale: 1.01 } : {}}
                whileTap={item.available ? { scale: 0.97 } : {}}
                className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 ${
                  !item.available
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30'
                }`}
              >
                {item.available ? actionLabel : t.unavailable}
              </motion.button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}