import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Search, SlidersHorizontal, Phone, Tag, Bell, ChevronRight,
  UtensilsCrossed, ConciergeBell, Star, Megaphone,
} from 'lucide-react'
import { MenuCategory, MenuItem } from '../types/menu'
import { useHotelSettings } from '../contexts/HotelSettingsContext'
import { useLanguage } from '../contexts/LanguageContext'
import { fetchServiceFields } from '../services/serviceDataService'
import { translateCategory } from '../data/categoryTranslations'

interface HomePageProps {
  categories: MenuCategory[]
  items: MenuItem[]
  onNavigateToMenu: (categoryId?: string) => void
  onNavigateToServices: () => void
}

// ── Phase 1 sample data ──────────────────────────────────────────────────
// These 3 sections become fully admin-managed (CRUD + scheduling) in Phases 3–4.
// For now they're static placeholders so the Home layout is complete end-to-end.

const SAMPLE_SPECIALS = [
  { id: 's1', badge: '20% OFF', title: 'Laundry Service', subtitle: 'On all laundry orders', tag: 'Today only', emoji: '🧺' },
  { id: 's2', badge: '15% OFF', title: 'Spa Treatments', subtitle: 'Relax & rejuvenate', tag: 'Today only', emoji: '💆' },
  { id: 's3', badge: 'Free', title: 'Free Coffee', subtitle: 'With any breakfast', tag: 'Today only', emoji: '☕' },
]

const SAMPLE_ANNOUNCEMENTS = [
  { id: 'a1', text: 'Breakfast is served from 6:00 AM to 10:30 AM', time: 'Daily' },
  { id: 'a2', text: 'Pool maintenance scheduled this afternoon', time: 'Today' },
  { id: 'a3', text: 'Live music in the lobby lounge tonight', time: 'Tonight' },
]

export const HomePage: React.FC<HomePageProps> = ({
  categories,
  items,
  onNavigateToMenu,
  onNavigateToServices,
}) => {
  const { settings } = useHotelSettings()
  const { language, t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [serviceFields, setServiceFields] = useState<MenuCategory[]>([])
  const offersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    (async () => {
      const fields = await fetchServiceFields()
      setServiceFields(fields)
    })()
  }, [])

  const popularDishes = [...items]
    .filter(i => i.available)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 8)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Full search-and-redirect logic lands in Phase 2.
  }

  const scrollToOffers = () => {
    offersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleContactUs = () => {
    if (settings.reception_phone) {
      window.location.href = `tel:${settings.reception_phone}`
    }
  }

  return (
    <div className="px-4 pt-3 pb-28">

      {/* ── Universal Search ─────────────────────────────────────────── */}
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search for food, drinks or services..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
          />
          <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </div>
      </form>

      {/* ── Welcome Card ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-4 mb-6"
      >
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          Welcome to {settings.hotel_name} 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          We're delighted to serve you.
        </p>

        <div className="grid grid-cols-4 gap-2 mt-4">
          <button
            onClick={() => onNavigateToMenu()}
            className="flex flex-col items-center gap-2 py-3 rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Order Food</span>
          </button>

          <button
            onClick={onNavigateToServices}
            className="flex flex-col items-center gap-2 py-3 rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
              <ConciergeBell className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Services</span>
          </button>

          <button
            onClick={scrollToOffers}
            className="flex flex-col items-center gap-2 py-3 rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
              <Tag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Offers</span>
          </button>

          <button
            onClick={handleContactUs}
            className="flex flex-col items-center gap-2 py-3 rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
              <Phone className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Contact Us</span>
          </button>
        </div>
      </motion.div>

      {/* ── Today's Offers (sample — becomes admin-managed in Phase 3) ─── */}
      <div ref={offersRef} className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Today's Offers</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
          {SAMPLE_SPECIALS.map((offer, i) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex-shrink-0 w-40 snap-start bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="relative w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                <span className="text-4xl">{offer.emoji}</span>
                <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {offer.badge}
                </span>
              </div>
              <div className="p-2.5">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white leading-tight line-clamp-1">
                  {offer.title}
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                  {offer.subtitle}
                </p>
                <p className="text-[11px] text-green-600 dark:text-green-400 font-semibold mt-1">
                  {offer.tag}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Popular Dishes ───────────────────────────────────────────── */}
      {popularDishes.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Popular Dishes</h2>
            <button
              onClick={() => onNavigateToMenu()}
              className="flex items-center gap-0.5 text-xs font-semibold text-gray-500 dark:text-gray-400"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
            {popularDishes.map((item, i) => (
              <motion.button
                key={item.id}
                onClick={() => onNavigateToMenu(item.category)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex-shrink-0 w-32 snap-start bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm text-left"
              >
                <div className="w-full aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
                  )}
                </div>
                <div className="p-2.5">
                  {item.rating !== undefined && (
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                        {item.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white leading-tight line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1">
                    {item.price.toLocaleString()} {t.birr}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* ── Popular Services ─────────────────────────────────────────── */}
      {serviceFields.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Popular Services</h2>
            <button
              onClick={onNavigateToServices}
              className="flex items-center gap-0.5 text-xs font-semibold text-gray-500 dark:text-gray-400"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {serviceFields.map((field, i) => (
              <motion.button
                key={field.id}
                onClick={onNavigateToServices}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-2xl">{field.icon}</span>
                <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 text-center leading-tight">
                  {translateCategory(field.id, field.name, language)}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* ── Announcements (sample — becomes admin-managed in Phase 4) ──── */}
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-3">
          <Megaphone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Announcements</h2>
        </div>
        <div className="space-y-2">
          {SAMPLE_ANNOUNCEMENTS.map((note, i) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug">{note.text}</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium mt-0.5">{note.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  )
}