import React, { useState, useEffect, useCallback } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { AdminProvider } from './contexts/AdminContext'
import { OnboardingProvider } from './contexts/OnboardingContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { HotelSettingsProvider } from './contexts/HotelSettingsContext'
import { Header } from './components/Header'
import { CategoryNav } from './components/CategoryNav'
import { SubCategoryNav } from './components/SubCategoryNav'
import { MenuGrid } from './components/MenuGrid'
import { ItemDetail } from './components/ItemDetail'
import { Cart } from './components/Cart'
import { SideCart } from './components/SideCart'
import { HotelDirectory } from './components/HotelDirectory'
import { OnboardingOverlay } from './components/onboarding/OnboardingOverlay'
import { AdminLogin } from './components/admin/AdminLogin'
import { AdminDashboard } from './components/admin/AdminDashboard'
import { SubCategoryPage } from './components/SubCategoryPage'
import { HomePage } from './components/HomePage'
import { PageWrapper } from './components/animations/PageTransition'
import { PageTransitionOverlay } from './components/animations/PageTransitionOverlay'
import { usePageTransition } from './hooks/usePageTransition'
import { fetchCategories, fetchMenuItems } from './services/dataService'
import { BottomNav, BottomNavTab } from './components/BottomNav'
import { ServicesPage } from './components/ServicesPage'
import { PWAInstallPrompt } from './components/PWAInstallPrompt'
import { MenuCategory, MenuItem, CartItem } from './types/menu'
import { useLanguage } from './contexts/LanguageContext'
import { useAdmin } from './contexts/AdminContext'

type AppView = 'home' | 'menu' | 'subcategory' | 'services'

function AppContent() {
  const { t } = useLanguage()
  const { isAuthenticated, logout } = useAdmin()

  // ── Page transition overlay (branded splash between views) ──────────
  const { isTransitioning, startTransition, completeTransition } = usePageTransition()

  const runPageTransition = useCallback((duration: number = 650) => {
    startTransition()
    setTimeout(() => {
      completeTransition()
    }, duration)
  }, [startTransition, completeTransition])

  // ── Data state ────────────────────────────────────
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // ── View state ────────────────────────────────────
  const [currentView, setCurrentView] = useState<AppView>('home')

  // ── Navigation state ──────────────────────────────
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null)
  const [subCategoryPageFilter, setSubCategoryPageFilter] = useState<string | null>(null)

  // ── UI overlay state ──────────────────────────────
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false)
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false)

  // ── Item + Cart state ─────────────────────────────
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // ── SideCart state ────────────────────────────────
  const [isSideCartVisible, setIsSideCartVisible] = useState(false)
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null)

  // ── Load data — show branded splash for the initial boot ─────────────
  useEffect(() => {
    startTransition()
    const loadData = async () => {
      try {
        const [cats, menuItems] = await Promise.all([
          fetchCategories(),
          fetchMenuItems(),
        ])
        setCategories(cats)
        setItems(menuItems)
        if (cats.length > 0) setActiveCategory(cats[0].id)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
        // keep splash visible briefly so it never flashes instantly
        setTimeout(() => completeTransition(), 450)
      }
    }
    loadData()
  }, [])

  // ── Handlers ──────────────────────────────────────

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === activeCategory) return
    runPageTransition()
    setActiveCategory(categoryId)
    setActiveSubCategory(null)
    setCurrentView('menu')
  }

  const handleSubCategoryChange = (sub: string | null) => {
    runPageTransition()
    setActiveSubCategory(sub)
    if (sub) {
      setSubCategoryPageFilter(sub)
      setCurrentView('subcategory')
    } else {
      setCurrentView('menu')
    }
  }

  const handleBackFromSubCategory = () => {
    runPageTransition()
    setCurrentView('menu')
    setActiveSubCategory(null)
    setSubCategoryPageFilter(null)
  }

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item)
    setIsDetailOpen(true)
  }

  const handleDetailClose = () => {
    setIsDetailOpen(false)
    setTimeout(() => setSelectedItem(null), 350)
  }

  const handleAddToCart = useCallback((cartItem: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === cartItem.id)
      let updated: CartItem[]
      if (existing) {
        updated = prev.map(i =>
          i.id === cartItem.id
            ? { ...i, cartQuantity: i.cartQuantity + cartItem.cartQuantity }
            : i
        )
      } else {
        updated = [...prev, cartItem]
      }
      const updatedItem = updated.find(i => i.id === cartItem.id) || cartItem
      setLastAddedItem(updatedItem)
      setIsSideCartVisible(true)
      return updated
    })
  }, [])

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(i => i.id === itemId ? { ...i, cartQuantity: quantity } : i)
    )
  }

  const handleRemoveItem = (itemId: string) => {
    setCartItems(prev => prev.filter(i => i.id !== itemId))
  }

  const handleClearCart = () => setCartItems([])

  const handleToggleFavorite = (itemId: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, isFavorite: !item.isFavorite }
          : item
      )
    )
    if (selectedItem?.id === itemId) {
      setSelectedItem(prev =>
        prev ? { ...prev, isFavorite: !prev.isFavorite } : null
      )
    }
  }

  // ── Computed ──────────────────────────────────────

  const activeCategory_ = categories.find(c => c.id === activeCategory) || null

  const filteredItems = items.filter(item => {
    const categoryMatch = item.category === activeCategory
    const subMatch = activeSubCategory
      ? item.subCategory === activeSubCategory
      : true
    return categoryMatch && subMatch
  })

  const subCategoryItems = items.filter(
    item => item.category === activeCategory
  )

  const cartCount = cartItems.reduce((sum, i) => sum + i.cartQuantity, 0)
  const anyOverlayOpen = isCartOpen || isDetailOpen || isDirectoryOpen

  const bottomNavActiveTab: BottomNavTab = isDirectoryOpen
    ? 'info'
    : currentView === 'services'
    ? 'services'
    : currentView === 'home'
    ? 'home'
    : 'menu'

  // ── Floating-nav tab switches trigger the same branded splash used ───
  // ── for category-level transitions, so all 4 tabs feel consistent.

  const goToHome = () => {
    if (currentView !== 'home') runPageTransition()
    setCurrentView('home')
    setActiveSubCategory(null)
  }

  const goToMenu = () => {
    if (currentView !== 'menu') runPageTransition()
    setCurrentView('menu')
    setActiveSubCategory(null)
  }

  // Used by Home's "Order Food" / "Popular Dishes" links — optionally jumps
  // straight to a specific category, same as tapping that category tab.
  const handleNavigateToMenu = (categoryId?: string) => {
    runPageTransition()
    if (categoryId) setActiveCategory(categoryId)
    setActiveSubCategory(null)
    setCurrentView('menu')
  }

  const goToServices = () => {
    if (currentView !== 'services') runPageTransition()
    setCurrentView('services')
    setActiveSubCategory(null)
  }

  const openDirectory = () => {
    runPageTransition(450)
    setIsDirectoryOpen(true)
  }

  // ── Admin Dashboard View ───────────────────────────
  if (isAuthenticated) {
    return (
      <>
        <AdminDashboard onLogout={logout} />
        <PageTransitionOverlay isVisible={isTransitioning} />
      </>
    )
  }

  // ── Guest Menu View ────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pb-28">

      <Header
        onLogoClick={goToMenu}
        cartItemsCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      {currentView === 'home' ? (
        <PageWrapper pageKey="home">
          <HomePage
            categories={categories}
            items={items}
            onNavigateToMenu={handleNavigateToMenu}
            onNavigateToServices={handleNavigateToServices}
            onAddToCart={handleAddToCart}
          />
        </PageWrapper>
      ) : currentView === 'services' ? (
        <PageWrapper pageKey="services">
          <ServicesPage onCategoryTransition={() => runPageTransition()} />
        </PageWrapper>
      ) : currentView === 'subcategory' ? (
        <PageWrapper pageKey={`sub-${activeCategory}-${subCategoryPageFilter}`}>
          <SubCategoryPage
            category={activeCategory_}
            subCategory={subCategoryPageFilter}
            items={subCategoryItems}
            isLoading={isLoading}
            onBack={handleBackFromSubCategory}
            onItemClick={handleItemClick}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
          />
        </PageWrapper>
      ) : (
        <PageWrapper pageKey={`menu-${activeCategory}`}>
          <div>
            {!isLoading && (
              <CategoryNav
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
              />
            )}
            {!isLoading && (
              <SubCategoryNav
                activeCategory={activeCategory}
                activeSubCategory={activeSubCategory}
                items={items}
                onSubCategoryChange={handleSubCategoryChange}
              />
            )}
            <MenuGrid
              items={filteredItems}
              isLoading={isLoading}
              activeCategory={activeCategory}
              activeSubCategory={activeSubCategory}
              onAddToCart={handleAddToCart}
              onItemClick={handleItemClick}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        </PageWrapper>
      )}

      <ItemDetail
        item={selectedItem}
        isOpen={isDetailOpen}
        onClose={handleDetailClose}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
      />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      <HotelDirectory
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
        onAdminLoginClick={() => {
          setIsDirectoryOpen(false)
          setTimeout(() => setIsAdminLoginOpen(true), 300)
        }}
      />

      <AdminLogin
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => setIsAdminLoginOpen(false)}
      />

      <SideCart
        isVisible={isSideCartVisible && !anyOverlayOpen}
        lastAddedItem={lastAddedItem}
        cartItems={cartItems}
        onClose={() => setIsSideCartVisible(false)}
        onOpenCart={() => {
          setIsSideCartVisible(false)
          setIsCartOpen(true)
        }}
      />

      <OnboardingOverlay />

      {/* Branded page transition splash — always on top */}
      <PageTransitionOverlay isVisible={isTransitioning} />

      {/* PWA "install this app" popup */}
      <PWAInstallPrompt />

      <BottomNav
        activeTab={bottomNavActiveTab}
        onHomeClick={goToHome}
        onMenuClick={goToMenu}
        onServicesClick={goToServices}
        onInfoClick={openDirectory}
      />

    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <HotelSettingsProvider>
          <OnboardingProvider>
            <AdminProvider>
              <AppContent />
            </AdminProvider>
          </OnboardingProvider>
        </HotelSettingsProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App