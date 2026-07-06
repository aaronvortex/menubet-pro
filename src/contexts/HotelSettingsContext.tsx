import React, { createContext, useContext, useEffect, useState } from 'react'
import { HotelSettings } from '../types/menu'
import { fetchHotelSettings } from '../services/dataService'
import { mockHotelSettings } from '../data/mockData'

interface HotelSettingsContextType {
  settings: HotelSettings
  isLoading: boolean
  refreshSettings: () => Promise<void>
}

const HotelSettingsContext = createContext<HotelSettingsContextType>({
  settings: mockHotelSettings,
  isLoading: false,
  refreshSettings: async () => {},
})

export const HotelSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<HotelSettings>(mockHotelSettings)
  const [isLoading, setIsLoading] = useState(true)

  const loadSettings = async () => {
    try {
      const data = await fetchHotelSettings()
      setSettings(data)
    } catch (error) {
      console.error('Failed to load hotel settings:', error)
      setSettings(mockHotelSettings)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const refreshSettings = async () => {
    await loadSettings()
  }

  return (
    <HotelSettingsContext.Provider
      value={{ settings, isLoading, refreshSettings }}
    >
      {children}
    </HotelSettingsContext.Provider>
  )
}

export const useHotelSettings = () => useContext(HotelSettingsContext)
