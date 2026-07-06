import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Star,
  Flame,
  FlaskConical,
  Plus,
  Minus,
  ShoppingCart,
  Heart,
  AlertCircle,
} from 'lucide-react'
import { MenuItem, CartItem } from '../types/menu'
import { useLanguage } from '../contexts/LanguageContext'

interface ItemDetailProps {
  item: MenuItem | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (item: CartItem) => void
  onToggleFavorite: (itemId: string) => void
}

export const ItemDetail: React.FC<ItemDetailProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
  onToggleFavorite,
}) => {
  const { t } = useLanguage()
  const [quantity, setQuantity] = useState(1)
  const [imageError, setImageError] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  useEffect(() => {
    if (isOpen && item) {
      setQuantity(1)
      setImageError(false)
      setJustAdded(false)
    }
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

  const handleAddToCart = () => {
    if (!item || !item.available) return
    const cartItem: CartItem = { ...item, cartQuantity: quantity }
    onAddToCart(cartItem)
    setJustAdded(true)
    setTimeout(() => {
      setJustAdded(false)
      onClose()
    }, 900)
  }

  const increaseQty = () => setQuantity(q => q + 1)
  const decreaseQty = () => setQuantity(q => Math.max(1, q - 1))
  const totalPrice = item ? item.price * quantity : 0

  return (
    <AnimatePresence>
      {isOpen && item && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.9 }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-white dark:bg-gray-900 rounded-t-3xl overflow-hidden max-h-[92vh] flex flex-col shadow-2xl"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1">

              {/* Food image */}
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
                    <span className="text-7xl">🍽️</span>
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none" />

                {/* FIXED: Unavailable overlay — pointer-events-none so buttons behind still work */}
                {!item.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                    <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-full">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-bold text-red-500">
                        {t.unavailable}
                      </span>
                    </div>
                  </div>
                )}

                {/* Close button — always on top and clickable */}
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center z-10"
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>

                {/* Favorite button — always on top and clickable */}
                <motion.button
                  onClick={() => onToggleFavorite(item.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.85 }}
                  className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center z-10"
                >
                  <motion.div
                    animate={item.isFavorite ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        item.isFavorite
                          ? 'fill-red-500 text-red-500'
                          : 'text-white'
                      }`}
                    />
                  </motion.div>
                </motion.button>
              </div>

              {/* Item info */}
              <div className="px-5 pt-2 pb-6">

                {/* Name + rating */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex-1 leading-tight">
                    {item.name}
                  </h2>
                  {item.rating !== undefined && item.rating > 0 && (
                    <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/30 px-2.5 py-1 rounded-full flex-shrink-0">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">
                        {item.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Available badge */}
                {item.available && (
                  <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    ✓ {t.available}
                  </span>
                )}

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-5">
                  {item.description}
                </p>

                {/* Info pills */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {item.calories > 0 && (
                    <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-full">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      <span className="text-xs font-semibold text-orange-700 dark:text-orange-400">
                        {item.calories} {t.calories}
                      </span>
                    </div>
                  )}
                  {item.volume && (
                    <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full">
                      <FlaskConical className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                        {item.volume}
                      </span>
                    </div>
                  )}
                  {item.subCategory && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-full">
                      <span className="text-xs font-semibold text-purple-700 dark:text-purple-400 capitalize">
                        {item.subCategory}
                      </span>
                    </div>
                  )}
                </div>

                {/* Ingredients */}
                {item.ingredients && item.ingredients.length > 0 && (
                  <div className="mb-5">
                    <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-2.5">
                      {t.ingredients}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {item.ingredients.map((ingredient, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.04 }}
                          className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700"
                        >
                          {ingredient}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Divider */}
                <div className="h-px bg-gray-100 dark:bg-gray-800 mb-5" />

                {/* Quantity stepper */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">
                    {t.quantity}
                  </span>
                  <div className="flex items-center gap-4">
                    <motion.button
                      onClick={decreaseQty}
                      whileTap={{ scale: 0.85 }}
                      disabled={quantity <= 1}
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                        quantity <= 1
                          ? 'border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                          : 'border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                      }`}
                    >
                      <Minus className="w-4 h-4" />
                    </motion.button>
                    <motion.span
                      key={quantity}
                      initial={{ scale: 1.3, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className="text-xl font-bold text-gray-900 dark:text-white w-8 text-center"
                    >
                      {quantity}
                    </motion.span>
                    <motion.button
                      onClick={increaseQty}
                      whileTap={{ scale: 0.85 }}
                      className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

              </div>
            </div>

            {/* Sticky bottom bar */}
            <div className="flex-shrink-0 px-5 py-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">{t.total}</span>
                <motion.span
                  key={totalPrice}
                  initial={{ scale: 1.1, color: '#2563eb' }}
                  animate={{ scale: 1, color: 'inherit' }}
                  transition={{ duration: 0.25 }}
                  className="text-xl font-bold text-gray-900 dark:text-white"
                >
                  {totalPrice.toLocaleString()}{' '}
                  <span className="text-base font-semibold text-gray-500 dark:text-gray-400">
                    {t.birr}
                  </span>
                </motion.span>
              </div>

              <motion.button
                onClick={handleAddToCart}
                disabled={!item.available || justAdded}
                whileHover={item.available && !justAdded ? { scale: 1.01 } : {}}
                whileTap={item.available && !justAdded ? { scale: 0.97 } : {}}
                className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 ${
                  !item.available
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : justAdded
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30'
                }`}
              >
                <AnimatePresence mode="wait">
                  {justAdded ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-center gap-2"
                    >
                      ✓ Added to Cart!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {item.available ? t.addToCart : t.unavailable}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
