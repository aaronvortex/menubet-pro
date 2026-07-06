import { supabaseServices } from '../lib/supabaseServices'
import { MenuCategory } from '../types/menu'
import { ServiceItem, ServiceRequest } from '../types/service'

export async function fetchServiceFields(): Promise<MenuCategory[]> {
  const { data, error } = await supabaseServices
    .from('service_categories')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('fetchServiceFields error:', error)
    return []
  }
  return (data || []) as MenuCategory[]
}

export async function createServiceField(field: Partial<MenuCategory>): Promise<void> {
  const { error } = await supabaseServices.from('service_categories').insert({
    id: field.id,
    name: field.name,
    icon: field.icon,
    display_order: field.display_order,
  })
  if (error) throw error
}

export async function updateServiceField(id: string, field: Partial<MenuCategory>): Promise<void> {
  const { error } = await supabaseServices
    .from('service_categories')
    .update({
      name: field.name,
      icon: field.icon,
      display_order: field.display_order,
    })
    .eq('id', id)
  if (error) throw error
}

export async function deleteServiceField(id: string): Promise<void> {
  const { error } = await supabaseServices.from('service_categories').delete().eq('id', id)
  if (error) throw error
}

// ── Services (service_items table) ─────────────────────────────────────────

function mapRowToService(row: any): ServiceItem {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description || '',
    price: row.price === null || row.price === undefined ? undefined : Number(row.price),
    icon: row.icon || '🛎️',
    image: row.image || undefined,
    estimatedTime: row.estimated_time || undefined,
    notes: row.notes || undefined,
    available: row.available ?? true,
  }
}

export async function fetchServices(): Promise<ServiceItem[]> {
  const { data, error } = await supabaseServices
    .from('service_items')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('fetchServices error:', error)
    return []
  }
  return (data || []).map(mapRowToService)
}

export async function createService(service: Partial<ServiceItem>): Promise<void> {
  const { error } = await supabaseServices.from('service_items').insert({
    id: service.id,
    category_id: service.categoryId,
    name: service.name,
    description: service.description || '',
    price: service.price ?? null,
    icon: service.icon || '🛎️',
    image: service.image || '',
    estimated_time: service.estimatedTime || '',
    notes: service.notes || '',
    available: service.available ?? true,
  })
  if (error) throw error
}

export async function updateService(id: string, service: Partial<ServiceItem>): Promise<void> {
  const { error } = await supabaseServices
    .from('service_items')
    .update({
      category_id: service.categoryId,
      name: service.name,
      description: service.description || '',
      price: service.price ?? null,
      icon: service.icon || '🛎️',
      image: service.image || '',
      estimated_time: service.estimatedTime || '',
      notes: service.notes || '',
      available: service.available ?? true,
    })
    .eq('id', id)
  if (error) throw error
}

export async function deleteService(id: string): Promise<void> {
  const { error } = await supabaseServices.from('service_items').delete().eq('id', id)
  if (error) throw error
}

// ── Service Requests (service_requests table) ──────────────────────────────

function mapRowToServiceRequest(row: any): ServiceRequest {
  return {
    id: row.id,
    serviceId: row.service_id,
    serviceName: row.service_name,
    categoryId: row.category_id,
    actionLabel: row.action_label || 'Request',
    guestName: row.guest_name,
    roomNumber: row.room_number,
    status: row.status,
    submittedAt: row.submitted_at,
    details: row.details || [],
  }
}

export async function fetchServiceRequests(): Promise<ServiceRequest[]> {
  const { data, error } = await supabaseServices
    .from('service_requests')
    .select('*')
    .order('submitted_at', { ascending: false })

  if (error) {
    console.error('fetchServiceRequests error:', error)
    return []
  }
  return (data || []).map(mapRowToServiceRequest)
}

export async function createServiceRequest(request: Omit<ServiceRequest, 'id'>): Promise<void> {
  const { error } = await supabaseServices.from('service_requests').insert({
    service_id: request.serviceId,
    service_name: request.serviceName,
    category_id: request.categoryId,
    action_label: request.actionLabel,
    guest_name: request.guestName,
    room_number: request.roomNumber,
    status: request.status,
    submitted_at: request.submittedAt,
    details: request.details,
  })
  if (error) throw error
}

export async function updateServiceRequestStatus(id: string, status: ServiceRequest['status']): Promise<void> {
  const { error } = await supabaseServices
    .from('service_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}
