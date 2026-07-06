import React, { createContext, useContext, useEffect, useState } from 'react'
import { LanguageCode } from '../types/menu'
import { translations, languages, TranslationKeys } from '../data/translations'

interface LanguageContextType {
  language: LanguageCode
  setLanguage: (code: LanguageCode) => void
  t: TranslationKeys
  isRTL: boolean
  languages: typeof languages
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: translations['en'],
  isRTL: false,
  languages,
})

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en')

  const currentLang = languages.find(l => l.code === language)
  const isRTL = currentLang?.rtl || false

  useEffect(() => {
    localStorage.setItem('menubet_language', language)
    const html = document.documentElement
    html.setAttribute('lang', language)
    html.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
  }, [language, isRTL])

  const setLanguage = (code: LanguageCode) => {
    setLanguageState(code)
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
        isRTL,
        languages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
