import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftRight, TrendingUp, TrendingDown, ChevronRight, X } from 'lucide-react'
import {
  ExchangeRate,
  fetchActiveExchangeRates,
  getMostRecentUpdateLabel,
} from '../../services/exchangeRatesService'

export const ExchangeRatesSection: React.FC = () => {
  const [rates, setRates] = useState<ExchangeRate[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    (async () => {
      setRates(await fetchActiveExchangeRates())
      setLoading(false)
    })()
  }, [])

  if (loading || rates.length === 0) return null

  const updatedLabel = getMostRecentUpdateLabel(rates)

  return (
    <div className="mb-6">

      {/* ── Header ── */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
              <ArrowLeftRight className="w-4 h-4 text-white" strokeWidth={2.4} />
            </div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Exchange Rates</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">{updatedLabel}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          </div>
        </div>

        {/* ── Horizontal cards ── */}
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory scrollbar-hide">
          {rates.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex-shrink-0 w-32 snap-start bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-lg leading-none">{r.flag_emoji}</span>
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{r.currency_code}</span>
              </div>
              <p className="text-lg font-extrabold text-gray-900 dark:text-white leading-tight">
                {r.rate.toLocaleString()}
              </p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium mb-1.5">{r.base_currency}</p>
              <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${r.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                {r.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {r.trend === 'up' ? '+' : '-'}{r.change_percent}%
              </span>
            </motion.div>
          ))}
        </div>

        {/* ── View all ── */}
        <button
          onClick={() => setShowAll(true)}
          className="flex items-center gap-0.5 text-xs font-bold text-blue-600 dark:text-blue-400 mt-3 ml-auto"
        >
          View all <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── "View all" bottom sheet ── */}
      <AnimatePresence>
        {showAll && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAll(false)}
              className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed bottom-0 left-0 right-0 z-[101] bg-white dark:bg-gray-900 rounded-t-3xl max-h-[80vh] flex flex-col shadow-2xl"
            >
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
              </div>

              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">All Exchange Rates</h3>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">{updatedLabel}</p>
                </div>
                <button
                  onClick={() => setShowAll(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="overflow-y-auto px-5 py-3 space-y-2">
                {rates.map(r => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-2xl p-3"
                  >
                    <span className="text-2xl flex-shrink-0">{r.flag_emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {r.currency_code}
                        {r.currency_name && (
                          <span className="text-xs font-normal text-gray-400 ml-1.5">{r.currency_name}</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {r.rate.toLocaleString()} {r.base_currency}
                      </p>
                    </div>
                    <span className={`flex items-center gap-1 text-sm font-bold flex-shrink-0 ${r.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                      {r.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {r.trend === 'up' ? '+' : '-'}{r.change_percent}%
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  )
}