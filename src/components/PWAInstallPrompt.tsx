import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Share, PlusSquare, Download } from 'lucide-react'

const DISMISS_KEY = 'pwa_install_dismissed_at'
const DISMISS_DAYS = 14

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  )
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
}

function wasDismissedRecently(): boolean {
  const raw = localStorage.getItem(DISMISS_KEY)
  if (!raw) return false
  const dismissedAt = parseInt(raw, 10)
  if (Number.isNaN(dismissedAt)) return false
  const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24)
  return daysSince < DISMISS_DAYS
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showIosHint, setShowIosHint] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isStandalone() || wasDismissedRecently()) return

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      const t = setTimeout(() => setVisible(true), 2500)
      return () => clearTimeout(t)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    // iOS Safari never fires beforeinstallprompt — show manual instructions instead
    if (isIos()) {
      const t = setTimeout(() => {
        setShowIosHint(true)
        setVisible(true)
      }, 2500)
      return () => {
        clearTimeout(t)
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      }
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  }, [])

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString())
    setVisible(false)
  }

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted' || outcome === 'dismissed') {
      localStorage.setItem(DISMISS_KEY, Date.now().toString())
    }
    setDeferredPrompt(null)
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="pwa-install-prompt"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed bottom-24 inset-x-4 z-[60] mx-auto max-w-md"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 flex items-start gap-3 border border-gray-100 dark:border-gray-700">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2422EB] to-[#0F8AF0] flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Install this app
              </h3>

              {showIosHint ? (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed flex flex-wrap items-center gap-1">
                  Tap <Share className="w-3.5 h-3.5 inline text-blue-500" /> then
                  <span className="inline-flex items-center gap-1 font-semibold text-gray-700 dark:text-gray-300">
                    "Add to Home Screen" <PlusSquare className="w-3.5 h-3.5" />
                  </span>
                </p>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  Add to your home screen for quick, full-screen access.
                </p>
              )}

              {!showIosHint && (
                <motion.button
                  onClick={handleInstall}
                  whileTap={{ scale: 0.96 }}
                  className="mt-2.5 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                >
                  Install
                </motion.button>
              )}
            </div>

            <button
              onClick={handleDismiss}
              aria-label="Dismiss"
              className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}