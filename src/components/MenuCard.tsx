import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Plus, Check, Star, AlertCircle } from 'lucide-react'
import { MenuItem, CartItem } from '../types/menu'
import { useLanguage } from '../contexts/LanguageContext'
import { recordFavorite } from '../services/dataService'

interface MenuCardProps {
  item: MenuItem
  onAddToCart: (item: CartItem) => void
  onItemClick: (item: MenuItem) => void
  onToggleFavorite: (itemId: string) => void
}

export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  onAddToCart,
  onItemClick,
  onToggleFavorite,
}) => {
  const { t } = useLanguage()
  const [imageError, setImageError] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!item.available) return
    const cartItem: CartItem = { ...item, cartQuantity: 1 }
    onAddToCart(cartItem)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1200)
  }

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    // Record to Supabase only when ADDING favorite (heart off → on)
    if (!item.isFavorite) {
      await recordFavorite({
        item_id: item.id,
        item_name: item.name,
        item_image: item.image || '',
        item_price: item.price,
        category_id: item.category || '',
      })
    }
    onToggleFavorite(item.id)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
      onClick={() => onItemClick(item)}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
    >
      {/* Food image */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 dark:bg-gray-700 overflow-hidden">
        {!imageError && item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">🍽️</span>
          </div>
        )}

        {/* Unavailable overlay — pointer-events-none so buttons still work */}
        {!item.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-1.5 bg-white/90 dark:bg-gray-800/90 px-3 py-1.5 rounded-full">
              <AlertCircle className="w-3.5 h-3.5 text-red-500" />
              <span className="text-xs font-semibold text-red-500">{t.unavailable}</span>
            </div>
          </div>
        )}

        {/* Top badges */}
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
          {item.available && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm"
            >
              {t.available}
            </motion.span>
          )}
          {item.quantity !== undefined && item.quantity > 0 && (
            <span className="bg-black/50 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full ml-auto">
              +{item.quantity}
            </span>
          )}
        </div>

        {/* Favorite button */}
        <motion.button
          onClick={handleFavorite}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.85 }}
          className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 dark:bg-gray-800/90 flex items-center justify-center shadow-sm z-10"
          aria-label="Toggle favorite"
        >
          <motion.div
            animate={item.isFavorite ? { scale: [1, 1.4, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors duration-200 ${
                item.isFavorite
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            />
          </motion.div>
        </motion.button>
      </div>

      {/* Card content */}
      <div className="p-3">
        {item.rating !== undefined && item.rating > 0 && (
          <div className="flex items-center gap-1 mb-1.5">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">
              {item.rating.toFixed(1)}
            </span>
          </div>
        )}

        <h3 className="text-sm font-bold text-gray-800 dark:text-white leading-tight mb-1 line-clamp-1">
          {item.name}
        </h3>

        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-3">
          {item.description}
        </p>

        {/* Price + Add button */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {item.price.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              {t.birr}
            </span>
          </div>

          <motion.button
            onClick={handleAddToCart}
            whileHover={item.available ? { scale: 1.05 } : {}}
            whileTap={item.available ? { scale: 0.9 } : {}}
            disabled={!item.available}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-colors duration-200 ${
              !item.available
                ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
                : justAdded
                ? 'bg-green-500'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            }`}
            aria-label={t.addToCart}
          >
            <AnimatePresence mode="wait">
              {justAdded ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="plus"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <Plus
                    className={`w-4 h-4 ${
                      item.available ? 'text-white' : 'text-gray-400 dark:text-gray-500'
                    }`}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
