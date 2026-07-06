import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Check, Phone, ShoppingCart } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useOnboarding } from '../../contexts/OnboardingContext'
import { LanguageCode } from '../../types/menu'

const STEP_GRADIENTS = [
  'bg-gradient-to-br from-blue-600 to-indigo-700',
  'bg-gradient-to-br from-violet-500 to-purple-700',
  'bg-gradient-to-br from-orange-500 to-pink-600',
  'bg-gradient-to-br from-green-500 to-emerald-700',
]

const STEP_BUTTON_GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-violet-400 to-purple-600',
  'from-orange-400 to-pink-500',
  'from-green-400 to-emerald-600',
]

export const OnboardingOverlay: React.FC = () => {
  const { t, language, setLanguage, languages } = useLanguage()
  const { isOnboardingOpen, completeOnboarding } = useOnboarding()
  const [currentStep, setCurrentStep] = useState(0)

  const isLastStep = currentStep === 3

  const handleNext = () => {
    if (isLastStep) {
      completeOnboarding()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    completeOnboarding()
  }

  const handleLanguageSelect = (code: LanguageCode) => {
    setLanguage(code)
  }

  const getStepContent = () => {
    switch (currentStep) {
      case 0:
        return {
          emoji: '🌍',
          title: 'Choose Your Language',
          subtitle: 'ቋንቋዎን ይምረጡ / اختر لغتك',
        }
      case 1:
        return {
          emoji: '👋',
          title: t.onboardingWelcome,
          subtitle: t.onboardingWelcomeDesc,
        }
      case 2:
        return {
          emoji: '🗂️',
          title: t.onboardingBrowse,
          subtitle: t.onboardingBrowseDesc,
        }
      case 3:
        return {
          emoji: '✅',
          title: t.onboardingOrder,
          subtitle: t.onboardingOrderDesc,
        }
      default:
        return { emoji: '', title: '', subtitle: '' }
    }
  }

  const stepContent = getStepContent()
  const gradientClass = STEP_GRADIENTS[currentStep]
  const buttonGradient = STEP_BUTTON_GRADIENTS[currentStep]

  return (
    <AnimatePresence>
      {isOnboardingOpen && (
        <motion.div
          key={`onboarding-step-${currentStep}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-[400] flex flex-col ${gradientClass}`}
        >
          {/* TOP: Progress dots — always visible, never shrinks */}
          <div className="flex-shrink-0 pt-10 pb-2 flex items-center justify-center gap-2">
            {[0, 1, 2, 3].map((step) => (
              <motion.div
                key={step}
                animate={{
                  width: step === currentStep ? 28 : 8,
                  opacity: step === currentStep ? 1 : 0.4,
                }}
                transition={{ duration: 0.25 }}
                className="h-2 rounded-full bg-white"
              />
            ))}
          </div>

          {/* MIDDLE: Scrollable content area */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="flex flex-col items-center px-6 py-4 min-h-full justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center w-full"
                >
                  {/* Big emoji */}
                  <motion.span
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="text-7xl mb-4 select-none"
                  >
                    {stepContent.emoji}
                  </motion.span>

                  {/* Title */}
                  <h2 className="text-2xl font-extrabold text-white text-center mb-2">
                    {stepContent.title}
                  </h2>

                  {/* Subtitle */}
                  <p className="text-sm text-white/80 text-center max-w-xs mb-5">
                    {stepContent.subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Language grid — Step 0 only */}
              {currentStep === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="w-full max-w-sm mb-4"
                >
                  <div className="grid grid-cols-4 gap-2">
                    {languages.map((lang) => {
                      const isSelected = lang.code === language
                      return (
                        <motion.button
                          key={lang.code}
                          onClick={() => handleLanguageSelect(lang.code as LanguageCode)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.92 }}
                          className={`relative flex flex-col items-center gap-1 p-2 rounded-2xl backdrop-blur-sm border transition-all ${
                            isSelected
                              ? 'bg-white/35 border-white/70 shadow-lg'
                              : 'bg-white/15 border-white/25'
                          }`}
                        >
                          <span className="text-xl leading-none">{lang.flag}</span>
                          <span className="text-[9px] font-semibold text-white/90 text-center leading-tight line-clamp-1 w-full">
                            {lang.nativeName}
                          </span>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                            >
                              <Check className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Illustration panel — Steps 1–3 */}
              {currentStep > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="w-full max-w-xs bg-white/15 rounded-3xl p-4 mb-4"
                >
                  {currentStep === 1 && (
                    <div className="space-y-3">
                      <div className="bg-white/20 rounded-xl px-4 py-2.5 flex items-center gap-2">
                        <span className="text-lg">🏨</span>
                        <span className="text-sm font-semibold text-white">Grand Hotel</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap justify-center">
                        {['🍜 Soups', '🥤 Drinks', '🍖 Mains', '🍰 Desserts'].map((cat, i) => (
                          <motion.div
                            key={cat}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                              i === 0
                                ? 'bg-white text-purple-700'
                                : 'bg-white/30 text-white border border-white/40'
                            }`}
                          >
                            {cat}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-white/20 rounded-xl p-3">
                        <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center text-2xl">🍜</div>
                        <div className="flex-1">
                          <div className="h-3 bg-white/40 rounded-full w-20 mb-1.5" />
                          <div className="h-2 bg-white/30 rounded-full w-16" />
                        </div>
                        <motion.div
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.5 }}
                          className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow"
                        >
                          <ShoppingCart className="w-4 h-4 text-orange-500" />
                        </motion.div>
                      </div>
                      <div className="flex items-center gap-3 bg-white/20 rounded-xl p-3">
                        <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center text-2xl">🥤</div>
                        <div className="flex-1">
                          <div className="h-3 bg-white/40 rounded-full w-24 mb-1.5" />
                          <div className="h-2 bg-white/30 rounded-full w-14" />
                        </div>
                        <div className="w-9 h-9 rounded-full bg-white/50 flex items-center justify-center">
                          <ShoppingCart className="w-4 h-4 text-white/60" />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          className="w-16 h-16 rounded-full bg-green-400/30 flex items-center justify-center"
                        >
                          <Phone className="w-8 h-8 text-white" />
                        </motion.div>
                      </div>
                      <motion.button
                        animate={{ scale: [1, 1.03, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }}
                        className="w-full bg-green-500 rounded-xl px-4 py-3 flex items-center justify-center gap-2 shadow-lg"
                      >
                        <Phone className="w-4 h-4 text-white" />
                        <span className="text-sm font-bold text-white">Call Reception</span>
                      </motion.button>
                      <p className="text-xs text-white/70 text-center">Tap order → calls reception</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* BOTTOM: Buttons — flex-shrink-0 so they are ALWAYS visible */}
          <div className="flex-shrink-0 px-6 pb-10 pt-3 bg-gradient-to-t from-black/20 to-transparent">
            {/* Main Next/Get Started button */}
            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-3xl bg-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg mb-3"
            >
              <span className={`bg-gradient-to-r ${buttonGradient} bg-clip-text text-transparent font-bold`}>
                {isLastStep ? t.getStarted : t.next}
              </span>
              {isLastStep ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </motion.button>

            {/* Back and Skip row */}
            <div className="flex items-center justify-between">
              <motion.button
                onClick={handleBack}
                initial={{ opacity: 0 }}
                animate={{ opacity: currentStep > 0 ? 1 : 0 }}
                className="text-white/70 text-xs font-semibold hover:text-white transition-colors px-4 py-2"
                disabled={currentStep === 0}
              >
                ← {t.back}
              </motion.button>

              {!isLastStep && (
                <motion.button
                  onClick={handleSkip}
                  className="text-white/60 text-xs font-semibold hover:text-white transition-colors px-4 py-2"
                >
                  {t.skip} →
                </motion.button>
              )}
            </div>

            {/* Step counter */}
            <p className="text-center text-white/40 text-xs mt-2">
              {currentStep + 1} / 4
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
