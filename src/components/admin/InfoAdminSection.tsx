import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, CreditCard as Edit2, Trash2, X, Save, AlertCircle,
  ToggleLeft, ToggleRight, ChevronUp, ChevronDown,
  Building2, UtensilsCrossed, Sparkles, Star, ShieldAlert,
} from 'lucide-react'
import {
  HotelInfoItem, HotelInfoSection,
  fetchHotelInfoItems, createHotelInfoItem, updateHotelInfoItem, deleteHotelInfoItem,
} from '../../services/hotelInfoService'

// ── Shared small pieces ────────────────────────────────────────────────────

const MiniConfirmModal: React.FC<{
  message: string
  onConfirm: () => void
  onCancel: () => void
}> = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[500] bg-black/60 flex items-center justify-center px-4">
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-xs w-full shadow-2xl">
      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-6 h-6 text-red-500" />
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 text-center mb-5 leading-relaxed">{message}</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-semibold">Cancel</button>
        <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold">Delete</button>
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
}> = ({ label, value, onChange, placeholder, type = 'text', error }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white outline-none border-2 ${error ? 'border-red-400' : 'border-transparent focus:border-blue-500'}`}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
)

// ── Item form ──────────────────────────────────────────────────────────────

const InfoItemForm: React.FC<{
  section: HotelInfoSection
  initial?: HotelInfoItem | null
  onSave: (d: Partial<HotelInfoItem>) => Promise<void>
  onClose: () => void
}> = ({ section, initial, onSave, onClose }) => {
  const [label, setLabel] = useState(initial?.label || '')
  const [value, setValue] = useState(initial?.value || '')
  const [icon, setIcon] = useState(initial?.icon || '')
  const [sortOrder, setSortOrder] = useState(String(initial?.sort_order ?? 0))
  const [active, setActive] = useState(initial?.active ?? true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isFacilities = section === 'facilities'

  const validate = () => {
    const e: Record<string, string> = {}
    if (!label.trim()) e.label = 'Label is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await onSave({ section, label, value, icon, sort_order: Number(sortOrder) || 0, active })
      onClose()
    } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-[400] bg-black/60 flex items-end sm:items-center justify-center">
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">{initial ? 'Edit Item' : 'Add Item'}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"><X className="w-4 h-4 text-gray-500" /></button>
        </div>
        <div className="p-5 space-y-4">
          <FormField
            label={isFacilities ? 'Facility Name' : 'Label'}
            value={label}
            onChange={setLabel}
            placeholder={isFacilities ? 'Swimming Pool' : 'Breakfast'}
            error={errors.label}
          />
          {!isFacilities && (
            <FormField label="Value" value={value} onChange={setValue} placeholder="6:00 AM – 10:00 AM" />
          )}
          <FormField label="Icon (emoji, optional)" value={icon} onChange={setIcon} placeholder="🏊" />
          <FormField label="Sort Order" value={sortOrder} onChange={setSortOrder} type="number" />
          <button onClick={() => setActive(!active)} className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            {active ? <ToggleRight className="w-8 h-8 text-green-500" /> : <ToggleLeft className="w-8 h-8 text-gray-400" />}
            {active ? 'Visible to guests' : 'Hidden from guests'}
          </button>
        </div>
        <div className="p-5 pt-0">
          <button onClick={handleSubmit} disabled={saving} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-bold disabled:opacity-60">
            <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save Item'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Section panel (list + reorder for one section) ─────────────────────────

const SectionPanel: React.FC<{ section: HotelInfoSection; items: HotelInfoItem[]; onChanged: () => void }> = ({ section, items, onChanged }) => {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<HotelInfoItem | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const sectionItems = items.filter(i => i.section === section).sort((a, b) => a.sort_order - b.sort_order)
  const isFacilities = section === 'facilities'

  const handleSave = async (data: Partial<HotelInfoItem>) => {
    if (editing) await updateHotelInfoItem(editing.id, data)
    else await createHotelInfoItem(data)
    onChanged()
  }

  const toggleActive = async (item: HotelInfoItem) => {
    await updateHotelInfoItem(item.id, { ...item, active: !item.active })
    onChanged()
  }

  const move = async (item: HotelInfoItem, direction: -1 | 1) => {
    const idx = sectionItems.findIndex(x => x.id === item.id)
    const newIdx = idx + direction
    if (newIdx < 0 || newIdx >= sectionItems.length) return
    const other = sectionItems[newIdx]
    await Promise.all([
      updateHotelInfoItem(item.id, { ...item, sort_order: other.sort_order }),
      updateHotelInfoItem(other.id, { ...other, sort_order: item.sort_order }),
    ])
    onChanged()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-800 dark:text-white capitalize">{section}</h2>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold">
          <Plus className="w-3.5 h-3.5" /> Add Item
        </button>
      </div>

      {sectionItems.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">No items yet.</p>
      ) : (
        <div className="space-y-2">
          {sectionItems.map((item, i) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
              <div className="flex flex-col flex-shrink-0">
                <button onClick={() => move(item, -1)} disabled={i === 0} className="disabled:opacity-25"><ChevronUp className="w-4 h-4 text-gray-400" /></button>
                <button onClick={() => move(item, 1)} disabled={i === sectionItems.length - 1} className="disabled:opacity-25"><ChevronDown className="w-4 h-4 text-gray-400" /></button>
              </div>
              {item.icon && <span className="text-xl flex-shrink-0">{item.icon}</span>}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.label}</h3>
                {!isFacilities && item.value && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.value}</p>
                )}
              </div>
              <button onClick={() => toggleActive(item)} className="flex-shrink-0">
                {item.active ? <ToggleRight className="w-7 h-7 text-green-500" /> : <ToggleLeft className="w-7 h-7 text-gray-400" />}
              </button>
              <button onClick={() => { setEditing(item); setShowForm(true) }} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0"><Edit2 className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" /></button>
              <button onClick={() => setDeletingId(item.id)} className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <InfoItemForm section={section} initial={editing} onSave={handleSave} onClose={() => setShowForm(false)} />
        )}
        {deletingId && (
          <MiniConfirmModal
            message="Delete this item? This cannot be undone."
            onCancel={() => setDeletingId(null)}
            onConfirm={async () => { await deleteHotelInfoItem(deletingId); setDeletingId(null); onChanged() }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────

interface InfoAdminSectionProps {
  activeTab: string
}

export const InfoAdminSection: React.FC<InfoAdminSectionProps> = ({ activeTab }) => {
  const [subSection, setSubSection] = useState<HotelInfoSection>('reception')
  const [items, setItems] = useState<HotelInfoItem[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => { setLoading(true); setItems(await fetchHotelInfoItems()); setLoading(false) }

  useEffect(() => { load() }, [])

  if (activeTab !== 'info') return null

  const pills: { key: HotelInfoSection; label: string; icon: React.ReactNode }[] = [
    { key: 'reception', label: 'Reception', icon: <Building2 className="w-3.5 h-3.5" /> },
    { key: 'restaurant', label: 'Restaurant Hours', icon: <UtensilsCrossed className="w-3.5 h-3.5" /> },
    { key: 'facilities', label: 'Facilities', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { key: 'services', label: 'Services', icon: <Star className="w-3.5 h-3.5" /> },
    { key: 'emergency', label: 'Emergency', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
  ]

  return (
    <div className="p-4">
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
        Manages the Restaurant Hours, Facilities, Services, and Emergency Contacts sections of the guest Hotel Directory. Reception's phone, address, and check-in/out times are managed in Settings.
      </p>

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {pills.map(p => (
          <button
            key={p.key}
            onClick={() => setSubSection(p.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold flex-shrink-0 ${
              subSection === p.key ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}
          >
            {p.icon} {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mt-10" />
      ) : (
        <SectionPanel section={subSection} items={items} onChanged={load} />
      )}
    </div>
  )
}