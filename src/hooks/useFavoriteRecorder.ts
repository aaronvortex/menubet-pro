/**
 * useFavoriteRecorder
 *
 * Tracks favorite activity:
 * - localStorage keeps UI state (heart red/white per session)
 * - Supabase records every favorite event for admin analytics
 *
 * Called from MenuCard when user taps the heart icon
 * (recording is handled directly in MenuCard via recordFavorite)
 *
 * This hook provides helper utilities for reading local state
 */

export const useFavoriteRecorder = () => {

  // Check if an item is currently favorited in this session
  const isItemFavorited = (itemId: string): boolean => {
    try {
      const data = localStorage.getItem('menubet_favorites')
      if (!data) return false
      const favorites: string[] = JSON.parse(data)
      return favorites.includes(itemId)
    } catch {
      return false
    }
  }

  // Get count of all locally favorited items
  const getLocalFavoritesCount = (): number => {
    try {
      const data = localStorage.getItem('menubet_favorites')
      if (!data) return 0
      const favorites: string[] = JSON.parse(data)
      return favorites.length
    } catch {
      return 0
    }
  }

  // Save item id to local favorites list
  const saveToLocalFavorites = (itemId: string): void => {
    try {
      const data = localStorage.getItem('menubet_favorites')
      const favorites: string[] = data ? JSON.parse(data) : []
      if (!favorites.includes(itemId)) {
        favorites.push(itemId)
        localStorage.setItem('menubet_favorites', JSON.stringify(favorites))
      }
    } catch (err) {
      console.error('saveToLocalFavorites error:', err)
    }
  }

  // Remove item id from local favorites list
  const removeFromLocalFavorites = (itemId: string): void => {
    try {
      const data = localStorage.getItem('menubet_favorites')
      if (!data) return
      const favorites: string[] = JSON.parse(data)
      const updated = favorites.filter(id => id !== itemId)
      localStorage.setItem('menubet_favorites', JSON.stringify(updated))
    } catch (err) {
      console.error('removeFromLocalFavorites error:', err)
    }
  }

  return {
    isItemFavorited,
    getLocalFavoritesCount,
    saveToLocalFavorites,
    removeFromLocalFavorites,
  }
}
