export interface ServiceItem {
  id: string
  categoryId: string
  name: string
  description: string
  price?: number
  icon: string
  image?: string
  estimatedTime?: string
  notes?: string
  available: boolean
}

export interface ServiceRequest {
  id: string
  serviceId: string
  serviceName: string
  categoryId: string
  actionLabel: string
  guestName: string
  roomNumber: string
  status: 'pending' | 'completed'
  submittedAt: string
  details: { label: string; value: string }[]
}
