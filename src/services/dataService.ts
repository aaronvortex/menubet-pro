/**
 * MENUBET DATA SERVICE
 *
 * Round 1 → hotel_settings ✅ Real Supabase
 * Round 2 → admin login     ✅ Real Supabase (auth.ts)
 * Round 3 → categories      ✅ Real Supabase
 * Round 4 → menu_items      ✅ Real Supabase
 * Round 5 → orders          ✅ Real Supabase
 * Task 4  → user_favorites  ✅ Real Supabase
 */

import { supabase } from '../lib/supabase'
import { mockHotelSettings } from '../data/mockData'
import { MenuCategory, MenuItem, HotelSettings, Order } from '../types/menu'

export const USE_MOCK_DATA = true

// ─────────────────────────────────────────────
// CATEGORIES — ✅ REAL SUPABASE
// ─────────────────────────────────────────────

export const fetchCategories = async (): Promise<MenuCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order')
    if (error) { console.error('❌ fetchCategories:', error.message); return [] }
    console.log('✅ Categories loaded:', data?.length)
    return data || []
  } catch (err) {
    console.error('❌ fetchCategories exception:', err)
    return []
  }
}

export const createCategory = async (category: Partial<MenuCategory>): Promise<void> => {
  if (!category.id || !category.name || !category.icon) throw new Error('id, name, icon required')
  const { error } = await supabase.from('categories').insert([{
    id: category.id.trim().toLowerCase().replace(/\s+/g, '_'),
    name: category.name.trim(),
    icon: category.icon.trim(),
    display_order: category.display_order ?? 0,
  }])
  if (error) { console.error('❌ createCategory:', error.message); throw error }
  console.log('✅ Category created:', category.name)
}

export const updateCategory = async (id: string, category: Partial<MenuCategory>): Promise<void> => {
  const { error } = await supabase.from('categories')
    .update({ name: category.name?.trim(), icon: category.icon?.trim(), display_order: category.display_order })
    .eq('id', id)
  if (error) { console.error('❌ updateCategory:', error.message); throw error }
  console.log('✅ Category updated:', id)
}

export const deleteCategory = async (id: string): Promise<void> => {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) { console.error('❌ deleteCategory:', error.message); throw error }
  console.log('✅ Category deleted:', id)
}

// ─────────────────────────────────────────────
// MENU ITEMS — ✅ REAL SUPABASE
// ─────────────────────────────────────────────

export const fetchMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('category_id')
      .order('name')
    if (error) { console.error('❌ fetchMenuItems:', error.message); return [] }
    console.log('✅ Menu items loaded:', data?.length)
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: Number(item.price),
      image: item.image || '',
      category: item.category_id,
      subCategory: item.sub_category || undefined,
      calories: item.calories || 0,
      volume: item.volume || '',
      ingredients: item.ingredients || [],
      available: item.available,
      quantity: item.quantity || 0,
      rating: item.rating || 0,
      isFavorite: false,
    }))
  } catch (err) {
    console.error('❌ fetchMenuItems exception:', err)
    return []
  }
}

export const createMenuItem = async (item: Partial<MenuItem>): Promise<void> => {
  if (!item.id || !item.name || !item.category) throw new Error('id, name, category required')
  const { error } = await supabase.from('menu_items').insert([{
    id: item.id.trim(),
    name: item.name.trim(),
    description: item.description || '',
    price: Number(item.price),
    image: item.image || '',
    category_id: item.category,
    sub_category: item.subCategory || null,
    calories: item.calories || 0,
    volume: item.volume || '',
    ingredients: item.ingredients || [],
    available: item.available ?? true,
    quantity: item.quantity || 0,
    rating: item.rating || 0,
  }])
  if (error) { console.error('❌ createMenuItem:', error.message); throw error }
  console.log('✅ Menu item created:', item.name)
}

export const updateMenuItem = async (id: string, item: Partial<MenuItem>): Promise<void> => {
  const { error } = await supabase.from('menu_items').update({
    name: item.name?.trim(),
    description: item.description || '',
    price: Number(item.price),
    image: item.image || '',
    category_id: item.category,
    sub_category: item.subCategory || null,
    calories: item.calories || 0,
    volume: item.volume || '',
    ingredients: item.ingredients || [],
    available: item.available ?? true,
    quantity: item.quantity || 0,
    rating: item.rating || 0,
  }).eq('id', id)
  if (error) { console.error('❌ updateMenuItem:', error.message); throw error }
  console.log('✅ Menu item updated:', id)
}

export const deleteMenuItem = async (id: string): Promise<void> => {
  const { error } = await supabase.from('menu_items').delete().eq('id', id)
  if (error) { console.error('❌ deleteMenuItem:', error.message); throw error }
  console.log('✅ Menu item deleted:', id)
}

// ─────────────────────────────────────────────
// ORDERS — ✅ REAL SUPABASE
// ─────────────────────────────────────────────

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) { console.error('❌ fetchOrders:', error.message); return [] }
    console.log('✅ Orders loaded:', data?.length)
    return (data || []).map(row => ({
      id: row.id,
      guest_name: row.guest_name,
      room_number: row.room_number,
      guest_phone: row.guest_phone || undefined,
      items: row.items || [],
      total_price: Number(row.total_price),
      status: row.status as 'pending' | 'completed' | 'cancelled',
      special_requests: row.special_requests || undefined,
      call_time: row.call_time || undefined,
      created_at: row.created_at,
    }))
  } catch (err) {
    console.error('❌ fetchOrders exception:', err)
    return []
  }
}

export const createOrder = async (order: Omit<Order, 'id' | 'created_at'>): Promise<void> => {
  try {
    const { error } = await supabase.from('orders').insert([{
      guest_name: order.guest_name,
      room_number: order.room_number,
      guest_phone: order.guest_phone || null,
      items: order.items,
      total_price: Number(order.total_price),
      status: order.status || 'pending',
      special_requests: order.special_requests || null,
      call_time: order.call_time || null,
    }])
    if (error) { console.error('❌ createOrder:', error.message); throw error }
    console.log('✅ Order saved — Room:', order.room_number)
  } catch (err) {
    console.error('❌ createOrder exception:', err)
    throw err
  }
}

export const updateOrderStatus = async (
  id: string,
  status: 'pending' | 'completed' | 'cancelled'
): Promise<void> => {
  const { error } = await supabase.from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) { console.error('❌ updateOrderStatus:', error.message); throw error }
  console.log('✅ Order status updated:', id, '→', status)
}

export const deleteOrder = async (id: string): Promise<void> => {
  const { error } = await supabase.from('orders').delete().eq('id', id)
  if (error) { console.error('❌ deleteOrder:', error.message); throw error }
  console.log('✅ Order deleted:', id)
}

// ─────────────────────────────────────────────
// HOTEL SETTINGS — ✅ REAL SUPABASE
// ─────────────────────────────────────────────

export const fetchHotelSettings = async (): Promise<HotelSettings> => {
  try {
    const { data, error } = await supabase
      .from('hotel_settings').select('*').limit(1).single()
    if (error) { console.error('❌ fetchHotelSettings:', error.message); return { ...mockHotelSettings } }
    console.log('✅ Hotel settings loaded from Supabase')
    return {
      id: data.id,
      hotel_name: data.hotel_name || 'MenuBet Hotel',
      logo_url: data.logo_url || '',
      reception_phone: data.reception_phone || '',
      address: data.address || '',
      check_in: data.check_in || '2:00 PM',
      check_out: data.check_out || '12:00 PM',
      about_text: data.about_text || '',
    }
  } catch (err) {
    console.error('❌ fetchHotelSettings exception:', err)
    return { ...mockHotelSettings }
  }
}

export const updateHotelSettings = async (settings: Partial<HotelSettings>): Promise<void> => {
  if (!settings.id) throw new Error('Settings ID missing')
  const { error } = await supabase.from('hotel_settings').update({
    hotel_name: settings.hotel_name || '',
    logo_url: settings.logo_url || '',
    reception_phone: settings.reception_phone || '',
    address: settings.address || '',
    check_in: settings.check_in || '2:00 PM',
    check_out: settings.check_out || '12:00 PM',
    about_text: settings.about_text || '',
    updated_at: new Date().toISOString(),
  }).eq('id', settings.id)
  if (error) { console.error('❌ updateHotelSettings:', error.message); throw error }
  console.log('✅ Hotel settings saved to Supabase')
}

// ─────────────────────────────────────────────
// USER PREFERENCES — mock still
// ─────────────────────────────────────────────

export const fetchUserPreferences = async (
  roomNumber: string
): Promise<{ preferred_language: string; theme_preference: string } | null> => {
  if (USE_MOCK_DATA) {
    return Promise.resolve({ preferred_language: 'en', theme_preference: 'light' })
  }
  const { data } = await supabase
    .from('user_preferences')
    .select('preferred_language, theme_preference')
    .eq('room_number', roomNumber)
    .maybeSingle()
  return data
}

export const saveUserPreferences = async (
  roomNumber: string,
  language: string,
  theme: string
): Promise<void> => {
  if (USE_MOCK_DATA) {
    console.log('[Mock] saveUserPreferences:', roomNumber, language, theme)
    return
  }
  const { error } = await supabase.from('user_preferences').upsert(
    { room_number: roomNumber, preferred_language: language, theme_preference: theme, updated_at: new Date().toISOString() },
    { onConflict: 'room_number' }
  )
  if (error) throw error
}

// ─────────────────────────────────────────────
// USER FAVORITES — ✅ REAL SUPABASE (Task 4)
// Records every time a guest taps the heart icon
// Admin sees all favorites with counts + can delete
// ─────────────────────────────────────────────

export interface FavoriteRecord {
  id: string
  item_id: string
  item_name: string
  item_image: string
  item_price: number
  category_id: string
  favorited_at: string
}

export const fetchFavorites = async (): Promise<FavoriteRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('*')
      .order('favorited_at', { ascending: false })
    if (error) { console.error('❌ fetchFavorites:', error.message); return [] }
    console.log('✅ Favorites loaded from Supabase:', data?.length)
    return data || []
  } catch (err) {
    console.error('❌ fetchFavorites exception:', err)
    return []
  }
}

export const recordFavorite = async (item: {
  item_id: string
  item_name: string
  item_image: string
  item_price: number
  category_id: string
}): Promise<void> => {
  try {
    const { error } = await supabase.from('user_favorites').insert([{
      item_id: item.item_id,
      item_name: item.item_name,
      item_image: item.item_image || '',
      item_price: Number(item.item_price) || 0,
      category_id: item.category_id || '',
    }])
    if (error) {
      console.error('❌ recordFavorite:', error.message)
      // Do not throw — favorites failing should never break the guest experience
    } else {
      console.log('✅ Favorite recorded:', item.item_name)
    }
  } catch (err) {
    console.error('❌ recordFavorite exception:', err)
  }
}

export const deleteFavoritesByItemId = async (itemId: string): Promise<void> => {
  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('item_id', itemId)
  if (error) { console.error('❌ deleteFavoritesByItemId:', error.message); throw error }
  console.log('✅ All favorites deleted for item:', itemId)
}
