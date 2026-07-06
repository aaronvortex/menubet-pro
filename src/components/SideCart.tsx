import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, X, ChevronRight } from 'lucide-react'
import { CartItem } from '../types/menu'
import { useLanguage } from '../contexts/LanguageContext'

interface SideCartProps {
  isVisible: boolean
  lastAddedItem: CartItem | null
  cartItems: CartItem[]
  onClose: () => void
  onOpenCart: () => void
}

export const SideCart: React.FC<SideCartProps> = ({
  isVisible,
  lastAddedItem,
  cartItems,
  onClose,
  onOpenCart,
}) => {
  const { t } = useLanguage()
  const [progress, setProgress] = useState(100)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cartCount = cartItems.reduce((sum, i) => sum + i.cartQuantity, 0)
  const cartTotal = cartItems.reduce(
    (sum, i) => sum + i.price * i.cartQuantity,
    0
  )

  // Auto-dismiss countdown with progress bar
  useEffect(() => {
    if (isVisible) {
      setProgress(100)

      // Clear any existing timers
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      // Progress bar drains over 3 seconds
      const totalMs = 3000
      const stepMs = 50
      const steps = totalMs / stepMs
      const decrement = 100 / steps

      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          const next = prev - decrement
          if (next <= 0) {
            if (intervalRef.current) clearInterval(intervalRef.current)
            return 0
          }
          return next
        })
      }, stepMs)

      // Auto-close after 3 seconds
      timeoutRef.current = setTimeout(() => {
        onClose()
      }, totalMs)
    } else {
      // Clean up when hidden
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setProgress(100)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isVisible, lastAddedItem?.id])

  const handleOpenCart = () => {
    onClose()
    onOpenCart()
  }

  const [imageError, setImageError] = useState(false)

  // Reset image error when item changes
  useEffect(() => {
    setImageError(false)
  }, [lastAddedItem?.id])

  return (
    <AnimatePresence>
      {isVisible && lastAddedItem && (
        <motion.div
          key="sidecart"
          initial={{ opacity: 0, x: 80, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 80, scale: 0.95 }}
          transition={{
            type: 'spring',
            stiffness: 350,
            damping: 28,
            mass: 0.8,
          }}
          className="fixed top-20 right-3 z-[90] w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
        >

          {/* ── Progress bar at top ── */}
          <div className="h-1 bg-gray-100 dark:bg-gray-700 w-full">
            <motion.div
              className="h-full bg-blue-500 origin-left"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.05, ease: 'linear' }}
            />
          </div>

          {/* ── Header row ── */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, delay: 0.05 }}
                className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
              >
                <span className="text-white text-[10px] font-bold">✓</span>
              </motion.div>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Added to cart!
              </span>
            </div>
            <motion.button
              onClick={onClose}
              whileTap={{ scale: 0.85 }}
              className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
            >
              <X className="w-3 h-3 text-gray-500 dark:text-gray-400" />
            </motion.button>
          </div>

          {/* ── Item preview ── */}
          <div className="px-4 pb-3">
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5">

              {/* Item image */}
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-600 flex-shrink-0">
                {!imageError && lastAddedItem.image ? (
                  <img
                    src={lastAddedItem.image}
                    alt={lastAddedItem.name}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xl">🍽️</span>
                  </div>
                )}
              </div>

              {/* Item info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight line-clamp-1">
                  {lastAddedItem.name}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-0.5">
                  {lastAddedItem.price.toLocaleString()} {t.birr}
                </p>
              </div>

              {/* Qty badge */}
              <motion.div
                key={lastAddedItem.cartQuantity}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0"
              >
                <span className="text-white text-xs font-bold">
                  ×{lastAddedItem.cartQuantity}
                </span>
              </motion.div>
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="mx-4 h-px bg-gray-100 dark:bg-gray-700" />

          {/* ── Cart summary row ── */}
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </p>
                <p className="text-sm font-bold text-gray-800 dark:text-white leading-tight">
                  {cartTotal.toLocaleString()} {t.birr}
                </p>
              </div>
            </div>

            {/* View Cart button */}
            <motion.button
              onClick={handleOpenCart}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shadow-sm shadow-blue-600/30"
            >
              {t.cart}
              <ChevronRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
