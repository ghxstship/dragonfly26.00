"use client"

import { type LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getCategoryColor, getCategoryIcon, formatStatus } from "@/lib/design-system"
import { cn } from "@/lib/utils"

/**
 * CategoryBadge - Atomic Component
 * 
 * Reusable category indicator with automatic color mapping.
 * Replaces 50+ hardcoded category badge implementations.
 */

export interface CategoryBadgeProps {
  category: string | null | undefined
  showIcon?: boolean
  icon?: LucideIcon
  label?: string
  variant?: 'default' | 'secondary' | 'outline'
  className?: string
}

export function CategoryBadge({
  category,
  showIcon = false,
  icon: CustomIcon,
  label,
  variant = 'outline',
  className,
}: CategoryBadgeProps) {
  if (!category) return null
  
  const categoryColor = getCategoryColor(category)
  const Icon = CustomIcon || (showIcon ? getCategoryIcon(category) : null)
  const displayText = label || formatStatus(category)
  
  return (
    <Badge variant={variant} className={cn(categoryColor, className)}>
      {Icon && <Icon aria-hidden="true" className="h-3.5 w-3.5 mr-1" />}
      {displayText}
    </Badge>
  )
}
