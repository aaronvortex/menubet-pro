import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, Clock } from 'lucide-react'
import { ServiceItem } from '../types/service'
import { serviceCategoryStyles } from '../data/serviceData'
import { useLanguage } from '../contexts/LanguageContext'

interface ServiceCardProps {
  item: ServiceItem
  actionLabel: string
  onCardClick: (item: ServiceItem) => void
  onActionClick: (item: ServiceItem) => void
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ item, actionLabel, onCardClick, onActionClick }) => {
  const [imageError, setImageError] = useState(false)
  const { t } = useLanguage()
  const style = serviceCategoryStyles[item.categoryId]

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!item.available) return
    onActionClick(item)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
      onClick={() => onCardClick(item)}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
    >
      <div
        className={`relative w-full aspect-[4/3] flex items-center justify-center overflow-hidden bg-gradient-to-br ${
          style?.gradient || 'from-blue-400 to-blue-600'
        }`}
      >
        {!imageError && item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <span className="text-5xl drop-shadow-sm">{item.icon}</span>
        )}

        {!item.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-1.5 bg-white/90 dark:bg-gray-800/90 px-3 py-1.5 rounded-full">
              <AlertCircle className="w-3.5 h-3.5 text-red-500" />
              <span className="text-xs font-semibold text-red-500">{t.unavailable}</span>
            </div>
          </div>
        )}

        <div className="absolute top-2 left-2">
          {item.available && (
            <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {t.available}
            </span>
          )}
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-bold text-gray-800 dark:text-white leading-tight mb-1 line-clamp-1">
          {item.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-2">
          {item.description}
        </p>

        {item.estimatedTime && (
          <div className="flex items-center gap-1 mb-2 text-[11px] text-gray-400 dark:text-gray-500">
            <Clock className="w-3 h-3" />
            {item.estimatedTime}
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            {item.price !== undefined ? (
              <>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {item.price.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{t.birr}</span>
              </>
            ) : (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {t.complimentary}
              </span>
            )}
          </div>

          <motion.button
            onClick={handleAction}
            whileHover={item.available ? { scale: 1.05 } : {}}
            whileTap={item.available ? { scale: 0.92 } : {}}
            disabled={!item.available}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm transition-colors duration-200 ${
              !item.available
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
            }`}
          >
            {actionLabel}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}