"use client"

import { type LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getTypeColor, getTypeIcon, formatStatus } from "@/lib/design-system"
import { cn } from "@/lib/utils"

/**
 * TypeBadge - Atomic Component
 * 
 * Reusable type indicator with automatic color mapping.
 * Replaces 100+ hardcoded type badge implementations.
 */

export interface TypeBadgeProps {
  type: string | null | undefined
  showIcon?: boolean
  icon?: LucideIcon
  label?: string
  variant?: 'default' | 'secondary' | 'outline'
  className?: string
}

export function TypeBadge({
  type,
  showIcon = false,
  icon: CustomIcon,
  label,
  variant = 'outline',
  className,
}: TypeBadgeProps) {
  if (!type) return null
  
  const typeColor = getTypeColor(type)
  const Icon = CustomIcon || (showIcon ? getTypeIcon(type) : null)
  const displayText = label || formatStatus(type)
  
  return (
    <Badge variant={variant} className={cn(typeColor, className)}>
      {Icon && <Icon className="h-3.5 w-3.5 mr-1" aria-hidden="true" />}
      {displayText}
    </Badge>
  )
}
