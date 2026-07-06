import React from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <motion.div
      onClick={toggleTheme}
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center cursor-pointer"
      style={{ width: 56, height: 30 }}
      aria-label="Toggle theme"
    >
      {/* Track */}
      <div
        className={`absolute inset-0 rounded-full transition-colors duration-300 ${
          isDark
            ? 'bg-gray-700'
            : 'bg-blue-100 border border-blue-200'
        }`}
      />

      {/* Sliding thumb with icon */}
      <motion.div
        animate={{ x: isDark ? 28 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`absolute top-[3px] w-6 h-6 rounded-full flex items-center justify-center shadow-md z-10 ${
          isDark ? 'bg-gray-500' : 'bg-white'
        }`}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-blue-300" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-yellow-500" />
        )}
      </motion.div>
    </motion.div>
  )
}
