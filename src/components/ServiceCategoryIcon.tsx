import React from 'react'

interface ServiceCategoryIconProps {
  categoryId: string
  fallbackEmoji?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'w-9 h-9',
  md: 'w-11 h-11',
  lg: 'w-14 h-14',
}

const isImageUrl = (value?: string): boolean => {
  if (!value) return false
  return /^https?:\/\//i.test(value) || value.startsWith('data:image')
}

export const ServiceCategoryIcon: React.FC<ServiceCategoryIconProps> = ({
  fallbackEmoji,
  size = 'md',
}) => {
  const boxSize = sizeMap[size]

  if (isImageUrl(fallbackEmoji)) {
    return (
      <div className={`${boxSize} rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50 dark:bg-gray-800`}>
        <img src={fallbackEmoji} alt="" className="w-full h-full object-contain" />
      </div>
    )
  }

  return <span className="text-2xl leading-none">{fallbackEmoji || '🛎️'}</span>
}