import React from 'react'
import { motion } from 'framer-motion'
import homeIcon from '../assets/nav/home.png'
import menuIcon from '../assets/nav/menu.png'
import servicesIcon from '../assets/nav/services.png'
import infoIcon from '../assets/nav/info.png'

export type BottomNavTab = 'home' | 'menu' | 'services' | 'info'

interface BottomNavProps {
  activeTab: BottomNavTab
  onHomeClick: () => void
  onMenuClick: () => void
  onServicesClick: () => void
  onInfoClick: () => void
}

interface TabConfig {
  key: BottomNavTab
  label: string
  icon: string
  onClick: () => void
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onHomeClick,
  onMenuClick,
  onServicesClick,
  onInfoClick,
}) => {
  const tabs: TabConfig[] = [
    { key: 'home', label: 'Home', icon: homeIcon, onClick: onHomeClick },
    { key: 'menu', label: 'Menu', icon: menuIcon, onClick: onMenuClick },
    { key: 'services', label: 'Services', icon: servicesIcon, onClick: onServicesClick },
    { key: 'info', label: 'Info', icon: infoIcon, onClick: onInfoClick },
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="fixed bottom-3 inset-x-4 z-50 mx-auto max-w-md"
    >
      <div className="flex items-stretch justify-around h-16 rounded-full bg-[#02123C] shadow-2xl">
        {tabs.map(({ key, label, icon, onClick }) => {
          const isActive = activeTab === key

          return (
            <motion.button
              key={key}
              type="button"
              onClick={onClick}
              aria-label={label}
              whileTap={{ scale: 1.1, y: -8 }}
              transition={{ type: 'spring', stiffness: 500, damping: 16 }}
              className="relative flex-1 flex flex-col items-center justify-end gap-1 pb-2 focus:outline-none"
            >
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className={`relative flex items-center justify-center rounded-2xl ${
                  isActive
                    ? '-mt-6 w-14 h-14 bg-white/15 backdrop-blur-sm shadow-lg'
                    : 'w-9 h-9'
                }`}
              >
                <img
                  src={icon}
                  alt={label}
                  className={isActive ? 'w-8 h-8 object-contain' : 'w-6 h-6 object-contain opacity-60'}
                />
              </motion.div>

              <span
                className={`text-[11px] leading-none ${
                  isActive ? 'text-white font-semibold' : 'text-slate-400 font-medium'
                }`}
              >
                {label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </motion.nav>
  )
}