"use client"

import { type LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getPriorityColor, getPriorityIcon, formatStatus } from "@/lib/design-system"
import { cn } from "@/lib/utils"

/**
 * PriorityBadge - Atomic Component
 * 
 * Reusable priority indicator with automatic color mapping.
 * Replaces 100+ hardcoded priority badge implementations.
 */

export interface PriorityBadgeProps {
  priority: string | null | undefined
  showIcon?: boolean
  icon?: LucideIcon
  label?: string
  variant?: 'default' | 'secondary' | 'outline'
  className?: string
}

export function PriorityBadge({
  priority,
  showIcon = true,
  icon: CustomIcon,
  label,
  variant = 'outline',
  className,
}: PriorityBadgeProps) {
  if (!priority) return null
  
  const priorityColor = getPriorityColor(priority)
  const Icon = CustomIcon || (showIcon ? getPriorityIcon(priority) : null)
  const displayText = label || formatStatus(priority)
  
  return (
    <Badge variant={variant} className={cn(priorityColor, className)}>
      {Icon && <Icon className="h-3.5 w-3.5 mr-1" aria-hidden="true" />}
      {displayText}
    </Badge>
  )
}
