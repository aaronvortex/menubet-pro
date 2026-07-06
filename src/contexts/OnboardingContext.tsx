import React, { createContext, useContext, useState } from 'react'

interface OnboardingContextType {
  hasSeenOnboarding: boolean
  isOnboardingOpen: boolean
  completeOnboarding: () => void
  resetOnboarding: () => void
}

const OnboardingContext = createContext<OnboardingContextType>({
  hasSeenOnboarding: false,
  isOnboardingOpen: false,
  completeOnboarding: () => {},
  resetOnboarding: () => {},
})

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
    return localStorage.getItem('menubet_onboarding_done') === 'true'
  })

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    return localStorage.getItem('menubet_onboarding_done') !== 'true'
  })

  const completeOnboarding = () => {
    localStorage.setItem('menubet_onboarding_done', 'true')
    setHasSeenOnboarding(true)
    setIsOnboardingOpen(false)
  }

  const resetOnboarding = () => {
    localStorage.removeItem('menubet_onboarding_done')
    setHasSeenOnboarding(false)
    setIsOnboardingOpen(true)
  }

  return (
    <OnboardingContext.Provider
      value={{
        hasSeenOnboarding,
        isOnboardingOpen,
        completeOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export const useOnboarding = () => useContext(OnboardingContext)
