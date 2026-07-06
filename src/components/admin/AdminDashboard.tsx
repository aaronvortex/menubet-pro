import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutGrid, UtensilsCrossed, ClipboardList, Settings, LogOut, Home, Plus, CreditCard as Edit2, Trash2, X, Check, AlertCircle, Save, RefreshCw, Clock, CheckCircle, XCircle, Eye, Hotel, Phone, MapPin, Image as ImageIcon, ToggleLeft, ToggleRight, BarChart2, TrendingUp, ShoppingBag, DollarSign, Package, Star, ArrowUp, ArrowDown, Minus, Calendar, Activity, TrendingDown, Heart, Layers, ConciergeBell, Inbox } from 'lucide-react'
import { useAdmin } from '../../contexts/AdminContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useHotelSettings } from '../../contexts/HotelSettingsContext'
import { useOnboarding } from '../../contexts/OnboardingContext'
import {
  fetchCategories,
  fetchMenuItems,
  fetchOrders,
  createCategory,
  updateCategory,
  deleteCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateOrderStatus,
  deleteOrder,
  updateHotelSettings,
  fetchFavorites,
  deleteFavoritesByItemId,
  FavoriteRecord,
} from '../../services/dataService'
import { MenuCategory, MenuItem, Order, HotelSettings } from '../../types/menu'
import { AnalyticsCardSkeleton, AdminListSkeleton } from '../animations/ShimmerSkeleton'
import { ServicesAdminSection } from './ServicesAdminSection'
import { HomeDashboardAdminSection } from './HomeDashboardAdminSection'
// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type Tab = 'analytics' | 'homeDashboard' | 'categories' | 'items' | 'serviceFields' | 'services' | 'serviceRequests' | 'orders' | 'favorites' | 'settings'
type OrderStatus = 'all' | 'pending' | 'completed' | 'cancelled'

// ─────────────────────────────────────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────────────────────────────────────

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  }
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${map[status] || 'bg-gray-100 text-gray-500'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

const ConfirmModal: React.FC<{
  message: string
  onConfirm: () => void
  onCancel: () => void
}> = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[500] bg-black/60 flex items-center justify-center px-4">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-xs w-full shadow-2xl"
    >
      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-6 h-6 text-red-500" />
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 text-center mb-5 leading-relaxed">
        {message}
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-semibold"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold"
        >
          Delete
        </button>
      </div>
    </motion.div>
  </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS TAB
// ─────────────────────────────────────────────────────────────────────────────

const AnalyticsTab: React.FC<{
  orders: Order[]
  menuItems: MenuItem[]
  categories: MenuCategory[]
  isLoading: boolean
}> = ({ orders, menuItems, categories, isLoading }) => {

  if (isLoading) return <AnalyticsCardSkeleton />

  // FIX 1-4: Core metrics calculations (already correct)
  const totalOrders = orders.length
  const completedOrders = orders.filter(o => o.status === 'completed').length
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total_price, 0)
  const completedRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.total_price, 0)
  const availableItems = menuItems.filter(i => i.available).length

  // FIX 5: Today's Activity
  const today = new Date().toDateString()
  const todayOrders = orders.filter(o => {
    const date = o.call_time || o.created_at
    return date && new Date(date).toDateString() === today
  })
  const todayOrderCount = todayOrders.length
  const todayRevenue = todayOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total_price, 0)
  const todayPending = todayOrders.filter(o => o.status === 'pending').length

  // FIX 7: Hourly Distribution - all 24 hours
  const hoursData: { hour: number; count: number }[] = []
  for (let h = 0; h <= 23; h++) {
    hoursData.push({ hour: h, count: 0 })
  }
  orders.forEach(order => {
    const timestamp = order.call_time || order.created_at
    if (timestamp) {
      const hour = new Date(timestamp).getHours()
      hoursData[hour].count += 1
    }
  })
  const maxHourCount = Math.max(...hoursData.map(h => h.count), 1)
  const hasCallData = hoursData.some(h => h.count > 0)

  // FIX 8: Completion Rate
  const completionRate = totalOrders > 0
    ? ((completedOrders / totalOrders) * 100).toFixed(1)
    : '0.0'
  const rateValue = parseFloat(completionRate)
  let rateColor = 'text-red-500'
  if (rateValue > 70) rateColor = 'text-green-600'
  else if (rateValue >= 40) rateColor = 'text-yellow-500'

  // FIX 10: Item order frequency
  const itemFrequency: Record<string, { name: string; count: number; revenue: number }> = {}
  orders.forEach(order => {
    order.items.forEach((item: any) => {
      if (!itemFrequency[item.id]) {
        itemFrequency[item.id] = { name: item.name, count: 0, revenue: 0 }
      }
      itemFrequency[item.id].count += item.cartQuantity
      itemFrequency[item.id].revenue += item.price * item.cartQuantity
    })
  })
  const topItems = Object.values(itemFrequency)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // FIX 9: Revenue by category - ALL 5 categories always shown
  const categoryRevenue: Record<string, number> = {}
  orders.filter(o => o.status !== 'cancelled').forEach(order => {
    order.items.forEach((item: any) => {
      const cat = item.category || 'unknown'
      categoryRevenue[cat] = (categoryRevenue[cat] || 0) + item.price * item.cartQuantity
    })
  })
  // Merge all categories with revenue data, defaulting to 0 for categories with no orders
  const catRevenueList = categories
    .map(cat => ({
      catId: cat.id,
      name: cat.name,
      icon: cat.icon,
      revenue: categoryRevenue[cat.id] || 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)

  const maxCatRevenue = Math.max(...catRevenueList.map(c => c.revenue), 1)
  const maxItemCount = Math.max(...topItems.map(i => i.count), 1)

  const metricCards = [
    {
      icon: <ShoppingBag className="w-5 h-5" />,
      label: 'Total Orders',
      value: totalOrders,
      sub: `${completedOrders} completed`,
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: 'Total Revenue',
      value: `${totalRevenue.toLocaleString()} Birr`,
      sub: `${completedRevenue.toLocaleString()} confirmed`,
      color: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
      iconBg: 'bg-green-100 dark:bg-green-900/40',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Pending',
      value: pendingOrders,
      sub: `${cancelledOrders} cancelled`,
      color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/40',
    },
    {
      icon: <Package className="w-5 h-5" />,
      label: 'Menu Items',
      value: menuItems.length,
      sub: `${availableItems} available`,
      color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-900/40',
    },
  ]

  const formatHour = (hour: number): string => {
    if (hour === 0) return '12am'
    if (hour === 12) return '12pm'
    return hour > 12 ? `${hour - 12}pm` : `${hour}am`
  }

  return (
    <div className="p-4 space-y-4 pb-10">

      {/* FIX 1-4: Metric Cards */}
      <div className="grid grid-cols-2 gap-3">
        {metricCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`${card.color} rounded-2xl p-4 shadow-sm`}
          >
            <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center mb-3`}>
              {card.icon}
            </div>
            <p className="text-xl font-extrabold leading-tight">{card.value}</p>
            <p className="text-xs font-semibold mt-0.5 opacity-80">{card.label}</p>
            <p className="text-[10px] opacity-60 mt-1">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* FIX 5: Today's Activity Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-4 shadow-lg text-white"
      >
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-200" />
          Today's Activity
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Orders', value: todayOrderCount, icon: '📋' },
            { label: 'Revenue', value: `${todayRevenue.toLocaleString()}`, icon: '💰' },
            { label: 'Pending', value: todayPending, icon: '⏳' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="bg-white/10 rounded-xl p-3 text-center"
            >
              <span className="text-xl">{s.icon}</span>
              <p className="text-lg font-extrabold mt-1">{s.value}</p>
              <p className="text-[10px] text-emerald-200 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* FIX 6: Order Status Breakdown (already correct) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm"
      >
        <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-blue-500" />
          Order Status Breakdown
        </h3>
        {totalOrders === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">No orders yet</p>
        ) : (
          <div className="space-y-3">
            {[
              { label: 'Completed', count: completedOrders, color: 'bg-green-500', textColor: 'text-green-600 dark:text-green-400' },
              { label: 'Pending', count: pendingOrders, color: 'bg-yellow-500', textColor: 'text-yellow-600 dark:text-yellow-400' },
              { label: 'Cancelled', count: cancelledOrders, color: 'bg-red-500', textColor: 'text-red-600 dark:text-red-400' },
            ].map((s, i) => (
              <div key={s.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{s.label}</span>
                  <span className={`text-xs font-bold ${s.textColor}`}>{s.count}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: totalOrders > 0 ? `${(s.count / totalOrders) * 100}%` : '0%' }}
                    transition={{ duration: 0.8, delay: i * 0.15, ease: 'easeOut' }}
                    className={`h-full ${s.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* FIX 7: Hourly Call Distribution - all 24 hours */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm"
      >
        <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-500" />
          Hourly Call Distribution
        </h3>
        {!hasCallData ? (
          <p className="text-xs text-gray-400 text-center py-6">No call data yet</p>
        ) : (
          <div className="grid grid-cols-12 gap-1">
            {hoursData.map(({ hour, count }) => (
              <div key={hour} className="flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-orange-400 to-orange-500 rounded-t"
                  style={{
                    height: `${Math.max((count / maxHourCount) * 60, 4)}px`,
                  }}
                />
                <span className="text-[8px] text-gray-400 mt-1">{formatHour(hour)}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* FIX 8: Completion Rate */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm text-center"
      >
        <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-2 flex items-center justify-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          Completion Rate
        </h3>
        {totalOrders === 0 ? (
          <p className="text-sm text-gray-400 py-4">No data</p>
        ) : (
          <motion.p
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className={`text-5xl font-extrabold ${rateColor}`}
          >
            {completionRate}%
          </motion.p>
        )}
        {totalOrders > 0 && (
          <p className="text-xs text-gray-400 mt-2">
            {completedOrders} of {totalOrders} orders completed
          </p>
        )}
      </motion.div>

      {/* FIX 9: Revenue by Category - ALL categories */}
      {catRevenueList.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm"
        >
          <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            Revenue by Category
          </h3>
          <div className="space-y-3">
            {catRevenueList.map((cat, i) => (
              <div key={cat.catId} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{cat.icon}</span>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{cat.name}</span>
                  </div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {cat.revenue.toLocaleString()} Birr
                  </span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(cat.revenue / maxCatRevenue) * 100}%` }}
                    transition={{ duration: 0.9, delay: i * 0.05, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* FIX 10: Top Ordered Items */}
      {topItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm"
        >
          <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            Top Ordered Items
          </h3>
          <div className="space-y-3">
            {topItems.map((item, i) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                      i === 0 ? 'bg-yellow-100 text-yellow-600' :
                      i === 1 ? 'bg-gray-100 text-gray-600' :
                      i === 2 ? 'bg-orange-100 text-orange-600' :
                      'bg-gray-50 text-gray-500'
                    }`}>{i + 1}</span>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 line-clamp-1 max-w-[140px]">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-gray-800 dark:text-white">x{item.count}</p>
                    <p className="text-[10px] text-gray-400">{item.revenue.toLocaleString()} Birr</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / maxItemCount) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FAVORITES TAB
// ─────────────────────────────────────────────────────────────────────────────

const FavoritesTab: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null)

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    setIsLoading(true)
    try {
      const data = await fetchFavorites()
      setFavorites(data)
    } catch (err) {
      console.error('Failed to load favorites:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteByItem = async (itemId: string) => {
    try {
      await deleteFavoritesByItemId(itemId)
      await loadFavorites()
    } catch (err) {
      console.error('Failed to delete favorites:', err)
    } finally {
      setDeletingItemId(null)
    }
  }

  // Group favorites by item_id and count them
  const grouped = favorites.reduce((acc, fav) => {
    if (!acc[fav.item_id]) {
      acc[fav.item_id] = {
        item_id: fav.item_id,
        item_name: fav.item_name,
        item_image: fav.item_image,
        item_price: fav.item_price,
        category_id: fav.category_id,
        count: 0,
        latest_at: fav.favorited_at,
      }
    }
    acc[fav.item_id].count++
    if (fav.favorited_at > acc[fav.item_id].latest_at) {
      acc[fav.item_id].latest_at = fav.favorited_at
    }
    return acc
  }, {} as Record<string, any>)

  const groupedList = Object.values(grouped)
    .sort((a: any, b: any) => b.count - a.count)

  if (isLoading) return <AdminListSkeleton rows={5} />

  if (groupedList.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <span className="text-6xl">❤️</span>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-4">
          No favorites recorded yet
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
          When guests tap the heart on any item it appears here
        </p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-800 dark:text-white">
          Guest Favorites{' '}
          <span className="text-sm text-gray-400 font-normal">
            ({favorites.length} total taps)
          </span>
        </h2>
        <button
          onClick={loadFavorites}
          className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
        >
          <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
        </button>
      </div>

      <div className="space-y-2">
        {groupedList.map((group: any, i: number) => (
          <motion.div
            key={group.item_id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-3 flex items-center gap-3 shadow-sm"
          >
            {/* Item image */}
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
              {group.item_image ? (
                <img
                  src={group.item_image}
                  alt={group.item_name}
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>
              )}
            </div>

            {/* Item info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 dark:text-white line-clamp-1">
                {group.item_name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {Number(group.item_price).toLocaleString()} Birr · {group.category_id}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                Last: {new Date(group.latest_at).toLocaleDateString()}
              </p>
            </div>

            {/* Heart count + delete */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-2.5 py-1.5 rounded-xl">
                <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                <span className="text-xs font-bold text-red-600 dark:text-red-400">
                  {group.count}
                </span>
              </div>
              <button
                onClick={() => setDeletingItemId(group.item_id)}
                className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center"
                title="Delete all favorites for this item"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Confirm delete modal */}
      {deletingItemId && (
        <ConfirmModal
          message="Delete all favorite records for this item? This cannot be undone."
          onConfirm={() => handleDeleteByItem(deletingItemId)}
          onCancel={() => setDeletingItemId(null)}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY FORM MODAL
// ─────────────────────────────────────────────────────────────────────────────

const CategoryForm: React.FC<{
  initial?: MenuCategory | null
  onSave: (data: Partial<MenuCategory>) => Promise<void>
  onClose: () => void
}> = ({ initial, onSave, onClose }) => {
  const [id, setId] = useState(initial?.id || '')
  const [name, setName] = useState(initial?.name || '')
  const [icon, setIcon] = useState(initial?.icon || '🍽️')
  const [order, setOrder] = useState(String(initial?.display_order || 1))
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!id.trim()) e.id = 'ID is required'
    if (!name.trim()) e.name = 'Name is required'
    if (!icon.trim()) e.icon = 'Icon is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await onSave({ id: id.trim(), name: name.trim(), icon: icon.trim(), display_order: Number(order) })
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[400] bg-black/60 flex items-end sm:items-center justify-center px-0 sm:px-4">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl w-full max-w-sm shadow-2xl"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {initial ? 'Edit Category' : 'Add Category'}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Category ID *</label>
            <input
              value={id}
              onChange={e => setId(e.target.value)}
              disabled={!!initial}
              placeholder="e.g. soups"
              className={`w-full bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white outline-none border-2 ${errors.id ? 'border-red-400' : 'border-transparent focus:border-blue-500'} ${initial ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
            {errors.id && <p className="text-xs text-red-500 mt-1">{errors.id}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Name *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Soups"
              className={`w-full bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white outline-none border-2 ${errors.name ? 'border-red-400' : 'border-transparent focus:border-blue-500'}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Icon (emoji) *</label>
            <input
              value={icon}
              onChange={e => setIcon(e.target.value)}
              placeholder="🍜"
              className={`w-full bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white outline-none border-2 ${errors.icon ? 'border-red-400' : 'border-transparent focus:border-blue-500'}`}
            />
            {errors.icon && <p className="text-xs text-red-500 mt-1">{errors.icon}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Display Order</label>
            <input
              type="number"
              value={order}
              onChange={e => setOrder(e.target.value)}
              min="1"
              className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white outline-none border-2 border-transparent focus:border-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-semibold">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-[2] py-3 rounded-2xl bg-blue-600 text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <><Save className="w-4 h-4" /> Save</>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MENU ITEM FORM MODAL - FIX 15: Interactive Star Rating
// ─────────────────────────────────────────────────────────────────────────────

const Field: React.FC<{
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  error?: string
  multiline?: boolean
}> = ({ label, value, onChange, placeholder, type = 'text', error, multiline }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">{label}</label>
    {multiline ? (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className={`w-full bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white outline-none border-2 resize-none ${error ? 'border-red-400' : 'border-transparent focus:border-blue-500'}`}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white outline-none border-2 ${error ? 'border-red-400' : 'border-transparent focus:border-blue-500'}`}
      />
    )}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
)

const MenuItemForm: React.FC<{
  initial?: MenuItem | null
  categories: MenuCategory[]
  onSave: (data: Partial<MenuItem>) => Promise<void>
  onClose: () => void
}> = ({ initial, categories, onSave, onClose }) => {
  const [form, setForm] = useState({
    id: initial?.id || '',
    name: initial?.name || '',
    description: initial?.description || '',
    price: String(initial?.price || ''),
    category: initial?.category || (categories[0]?.id || ''),
    subCategory: initial?.subCategory || '',
    image: initial?.image || '',
    calories: String(initial?.calories || ''),
    volume: initial?.volume || '',
    ingredients: initial?.ingredients?.join(', ') || '',
    quantity: String(initial?.quantity || ''),
    rating: String(initial?.rating || '0'),
    available: initial?.available ?? true,
  })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (key: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.id.trim()) e.id = 'ID required'
    if (!form.name.trim()) e.name = 'Name required'
    if (!form.price || isNaN(Number(form.price))) e.price = 'Valid price required'
    if (!form.category) e.category = 'Category required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await onSave({
        id: form.id.trim(),
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category,
        subCategory: form.subCategory.trim() || undefined,
        image: form.image.trim(),
        calories: Number(form.calories) || 0,
        volume: form.volume.trim(),
        ingredients: form.ingredients.split(',').map(s => s.trim()).filter(Boolean),
        quantity: Number(form.quantity) || 0,
        rating: Number(form.rating) || 0,
        available: form.available,
      })
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  // FIX 15: Star Rating Component
  const StarRating: React.FC<{
    value: number
    onChange: (rating: number) => void
  }> = ({ value, onChange }) => {
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  star <= value
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            </button>
          ))}
        </div>
        <span className="text-xs font-semibold text-gray-500">
          {value} / 5
        </span>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[400] bg-black/60 overflow-y-auto">
      <div className="min-h-full flex items-end sm:items-center justify-center px-0 sm:px-4 py-0 sm:py-8">
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl w-full max-w-sm shadow-2xl"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 rounded-t-3xl z-10">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {initial ? 'Edit Item' : 'Add Menu Item'}
            </h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="px-5 py-4 space-y-4">
            <Field label="Item ID *" value={form.id} onChange={v => set('id', v)} placeholder="e.g. item-001" error={errors.id} />
            <Field label="Item Name *" value={form.name} onChange={v => set('name', v)} placeholder="e.g. Tomato Soup" error={errors.name} />
            <Field label="Description" value={form.description} onChange={v => set('description', v)} placeholder="Brief description..." multiline />

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Category *</label>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className={`w-full bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white outline-none border-2 ${errors.category ? 'border-red-400' : 'border-transparent focus:border-blue-500'}`}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
            </div>

            <Field label="Sub Category" value={form.subCategory} onChange={v => set('subCategory', v)} placeholder="e.g. hot, cold, juice" />
            <Field label="Price (Birr) *" value={form.price} onChange={v => set('price', v)} type="number" placeholder="120" error={errors.price} />
            <Field label="Image URL" value={form.image} onChange={v => set('image', v)} placeholder="https://..." />

            {form.image && (
              <div className="w-full h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img src={form.image} alt="preview" className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Field label="Calories" value={form.calories} onChange={v => set('calories', v)} type="number" placeholder="180" />
              <Field label="Volume" value={form.volume} onChange={v => set('volume', v)} placeholder="350ml" />
            </div>

            <Field label="Ingredients (comma-separated)" value={form.ingredients} onChange={v => set('ingredients', v)} placeholder="Tomato, Cream, Basil" />

            <div className="grid grid-cols-2 gap-3">
              <Field label="Quantity" value={form.quantity} onChange={v => set('quantity', v)} type="number" placeholder="10" />
              {/* FIX 15: Interactive Star Rating instead of text input */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Rating</label>
                <StarRating
                  value={Number(form.rating) || 0}
                  onChange={(rating) => set('rating', String(rating))}
                />
              </div>
            </div>

            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Available</span>
              <button
                onClick={() => set('available', !form.available)}
                className={`transition-colors ${form.available ? 'text-green-500' : 'text-gray-400'}`}
              >
                {form.available
                  ? <ToggleRight className="w-8 h-8" />
                  : <ToggleLeft className="w-8 h-8" />
                }
              </button>
            </div>

            <div className="flex gap-3 pt-1 pb-2">
              <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-semibold">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-[2] py-3 rounded-2xl bg-blue-600 text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Save className="w-4 h-4" /> Save Item</>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDER DETAIL MODAL
// ─────────────────────────────────────────────────────────────────────────────

const OrderDetail: React.FC<{
  order: Order
  onClose: () => void
  onStatusChange: (id: string, status: 'completed' | 'cancelled') => void
}> = ({ order, onClose, onStatusChange }) => (
  <div className="fixed inset-0 z-[400] bg-black/60 flex items-end sm:items-center justify-center px-0 sm:px-4">
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl w-full max-w-sm shadow-2xl max-h-[85vh] flex flex-col"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">Order Details</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Order ID</span>
            <span className="text-xs font-mono text-gray-700 dark:text-gray-300">{order.id?.slice(0, 8)}...</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Guest</span>
            <span className="text-xs font-bold text-gray-800 dark:text-white">{order.guest_name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Room</span>
            <span className="text-xs font-bold text-gray-800 dark:text-white">Room {order.room_number}</span>
          </div>
          {order.guest_phone && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Phone</span>
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-blue-500" />
                <span className="text-xs font-bold text-gray-800 dark:text-white">{order.guest_phone}</span>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Status</span>
            <StatusBadge status={order.status} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Called at</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {(order.call_time || order.created_at)
                ? new Date(order.call_time || order.created_at!).toLocaleString()
                : '—'}
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Items Ordered</h4>
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg">🍽️</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 dark:text-white line-clamp-1">{item.name}</p>
                  <p className="text-xs text-gray-500">×{item.cartQuantity} · {(item.price * item.cartQuantity).toLocaleString()} Birr</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {order.special_requests && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-3">
            <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 mb-1">Special Requests</p>
            <p className="text-xs text-yellow-600 dark:text-yellow-500">{order.special_requests}</p>
          </div>
        )}

        <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 rounded-xl px-4 py-3">
          <span className="text-sm font-bold text-gray-800 dark:text-white">Total</span>
          <span className="text-base font-bold text-blue-600 dark:text-blue-400">{order.total_price.toLocaleString()} Birr</span>
        </div>

        {/* FIX 13: Status change buttons for all statuses */}
        {order.status === 'pending' && (
          <div className="flex gap-3">
            <button
              onClick={() => { onStatusChange(order.id!, 'cancelled'); onClose() }}
              className="flex-1 py-3 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-4 h-4" /> Cancel
            </button>
            <button
              onClick={() => { onStatusChange(order.id!, 'completed'); onClose() }}
              className="flex-[2] py-3 rounded-2xl bg-green-500 text-white text-sm font-bold flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" /> Mark Complete
            </button>
          </div>
        )}
        {order.status === 'completed' && (
          <button
            onClick={() => { onStatusChange(order.id!, 'cancelled'); onClose() }}
            className="w-full py-3 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold flex items-center justify-center gap-1.5"
          >
            <XCircle className="w-4 h-4" /> Cancel Order
          </button>
        )}
        {order.status === 'cancelled' && (
          <button
            onClick={() => { onStatusChange(order.id!, 'completed'); onClose() }}
            className="w-full py-3 rounded-2xl bg-green-500 text-white text-sm font-bold flex items-center justify-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" /> Mark as Completed
          </button>
        )}
      </div>
    </motion.div>
  </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

interface AdminDashboardProps {
  onLogout: () => void
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { admin } = useAdmin()
  const { t } = useLanguage()
  const { settings, refreshSettings } = useHotelSettings()
  const { resetOnboarding } = useOnboarding()

  const [activeTab, setActiveTab] = useState<Tab>('analytics')

  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [catLoading, setCatLoading] = useState(true)
  const [showCatForm, setShowCatForm] = useState(false)
  const [editingCat, setEditingCat] = useState<MenuCategory | null>(null)
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null)

  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [itemsLoading, setItemsLoading] = useState(true)
  const [showItemForm, setShowItemForm] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null)
  const [itemCategoryFilter, setItemCategoryFilter] = useState<string>('all')

  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus>('all')
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null)

  // FIX 11: Add deletingOrderId state
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null)

  const [settingsForm, setSettingsForm] = useState<HotelSettings>(settings)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsSaved, setSettingsSaved] = useState(false)

  const [favoritesCount, setFavoritesCount] = useState(0)

  useEffect(() => {
    setSettingsForm(settings)
  }, [settings])

  useEffect(() => {
    loadCategories()
    loadMenuItems()
    loadOrders()
    loadFavoritesCount()
  }, [])

  const loadFavoritesCount = async () => {
    try {
      const favData = await fetchFavorites()
      const uniqueItemCount = new Set(
        favData.map((f: FavoriteRecord) => f.item_id)
      ).size
      setFavoritesCount(uniqueItemCount)
    } catch (error) {
      console.error('Failed to load favorites count:', error)
      setFavoritesCount(0)
    }
  }

  const loadCategories = async () => {
    setCatLoading(true)
    try {
      const data = await fetchCategories()
      setCategories(data)
    } finally {
      setCatLoading(false)
    }
  }

  const loadMenuItems = async () => {
    setItemsLoading(true)
    try {
      const data = await fetchMenuItems()
      setMenuItems(data)
    } finally {
      setItemsLoading(false)
    }
  }

  const loadOrders = async () => {
    setOrdersLoading(true)
    try {
      const data = await fetchOrders()
      setOrders(data)
    } finally {
      setOrdersLoading(false)
    }
  }

  const handleSaveCategory = async (data: Partial<MenuCategory>) => {
    if (editingCat) {
      await updateCategory(editingCat.id, data)
    } else {
      await createCategory(data)
    }
    setEditingCat(null)
    await loadCategories()
  }

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id)
    setDeletingCatId(null)
    await loadCategories()
  }

  const handleSaveItem = async (data: Partial<MenuItem>) => {
    if (editingItem) {
      await updateMenuItem(editingItem.id, data)
    } else {
      await createMenuItem(data)
    }
    setEditingItem(null)
    await loadMenuItems()
  }

  const handleDeleteItem = async (id: string) => {
    await deleteMenuItem(id)
    setDeletingItemId(null)
    await loadMenuItems()
  }

  const handleOrderStatus = async (id: string, status: 'completed' | 'cancelled') => {
    await updateOrderStatus(id, status)
    await loadOrders()
  }

  // FIX 12: handleDeleteOrder function
  const handleDeleteOrder = async (id: string) => {
    await deleteOrder(id)
    setDeletingOrderId(null)
    await loadOrders()
  }

  const handleSaveSettings = async () => {
    setSettingsSaving(true)
    try {
      await updateHotelSettings(settingsForm)
      await refreshSettings()
      setSettingsSaved(true)
      setTimeout(() => setSettingsSaved(false), 2500)
    } catch (e) {
      console.error(e)
    } finally {
      setSettingsSaving(false)
    }
  }

  const filteredItems = itemCategoryFilter === 'all'
    ? menuItems
    : menuItems.filter(i => i.category === itemCategoryFilter)

  const filteredOrders = orderStatusFilter === 'all'
    ? orders
    : orders.filter(o => o.status === orderStatusFilter)

  const pendingCount = orders.filter(o => o.status === 'pending').length

  const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'homeDashboard', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'categories', label: 'Categories', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'items', label: 'Items', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: 'serviceFields', label: 'Fields', icon: <Layers className="w-4 h-4" /> },
    { id: 'services', label: 'Services', icon: <ConciergeBell className="w-4 h-4" /> },
    { id: 'serviceRequests', label: 'Requests', icon: <Inbox className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders', icon: <ClipboardList className="w-4 h-4" />, badge: pendingCount },
    { id: 'favorites', label: 'Favorites', icon: <Heart className="w-4 h-4" />, badge: favoritesCount },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">

      {/* Top Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">⚙️</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Admin Dashboard</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{admin?.username}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-semibold bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-xl transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>

      {/* Tab Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-2 flex overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors flex-shrink-0 ${
              activeTab === tab.id
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <AnalyticsTab
            orders={orders}
            menuItems={menuItems}
            categories={categories}
            isLoading={ordersLoading || itemsLoading || catLoading}
          />
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-800 dark:text-white">
                Categories <span className="text-sm text-gray-400 font-normal">({categories.length})</span>
              </h2>
              <div className="flex gap-2">
                <button onClick={loadCategories} className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                </button>
                <button
                  onClick={() => { setEditingCat(null); setShowCatForm(true) }}
                  className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-xl"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>

            {catLoading ? (
              <AdminListSkeleton rows={5} />
            ) : categories.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-5xl">📂</span>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">No categories yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((cat, i) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm"
                  >
                    <span className="text-2xl flex-shrink-0">{cat.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 dark:text-white">{cat.name}</p>
                      <p className="text-xs text-gray-400">ID: {cat.id} · Order: {cat.display_order}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => { setEditingCat(cat); setShowCatForm(true) }}
                        className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      </button>
                      <button
                        onClick={() => setDeletingCatId(cat.id)}
                        className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MENU ITEMS TAB */}
        {activeTab === 'items' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-800 dark:text-white">
                Menu Items <span className="text-sm text-gray-400 font-normal">({filteredItems.length})</span>
              </h2>
              <div className="flex gap-2">
                <button onClick={loadMenuItems} className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                </button>
                <button
                  onClick={() => { setEditingItem(null); setShowItemForm(true) }}
                  className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-xl"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>

            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {['all', ...categories.map(c => c.id)].map(catId => (
                <button
                  key={catId}
                  onClick={() => setItemCategoryFilter(catId)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    itemCategoryFilter === catId
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {catId === 'all' ? 'All' : `${categories.find(c => c.id === catId)?.icon} ${categories.find(c => c.id === catId)?.name}`}
                </button>
              ))}
            </div>

            {itemsLoading ? (
              <AdminListSkeleton rows={6} />
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-5xl">🍽️</span>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">No items found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-3 flex items-center gap-3 shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-800 dark:text-white line-clamp-1">{item.name}</p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                          item.available
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-500'
                        }`}>
                          {item.available ? '✓' : '✗'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {item.price.toLocaleString()} Birr
                        {item.subCategory && <span className="ml-1 text-purple-500">· {item.subCategory}</span>}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => { setEditingItem(item); setShowItemForm(true) }}
                        className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      </button>
                      <button
                        onClick={() => setDeletingItemId(item.id)}
                        className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        <ServicesAdminSection activeTab={activeTab} />

        <HomeDashboardAdminSection activeTab={activeTab} />
          
        {/* ORDERS TAB - FIX 11, 12, 13 */}
        {activeTab === 'orders' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-800 dark:text-white">
                Orders <span className="text-sm text-gray-400 font-normal">({filteredOrders.length})</span>
              </h2>
              <button onClick={loadOrders} className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>

            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {(['all', 'pending', 'completed', 'cancelled'] as OrderStatus[]).map(s => (
                <button
                  key={s}
                  onClick={() => setOrderStatusFilter(s)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    orderStatusFilter === s
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                  {s === 'pending' && pendingCount > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full inline-flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {ordersLoading ? (
              <AdminListSkeleton rows={4} />
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-5xl">📋</span>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">No orders found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredOrders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-bold text-gray-800 dark:text-white">{order.guest_name}</p>
                        <p className="text-xs text-gray-500">Room {order.room_number}</p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''} ·{' '}
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            {order.total_price.toLocaleString()} Birr
                          </span>
                        </p>
                        {/* FIX 11: Buttons for all statuses, delete button added */}
                        <div className="flex gap-2">
                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleOrderStatus(order.id!, 'cancelled')}
                                className="w-7 h-7 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center"
                              >
                                <XCircle className="w-3.5 h-3.5 text-red-500" />
                              </button>
                              <button
                                onClick={() => handleOrderStatus(order.id!, 'completed')}
                                className="w-7 h-7 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center"
                              >
                                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                              </button>
                            </>
                          )}
                          {order.status === 'completed' && (
                            <button
                              onClick={() => handleOrderStatus(order.id!, 'cancelled')}
                              className="w-7 h-7 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center"
                            >
                              <XCircle className="w-3.5 h-3.5 text-red-500" />
                            </button>
                          )}
                          {order.status === 'cancelled' && (
                            <button
                              onClick={() => handleOrderStatus(order.id!, 'completed')}
                              className="w-7 h-7 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center"
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                            </button>
                          )}
                          <button
                            onClick={() => setViewingOrder(order)}
                            className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          </button>
                          {/* FIX 11: Delete button */}
                          <button
                            onClick={() => setDeletingOrderId(order.id!)}
                            className="w-7 h-7 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          </button>
                        </div>
                      </div>
                      {order.guest_phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-blue-500" />
                          <span className="text-[10px] text-gray-500">{order.guest_phone}</span>
                        </div>
                      )}
                      <p className="text-[10px] text-gray-400">
                        Called at: {(order.call_time || order.created_at)
                          ? new Date(order.call_time || order.created_at!).toLocaleString()
                          : '—'}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FAVORITES TAB */}
        {activeTab === 'favorites' && <FavoritesTab />}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-800 dark:text-white">Hotel Settings</h2>
              <AnimatePresence>
                {settingsSaved && (
                  <motion.span
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-semibold"
                  >
                    <Check className="w-3.5 h-3.5" /> Saved!
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  <Hotel className="w-3.5 h-3.5" /> Hotel Name
                </label>
                <input
                  value={settingsForm.hotel_name}
                  onChange={e => setSettingsForm(prev => ({ ...prev, hotel_name: e.target.value }))}
                  placeholder="Enter hotel name"
                  className="w-full bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white outline-none border-2 border-transparent focus:border-blue-500"
                />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  <ImageIcon className="w-3.5 h-3.5" /> Logo URL
                </label>
                <input
                  value={settingsForm.logo_url}
                  onChange={e => setSettingsForm(prev => ({ ...prev, logo_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white outline-none border-2 border-transparent focus:border-blue-500 mb-2"
                />
                {settingsForm.logo_url && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img src={settingsForm.logo_url} alt="logo preview"
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  <Phone className="w-3.5 h-3.5" /> Reception Phone
                </label>
                <input
                  value={settingsForm.reception_phone}
                  onChange={e => setSettingsForm(prev => ({ ...prev, reception_phone: e.target.value }))}
                  placeholder="+251 11 000 0000"
                  type="tel"
                  className="w-full bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white outline-none border-2 border-transparent focus:border-blue-500"
                />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  <MapPin className="w-3.5 h-3.5" /> Address
                </label>
                <input
                  value={settingsForm.address}
                  onChange={e => setSettingsForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="City, Country"
                  className="w-full bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white outline-none border-2 border-transparent focus:border-blue-500"
                />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                  <Clock className="w-3.5 h-3.5" /> Check-in / Check-out
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Check-in</p>
                    <input
                      value={settingsForm.check_in}
                      onChange={e => setSettingsForm(prev => ({ ...prev, check_in: e.target.value }))}
                      placeholder="2:00 PM"
                      className="w-full bg-gray-50 dark:bg-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white outline-none border-2 border-transparent focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Check-out</p>
                    <input
                      value={settingsForm.check_out}
                      onChange={e => setSettingsForm(prev => ({ ...prev, check_out: e.target.value }))}
                      placeholder="12:00 PM"
                      className="w-full bg-gray-50 dark:bg-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white outline-none border-2 border-transparent focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">About Hotel</label>
                <textarea
                  value={settingsForm.about_text}
                  onChange={e => setSettingsForm(prev => ({ ...prev, about_text: e.target.value }))}
                  placeholder="Welcome message or description..."
                  rows={3}
                  className="w-full bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white outline-none border-2 border-transparent focus:border-blue-500 resize-none"
                />
              </div>

              <motion.button
                onClick={handleSaveSettings}
                disabled={settingsSaving}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-blue-600/20 mb-8"
              >
                {settingsSaving ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Save className="w-4 h-4" /> Save Settings</>
                )}
              </motion.button>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Reset Onboarding</p>
                <p className="text-xs text-gray-400 mb-3">Show the welcome onboarding screens again on next app load. Useful for demos and testing.</p>
                <button
                  onClick={() => {
                    resetOnboarding()
                    alert('Onboarding reset! Reload the app to see it again.')
                  }}
                  className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-colors"
                >
                  🔄 Reset Onboarding
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {(showCatForm || editingCat) && (
          <CategoryForm
            key="cat-form"
            initial={editingCat}
            onSave={handleSaveCategory}
            onClose={() => { setShowCatForm(false); setEditingCat(null) }}
          />
        )}
        {(showItemForm || editingItem) && (
          <MenuItemForm
            key="item-form"
            initial={editingItem}
            categories={categories}
            onSave={handleSaveItem}
            onClose={() => { setShowItemForm(false); setEditingItem(null) }}
          />
        )}
        {deletingCatId && (
          <ConfirmModal
            key="del-cat"
            message="Delete this category? All items in it may be affected."
            onConfirm={() => handleDeleteCategory(deletingCatId)}
            onCancel={() => setDeletingCatId(null)}
          />
        )}
        {deletingItemId && (
          <ConfirmModal
            key="del-item"
            message="Delete this menu item? This cannot be undone."
            onConfirm={() => handleDeleteItem(deletingItemId)}
            onCancel={() => setDeletingItemId(null)}
          />
        )}
        {/* FIX 12: Order delete confirmation modal */}
        {deletingOrderId && (
          <ConfirmModal
            key="del-order"
            message="This order cannot be recovered once deleted. Are you sure you want to permanently remove this order?"
            onConfirm={() => handleDeleteOrder(deletingOrderId)}
            onCancel={() => setDeletingOrderId(null)}
          />
        )}
        {viewingOrder && (
          <OrderDetail
            key="order-detail"
            order={viewingOrder}
            onClose={() => setViewingOrder(null)}
            onStatusChange={handleOrderStatus}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
