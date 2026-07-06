import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, ShoppingCart, ChevronDown, Check } from 'lucide-react'
import { useHotelSettings } from '../contexts/HotelSettingsContext'
import { useLanguage } from '../contexts/LanguageContext'
import { ThemeToggle } from './ThemeToggle'
import { LanguageCode } from '../types/menu'

interface HeaderProps {
  onLogoClick?: () => void
  cartItemsCount: number
  onCartClick: () => void
}

const CompactLanguageSwitcher: React.FC = () => {
  const { language, setLanguage, languages } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const currentLang = languages.find(l => l.code === language)

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(prev => !prev)}
        whileTap={{ scale: 0.92 }}
        className="flex items-center gap-1 px-2 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <span className="text-sm leading-none">{currentLang?.flag}</span>
        <ChevronDown
          className={`w-2.5 h-2.5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-[150]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-[151]"
            >
              <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Language
                </p>
              </div>
              <div className="py-1 max-h-64 overflow-y-auto">
                {languages.map((lang, i) => {
                  const selected = lang.code === language
                  return (
                    <motion.button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as LanguageCode)
                        setIsOpen(false)
                      }}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.025 }}
                      className={`w-full flex items-center justify-between px-3 py-2 transition-colors ${
                        selected
                          ? 'bg-blue-50 dark:bg-blue-900/20'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{lang.flag}</span>
                        <div className="text-left">
                          <p className={`text-xs font-semibold leading-tight ${
                            selected
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-800 dark:text-gray-200'
                          }`}>
                            {lang.nativeName}
                          </p>
                          <p className="text-[10px] text-gray-400 leading-tight">
                            {lang.name}
                          </p>
                        </div>
                      </div>
                      {selected && (
                        <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick, cartItemsCount, onCartClick }) => {
  const { settings } = useHotelSettings()
  const { t } = useLanguage()
  const [logoError, setLogoError] = useState(false)

  const handleCallReception = () => {
    if (settings.reception_phone) {
      window.location.href = `tel:${settings.reception_phone}`
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 transition-colors duration-300"
    >
      <div className="flex items-center justify-between px-3 py-2.5">

            <button
              type="button"
              onClick={onLogoClick}
              className="flex items-center gap-3 flex-1 min-w-0 text-left"
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 280 }}
                className="flex-shrink-0 w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center shadow-lg"
              >
                {settings.logo_url && !logoError ? (
                  <img
                    src={settings.logo_url}
                    alt={settings.hotel_name}
                    className="w-full h-full object-cover"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <span className="text-white font-bold text-2xl">
                    {settings.hotel_name?.charAt(0)?.toUpperCase() || 'H'}
                  </span>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="min-w-0 flex-1"
              >
                <h1 className="text-base font-extrabold text-gray-900 dark:text-white leading-tight line-clamp-2 max-w-[190px] sm:max-w-[240px]">
                  {settings.hotel_name || 'MenuBet'}
                </h1>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 leading-tight mt-0.5">
                  {t.tagline}
                </p>
              </motion.div>
            </button>

            <div className="flex items-center gap-2 flex-shrink-0 ml-2">

              {settings.reception_phone && (
                <motion.button
                  onClick={handleCallReception}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.18 }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
                  aria-label={t.callReception}
                  title={settings.reception_phone}
                >
                  <motion.div
                    animate={{ rotate: [0, -12, 12, -12, 0] }}
                    transition={{ duration: 0.7, repeat: Infinity, repeatDelay: 5 }}
                  >
                    <Phone className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  </motion.div>
                </motion.button>
              )}

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <CompactLanguageSwitcher />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.22 }}
              >
                <ThemeToggle />
              </motion.div>

              <motion.button
                onClick={onCartClick}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="relative w-9 h-9 rounded-full bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 flex items-center justify-center shadow-sm transition-colors"
                aria-label="Open cart"
              >
                <ShoppingCart className="w-4 h-4 text-white" />
                <AnimatePresence>
                  {cartItemsCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-yellow-400 text-gray-900 text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow"
                    >
                      {cartItemsCount > 99 ? '99+' : cartItemsCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

            </div>
          </div>
      </motion.header>
    )
  }
