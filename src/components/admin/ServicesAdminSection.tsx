import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, CreditCard as Edit2, Trash2, X, Save, AlertCircle, ToggleLeft, ToggleRight, Check, RefreshCw } from 'lucide-react'
import { MenuCategory } from '../../types/menu'
import { ServiceItem, ServiceRequest } from '../../types/service'
import {
  fetchServiceFields, createServiceField, updateServiceField, deleteServiceField,
  fetchServices, createService, updateService, deleteService,
  fetchServiceRequests, updateServiceRequestStatus,
} from '../../services/serviceDataService'

const MiniConfirmModal: React.FC<{
  message: string
  onConfirm: () => void
  onCancel: () => void
}> = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[500] bg-black/60 flex items-center justify-center px-4">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-xs w-full shadow-2xl"
    >
      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-6 h-6 text-red-500" />
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 text-center mb-5 leading-relaxed">
        {message}
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-semibold">
          Cancel
        </button>
        <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold">
          Delete
        </button>
      </div>
    </motion.div>
  </div>
)

const FormField: React.FC<{
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  error?: string
  multiline?: boolean
}> = ({ label, value, onChange, placeholder, type = 'text', error, multiline }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">{label}</label>
    {multiline ? (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className={`w-full bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white outline-none border-2 resize-none ${error ? 'border-red-400' : 'border-transparent focus:border-blue-500'}`}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white outline-none border-2 ${error ? 'border-red-400' : 'border-transparent focus:border-blue-500'}`}
      />
    )}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
)

const FieldForm: React.FC<{
  initial?: MenuCategory | null
  onSave: (data: Partial<MenuCategory>) => Promise<void>
  onClose: () => void
}> = ({ initial, onSave, onClose }) => {
  const [id, setId] = useState(initial?.id || '')
  const [name, setName] = useState(initial?.name || '')
  const [icon, setIcon] = useState(initial?.icon || '🛎️')
  const [order, setOrder] = useState(String(initial?.display_order || 1))
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!id.trim()) e.id = 'ID is required'
    if (!name.trim()) e.name = 'Name is required'
    if (!icon.trim()) e.icon = 'Icon is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await onSave({ id: id.trim(), name: name.trim(), icon: icon.trim(), display_order: Number(order) })
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[400] bg-black/60 flex items-end sm:items-center justify-center px-0 sm:px-4">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl w-full max-w-sm shadow-2xl"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {initial ? 'Edit Field' : 'Add Field'}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <FormField label="Field ID *" value={id} onChange={setId} placeholder="e.g. laundry" error={errors.id} />
          <FormField label="Name *" value={name} onChange={setName} placeholder="e.g. Laundry" error={errors.name} />
          <FormField label="Icon (emoji) *" value={icon} onChange={setIcon} placeholder="🧺" error={errors.icon} />
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Display Order</label>
            <input
              type="number"
              value={order}
              onChange={e => setOrder(e.target.value)}
              min="1"
              className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white outline-none border-2 border-transparent focus:border-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-semibold">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-[2] py-3 rounded-2xl bg-blue-600 text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <><Save className="w-4 h-4" /> Save</>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const ServiceForm: React.FC<{
  initial?: ServiceItem | null
  fields: MenuCategory[]
  onSave: (data: Partial<ServiceItem>) => Promise<void>
  onClose: () => void
}> = ({ initial, fields, onSave, onClose }) => {
  const [form, setForm] = useState({
    id: initial?.id || '',
    name: initial?.name || '',
    description: initial?.description || '',
    categoryId: initial?.categoryId || (fields[0]?.id || ''),
    price: initial?.price !== undefined ? String(initial.price) : '',
    icon: initial?.icon || '🛎️',
    image: initial?.image || '',
    estimatedTime: initial?.estimatedTime || '',
    notes: initial?.notes || '',
    available: initial?.available ?? true,
  })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (key: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.id.trim()) e.id = 'ID required'
    if (!form.name.trim()) e.name = 'Name required'
    if (!form.categoryId) e.categoryId = 'Field required'
    if (form.price.trim() && isNaN(Number(form.price))) e.price = 'Enter a valid number or leave blank'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await onSave({
        id: form.id.trim(),
        name: form.name.trim(),
        description: form.description.trim(),
        categoryId: form.categoryId,
        price: form.price.trim() ? Number(form.price) : undefined,
        icon: form.icon.trim() || '🛎️',
        image: form.image.trim() || undefined,
        estimatedTime: form.estimatedTime.trim() || undefined,
        notes: form.notes.trim() || undefined,
        available: form.available,
      })
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[400] bg-black/60 overflow-y-auto">
      <div className="min-h-full flex items-end sm:items-center justify-center px-0 sm:px-4 py-0 sm:py-8">
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl w-full max-w-sm shadow-2xl"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 rounded-t-3xl z-10">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {initial ? 'Edit Service' : 'Add Service'}
            </h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="px-5 py-4 space-y-4">
            <FormField label="Service ID *" value={form.id} onChange={v => set('id', v)} placeholder="e.g. laundry-005" error={errors.id} />
            <FormField label="Service Name *" value={form.name} onChange={v => set('name', v)} placeholder="e.g. Shoe Shine" error={errors.name} />
            <FormField label="Description" value={form.description} onChange={v => set('description', v)} placeholder="Brief description..." multiline />

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Field *</label>
              <select
                value={form.categoryId}
                onChange={e => set('categoryId', e.target.value)}
                className={`w-full bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white outline-none border-2 ${errors.categoryId ? 'border-red-400' : 'border-transparent focus:border-blue-500'}`}
              >
                {fields.map(f => (
                  <option key={f.id} value={f.id}>{f.icon} {f.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId}</p>}
            </div>

            <FormField label="Icon (emoji) *" value={form.icon} onChange={v => set('icon', v)} placeholder="🧺" />
            <FormField label="Image URL" value={form.image} onChange={v => set('image', v)} placeholder="https://..." />

            {form.image && (
              <div className="w-full h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={form.image}
                  alt="preview"
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
            )}

            <FormField label="Price in Birr — leave blank for Complimentary" value={form.price} onChange={v => set('price', v)} type="number" placeholder="150" error={errors.price} />
            <FormField label="Estimated Time" value={form.estimatedTime} onChange={v => set('estimatedTime', v)} placeholder="e.g. Ready in 2 hours" />
            <FormField label="Notes" value={form.notes} onChange={v => set('notes', v)} placeholder="Anything guests should know before requesting" multiline />

            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Available</span>
              <button
                onClick={() => set('available', !form.available)}
                className={`transition-colors ${form.available ? 'text-green-500' : 'text-gray-400'}`}
              >
                {form.available ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
              </button>
            </div>

            <div className="flex gap-3 pt-1 pb-2">
              <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-semibold">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-[2] py-3 rounded-2xl bg-blue-600 text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Save className="w-4 h-4" /> Save Service</>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

interface ServicesAdminSectionProps {
  activeTab: string
}

export const ServicesAdminSection: React.FC<ServicesAdminSectionProps> = ({ activeTab }) => {
  const [serviceFields, setServiceFields] = useState<MenuCategory[]>([])
  const [fieldsLoading, setFieldsLoading] = useState(true)
  const [showFieldForm, setShowFieldForm] = useState(false)
  const [editingField, setEditingField] = useState<MenuCategory | null>(null)
  const [deletingFieldId, setDeletingFieldId] = useState<string | null>(null)

  const [services, setServices] = useState<ServiceItem[]>([])
  const [servicesLoading, setServicesLoading] = useState(true)
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [editingService, setEditingService] = useState<ServiceItem | null>(null)
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null)
  const [serviceFieldFilter, setServiceFieldFilter] = useState<string>('all')

  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [requestsLoading, setRequestsLoading] = useState(true)

  const loadFields = async () => {
    setFieldsLoading(true)
    const data = await fetchServiceFields()
    setServiceFields(data)
    setFieldsLoading(false)
  }

  const loadServices = async () => {
    setServicesLoading(true)
    const data = await fetchServices()
    setServices(data)
    setServicesLoading(false)
  }

  const loadRequests = async () => {
    setRequestsLoading(true)
    const data = await fetchServiceRequests()
    setRequests(data)
    setRequestsLoading(false)
  }

  useEffect(() => {
    loadFields()
    loadServices()
    loadRequests()
  }, [])

  if (activeTab !== 'serviceFields' && activeTab !== 'services' && activeTab !== 'serviceRequests') return null

  const handleSaveField = async (data: Partial<MenuCategory>) => {
    if (editingField) {
      await updateServiceField(editingField.id, data)
    } else {
      await createServiceField(data)
    }
    setEditingField(null)
    await loadFields()
  }

  const handleDeleteField = async (id: string) => {
    await deleteServiceField(id)
    setDeletingFieldId(null)
    await loadFields()
    await loadServices()
  }

  const handleSaveService = async (data: Partial<ServiceItem>) => {
    if (editingService) {
      await updateService(editingService.id, data)
    } else {
      await createService(data)
    }
    setEditingService(null)
    await loadServices()
  }

  const handleDeleteService = async (id: string) => {
    await deleteService(id)
    setDeletingServiceId(null)
    await loadServices()
  }

  const filteredServices = serviceFieldFilter === 'all'
    ? services
    : services.filter(s => s.categoryId === serviceFieldFilter)

  return (
    <>
      {activeTab === 'serviceFields' && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800 dark:text-white">
              Service Fields <span className="text-sm text-gray-400 font-normal">({serviceFields.length})</span>
            </h2>
            <div className="flex gap-2">
              <button onClick={loadFields} className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <RefreshCw className={`w-4 h-4 text-gray-500 ${fieldsLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => { setEditingField(null); setShowFieldForm(true) }}
                className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-xl"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {fieldsLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : serviceFields.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl">🗂️</span>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">No fields yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {serviceFields.map((field, i) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm"
                >
                  <span className="text-2xl flex-shrink-0">{field.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-white">{field.name}</p>
                    <p className="text-xs text-gray-400">ID: {field.id} · Order: {field.display_order}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => { setEditingField(field); setShowFieldForm(true) }}
                      className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    </button>
                    <button
                      onClick={() => setDeletingFieldId(field.id)}
                      className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'services' && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-800 dark:text-white">
              Services <span className="text-sm text-gray-400 font-normal">({filteredServices.length})</span>
            </h2>
            <div className="flex gap-2">
              <button onClick={loadServices} className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <RefreshCw className={`w-4 h-4 text-gray-500 ${servicesLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => { setEditingService(null); setShowServiceForm(true) }}
                className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-xl"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {['all', ...serviceFields.map(f => f.id)].map(fieldId => (
              <button
                key={fieldId}
                onClick={() => setServiceFieldFilter(fieldId)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  serviceFieldFilter === fieldId
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                {fieldId === 'all' ? 'All' : `${serviceFields.find(f => f.id === fieldId)?.icon} ${serviceFields.find(f => f.id === fieldId)?.name}`}
              </button>
            ))}
          </div>

          {servicesLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl">🛎️</span>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">No services found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredServices.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-3 flex items-center gap-3 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">{service.icon}</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-800 dark:text-white line-clamp-1">{service.name}</p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                        service.available
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-500'
                      }`}>
                        {service.available ? '✓' : '✗'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {service.price !== undefined ? `${service.price.toLocaleString()} Birr` : 'Complimentary'}
                      <span className="ml-1 text-purple-500">
                        · {serviceFields.find(f => f.id === service.categoryId)?.name || service.categoryId}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => { setEditingService(service); setShowServiceForm(true) }}
                      className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    </button>
                    <button
                      onClick={() => setDeletingServiceId(service.id)}
                      className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'serviceRequests' && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800 dark:text-white">
              Service Requests{' '}
              <span className="text-sm text-gray-400 font-normal">
                ({requests.filter(r => r.status === 'pending').length} pending)
              </span>
            </h2>
            <button onClick={loadRequests} className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <RefreshCw className={`w-4 h-4 text-gray-500 ${requestsLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {requestsLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl">📭</span>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">No requests yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req, i) => {
                const field = serviceFields.find(f => f.id === req.categoryId)
                return (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="text-sm font-bold text-gray-800 dark:text-white">
                          {field?.icon} {req.serviceName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {req.guestName} · Room {req.roomNumber}
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${
                        req.status === 'pending'
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-600'
                      }`}>
                        {req.status === 'pending' ? 'Pending' : 'Completed'}
                      </span>
                    </div>

                    <div className="space-y-1 mb-3">
                      {req.details.map((d, idx) => (
                        <p key={idx} className="text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-semibold text-gray-600 dark:text-gray-300">{d.label}:</span> {d.value}
                        </p>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-gray-400">
                        {new Date(req.submittedAt).toLocaleString()}
                      </p>
                      {req.status === 'pending' && (
                        <button
                          onClick={async () => { await updateServiceRequestStatus(req.id, 'completed'); await loadRequests() }}
                          className="flex items-center gap-1 bg-green-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full"
                        >
                          <Check className="w-3 h-3" /> Mark Completed
                        </button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {(showFieldForm || editingField) && (
          <FieldForm
            key="field-form"
            initial={editingField}
            onSave={handleSaveField}
            onClose={() => { setShowFieldForm(false); setEditingField(null) }}
          />
        )}
        {(showServiceForm || editingService) && (
          <ServiceForm
            key="service-form"
            initial={editingService}
            fields={serviceFields}
            onSave={handleSaveService}
            onClose={() => { setShowServiceForm(false); setEditingService(null) }}
          />
        )}
        {deletingFieldId && (
          <MiniConfirmModal
            key="del-field"
            message="Delete this field? All services inside it will also be deleted."
            onConfirm={() => handleDeleteField(deletingFieldId)}
            onCancel={() => setDeletingFieldId(null)}
          />
        )}
        {deletingServiceId && (
          <MiniConfirmModal
            key="del-service"
            message="Delete this service? This cannot be undone."
            onConfirm={() => handleDeleteService(deletingServiceId)}
            onCancel={() => setDeletingServiceId(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
