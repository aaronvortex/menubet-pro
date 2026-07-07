import { supabase } from '../lib/supabase'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface HomeSpecial {
  id: string
  title: string
  subtitle: string
  badge: string
  emoji: string
  image_url: string
  start_date: string | null
  end_date: string | null
  sort_order: number
  active: boolean
}

export interface HomePromotion {
  id: string
  title: string
  description: string
  image_url: string
  button_label: string
  target_page: 'menu' | 'services'
  target_category_id: string | null
  start_date: string | null
  end_date: string | null
  sort_order: number
  active: boolean
}

// ─────────────────────────────────────────────
// SCHEDULING HELPER — used by both the Home page (guest-facing filter)
// and the admin list (to show Live / Scheduled / Expired status)
// ─────────────────────────────────────────────

export const isWithinSchedule = (
  startDate: string | null,
  endDate: string | null
): boolean => {
  const now = new Date()
  if (startDate && new Date(startDate) > now) return false
  if (endDate && new Date(endDate) < now) return false
  return true
}

export type ScheduleStatus = 'live' | 'scheduled' | 'expired'

export const getScheduleStatus = (
  startDate: string | null,
  endDate: string | null
): ScheduleStatus => {
  const now = new Date()
  if (startDate && new Date(startDate) > now) return 'scheduled'
  if (endDate && new Date(endDate) < now) return 'expired'
  return 'live'
}

// ─────────────────────────────────────────────
// TODAY'S SPECIALS
// ─────────────────────────────────────────────

export const fetchSpecials = async (): Promise<HomeSpecial[]> => {
  try {
    const { data, error } = await supabase
      .from('home_specials')
      .select('*')
      .order('sort_order')
    if (error) { console.error('❌ fetchSpecials:', error.message); return [] }
    return data || []
  } catch (err) {
    console.error('❌ fetchSpecials exception:', err)
    return []
  }
}

// Guest-facing helper: only currently-active, schedule-valid specials, in order
export const fetchActiveSpecials = async (): Promise<HomeSpecial[]> => {
  const all = await fetchSpecials()
  return all
    .filter(s => s.active && isWithinSchedule(s.start_date, s.end_date))
    .sort((a, b) => a.sort_order - b.sort_order)
}

export const createSpecial = async (special: Partial<HomeSpecial>): Promise<void> => {
  if (!special.title) throw new Error('Title is required')
  const { error } = await supabase.from('home_specials').insert([{
    title: special.title.trim(),
    subtitle: special.subtitle?.trim() || '',
    badge: special.badge?.trim() || '',
    emoji: special.emoji?.trim() || '🍽️',
    image_url: special.image_url?.trim() || '',
    start_date: special.start_date || null,
    end_date: special.end_date || null,
    sort_order: special.sort_order ?? 0,
    active: special.active ?? true,
  }])
  if (error) { console.error('❌ createSpecial:', error.message); throw error }
}

export const updateSpecial = async (id: string, special: Partial<HomeSpecial>): Promise<void> => {
  const { error } = await supabase.from('home_specials').update({
    title: special.title?.trim(),
    subtitle: special.subtitle?.trim() || '',
    badge: special.badge?.trim() || '',
    emoji: special.emoji?.trim() || '🍽️',
    image_url: special.image_url?.trim() || '',
    start_date: special.start_date || null,
    end_date: special.end_date || null,
    sort_order: special.sort_order ?? 0,
    active: special.active ?? true,
  }).eq('id', id)
  if (error) { console.error('❌ updateSpecial:', error.message); throw error }
}

export const deleteSpecial = async (id: string): Promise<void> => {
  const { error } = await supabase.from('home_specials').delete().eq('id', id)
  if (error) { console.error('❌ deleteSpecial:', error.message); throw error }
}

// ─────────────────────────────────────────────
// PROMOTIONS
// ─────────────────────────────────────────────

export const fetchPromotions = async (): Promise<HomePromotion[]> => {
  try {
    const { data, error } = await supabase
      .from('home_promotions')
      .select('*')
      .order('sort_order')
    if (error) { console.error('❌ fetchPromotions:', error.message); return [] }
    return data || []
  } catch (err) {
    console.error('❌ fetchPromotions exception:', err)
    return []
  }
}

// Guest-facing helper: only currently-active, schedule-valid promotions, in order
export const fetchActivePromotions = async (): Promise<HomePromotion[]> => {
  const all = await fetchPromotions()
  return all
    .filter(p => p.active && isWithinSchedule(p.start_date, p.end_date))
    .sort((a, b) => a.sort_order - b.sort_order)
}

export const createPromotion = async (promo: Partial<HomePromotion>): Promise<void> => {
  if (!promo.title) throw new Error('Title is required')
  const { error } = await supabase.from('home_promotions').insert([{
    title: promo.title.trim(),
    description: promo.description?.trim() || '',
    image_url: promo.image_url?.trim() || '',
    button_label: promo.button_label?.trim() || 'Learn more',
    target_page: promo.target_page || 'menu',
    target_category_id: promo.target_category_id?.trim() || null,
    start_date: promo.start_date || null,
    end_date: promo.end_date || null,
    sort_order: promo.sort_order ?? 0,
    active: promo.active ?? true,
  }])
  if (error) { console.error('❌ createPromotion:', error.message); throw error }
}

export const updatePromotion = async (id: string, promo: Partial<HomePromotion>): Promise<void> => {
  const { error } = await supabase.from('home_promotions').update({
    title: promo.title?.trim(),
    description: promo.description?.trim() || '',
    image_url: promo.image_url?.trim() || '',
    button_label: promo.button_label?.trim() || 'Learn more',
    target_page: promo.target_page || 'menu',
    target_category_id: promo.target_category_id?.trim() || null,
    start_date: promo.start_date || null,
    end_date: promo.end_date || null,
    sort_order: promo.sort_order ?? 0,
    active: promo.active ?? true,
  }).eq('id', id)
  if (error) { console.error('❌ updatePromotion:', error.message); throw error }
}

export const deletePromotion = async (id: string): Promise<void> => {
  const { error } = await supabase.from('home_promotions').delete().eq('id', id)
  if (error) { console.error('❌ deletePromotion:', error.message); throw error }
}