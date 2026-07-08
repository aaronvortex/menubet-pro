import { supabase } from '../lib/supabase'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type ExchangeTrend = 'up' | 'down'

export interface ExchangeRate {
  id: string
  currency_code: string
  currency_name: string
  flag_emoji: string
  rate: number
  base_currency: string
  change_percent: number
  trend: ExchangeTrend
  sort_order: number
  active: boolean
  source: string
  updated_at: string
}

// ─────────────────────────────────────────────
// READ
// ─────────────────────────────────────────────

export const fetchExchangeRates = async (): Promise<ExchangeRate[]> => {
  try {
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('*')
      .order('sort_order')
    if (error) { console.error('❌ fetchExchangeRates:', error.message); return [] }
    return data || []
  } catch (err) {
    console.error('❌ fetchExchangeRates exception:', err)
    return []
  }
}

// Guest-facing helper: only active currencies, in admin-defined order
export const fetchActiveExchangeRates = async (): Promise<ExchangeRate[]> => {
  const all = await fetchExchangeRates()
  return all
    .filter(r => r.active)
    .sort((a, b) => a.sort_order - b.sort_order)
}

// ─────────────────────────────────────────────
// WRITE
// ─────────────────────────────────────────────

export const createExchangeRate = async (rate: Partial<ExchangeRate>): Promise<void> => {
  if (!rate.currency_code) throw new Error('Currency code is required')
  const { error } = await supabase.from('exchange_rates').insert([{
    currency_code: rate.currency_code.trim().toUpperCase(),
    currency_name: rate.currency_name?.trim() || '',
    flag_emoji: rate.flag_emoji?.trim() || '💱',
    rate: rate.rate ?? 0,
    base_currency: rate.base_currency?.trim() || 'Birr',
    change_percent: Math.abs(rate.change_percent ?? 0),
    trend: rate.trend || 'up',
    sort_order: rate.sort_order ?? 0,
    active: rate.active ?? true,
    source: 'manual',
    updated_at: new Date().toISOString(),
  }])
  if (error) { console.error('❌ createExchangeRate:', error.message); throw error }
}

export const updateExchangeRate = async (id: string, rate: Partial<ExchangeRate>): Promise<void> => {
  const { error } = await supabase.from('exchange_rates').update({
    currency_code: rate.currency_code?.trim().toUpperCase(),
    currency_name: rate.currency_name?.trim() || '',
    flag_emoji: rate.flag_emoji?.trim() || '💱',
    rate: rate.rate ?? 0,
    base_currency: rate.base_currency?.trim() || 'Birr',
    change_percent: Math.abs(rate.change_percent ?? 0),
    trend: rate.trend || 'up',
    sort_order: rate.sort_order ?? 0,
    active: rate.active ?? true,
    // Always bump the timestamp on save — this is what powers "Updated X min ago"
    updated_at: new Date().toISOString(),
  }).eq('id', id)
  if (error) { console.error('❌ updateExchangeRate:', error.message); throw error }
}

export const deleteExchangeRate = async (id: string): Promise<void> => {
  const { error } = await supabase.from('exchange_rates').delete().eq('id', id)
  if (error) { console.error('❌ deleteExchangeRate:', error.message); throw error }
}

// ─────────────────────────────────────────────
// "Updated X min ago" HELPER
// ─────────────────────────────────────────────

export const formatRelativeTime = (isoDate: string | null): string => {
  if (!isoDate) return 'Not updated yet'
  const diffMs = Date.now() - new Date(isoDate).getTime()
  const diffMin = Math.floor(diffMs / 60000)

  if (diffMin < 1) return 'Updated just now'
  if (diffMin === 1) return 'Updated 1 min ago'
  if (diffMin < 60) return `Updated ${diffMin} min ago`

  const diffHr = Math.floor(diffMin / 60)
  if (diffHr === 1) return 'Updated 1 hour ago'
  if (diffHr < 24) return `Updated ${diffHr} hours ago`

  const diffDays = Math.floor(diffHr / 24)
  if (diffDays === 1) return 'Updated 1 day ago'
  return `Updated ${diffDays} days ago`
}

// Returns the most recent updated_at among the given rates, for the section header
export const getMostRecentUpdateLabel = (rates: ExchangeRate[]): string => {
  if (rates.length === 0) return 'Not updated yet'
  const mostRecent = rates.reduce((latest, r) =>
    new Date(r.updated_at) > new Date(latest) ? r.updated_at : latest
  , rates[0].updated_at)
  return formatRelativeTime(mostRecent)
}