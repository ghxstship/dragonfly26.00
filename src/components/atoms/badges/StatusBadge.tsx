"use client"

import { type LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getStatusColor, getStatusIcon, formatStatus } from "@/lib/design-system"
import { cn } from "@/lib/utils"

/**
 * StatusBadge - Atomic Component
 * 
 * Reusable status badge with automatic color mapping and icon selection.
 * Replaces 200+ hardcoded status badge implementations.
 * 
 * Features:
 * - Automatic color mapping via design tokens
 * - Optional icon (auto-selected or custom)
 * - Automatic status formatting
 * - Consistent styling across all tabs
 * - ARIA labels for accessibility
 * 
 * Usage:
 * <StatusBadge status="active" />
 * <StatusBadge status="pending" showIcon />
 * <StatusBadge status="completed" icon={CheckCircle2} />
 */

export interface StatusBadgeProps {
  /** Status value (active, pending, completed, etc.) */
  status: string | null | undefined
  
  /** Show icon before text */
  showIcon?: boolean
  
  /** Custom icon (overrides auto-selection) */
  icon?: LucideIcon
  
  /** Custom label (overrides formatted status) */
  label?: string
  
  /** Badge variant */
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
  
  /** Additional CSS classes */
  className?: string
  
  /** Click handler */
  onClick?: () => void
}

export function StatusBadge({
  status,
  showIcon = false,
  icon: CustomIcon,
  label,
  variant = 'secondary',
  className,
  onClick,
}: StatusBadgeProps) {
  if (!status) return null
  
  const statusColor = getStatusColor(status)
  const Icon = CustomIcon || (showIcon ? getStatusIcon(status) : null)
  const displayText = label || formatStatus(status)
  
  return (
    <Badge
      variant={variant}
      className={cn(statusColor, className)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {Icon && <Icon aria-hidden="true" className="h-4 w-4 mr-1" />}
      {displayText}
    </Badge>
  )
}
