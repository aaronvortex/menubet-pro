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

export type AnnouncementPriority = 'normal' | 'important' | 'urgent'

export interface HomeAnnouncement {
  id: string
  text: string
  time_label: string
  priority: AnnouncementPriority
  start_date: string | null
  end_date: string | null
  sort_order: number
  active: boolean
}

export interface HomeSettings {
  id: string
  greeting: string
  welcome_message: string
  section_title_offers: string
  section_title_popular_dishes: string
  section_title_popular_services: string
  section_title_announcements: string
  search_enabled: boolean
}

export interface HomePopularDish {
  id: string
  item_id: string
  sort_order: number
  active: boolean
}

export interface HomePopularService {
  id: string
  category_id: string
  sort_order: number
  active: boolean
}

const DEFAULT_HOME_SETTINGS: HomeSettings = {
  id: 'default',
  greeting: 'Welcome to our hotel 👋',
  welcome_message: "We're delighted to serve you.",
  section_title_offers: "Today's Offers",
  section_title_popular_dishes: 'Popular Dishes',
  section_title_popular_services: 'Popular Services',
  section_title_announcements: 'Announcements',
  search_enabled: true,
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
    const { data, error } = await supabase.from('home_specials').select('*').order('sort_order')
    if (error) { console.error('❌ fetchSpecials:', error.message); return [] }
    return data || []
  } catch (err) {
    console.error('❌ fetchSpecials exception:', err)
    return []
  }
}

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
    const { data, error } = await supabase.from('home_promotions').select('*').order('sort_order')
    if (error) { console.error('❌ fetchPromotions:', error.message); return [] }
    return data || []
  } catch (err) {
    console.error('❌ fetchPromotions exception:', err)
    return []
  }
}

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

// ─────────────────────────────────────────────
// ANNOUNCEMENTS
// ─────────────────────────────────────────────

export const fetchAnnouncements = async (): Promise<HomeAnnouncement[]> => {
  try {
    const { data, error } = await supabase.from('home_announcements').select('*').order('sort_order')
    if (error) { console.error('❌ fetchAnnouncements:', error.message); return [] }
    return data || []
  } catch (err) {
    console.error('❌ fetchAnnouncements exception:', err)
    return []
  }
}

export const fetchActiveAnnouncements = async (): Promise<HomeAnnouncement[]> => {
  const all = await fetchAnnouncements()
  return all
    .filter(a => a.active && isWithinSchedule(a.start_date, a.end_date))
    .sort((a, b) => a.sort_order - b.sort_order)
}

export const createAnnouncement = async (item: Partial<HomeAnnouncement>): Promise<void> => {
  if (!item.text) throw new Error('Text is required')
  const { error } = await supabase.from('home_announcements').insert([{
    text: item.text.trim(),
    time_label: item.time_label?.trim() || '',
    priority: item.priority || 'normal',
    start_date: item.start_date || null,
    end_date: item.end_date || null,
    sort_order: item.sort_order ?? 0,
    active: item.active ?? true,
  }])
  if (error) { console.error('❌ createAnnouncement:', error.message); throw error }
}

export const updateAnnouncement = async (id: string, item: Partial<HomeAnnouncement>): Promise<void> => {
  const { error } = await supabase.from('home_announcements').update({
    text: item.text?.trim(),
    time_label: item.time_label?.trim() || '',
    priority: item.priority || 'normal',
    start_date: item.start_date || null,
    end_date: item.end_date || null,
    sort_order: item.sort_order ?? 0,
    active: item.active ?? true,
  }).eq('id', id)
  if (error) { console.error('❌ updateAnnouncement:', error.message); throw error }
}

export const deleteAnnouncement = async (id: string): Promise<void> => {
  const { error } = await supabase.from('home_announcements').delete().eq('id', id)
  if (error) { console.error('❌ deleteAnnouncement:', error.message); throw error }
}

// ─────────────────────────────────────────────
// HOME SETTINGS — greeting, welcome text, custom section titles, search toggle
// ─────────────────────────────────────────────

export const fetchHomeSettings = async (): Promise<HomeSettings> => {
  try {
    const { data, error } = await supabase
      .from('home_settings')
      .select('*')
      .eq('id', 'default')
      .maybeSingle()
    if (error || !data) {
      if (error) console.error('❌ fetchHomeSettings:', error.message)
      return DEFAULT_HOME_SETTINGS
    }
    return data
  } catch (err) {
    console.error('❌ fetchHomeSettings exception:', err)
    return DEFAULT_HOME_SETTINGS
  }
}

export const updateHomeSettings = async (settings: Partial<HomeSettings>): Promise<void> => {
  const { error } = await supabase.from('home_settings').update({
    greeting: settings.greeting,
    welcome_message: settings.welcome_message,
    section_title_offers: settings.section_title_offers,
    section_title_popular_dishes: settings.section_title_popular_dishes,
    section_title_popular_services: settings.section_title_popular_services,
    section_title_announcements: settings.section_title_announcements,
    search_enabled: settings.search_enabled,
    updated_at: new Date().toISOString(),
  }).eq('id', 'default')
  if (error) { console.error('❌ updateHomeSettings:', error.message); throw error }
}

// ─────────────────────────────────────────────
// POPULAR DISHES — admin-curated selection + order, referencing menu item IDs
// ─────────────────────────────────────────────

export const fetchPopularDishes = async (): Promise<HomePopularDish[]> => {
  try {
    const { data, error } = await supabase.from('home_popular_dishes').select('*').order('sort_order')
    if (error) { console.error('❌ fetchPopularDishes:', error.message); return [] }
    return data || []
  } catch (err) {
    console.error('❌ fetchPopularDishes exception:', err)
    return []
  }
}

// Guest-facing helper: ordered list of active item IDs to feature on Home.
// Returns [] if the admin hasn't curated a list yet (Home falls back to rating-sort).
export const fetchActivePopularDishIds = async (): Promise<string[]> => {
  const all = await fetchPopularDishes()
  return all
    .filter(d => d.active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(d => d.item_id)
}

// Replace-all: admin picks a fresh ordered list, we swap the whole table content
export const setPopularDishes = async (itemIds: string[]): Promise<void> => {
  const { error: delError } = await supabase
    .from('home_popular_dishes')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')
  if (delError) { console.error('❌ setPopularDishes (clear):', delError.message); throw delError }

  if (itemIds.length === 0) return

  const rows = itemIds.map((item_id, index) => ({ item_id, sort_order: index, active: true }))
  const { error } = await supabase.from('home_popular_dishes').insert(rows)
  if (error) { console.error('❌ setPopularDishes (insert):', error.message); throw error }
}

// ─────────────────────────────────────────────
// POPULAR SERVICES — admin-curated selection + order, referencing category IDs
// ─────────────────────────────────────────────

export const fetchPopularServices = async (): Promise<HomePopularService[]> => {
  try {
    const { data, error } = await supabase.from('home_popular_services').select('*').order('sort_order')
    if (error) { console.error('❌ fetchPopularServices:', error.message); return [] }
    return data || []
  } catch (err) {
    console.error('❌ fetchPopularServices exception:', err)
    return []
  }
}

// Guest-facing helper: ordered list of active category IDs to feature on Home.
// Returns [] if the admin hasn't curated a list yet (Home falls back to showing all).
export const fetchActivePopularServiceCategoryIds = async (): Promise<string[]> => {
  const all = await fetchPopularServices()
  return all
    .filter(s => s.active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(s => s.category_id)
}

export const setPopularServices = async (categoryIds: string[]): Promise<void> => {
  const { error: delError } = await supabase
    .from('home_popular_services')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')
  if (delError) { console.error('❌ setPopularServices (clear):', delError.message); throw delError }

  if (categoryIds.length === 0) return

  const rows = categoryIds.map((category_id, index) => ({ category_id, sort_order: index, active: true }))
  const { error } = await supabase.from('home_popular_services').insert(rows)
  if (error) { console.error('❌ setPopularServices (insert):', error.message); throw error }
}