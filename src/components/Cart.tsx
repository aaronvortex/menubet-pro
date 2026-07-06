import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  User,
  DoorOpen,
  Phone,
  MessageSquare,
  CheckCircle,
  ChevronRight,
  Tag,
} from 'lucide-react'
import { CartItem, Order } from '../types/menu'
import { useLanguage } from '../contexts/LanguageContext'
import { createOrder } from '../services/dataService'

interface CartProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onClearCart: () => void
}

export const Cart: React.FC<CartProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const { t } = useLanguage()
  const [guestName, setGuestName] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [errors, setErrors] = useState<{ guestName?: string; roomNumber?: string }>({})

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.cartQuantity, 0
  )
  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.cartQuantity, 0
  )

  // Lock body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const validate = () => {
    const newErrors: { guestName?: string; roomNumber?: string } = {}
    if (!guestName.trim()) {
      newErrors.guestName = t.nameRequired
    }
    if (!roomNumber.trim()) {
      newErrors.roomNumber = t.roomRequired
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePlaceOrder = async () => {
    if (!validate()) return
    if (cartItems.length === 0) return

    setIsPlacingOrder(true)
    try {
      const callTime = new Date().toISOString()
      const order: Omit<Order, 'id' | 'created_at'> = {
        guest_name: guestName.trim(),
        room_number: roomNumber.trim(),
        guest_phone: guestPhone.trim() || undefined,
        items: cartItems,
        total_price: subtotal,
        status: 'pending',
        special_requests: specialRequests.trim() || undefined,
        call_time: callTime,
      }
      await createOrder(order)
      setOrderSuccess(true)

      // After 2.5s — clear cart and close
      setTimeout(() => {
        onClearCart()
        setOrderSuccess(false)
        setGuestName('')
        setRoomNumber('')
        setGuestPhone('')
        setSpecialRequests('')
        setErrors({})
        onClose()
      }, 2500)
    } catch (error) {
      console.error('Failed to place order:', error)
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const handleClose = () => {
    if (!isPlacingOrder && !orderSuccess) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 z-[110] backdrop-blur-sm"
          />

          {/* ── Cart Panel ── */}
          <motion.div
            key="cart-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              mass: 0.9,
            }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm z-[111] bg-white dark:bg-gray-900 flex flex-col shadow-2xl"
          >

            {/* ── Order Success Screen ── */}
            <AnimatePresence>
              {orderSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 bg-white dark:bg-gray-900 flex flex-col items-center justify-center px-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                    className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6"
                  >
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
                  >
                    {t.orderPlaced}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-2"
                  >
                    {t.orderSuccess}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-blue-50 dark:bg-blue-900/20 rounded-xl px-4 py-3 mt-4"
                  >
                    <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">
                      🏨 Room {roomNumber} · {guestName}
                    </p>
                    <p className="text-xs text-blue-500 dark:text-blue-500 mt-1">
                      {subtotal.toLocaleString()} {t.birr}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                    {t.yourCart}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                    {totalItems} {t.itemsLabel}
                  </p>
                </div>
              </div>
              <motion.button
                onClick={handleClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </div>

            {/* ── Scrollable Body ── */}
            <div className="flex-1 overflow-y-auto">

              {/* Empty cart */}
              {cartItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full py-20 px-6 text-center"
                >
                  <span className="text-6xl mb-5">🛒</span>
                  <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t.emptyCart}
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {t.addItemsToStart}
                  </p>
                </motion.div>
              ) : (
                <div className="px-4 py-4 space-y-5">

                  {/* ── Cart Items List ── */}
                  <div className="space-y-3">
                    <AnimatePresence>
                      {cartItems.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-2xl p-3"
                        >
                          {/* Item image */}
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none'
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-2xl">🍽️</span>
                              </div>
                            )}
                          </div>

                          {/* Item info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight line-clamp-1">
                              {item.name}
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-0.5">
                              {(item.price * item.cartQuantity).toLocaleString()} {t.birr}
                            </p>
                          </div>

                          {/* Quantity controls */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => {
                                if (item.cartQuantity <= 1) {
                                  onRemoveItem(item.id)
                                } else {
                                  onUpdateQuantity(item.id, item.cartQuantity - 1)
                                }
                              }}
                              className="w-7 h-7 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center shadow-sm"
                            >
                              {item.cartQuantity <= 1 ? (
                                <Trash2 className="w-3 h-3 text-red-500" />
                              ) : (
                                <Minus className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                              )}
                            </motion.button>

                            <motion.span
                              key={item.cartQuantity}
                              initial={{ scale: 1.3 }}
                              animate={{ scale: 1 }}
                              className="text-sm font-bold text-gray-800 dark:text-white w-5 text-center"
                            >
                              {item.cartQuantity}
                            </motion.span>

                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() =>
                                onUpdateQuantity(item.id, item.cartQuantity + 1)
                              }
                              className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shadow-sm"
                            >
                              <Plus className="w-3 h-3 text-white" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* ── Divider ── */}
                  <div className="h-px bg-gray-100 dark:bg-gray-800" />

                  {/* ── Guest Details ── */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-800 dark:text-white">
                      {t.yourDetails}
                    </h3>

                    {/* Guest Name */}
                    <div>
                      <div className={`flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border ${
                        errors.guestName
                          ? 'border-red-400 dark:border-red-500'
                          : 'border-transparent'
                      }`}>
                        <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <input
                          type="text"
                          value={guestName}
                          onChange={(e) => {
                            setGuestName(e.target.value)
                            if (errors.guestName) {
                              setErrors(prev => ({ ...prev, guestName: undefined }))
                            }
                          }}
                          placeholder={t.guestNamePlaceholder}
                          className="flex-1 bg-transparent text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none"
                        />
                      </div>
                      {errors.guestName && (
                        <p className="text-xs text-red-500 mt-1 px-1">
                          {errors.guestName}
                        </p>
                      )}
                    </div>

                    {/* Room Number */}
                    <div>
                      <div className={`flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 border ${
                        errors.roomNumber
                          ? 'border-red-400 dark:border-red-500'
                          : 'border-transparent'
                      }`}>
                        <DoorOpen className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <input
                          type="text"
                          value={roomNumber}
                          onChange={(e) => {
                            setRoomNumber(e.target.value)
                            if (errors.roomNumber) {
                              setErrors(prev => ({ ...prev, roomNumber: undefined }))
                            }
                          }}
                          placeholder={t.roomNumberPlaceholder}
                          className="flex-1 bg-transparent text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none"
                        />
                      </div>
                      {errors.roomNumber && (
                        <p className="text-xs text-red-500 mt-1 px-1">
                          {errors.roomNumber}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder={t.guestPhonePlaceholder}
                        className="flex-1 bg-transparent text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none"
                      />
                    </div>

                    {/* Special Requests */}
                    <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
                      <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <textarea
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder={t.specialRequestsPlaceholder}
                        rows={2}
                        className="flex-1 bg-transparent text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none resize-none"
                      />
                    </div>
                  </div>

                  {/* ── Order Summary ── */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 space-y-2">
                    <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-3">
                      {t.orderSummary}
                    </h3>
                    {cartItems.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Tag className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 max-w-[140px]">
                            {item.name}
                          </span>
                          <span className="text-xs text-gray-400">
                            ×{item.cartQuantity}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex-shrink-0">
                          {(item.price * item.cartQuantity).toLocaleString()} {t.birr}
                        </span>
                      </div>
                    ))}
                    <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-800 dark:text-white">
                        {t.total}
                      </span>
                      <motion.span
                        key={subtotal}
                        initial={{ scale: 1.1, color: '#2563eb' }}
                        animate={{ scale: 1 }}
                        className="text-base font-bold text-blue-600 dark:text-blue-400"
                      >
                        {subtotal.toLocaleString()} {t.birr}
                      </motion.span>
                    </div>
                  </div>

                  {/* Bottom padding */}
                  <div className="h-4" />
                </div>
              )}
            </div>

            {/* ── Sticky Footer ── */}
            {cartItems.length > 0 && (
              <div className="flex-shrink-0 px-4 py-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                <motion.button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder || orderSuccess}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 ${
                    isPlacingOrder || orderSuccess
                      ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25'
                  }`}
                >
                  {isPlacingOrder ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      {t.placingOrder}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {t.placeOrder}
                      <ChevronRight className="w-5 h-5" />
                    </span>
                  )}
                </motion.button>
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
