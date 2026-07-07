import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, CreditCard as Edit2, Trash2, X, Save, AlertCircle,
  ToggleLeft, ToggleRight, Tag, Megaphone as PromoIcon, Bell,
} from 'lucide-react'
import {
  HomeSpecial, HomePromotion, HomeAnnouncement, AnnouncementPriority, getScheduleStatus,
  fetchSpecials, createSpecial, updateSpecial, deleteSpecial,
  fetchPromotions, createPromotion, updatePromotion, deletePromotion,
  fetchAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement,
} from '../../services/homeDashboardService'

// ── Shared small pieces (self-contained, matches ServicesAdminSection style) ──

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

const StatusPill: React.FC<{ startDate: string | null; endDate: string | null }> = ({ startDate, endDate }) => {
  const status = getScheduleStatus(startDate, endDate)
  const map: Record<string, string> = {
    live: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    scheduled: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    expired: 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
  }
  const label: Record<string, string> = { live: 'Live', scheduled: 'Scheduled', expired: 'Expired' }
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${map[status]}`}>
      {label[status]}
    </span>
  )
}

const PriorityPill: React.FC<{ priority: AnnouncementPriority }> = ({ priority }) => {
  const map: Record<AnnouncementPriority, string> = {
    normal: 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
    important: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    urgent: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  }
  const label: Record<AnnouncementPriority, string> = { normal: 'Normal', important: 'Important', urgent: 'Urgent' }
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${map[priority]}`}>
      {label[priority]}
    </span>
  )
}

// ── Special form ──────────────────────────────────────────────────────────

const SpecialForm: React.FC<{
  initial?: HomeSpecial | null
  onSave: (data: Partial<HomeSpecial>) => Promise<void>
  onClose: () => void
}> = ({ initial, onSave, onClose }) => {
  const [title, setTitle] = useState(initial?.title || '')
  const [subtitle, setSubtitle] = useState(initial?.subtitle || '')
  const [badge, setBadge] = useState(initial?.badge || '')
  const [emoji, setEmoji] = useState(initial?.emoji || '🍽️')
  const [startDate, setStartDate] = useState(initial?.start_date?.slice(0, 10) || '')
  const [endDate, setEndDate] = useState(initial?.end_date?.slice(0, 10) || '')
  const [sortOrder, setSortOrder] = useState(String(initial?.sort_order ?? 0))
  const [active, setActive] = useState(initial?.active ?? true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!title.trim()) e.title = 'Title is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await onSave({
        title, subtitle, badge, emoji,
        start_date: startDate ? `${startDate}T00:00:00` : null,
        end_date: endDate ? `${endDate}T23:59:59` : null,
        sort_order: Number(sortOrder) || 0,
        active,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[400] bg-black/60 flex items-end sm:items-center justify-center">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-gray-900 flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {initial ? 'Edit Special' : 'Add Special'}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <FormField label="Title" value={title} onChange={setTitle} placeholder="Laundry Service" error={errors.title} />
          <FormField label="Subtitle" value={subtitle} onChange={setSubtitle} placeholder="On all laundry orders" />
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Badge" value={badge} onChange={setBadge} placeholder="20% OFF" />
            <FormField label="Emoji" value={emoji} onChange={setEmoji} placeholder="🧺" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Start Date" value={startDate} onChange={setStartDate} type="date" />
            <FormField label="End Date" value={endDate} onChange={setEndDate} type="date" />
          </div>
          <FormField label="Sort Order" value={sortOrder} onChange={setSortOrder} type="number" />

          <button
            onClick={() => setActive(!active)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            {active ? <ToggleRight className="w-8 h-8 text-green-500" /> : <ToggleLeft className="w-8 h-8 text-gray-400" />}
            {active ? 'Visible to guests' : 'Hidden from guests'}
          </button>
        </div>

        <div className="p-5 pt-0">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-bold disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Special'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Promotion form ────────────────────────────────────────────────────────

const PromotionForm: React.FC<{
  initial?: HomePromotion | null
  onSave: (data: Partial<HomePromotion>) => Promise<void>
  onClose: () => void
}> = ({ initial, onSave, onClose }) => {
  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [imageUrl, setImageUrl] = useState(initial?.image_url || '')
  const [buttonLabel, setButtonLabel] = useState(initial?.button_label || 'Learn more')
  const [targetPage, setTargetPage] = useState<'menu' | 'services'>(initial?.target_page || 'menu')
  const [targetCategoryId, setTargetCategoryId] = useState(initial?.target_category_id || '')
  const [startDate, setStartDate] = useState(initial?.start_date?.slice(0, 10) || '')
  const [endDate, setEndDate] = useState(initial?.end_date?.slice(0, 10) || '')
  const [sortOrder, setSortOrder] = useState(String(initial?.sort_order ?? 0))
  const [active, setActive] = useState(initial?.active ?? true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!title.trim()) e.title = 'Title is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await onSave({
        title, description, image_url: imageUrl, button_label: buttonLabel,
        target_page: targetPage, target_category_id: targetCategoryId || null,
        start_date: startDate ? `${startDate}T00:00:00` : null,
        end_date: endDate ? `${endDate}T23:59:59` : null,
        sort_order: Number(sortOrder) || 0,
        active,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[400] bg-black/60 flex items-end sm:items-center justify-center">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-gray-900 flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {initial ? 'Edit Promotion' : 'Add Promotion'}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <FormField label="Title" value={title} onChange={setTitle} placeholder="Weekend Offer" error={errors.title} />
          <FormField label="Description" value={description} onChange={setDescription} placeholder="20% off all spa treatments" multiline />
          <FormField label="Image URL" value={imageUrl} onChange={setImageUrl} placeholder="https://..." />
          <FormField label="Button Label" value={buttonLabel} onChange={setButtonLabel} placeholder="Learn more" />

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Target Page</label>
            <select
              value={targetPage}
              onChange={e => setTargetPage(e.target.value as 'menu' | 'services')}
              className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white outline-none border-2 border-transparent focus:border-blue-500"
            >
              <option value="menu">Menu</option>
              <option value="services">Services</option>
            </select>
          </div>

          <FormField
            label="Target Category ID (optional)"
            value={targetCategoryId}
            onChange={setTargetCategoryId}
            placeholder="e.g. spa, drinks, mains"
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Start Date" value={startDate} onChange={setStartDate} type="date" />
            <FormField label="End Date" value={endDate} onChange={setEndDate} type="date" />
          </div>
          <FormField label="Sort Order" value={sortOrder} onChange={setSortOrder} type="number" />

          <button
            onClick={() => setActive(!active)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            {active ? <ToggleRight className="w-8 h-8 text-green-500" /> : <ToggleLeft className="w-8 h-8 text-gray-400" />}
            {active ? 'Visible to guests' : 'Hidden from guests'}
          </button>
        </div>

        <div className="p-5 pt-0">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-bold disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Promotion'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Announcement form ─────────────────────────────────────────────────────

const AnnouncementForm: React.FC<{
  initial?: HomeAnnouncement | null
  onSave: (data: Partial<HomeAnnouncement>) => Promise<void>
  onClose: () => void
}> = ({ initial, onSave, onClose }) => {
  const [text, setText] = useState(initial?.text || '')
  const [timeLabel, setTimeLabel] = useState(initial?.time_label || '')
  const [priority, setPriority] = useState<AnnouncementPriority>(initial?.priority || 'normal')
  const [startDate, setStartDate] = useState(initial?.start_date?.slice(0, 10) || '')
  const [endDate, setEndDate] = useState(initial?.end_date?.slice(0, 10) || '')
  const [sortOrder, setSortOrder] = useState(String(initial?.sort_order ?? 0))
  const [active, setActive] = useState(initial?.active ?? true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!text.trim()) e.text = 'Announcement text is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await onSave({
        text, time_label: timeLabel, priority,
        start_date: startDate ? `${startDate}T00:00:00` : null,
        end_date: endDate ? `${endDate}T23:59:59` : null,
        sort_order: Number(sortOrder) || 0,
        active,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[400] bg-black/60 flex items-end sm:items-center justify-center">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-gray-900 flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {initial ? 'Edit Announcement' : 'Add Announcement'}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <FormField label="Announcement Text" value={text} onChange={setText} placeholder="Breakfast starts at 6 AM" multiline error={errors.text} />
          <FormField label="Time Label" value={timeLabel} onChange={setTimeLabel} placeholder="Daily / Today / Tonight" />

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Priority</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as AnnouncementPriority)}
              className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white outline-none border-2 border-transparent focus:border-blue-500"
            >
              <option value="normal">Normal</option>
              <option value="important">Important</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Start Date" value={startDate} onChange={setStartDate} type="date" />
            <FormField label="End Date" value={endDate} onChange={setEndDate} type="date" />
          </div>
          <FormField label="Sort Order" value={sortOrder} onChange={setSortOrder} type="number" />

          <button
            onClick={() => setActive(!active)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            {active ? <ToggleRight className="w-8 h-8 text-green-500" /> : <ToggleLeft className="w-8 h-8 text-gray-400" />}
            {active ? 'Visible to guests' : 'Hidden from guests'}
          </button>
        </div>

        <div className="p-5 pt-0">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-bold disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Announcement'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────

interface HomeDashboardAdminSectionProps {
  activeTab: string
}

export const HomeDashboardAdminSection: React.FC<HomeDashboardAdminSectionProps> = ({ activeTab }) => {
  const [subTab, setSubTab] = useState<'specials' | 'promotions' | 'announcements'>('specials')

  const [specials, setSpecials] = useState<HomeSpecial[]>([])
  const [specialsLoading, setSpecialsLoading] = useState(true)
  const [showSpecialForm, setShowSpecialForm] = useState(false)
  const [editingSpecial, setEditingSpecial] = useState<HomeSpecial | null>(null)
  const [deletingSpecialId, setDeletingSpecialId] = useState<string | null>(null)

  const [promotions, setPromotions] = useState<HomePromotion[]>([])
  const [promotionsLoading, setPromotionsLoading] = useState(true)
  const [showPromoForm, setShowPromoForm] = useState(false)
  const [editingPromo, setEditingPromo] = useState<HomePromotion | null>(null)
  const [deletingPromoId, setDeletingPromoId] = useState<string | null>(null)

  const [announcements, setAnnouncements] = useState<HomeAnnouncement[]>([])
  const [announcementsLoading, setAnnouncementsLoading] = useState(true)
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<HomeAnnouncement | null>(null)
  const [deletingAnnouncementId, setDeletingAnnouncementId] = useState<string | null>(null)

  const loadSpecials = async () => {
    setSpecialsLoading(true)
    setSpecials(await fetchSpecials())
    setSpecialsLoading(false)
  }

  const loadPromotions = async () => {
    setPromotionsLoading(true)
    setPromotions(await fetchPromotions())
    setPromotionsLoading(false)
  }

  const loadAnnouncements = async () => {
    setAnnouncementsLoading(true)
    setAnnouncements(await fetchAnnouncements())
    setAnnouncementsLoading(false)
  }

  useEffect(() => {
    loadSpecials()
    loadPromotions()
    loadAnnouncements()
  }, [])

  if (activeTab !== 'homeDashboard') return null

  const handleSaveSpecial = async (data: Partial<HomeSpecial>) => {
    if (editingSpecial) await updateSpecial(editingSpecial.id, data)
    else await createSpecial(data)
    await loadSpecials()
  }

  const handleSavePromo = async (data: Partial<HomePromotion>) => {
    if (editingPromo) await updatePromotion(editingPromo.id, data)
    else await createPromotion(data)
    await loadPromotions()
  }

  const handleSaveAnnouncement = async (data: Partial<HomeAnnouncement>) => {
    if (editingAnnouncement) await updateAnnouncement(editingAnnouncement.id, data)
    else await createAnnouncement(data)
    await loadAnnouncements()
  }

  return (
    <div className="p-4">

      {/* Sub-tab pills */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        <button
          onClick={() => setSubTab('specials')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold flex-shrink-0 ${
            subTab === 'specials' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
          }`}
        >
          <Tag className="w-3.5 h-3.5" /> Today's Specials
        </button>
        <button
          onClick={() => setSubTab('promotions')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold flex-shrink-0 ${
            subTab === 'promotions' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
          }`}
        >
          <PromoIcon className="w-3.5 h-3.5" /> Promotions
        </button>
        <button
          onClick={() => setSubTab('announcements')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold flex-shrink-0 ${
            subTab === 'announcements' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
          }`}
        >
          <Bell className="w-3.5 h-3.5" /> Announcements
        </button>
      </div>

      {/* ── Specials list ── */}
      {subTab === 'specials' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-800 dark:text-white">Today's Specials</h2>
            <button
              onClick={() => { setEditingSpecial(null); setShowSpecialForm(true) }}
              className="flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" /> Add Special
            </button>
          </div>

          {specialsLoading ? (
            <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mt-10" />
          ) : specials.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">No specials yet.</p>
          ) : (
            <div className="space-y-2">
              {specials.map(s => (
                <div key={s.id} className="bg-white dark:bg-gray-800 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
                  <span className="text-2xl flex-shrink-0">{s.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{s.title}</h3>
                      <StatusPill startDate={s.start_date} endDate={s.end_date} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{s.subtitle || s.badge}</p>
                  </div>
                  <button
                    onClick={() => { setEditingSpecial(s); setShowSpecialForm(true) }}
                    className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
                  </button>
                  <button
                    onClick={() => setDeletingSpecialId(s.id)}
                    className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Promotions list ── */}
      {subTab === 'promotions' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-800 dark:text-white">Promotions</h2>
            <button
              onClick={() => { setEditingPromo(null); setShowPromoForm(true) }}
              className="flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" /> Add Promotion
            </button>
          </div>

          {promotionsLoading ? (
            <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mt-10" />
          ) : promotions.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">No promotions yet.</p>
          ) : (
            <div className="space-y-2">
              {promotions.map(p => (
                <div key={p.id} className="bg-white dark:bg-gray-800 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
                    {p.image_url && <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{p.title}</h3>
                      <StatusPill startDate={p.start_date} endDate={p.end_date} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      → {p.target_page}{p.target_category_id ? ` / ${p.target_category_id}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => { setEditingPromo(p); setShowPromoForm(true) }}
                    className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
                  </button>
                  <button
                    onClick={() => setDeletingPromoId(p.id)}
                    className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Announcements list ── */}
      {subTab === 'announcements' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-800 dark:text-white">Announcements</h2>
            <button
              onClick={() => { setEditingAnnouncement(null); setShowAnnouncementForm(true) }}
              className="flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" /> Add Announcement
            </button>
          </div>

          {announcementsLoading ? (
            <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mt-10" />
          ) : announcements.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">No announcements yet.</p>
          ) : (
            <div className="space-y-2">
              {announcements.map(a => (
                <div key={a.id} className="bg-white dark:bg-gray-800 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusPill startDate={a.start_date} endDate={a.end_date} />
                      <PriorityPill priority={a.priority} />
                    </div>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">{a.text}</p>
                    {a.time_label && (
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium mt-0.5">{a.time_label}</p>
                    )}
                  </div>
                  <button
                    onClick={() => { setEditingAnnouncement(a); setShowAnnouncementForm(true) }}
                    className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
                  </button>
                  <button
                    onClick={() => setDeletingAnnouncementId(a.id)}
                    className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {showSpecialForm && (
          <SpecialForm initial={editingSpecial} onSave={handleSaveSpecial} onClose={() => setShowSpecialForm(false)} />
        )}
        {showPromoForm && (
          <PromotionForm initial={editingPromo} onSave={handleSavePromo} onClose={() => setShowPromoForm(false)} />
        )}
        {showAnnouncementForm && (
          <AnnouncementForm initial={editingAnnouncement} onSave={handleSaveAnnouncement} onClose={() => setShowAnnouncementForm(false)} />
        )}
        {deletingSpecialId && (
          <MiniConfirmModal
            message="Delete this special? This cannot be undone."
            onCancel={() => setDeletingSpecialId(null)}
            onConfirm={async () => { await deleteSpecial(deletingSpecialId); setDeletingSpecialId(null); await loadSpecials() }}
          />
        )}
        {deletingPromoId && (
          <MiniConfirmModal
            message="Delete this promotion? This cannot be undone."
            onCancel={() => setDeletingPromoId(null)}
            onConfirm={async () => { await deletePromotion(deletingPromoId); setDeletingPromoId(null); await loadPromotions() }}
          />
        )}
        {deletingAnnouncementId && (
          <MiniConfirmModal
            message="Delete this announcement? This cannot be undone."
            onCancel={() => setDeletingAnnouncementId(null)}
            onConfirm={async () => { await deleteAnnouncement(deletingAnnouncementId); setDeletingAnnouncementId(null); await loadAnnouncements() }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}