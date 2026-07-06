import React, { useState, useEffect } from 'react'
import { CategoryNav } from './CategoryNav'
import { StaggeredGrid } from './animations/StaggeredGrid'
import { ServiceCard } from './ServiceCard'
import { ServiceDetailModal } from './ServiceDetailModal'
import { ServiceRequestForm } from './ServiceRequestForm'
import { ServiceItem } from '../types/service'
import { MenuCategory } from '../types/menu'
import { serviceActionLabelKeys } from '../data/serviceData'
import { fetchServiceFields, fetchServices } from '../services/serviceDataService'
import { useLanguage } from '../contexts/LanguageContext'

export const ServicesPage: React.FC = () => {
  const { t } = useLanguage()
  const [fields, setFields] = useState<MenuCategory[]>([])
  const [services, setServices] = useState<ServiceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [requestItem, setRequestItem] = useState<ServiceItem | null>(null)
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false)

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

  const handleCardClick = (item: ServiceItem) => {
    setSelectedService(item)
    setIsDetailOpen(true)
  }

  const openRequestForm = (item: ServiceItem) => {
    setRequestItem(item)
    setIsRequestFormOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <CategoryNav
        categories={fields}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

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