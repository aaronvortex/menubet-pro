import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  AlertCircle,
  ChevronLeft,
} from 'lucide-react'
import { useAdmin } from '../../contexts/AdminContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { loginAdmin } from '../../utils/auth'

interface AdminLoginProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: () => void
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const { setAdmin } = useAdmin()
  const { t } = useLanguage()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string
    password?: string
  }>({})

  const resetForm = () => {
    setUsername('')
    setPassword('')
    setShowPassword(false)
    setError('')
    setFieldErrors({})
    setIsLoading(false)
  }

  const handleClose = () => {
    if (!isLoading) {
      resetForm()
      onClose()
    }
  }

  const validate = (): boolean => {
    const errors: { username?: string; password?: string } = {}
    if (!username.trim()) {
      errors.username = 'Username is required'
    }
    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 4) {
      errors.password = 'Password must be at least 4 characters'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleLogin = async () => {
    setError('')
    if (!validate()) return

    setIsLoading(true)
    try {
      const adminUser = await loginAdmin(username.trim(), password)
      if (adminUser) {
        setAdmin(adminUser)
        resetForm()
        onLoginSuccess()
      } else {
        setError(t.invalidCredentials)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="login-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 z-[200] backdrop-blur-sm"
          />

          {/* ── Login Card ── */}
          <motion.div
            key="login-card"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{
              type: 'spring',
              stiffness: 320,
              damping: 28,
            }}
            className="fixed inset-x-4 inset-y-6 z-[201] max-w-sm mx-auto flex flex-col justify-center"
          >
            <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-full">

              {/* ── Gradient Header ── */}
              <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 px-6 pt-8 pb-8 relative text-center">

                {/* Back/Close button */}
                <motion.button
                  onClick={handleClose}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </motion.button>

                {/* Shield icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    delay: 0.1,
                  }}
                  className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur mx-auto mb-4 flex items-center justify-center"
                >
                  <ShieldCheck className="w-8 h-8 text-white" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-xl font-bold text-white mb-1"
                >
                  {t.loginTitle}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-blue-200 text-xs"
                >
                  MenuBet Admin Panel
                </motion.p>
              </div>

              {/* ── Form Body ── */}
              <div className="px-6 py-6 space-y-4 overflow-y-auto flex-1">

                {/* ── Error Banner ── */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -8, height: 0 }}
                      className="flex items-center gap-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3"
                    >
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <p className="text-xs font-medium text-red-700 dark:text-red-400">
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Username Field ── */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">
                    {t.username}
                  </label>
                  <div className={`flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3.5 border-2 transition-colors ${
                    fieldErrors.username
                      ? 'border-red-400 dark:border-red-500'
                      : 'border-transparent focus-within:border-blue-500 dark:focus-within:border-blue-400'
                  }`}>
                    <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={username}
                      onChange={e => {
                        setUsername(e.target.value)
                        if (fieldErrors.username) {
                          setFieldErrors(prev => ({
                            ...prev,
                            username: undefined,
                          }))
                        }
                        if (error) setError('')
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter username"
                      autoCapitalize="none"
                      autoCorrect="off"
                      className="flex-1 bg-transparent text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none"
                    />
                  </div>
                  {fieldErrors.username && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-500 mt-1.5 px-1"
                    >
                      {fieldErrors.username}
                    </motion.p>
                  )}
                </div>

                {/* ── Password Field ── */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">
                    {t.password}
                  </label>
                  <div className={`flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3.5 border-2 transition-colors ${
                    fieldErrors.password
                      ? 'border-red-400 dark:border-red-500'
                      : 'border-transparent focus-within:border-blue-500 dark:focus-within:border-blue-400'
                  }`}>
                    <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => {
                        setPassword(e.target.value)
                        if (fieldErrors.password) {
                          setFieldErrors(prev => ({
                            ...prev,
                            password: undefined,
                          }))
                        }
                        if (error) setError('')
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter password"
                      className="flex-1 bg-transparent text-sm text-gray-800 dark:text-white placeholder-gray-400 outline-none"
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      whileTap={{ scale: 0.85 }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </motion.button>
                  </div>
                  {fieldErrors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-500 mt-1.5 px-1"
                    >
                      {fieldErrors.password}
                    </motion.p>
                  )}
                </div>

                {/* ── Login Button ── */}
                <motion.button
                  onClick={handleLogin}
                  disabled={isLoading}
                  whileHover={!isLoading ? { scale: 1.01 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                  className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 ${
                    isLoading
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.span
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        {t.signingIn}
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <LogIn className="w-4 h-4" />
                        {t.signIn}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Footer note */}
                <p className="text-center text-xs text-gray-400 dark:text-gray-600 pb-1">
                  This area is for hotel staff only
                </p>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
