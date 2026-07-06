export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  subCategory?: string
  calories: number
  volume?: string
  ingredients: string[]
  available: boolean
  quantity?: number
  rating?: number
  isFavorite?: boolean
}

export interface MenuCategory {
  id: string
  name: string
  icon: string
  display_order: number
}

export interface CartItem extends MenuItem {
  cartQuantity: number
}

export interface Order {
  id?: string
  guest_name: string
  room_number: string
  guest_phone?: string
  items: CartItem[]
  total_price: number
  status: 'pending' | 'completed' | 'cancelled'
  special_requests?: string
  call_time?: string
  created_at?: string
}

export interface HotelSettings {
  id?: string
  hotel_name: string
  logo_url: string
  reception_phone: string
  address: string
  check_in: string
  check_out: string
  about_text: string
}

export interface UserPreferences {
  room_number: string
  preferred_language: string
  theme_preference: string
}

export type LanguageCode = 'en' | 'am' | 'om' | 'ti' | 'ar' | 'fr' | 'zh' | 'es' | 'ja' | 'he' | 'de' | 'ru' | 'pt' | 'it'

export interface Language {
  code: LanguageCode
  name: string
  nativeName: string
  flag: string
  rtl: boolean
}
