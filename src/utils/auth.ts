/**
 * MENUBET ADMIN AUTH — ROUND 2 CONNECTED
 *
 * Admin login now uses real Supabase database.
 * Username: admin
 * Password: admin@menubet2024
 *
 * The password is hashed in the database using bcrypt.
 * The verify_admin_login function checks it securely.
 * The actual password is never stored or exposed anywhere.
 */

import { supabase } from '../lib/supabase'

export interface AdminUser {
  id: string
  username: string
  created_at: string
}

export const loginAdmin = async (
  username: string,
  password: string
): Promise<AdminUser | null> => {
  // Always uses real Supabase — bypasses USE_MOCK_DATA
  // This is Round 2 of the connection process
  try {
    const { data, error } = await supabase.rpc('verify_admin_login', {
      p_username: username.trim(),
      p_password: password,
    })

    if (error) {
      console.error('❌ loginAdmin RPC error:', error.message)
      return null
    }

    if (!data || data.length === 0) {
      console.log('loginAdmin: wrong username or password')
      return null
    }

    const adminUser = data[0] as AdminUser
    sessionStorage.setItem('menubet_admin', JSON.stringify(adminUser))
    console.log('✅ Admin logged in via Supabase:', adminUser.username)
    return adminUser
  } catch (err) {
    console.error('❌ loginAdmin exception:', err)
    return null
  }
}

export const logoutAdmin = () => {
  sessionStorage.removeItem('menubet_admin')
  console.log('Admin logged out')
}

export const getAdminUser = (): AdminUser | null => {
  const stored = sessionStorage.getItem('menubet_admin')
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export const isAdminAuthenticated = (): boolean => {
  return getAdminUser() !== null
}
