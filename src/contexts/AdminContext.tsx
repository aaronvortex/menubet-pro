import React, { createContext, useContext, useState } from 'react'

interface AdminUser {
  id: string
  username: string
  created_at: string
}

interface AdminContextType {
  admin: AdminUser | null
  setAdmin: (user: AdminUser | null) => void
  logout: () => void
  isAuthenticated: boolean
}

const AdminContext = createContext<AdminContextType>({
  admin: null,
  setAdmin: () => {},
  logout: () => {},
  isAuthenticated: false,
})

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdminState] = useState<AdminUser | null>(() => {
    const stored = sessionStorage.getItem('menubet_admin')
    if (!stored) return null
    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  })

  const setAdmin = (user: AdminUser | null) => {
    setAdminState(user)
    if (user) {
      sessionStorage.setItem('menubet_admin', JSON.stringify(user))
    } else {
      sessionStorage.removeItem('menubet_admin')
    }
  }

  const logout = () => {
    setAdmin(null)
  }

  return (
    <AdminContext.Provider
      value={{
        admin,
        setAdmin,
        logout,
        isAuthenticated: admin !== null,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)
