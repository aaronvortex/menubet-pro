import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Image as ImageIcon } from 'lucide-react'
import { ServiceItem, ServiceRequest } from '../types/service'
import { MenuCategory } from '../types/menu'
import { serviceCategoryStyles } from '../data/serviceData'
import { createServiceRequest } from '../services/serviceDataService'

interface ServiceRequestFormProps {
  item: ServiceItem | null
  actionLabel: string
  isOpen: boolean
  onClose: () => void
  fields: MenuCategory[]
  services: ServiceItem[]
}

const priorities = ['Low', 'Medium', 'High', 'Urgent']

const inputClass = (hasError: boolean) =>
  `w-full bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white outline-none border-2 ${
    hasError ? 'border-red-400' : 'border-transparent focus:border-blue-500'
  }`

const FormRow: React.FC<{ label: string; error?: string; children: React.ReactNode }> = ({
  label,
  error,
  children,
}) => (
  <div>
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
      {label}
    </label>
    {children}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
)

export const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({
  item,
  actionLabel,
  isOpen,
  onClose,
  fields,
  services,
}) => {
  const [form, setForm] = useState({
    fullName: '',
    roomNumber: '',
    phone: '',
    pickupTime: '',
    deliveryTime: '',
    quantity: '1',
    specialInstructions: '',
    requestType: 'Standard Request',
    preferredTime: '',
    notes: '',
    date: '',
    time: '',
    selectedServiceId: '',
    issueCategoryId: '',
    problemDescription: '',
    priority: 'Medium',
    additionalNotes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen && item) {
      setForm({
        fullName: '',
        roomNumber: '',
        phone: '',
        pickupTime: '',
        deliveryTime: '',
        quantity: '1',
        specialInstructions: '',
        requestType: 'Standard Request',
        preferredTime: '',
        notes: '',
        date: '',
        time: '',
        selectedServiceId: item.id,
        issueCategoryId: item.id,
        problemDescription: '',
        priority: 'Medium',
        additionalNotes: '',
      })
      setErrors({})
      setSubmitted(false)
    }
  }, [isOpen, item?.id])

  if (!item) return null

  const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))
  const sameCategoryItems = services.filter(s => s.categoryId === item.categoryId)
  const category = fields.find(c => c.id === item.categoryId)
  const style = serviceCategoryStyles[item.categoryId]

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.fullName.trim()) e.fullName = 'Full name is required'
    if (!form.roomNumber.trim()) e.roomNumber = 'Room number is required'

    if (item.categoryId === 'laundry') {
      if (!form.pickupTime) e.pickupTime = 'Pickup time is required'
      if (!form.quantity || Number(form.quantity) < 1) e.quantity = 'Enter at least 1'
    }
    if (item.categoryId === 'housekeeping') {
      if (!form.preferredTime) e.preferredTime = 'Preferred time is required'
    }
    if (item.categoryId === 'spa') {
      if (!form.date) e.date = 'Date is required'
      if (!form.time) e.time = 'Time is required'
      if (!form.selectedServiceId) e.selectedServiceId = 'Please select a service'
    }
    if (item.categoryId === 'maintenance') {
      if (!form.issueCategoryId) e.issueCategoryId = 'Please select an issue category'
      if (!form.problemDescription.trim()) e.problemDescription = 'Please describe the problem'
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    const details: { label: string; value: string }[] = []

    if (item.categoryId === 'laundry') {
      details.push({ label: 'Phone', value: form.phone || '—' })
      details.push({ label: 'Pickup Time', value: form.pickupTime })
      details.push({ label: 'Delivery Time', value: form.deliveryTime || '—' })
      details.push({ label: 'Quantity', value: form.quantity })
      details.push({ label: 'Special Instructions', value: form.specialInstructions || '—' })
    } else if (item.categoryId === 'housekeeping') {
      details.push({ label: 'Request Type', value: form.requestType })
      details.push({ label: 'Preferred Time', value: form.preferredTime })
      details.push({ label: 'Notes', value: form.notes || '—' })
    } else if (item.categoryId === 'spa') {
      const selected = services.find(s => s.id === form.selectedServiceId)
      details.push({ label: 'Date', value: form.date })
      details.push({ label: 'Time', value: form.time })
      details.push({ label: 'Selected Service', value: selected?.name || item.name })
      details.push({ label: 'Notes', value: form.notes || '—' })
    } else if (item.categoryId === 'maintenance') {
      const selectedIssue = services.find(s => s.id === form.issueCategoryId)
      details.push({ label: 'Issue Category', value: selectedIssue?.name || item.name })
      details.push({ label: 'Problem Description', value: form.problemDescription })
      details.push({ label: 'Priority', value: form.priority })
      details.push({ label: 'Additional Notes', value: form.additionalNotes || '—' })
    }

    const request: Omit<ServiceRequest, 'id'> = {
      serviceId: item.id,
      serviceName: item.name,
      categoryId: item.categoryId,
      actionLabel,
      guestName: form.fullName.trim(),
      roomNumber: form.roomNumber.trim(),
      status: 'pending',
      submittedAt: new Date().toISOString(),
      details,
    }

    setSubmitting(true)
    try {
      await createServiceRequest(request)
      setSubmitted(true)
    } catch (error) {
      console.error('Failed to submit service request:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm"
          />

          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.9 }}
            className="fixed bottom-0 left-0 right-0 z-[201] bg-white dark:bg-gray-900 rounded-t-3xl overflow-hidden max-h-[92vh] flex flex-col shadow-2xl"
          >
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>

            {submitted ? (
              <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-5"
                >
                  <Check className="w-8 h-8 text-white" strokeWidth={3} />
                </motion.div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Request Submitted
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs mb-6">
                  Our {category?.name || 'team'} has been notified and will take care of your {item.name.toLowerCase()} request shortly.
                </p>
                <button
                  onClick={onClose}
                  className="w-full max-w-xs py-3.5 rounded-2xl bg-blue-600 text-white text-sm font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="px-5 pt-2 pb-3 flex-shrink-0 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wide bg-clip-text text-transparent bg-gradient-to-r ${style?.gradient || 'from-blue-500 to-blue-600'}`}>
                        {actionLabel}
                      </p>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                        {item.name}
                      </h2>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

                  <FormRow label="Full Name *" error={errors.fullName}>
                    <input
                      value={form.fullName}
                      onChange={e => set('fullName', e.target.value)}
                      placeholder="Your name"
                      className={inputClass(!!errors.fullName)}
                    />
                  </FormRow>

                  <FormRow label="Room Number *" error={errors.roomNumber}>
                    <input
                      value={form.roomNumber}
                      onChange={e => set('roomNumber', e.target.value)}
                      placeholder="e.g. 204"
                      className={inputClass(!!errors.roomNumber)}
                    />
                  </FormRow>

                  {item.categoryId === 'laundry' && (
                    <>
                      <FormRow label="Phone Number (optional)">
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={e => set('phone', e.target.value)}
                          placeholder="Optional"
                          className={inputClass(false)}
                        />
                      </FormRow>
                      <FormRow label="Pickup Time *" error={errors.pickupTime}>
                        <input
                          type="time"
                          value={form.pickupTime}
                          onChange={e => set('pickupTime', e.target.value)}
                          className={inputClass(!!errors.pickupTime)}
                        />
                      </FormRow>
                      <FormRow label="Delivery Time (optional)">
                        <input
                          type="time"
                          value={form.deliveryTime}
                          onChange={e => set('deliveryTime', e.target.value)}
                          className={inputClass(false)}
                        />
                      </FormRow>
                      <FormRow label="Quantity *" error={errors.quantity}>
                        <input
                          type="number"
                          min="1"
                          value={form.quantity}
                          onChange={e => set('quantity', e.target.value)}
                          className={inputClass(!!errors.quantity)}
                        />
                      </FormRow>
                      <FormRow label="Special Instructions (optional)">
                        <textarea
                          value={form.specialInstructions}
                          onChange={e => set('specialInstructions', e.target.value)}
                          rows={3}
                          placeholder="Anything we should know?"
                          className={inputClass(false) + ' resize-none'}
                        />
                      </FormRow>
                    </>
                  )}

                  {item.categoryId === 'housekeeping' && (
                    <>
                      <FormRow label="Request Type *">
                        <select
                          value={form.requestType}
                          onChange={e => set('requestType', e.target.value)}
                          className={inputClass(false)}
                        >
                          <option>Standard Request</option>
                          <option>Urgent</option>
                          <option>Scheduled for Later</option>
                        </select>
                      </FormRow>
                      <FormRow label="Preferred Time *" error={errors.preferredTime}>
                        <input
                          type="time"
                          value={form.preferredTime}
                          onChange={e => set('preferredTime', e.target.value)}
                          className={inputClass(!!errors.preferredTime)}
                        />
                      </FormRow>
                      <FormRow label="Notes (optional)">
                        <textarea
                          value={form.notes}
                          onChange={e => set('notes', e.target.value)}
                          rows={3}
                          placeholder="Anything we should know?"
                          className={inputClass(false) + ' resize-none'}
                        />
                      </FormRow>
                    </>
                  )}

                  {item.categoryId === 'spa' && (
                    <>
                      <FormRow label="Date *" error={errors.date}>
                        <input
                          type="date"
                          value={form.date}
                          onChange={e => set('date', e.target.value)}
                          className={inputClass(!!errors.date)}
                        />
                      </FormRow>
                      <FormRow label="Time *" error={errors.time}>
                        <input
                          type="time"
                          value={form.time}
                          onChange={e => set('time', e.target.value)}
                          className={inputClass(!!errors.time)}
                        />
                      </FormRow>
                      <FormRow label="Selected Service *" error={errors.selectedServiceId}>
                        <select
                          value={form.selectedServiceId}
                          onChange={e => set('selectedServiceId', e.target.value)}
                          className={inputClass(!!errors.selectedServiceId)}
                        >
                          {sameCategoryItems.map(s => (
                            <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                          ))}
                        </select>
                      </FormRow>
                      <FormRow label="Notes (optional)">
                        <textarea
                          value={form.notes}
                          onChange={e => set('notes', e.target.value)}
                          rows={3}
                          placeholder="Anything we should know?"
                          className={inputClass(false) + ' resize-none'}
                        />
                      </FormRow>
                    </>
                  )}

                  {item.categoryId === 'maintenance' && (
                    <>
                      <FormRow label="Issue Category *" error={errors.issueCategoryId}>
                        <select
                          value={form.issueCategoryId}
                          onChange={e => set('issueCategoryId', e.target.value)}
                          className={inputClass(!!errors.issueCategoryId)}
                        >
                          {sameCategoryItems.map(s => (
                            <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                          ))}
                        </select>
                      </FormRow>
                      <FormRow label="Problem Description *" error={errors.problemDescription}>
                        <textarea
                          value={form.problemDescription}
                          onChange={e => set('problemDescription', e.target.value)}
                          rows={3}
                          placeholder="Describe the issue"
                          className={inputClass(!!errors.problemDescription) + ' resize-none'}
                        />
                      </FormRow>
                      <FormRow label="Priority *">
                        <div className="flex gap-2">
                          {priorities.map(p => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => set('priority', p)}
                              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
                                form.priority === p
                                  ? p === 'Urgent'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-blue-600 text-white'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </FormRow>
                      <FormRow label="Photo (optional)">
                        <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl py-5 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                          <ImageIcon className="w-5 h-5 mb-1" />
                          <span className="text-xs">Photo upload coming soon</span>
                        </div>
                      </FormRow>
                      <FormRow label="Additional Notes (optional)">
                        <textarea
                          value={form.additionalNotes}
                          onChange={e => set('additionalNotes', e.target.value)}
                          rows={2}
                          placeholder="Anything else?"
                          className={inputClass(false) + ' resize-none'}
                        />
                      </FormRow>
                    </>
                  )}

                </div>

                <div className="flex-shrink-0 px-5 py-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                  <motion.button
                    onClick={handleSubmit}
                    disabled={submitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 rounded-2xl font-bold text-base bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 transition-all duration-300 disabled:opacity-60"
                  >
                    {submitting ? 'Submitting...' : `Submit ${actionLabel}`}
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
