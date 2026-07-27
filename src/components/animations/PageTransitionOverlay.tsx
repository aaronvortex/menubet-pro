import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Soup, Beef, CupSoda, UtensilsCrossed, Wine, Sandwich } from 'lucide-react'

// ── Custom Chef Icon (white outline, matches brand illustration) ──────────

const ChefIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 200 220"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Hat */}
    <path
      d="M70 70 C58 42, 90 18, 100 35 C106 12, 136 14, 135 40 C152 28, 168 50, 150 70 C157 80, 150 96, 135 96 L75 96 C58 96, 56 80, 70 70 Z"
      stroke="white"
      strokeWidth="6"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <rect x="70" y="93" width="68" height="15" rx="7" stroke="white" strokeWidth="6" />
    {/* Face */}
    <circle cx="104" cy="128" r="23" stroke="white" strokeWidth="6" />
    {/* Mustache */}
    <path
      d="M88 135 C94 142, 100 142, 104 136 C108 142, 114 142, 120 135"
      stroke="white"
      strokeWidth="6"
      strokeLinecap="round"
    />
    {/* Body */}
    <path
      d="M58 214 C58 172, 80 152, 104 152 C128 152, 150 172, 150 214"
      stroke="white"
      strokeWidth="6"
      strokeLinecap="round"
    />
    {/* Buttons */}
    <circle cx="104" cy="174" r="3.5" fill="white" />
    <circle cx="104" cy="190" r="3.5" fill="white" />
    {/* Arm holding tray */}
    <path d="M138 178 C150 168, 158 166, 163 154" stroke="white" strokeWidth="6" strokeLinecap="round" />
    <ellipse cx="171" cy="149" rx="29" ry="8" stroke="white" strokeWidth="6" />
    <path d="M148 149 C148 126, 196 126, 196 149" stroke="white" strokeWidth="6" strokeLinecap="round" />
    {/* Steam */}
    <motion.path
      d="M163 118 C158 107, 169 101, 163 90"
      stroke="white"
      strokeWidth="4.5"
      strokeLinecap="round"
      opacity="0.85"
      animate={{ y: [0, -4, 0], opacity: [0.85, 0.4, 0.85] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.path
      d="M180 116 C175 105, 186 99, 180 88"
      stroke="white"
      strokeWidth="4.5"
      strokeLinecap="round"
      opacity="0.85"
      animate={{ y: [0, -4, 0], opacity: [0.85, 0.4, 0.85] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
    />
  </svg>
)

// ── Sparkle Decoration ──────────────────────────────────────────────────────

const Sparkle: React.FC<{
  style?: React.CSSProperties
  size?: number
  delay?: number
}> = ({ style, size = 14, delay = 0 }) => (
  <motion.svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    style={style}
    className="absolute text-white/50"
    animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.85, 1.1, 0.85] }}
    transition={{ duration: 2.2, repeat: Infinity, delay, ease: 'easeInOut' }}
  >
    <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" fill="currentColor" />
  </motion.svg>
)

// ── Background Food Icon Pattern ────────────────────────────────────────────

const BackgroundPattern: React.FC = () => (
  <div className="absolute inset-0 opacity-[0.08] pointer-events-none overflow-hidden">
    <Soup className="absolute top-[10%] left-[7%] w-16 h-16 text-white" strokeWidth={1} />
    <Beef className="absolute top-[12%] right-[9%] w-16 h-16 text-white rotate-12" strokeWidth={1} />
    <CupSoda className="absolute top-[48%] left-[4%] w-14 h-14 text-white" strokeWidth={1} />
    <UtensilsCrossed className="absolute top-[48%] right-[5%] w-14 h-14 text-white" strokeWidth={1} />
    <Wine className="absolute bottom-[14%] left-[9%] w-14 h-14 text-white" strokeWidth={1} />
    <Sandwich className="absolute bottom-[12%] right-[11%] w-16 h-16 text-white -rotate-6" strokeWidth={1} />
  </div>
)

// ── Main Page Transition Overlay ────────────────────────────────────────────

interface PageTransitionOverlayProps {
  isVisible: boolean
}

export const PageTransitionOverlay: React.FC<PageTransitionOverlayProps> = ({
  isVisible,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="page-transition-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1a237e 0%, #0d1257 100%)',
          }}
        >
          <BackgroundPattern />

          {/* Concentric decorative rings */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.15 }}
            transition={{ duration: 0.5 }}
            className="absolute w-[400px] h-[400px] rounded-full border border-white/20"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="absolute w-[320px] h-[320px] rounded-full border border-dashed border-white/15"
          />

          {/* Sparkles around the content */}
          <Sparkle style={{ top: '22%', left: '28%' }} size={16} delay={0} />
          <Sparkle style={{ top: '20%', right: '26%' }} size={12} delay={0.4} />
          <Sparkle style={{ bottom: '24%', left: '24%' }} size={14} delay={0.8} />
          <Sparkle style={{ bottom: '22%', right: '27%' }} size={18} delay={1.2} />

          {/* Main content */}
          <div className="relative flex flex-col items-center px-6">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="mb-5"
            >
              <ChefIcon className="w-24 h-24 sm:w-28 sm:h-28" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.35 }}
              className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
            >
              Tewodros Belay 🏨
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.35 }}
              className="text-base sm:text-lg text-blue-200 font-medium mt-1"
            >
              MenuBet Hotel Platform
            </motion.p>

            {/* Loading bar */}
            <div className="w-44 sm:w-48 h-1.5 bg-white/15 rounded-full overflow-hidden mt-7 relative">
              <motion.div
                className="h-full w-1/2 rounded-full bg-gradient-to-r from-transparent via-white to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
