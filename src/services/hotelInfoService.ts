import { supabase } from '../lib/supabase'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type HotelInfoSection = 'reception' | 'restaurant' | 'facilities' | 'services' | 'emergency'

export interface HotelInfoItem {
  id: string
  section: HotelInfoSection
  label: string
  value: string
  icon: string
  sort_order: number
  active: boolean
}

// ─────────────────────────────────────────────
// READ
// ─────────────────────────────────────────────

export const fetchHotelInfoItems = async (): Promise<HotelInfoItem[]> => {
  try {
    const { data, error } = await supabase
      .from('hotel_info_items')
      .select('*')
      .order('sort_order')
    if (error) { console.error('❌ fetchHotelInfoItems:', error.message); return [] }
    return data || []
  } catch (err) {
    console.error('❌ fetchHotelInfoItems exception:', err)
    return []
  }
}

// Guest-facing helper: only active items for a given section, in admin order
export const fetchActiveHotelInfoItems = async (section: HotelInfoSection): Promise<HotelInfoItem[]> => {
  const all = await fetchHotelInfoItems()
  return all
    .filter(i => i.section === section && i.active)
    .sort((a, b) => a.sort_order - b.sort_order)
}

// ─────────────────────────────────────────────
// WRITE
// ─────────────────────────────────────────────

export const createHotelInfoItem = async (item: Partial<HotelInfoItem>): Promise<void> => {
  if (!item.section) throw new Error('Section is required')
  if (!item.label) throw new Error('Label is required')
  const { error } = await supabase.from('hotel_info_items').insert([{
    section: item.section,
    label: item.label.trim(),
    value: item.value?.trim() || '',
    icon: item.icon?.trim() || '',
    sort_order: item.sort_order ?? 0,
    active: item.active ?? true,
  }])
  if (error) { console.error('❌ createHotelInfoItem:', error.message); throw error }
}

export const updateHotelInfoItem = async (id: string, item: Partial<HotelInfoItem>): Promise<void> => {
  const { error } = await supabase.from('hotel_info_items').update({
    section: item.section,
    label: item.label?.trim(),
    value: item.value?.trim() || '',
    icon: item.icon?.trim() || '',
    sort_order: item.sort_order ?? 0,
    active: item.active ?? true,
  }).eq('id', id)
  if (error) { console.error('❌ updateHotelInfoItem:', error.message); throw error }
}

export const deleteHotelInfoItem = async (id: string): Promise<void> => {
  const { error } = await supabase.from('hotel_info_items').delete().eq('id', id)
  if (error) { console.error('❌ deleteHotelInfoItem:', error.message); throw error }
}