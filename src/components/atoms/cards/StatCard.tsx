"use client"

import { type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/**
 * StatCard - Atomic Component
 * 
 * Reusable stat display card used across all dashboard and overview tabs.
 * Replaces 100+ hardcoded stat card implementations.
 * 
 * Features:
 * - Consistent styling via design tokens
 * - Optional icon with color variants
 * - Optional change indicator
 * - Responsive text sizing
 * - ARIA labels for accessibility
 * 
 * Usage:
 * <StatCard 
 *   label="Total Tasks" 
 *   value={42} 
 *   variant="success"
 *   icon={CheckSquare}
 *   change="+5"
 * />
 */

export interface StatCardProps {
  /** Display label for the stat */
  label: string
  
  /** Stat value (number or formatted string) */
  value: string | number
  
  /** Color variant for the value */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'blue' | 'green' | 'orange' | 'cyan'
  
  /** Optional icon to display */
  icon?: LucideIcon
  
  /** Optional change indicator (e.g., "+5", "-2") */
  change?: string
  
  /** Optional trend direction */
  trend?: 'up' | 'down' | 'neutral'
  
  /** Optional description text */
  description?: string
  
  /** Optional click handler */
  onClick?: () => void
  
  /** Additional CSS classes */
  className?: string
  
  /** ARIA label for accessibility */
  ariaLabel?: string
}

const variantColors = {
  default: '',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
  info: 'text-blue-600',
  purple: 'text-purple-600',
  blue: 'text-blue-600',
  green: 'text-green-600',
  orange: 'text-orange-600',
  cyan: 'text-cyan-600',
} as const

const iconBackgrounds = {
  default: 'bg-gray-100 dark:bg-gray-950',
  success: 'bg-green-100 dark:bg-green-950',
  warning: 'bg-yellow-100 dark:bg-yellow-950',
  error: 'bg-red-100 dark:bg-red-950',
  info: 'bg-blue-100 dark:bg-blue-950',
  purple: 'bg-purple-100 dark:bg-purple-950',
  blue: 'bg-blue-100 dark:bg-blue-950',
  green: 'bg-green-100 dark:bg-green-950',
  orange: 'bg-orange-100 dark:bg-orange-950',
  cyan: 'bg-cyan-100 dark:bg-cyan-950',
} as const

export function StatCard({
  label,
  value,
  variant = 'default',
  icon: Icon,
  change,
  trend,
  description,
  onClick,
  className,
  ariaLabel,
}: StatCardProps) {
  const valueColor = variantColors[variant]
  const iconBg = iconBackgrounds[variant]
  
  const cardClasses = cn(
    onClick && 'cursor-pointer hover:bg-accent transition-colors',
    className
  )
  
  return (
    <Card aria-hidden="true" className={cardClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel || `${label}: ${value}`}
    >
      <CardContent aria-hidden="true" className="pt-6">
        <div className="text-center">
          {/* Icon */}
          {Icon && (
            <div className={cn("p-2 rounded-lg inline-flex mb-2", iconBg)}>
              <Icon aria-hidden="true" className={cn("h-4 w-4", valueColor)} />
            </div>
          )}
          
          {/* Value */}
          <p className={cn("text-2xl font-bold", valueColor)}>
            {value}
          </p>
          
          {/* Label */}
          <p className="text-xs text-muted-foreground mt-1">
            {label}
          </p>
          
          {/* Change Indicator */}
          {change && (
            <p className="text-xs text-muted-foreground mt-1">
              {change}
            </p>
          )}
          
          {/* Description */}
          {description && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
