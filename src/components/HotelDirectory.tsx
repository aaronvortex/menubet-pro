import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Phone,
  MapPin,
  Clock,
  Wifi,
  Waves,
  Dumbbell,
  Sparkles,
  Users,
  ShieldAlert,
  UtensilsCrossed,
  BedDouble,
  Luggage,
  ChevronDown,
  ChevronUp,
  Star,
  Building2,
  LogIn,
} from 'lucide-react'
import { useHotelSettings } from '../contexts/HotelSettingsContext'
import { useLanguage } from '../contexts/LanguageContext'

interface HotelDirectoryProps {
  isOpen: boolean
  onClose: () => void
  onAdminLoginClick: () => void
}

// ── Collapsible Section Component ────────────────────────────────────────

interface SectionProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  accent?: string
}

const Section: React.FC<SectionProps> = ({
  icon,
  title,
  children,
  defaultOpen = false,
  accent = 'blue',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const accentMap: Record<string, string> = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden mb-3 shadow-sm">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${accentMap[accent] || accentMap.blue}`}>
            {icon}
          </div>
          <span className="text-sm font-bold text-gray-800 dark:text-white">
            {title}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t border-gray-100 dark:border-gray-700">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Info Row ─────────────────────────────────────────────────────────────

interface InfoRowProps {
  label: string
  value: string
  icon?: React.ReactNode
  onPress?: () => void
  highlight?: boolean
}

const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  icon,
  onPress,
  highlight = false,
}) => (
  <div
    onClick={onPress}
    className={`flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-0 ${
      onPress ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 -mx-4 px-4 rounded-lg transition-colors' : ''
    }`}
  >
    <div className="flex items-center gap-2">
      {icon && (
        <span className="text-gray-400 dark:text-gray-500">{icon}</span>
      )}
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
    </div>
    <span className={`text-xs font-semibold text-right max-w-[55%] ${
      highlight
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-gray-800 dark:text-gray-200'
    }`}>
      {value}
    </span>
  </div>
)

// ── Facility Badge ────────────────────────────────────────────────────────

interface FacilityBadgeProps {
  icon: React.ReactNode
  label: string
  available?: boolean
}

const FacilityBadge: React.FC<FacilityBadgeProps> = ({
  icon,
  label,
  available = true,
}) => (
  <div className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border ${
    available
      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800'
      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50'
  }`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
      available
        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
        : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
    }`}>
      {icon}
    </div>
    <span className={`text-[10px] font-semibold text-center leading-tight ${
      available
        ? 'text-blue-700 dark:text-blue-300'
        : 'text-gray-400'
    }`}>
      {label}
    </span>
  </div>
)

// ── Main HotelDirectory Component ─────────────────────────────────────────

export const HotelDirectory: React.FC<HotelDirectoryProps> = ({
  isOpen,
  onClose,
  onAdminLoginClick,
}) => {
  const { settings } = useHotelSettings()
  const { t } = useLanguage()
  const [logoError, setLogoError] = useState(false)

  const handleCallReception = () => {
    if (settings.reception_phone) {
      window.location.href = `tel:${settings.reception_phone}`
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="dir-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
          />

          {/* ── Sheet ── */}
          <motion.div
            key="dir-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 32,
              mass: 0.9,
            }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-gray-50 dark:bg-gray-900 rounded-t-3xl max-h-[92vh] flex flex-col shadow-2xl"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-0 flex-shrink-0">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>

            {/* ── Top Bar ── */}
            <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                {t.hotelDirectory}
              </h2>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </div>

            {/* ── Scrollable Content ── */}
            <div className="overflow-y-auto flex-1 px-4 pb-8">

              {/* ── Hotel Identity Card ── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 mb-4 text-white shadow-lg shadow-blue-600/20"
              >
                <div className="flex items-center gap-4 mb-4">
                  {/* Logo */}
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur overflow-hidden flex items-center justify-center flex-shrink-0 shadow-lg">
                    {settings.logo_url && !logoError ? (
                      <img
                        src={settings.logo_url}
                        alt={settings.hotel_name}
                        className="w-full h-full object-cover"
                        onError={() => setLogoError(true)}
                      />
                    ) : (
                      <span className="text-3xl font-bold text-white">
                        {settings.hotel_name?.charAt(0)?.toUpperCase() || 'H'}
                      </span>
                    )}
                  </div>

                  {/* Hotel name + tagline */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white leading-tight">
                      {settings.hotel_name || 'Grand Hotel'}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-yellow-300 text-yellow-300"
                        />
                      ))}
                    </div>
                    {settings.address && (
                      <p className="text-blue-200 text-xs mt-1.5 line-clamp-1">
                        📍 {settings.address}
                      </p>
                    )}
                  </div>
                </div>

                {/* About text */}
                {settings.about_text && (
                  <p className="text-blue-100 text-xs leading-relaxed border-t border-white/20 pt-3">
                    {settings.about_text}
                  </p>
                )}

                {/* Call reception button */}
                {settings.reception_phone && (
                  <motion.button
                    onClick={handleCallReception}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur py-2.5 rounded-xl transition-colors"
                  >
                    <Phone className="w-4 h-4 text-white" />
                    <span className="text-sm font-bold text-white">
                      {t.callReception}
                    </span>
                    <span className="text-blue-200 text-xs">
                      {settings.reception_phone}
                    </span>
                  </motion.button>
                )}
              </motion.div>

              {/* ── Reception & Check-in ── */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
              >
                <Section
                  icon={<Building2 className="w-4 h-4" />}
                  title={t.reception}
                  accent="blue"
                  defaultOpen={true}
                >
                  <div className="pt-2 space-y-0">
                    <InfoRow
                      label={t.receptionHours}
                      value={t.open24Hours}
                      icon={<Clock className="w-3 h-3" />}
                    />
                    <InfoRow
                      label={t.checkIn}
                      value={settings.check_in || '2:00 PM'}
                      icon={<BedDouble className="w-3 h-3" />}
                    />
                    <InfoRow
                      label={t.checkOut}
                      value={settings.check_out || '12:00 PM'}
                      icon={<BedDouble className="w-3 h-3" />}
                    />
                    <InfoRow
                      label={t.luggageStorage}
                      value={t.available}
                      icon={<Luggage className="w-3 h-3" />}
                    />
                    {settings.reception_phone && (
                      <InfoRow
                        label={t.phone}
                        value={settings.reception_phone}
                        icon={<Phone className="w-3 h-3" />}
                        onPress={handleCallReception}
                        highlight={true}
                      />
                    )}
                    {settings.address && (
                      <InfoRow
                        label={t.address}
                        value={settings.address}
                        icon={<MapPin className="w-3 h-3" />}
                      />
                    )}
                  </div>
                </Section>
              </motion.div>

              {/* ── Restaurant Hours ── */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.11 }}
              >
                <Section
                  icon={<UtensilsCrossed className="w-4 h-4" />}
                  title={t.restaurantHours}
                  accent="orange"
                >
                  <div className="pt-2 space-y-0">
                    <InfoRow
                      label={t.breakfast}
                      value="6:00 AM – 10:00 AM"
                      icon={<Clock className="w-3 h-3" />}
                    />
                    <InfoRow
                      label={t.lunch}
                      value="12:00 PM – 3:00 PM"
                      icon={<Clock className="w-3 h-3" />}
                    />
                    <InfoRow
                      label={t.dinner}
                      value="7:00 PM – 11:00 PM"
                      icon={<Clock className="w-3 h-3" />}
                    />
                    <InfoRow
                      label={t.roomService}
                      value={t.open24Hours}
                      icon={<Clock className="w-3 h-3" />}
                    />
                  </div>
                </Section>
              </motion.div>

              {/* ── Facilities ── */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 }}
              >
                <Section
                  icon={<Sparkles className="w-4 h-4" />}
                  title={t.facilities}
                  accent="purple"
                >
                  <div className="grid grid-cols-3 gap-2 pt-3">
                    <FacilityBadge
                      icon={<Wifi className="w-4 h-4" />}
                      label={t.wifi}
                    />
                    <FacilityBadge
                      icon={<Waves className="w-4 h-4" />}
                      label={t.pool}
                    />
                    <FacilityBadge
                      icon={<Dumbbell className="w-4 h-4" />}
                      label={t.gym}
                    />
                    <FacilityBadge
                      icon={<Sparkles className="w-4 h-4" />}
                      label={t.spa}
                    />
                    <FacilityBadge
                      icon={<Users className="w-4 h-4" />}
                      label={t.conferenceRoom}
                    />
                    <FacilityBadge
                      icon={<BedDouble className="w-4 h-4" />}
                      label={t.roomService}
                    />
                  </div>
                </Section>
              </motion.div>

              {/* ── Services ── */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.17 }}
              >
                <Section
                  icon={<Star className="w-4 h-4" />}
                  title={t.services}
                  accent="green"
                >
                  <div className="pt-2 space-y-0">
                    <InfoRow label={t.airportShuttle} value={t.available} />
                    <InfoRow label={t.laundryService} value={t.daily} />
                    <InfoRow label={t.wakeUpCall} value={t.onRequest} />
                    <InfoRow label={t.currencyExchange} value={t.reception} />
                    <InfoRow label={t.tourBooking} value={t.concierge} />
                  </div>
                </Section>
              </motion.div>

              {/* ── Emergency Contacts ── */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Section
                  icon={<ShieldAlert className="w-4 h-4" />}
                  title={t.emergency}
                  accent="red"
                >
                  <div className="pt-2 space-y-0">
                    <InfoRow
                      label={t.reception}
                      value={settings.reception_phone || '0'}
                      onPress={handleCallReception}
                      highlight={true}
                      icon={<Phone className="w-3 h-3" />}
                    />
                    <InfoRow
                      label={t.security}
                      value="Ext. 999"
                      icon={<Phone className="w-3 h-3" />}
                    />
                    <InfoRow
                      label={t.fireEmergency}
                      value="Ext. 911"
                      icon={<Phone className="w-3 h-3" />}
                    />
                    <InfoRow
                      label={t.medical}
                      value="Ext. 112"
                      icon={<Phone className="w-3 h-3" />}
                    />
                  </div>
                </Section>
              </motion.div>

              {/* ── Digital Menu Info ── */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
                className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 mb-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <UtensilsCrossed className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-bold text-blue-800 dark:text-blue-300">
                    {t.tagline}
                  </span>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                  {t.digitalMenuDesc}
                </p>
              </motion.div>

              {/* ── Hidden Admin Login Link ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center pb-4"
              >
                <button
                  onClick={() => {
                    onClose()
                    setTimeout(() => onAdminLoginClick(), 300)
                  }}
                  className="flex items-center gap-1.5 text-gray-300 dark:text-gray-700 hover:text-gray-400 dark:hover:text-gray-500 transition-colors text-xs py-2 px-4"
                >
                  <LogIn className="w-3 h-3" />
                  <span>{t.adminLogin}</span>
                </button>
              </motion.div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
