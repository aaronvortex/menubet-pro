import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
  console.error('❌ Supabase URL not set — check vite.config.ts')
}
if (!supabaseAnonKey || supabaseAnonKey.includes('placeholder')) {
  console.error('❌ Supabase Anon Key not set — check vite.config.ts')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})

console.log('✅ Supabase client ready — Task 1 Hotel Settings connected')
