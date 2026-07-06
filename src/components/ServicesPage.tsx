import React, { useState, useEffect } from 'react'
import { CategoryNav } from './CategoryNav'
import { StaggeredGrid } from './animations/StaggeredGrid'
import { ShimmerSkeleton } from './animations/ShimmerSkeleton'
import { PageWrapper } from './animations/PageTransition'
import { ServiceCard } from './ServiceCard'
import { ServiceDetailModal } from './ServiceDetailModal'
import { ServiceRequestForm } from './ServiceRequestForm'
import { ServiceItem } from '../types/service'
import { MenuCategory } from '../types/menu'
import { serviceActionLabelKeys } from '../data/serviceData'
import { fetchServiceFields, fetchServices } from '../services/serviceDataService'
import { useLanguage } from '../contexts/LanguageContext'
import { useShimmerTimer } from '../hooks/useShimmerTimer'

interface ServicesPageProps {
  onCategoryTransition?: () => void
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onCategoryTransition }) => {
  const { t } = useLanguage()
  const [fields, setFields] = useState<MenuCategory[]>([])
  const [services, setServices] = useState<ServiceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [requestItem, setRequestItem] = useState<ServiceItem | null>(null)
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false)

  const shimmerReady = useShimmerTimer(activeCategory || 'services-initial')

  useEffect(() => {
    (async () => {
      setLoading(true)
      const [fieldsData, servicesData] = await Promise.all([
        fetchServiceFields(),
        fetchServices(),
      ])
      setFields(fieldsData)
      setServices(servicesData)
      if (fieldsData.length > 0) setActiveCategory(prev => prev || fieldsData[0].id)
      setLoading(false)
    })()
  }, [])

  const getActionLabel = (categoryId: string) => {
    const key = serviceActionLabelKeys[categoryId]
    return key ? t[key] : t.actionRequest
  }

  const filteredItems = services.filter(item => item.categoryId === activeCategory)
  const actionLabel = getActionLabel(activeCategory)

  // ── Category switch — mirrors the Menu page's category transition ────
  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === activeCategory) return
    onCategoryTransition?.()
    setActiveCategory(categoryId)
  }

  const handleCardClick = (item: ServiceItem) => {
    setSelectedService(item)
    setIsDetailOpen(true)
  }

  const openRequestForm = (item: ServiceItem) => {
    setRequestItem(item)
    setIsRequestFormOpen(true)
  }

  return (
    <div>
      {!loading && (
        <CategoryNav
          categories={fields}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      )}

      <PageWrapper pageKey={`services-${activeCategory}`}>
        <div>
          {(!shimmerReady || loading) ? (
            <ShimmerSkeleton count={8} />
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <span className="text-6xl mb-5">🛎️</span>
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center font-medium">
                {t.noItems}
              </p>
            </div>
          ) : (
            <div className="px-4 pt-4 pb-28">
              <StaggeredGrid gridKey={activeCategory} columns={2} gap={3}>
                {filteredItems.map(item => (
                  <ServiceCard
                    key={item.id}
                    item={item}
                    actionLabel={actionLabel}
                    onCardClick={handleCardClick}
                    onActionClick={openRequestForm}
                  />
                ))}
              </StaggeredGrid>
            </div>
          )}
        </div>
      </PageWrapper>

      <ServiceDetailModal
        item={selectedService}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        actionLabel={selectedService ? getActionLabel(selectedService.categoryId) : t.actionRequest}
        onActionClick={() => {
          if (selectedService) {
            setIsDetailOpen(false)
            openRequestForm(selectedService)
          }
        }}
        fields={fields}
      />

      <ServiceRequestForm
        item={requestItem}
        actionLabel={requestItem ? getActionLabel(requestItem.categoryId) : t.actionRequest}
        isOpen={isRequestFormOpen}
        onClose={() => setIsRequestFormOpen(false)}
        fields={fields}
        services={services}
      />
    </div>
  )
}