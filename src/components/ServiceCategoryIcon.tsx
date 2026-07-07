import React from 'react'
import { Shirt, BedDouble, Sparkles, Wrench } from 'lucide-react'

// Colorful icon badges for known service categories — pure frontend,
// no Supabase changes needed. Anything not listed here just falls back
// to whatever emoji/string is already stored (e.g. all Menu categories).
const ICON_MAP: Record<string, { Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; gradient: string }> = {
  laundry: { Icon: Shirt, gradient: 'from-cyan-400 to-blue-500' },
  housekeeping: { Icon: BedDouble, gradient: 'from-violet-400 to-purple-500' },
  spa: { Icon: Sparkles, gradient: 'from-emerald-400 to-teal-500' },
  maintenance: { Icon: Wrench, gradient: 'from-amber-400 to-orange-500' },
}

const sizeMap = {
  sm: { box: 'w-9 h-9 rounded-xl', icon: 'w-4 h-4' },
  md: { box: 'w-11 h-11 rounded-2xl', icon: 'w-5 h-5' },
  lg: { box: 'w-14 h-14 rounded-2xl', icon: 'w-7 h-7' },
}

interface ServiceCategoryIconProps {
  categoryId: string
  fallbackEmoji?: string
  size?: 'sm' | 'md' | 'lg'
}

export const ServiceCategoryIcon: React.FC<ServiceCategoryIconProps> = ({
  categoryId,
  fallbackEmoji,
  size = 'md',
}) => {
  const config = ICON_MAP[categoryId]
  const s = sizeMap[size]

  if (!config) {
    return <span className="text-2xl leading-none">{fallbackEmoji || '🛎️'}</span>
  }

  const { Icon, gradient } = config
  return (
    <div className={`${s.box} bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm flex-shrink-0`}>
      <Icon className={`${s.icon} text-white`} strokeWidth={2.2} />
    </div>
  )
}