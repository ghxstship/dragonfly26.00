"use client"

import { type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { IconWrapper } from "@/components/atoms"
import { type IconBackgroundColor } from "@/design-tokens/colors"
import { cn } from "@/lib/utils"

/**
 * StatCard - Molecular Component
 * 
 * Displays a statistic with icon, label, and value.
 * Common in dashboards and overview pages.
 * 
 * Features:
 * - Icon with background
 * - Large value display
 * - Optional trend indicator
 * - Optional subtitle
 * - Clickable variant
 * 
 * Usage:
 * <StatCard icon={Users} label="Total Users" value="1,234" />
 * <StatCard icon={DollarSign} label="Revenue" value="$45,678" trend="+12%" iconColor="green" />
 */

export interface StatCardProps {
  /** Icon component */
  icon: LucideIcon
  
  /** Stat label */
  label: string
  
  /** Stat value */
  value: string | number
  
  /** Icon background color */
  iconColor?: IconBackgroundColor
  
  /** Trend indicator (e.g., "+12%", "-5%") */
  trend?: string
  
  /** Subtitle text */
  subtitle?: string
  
  /** Click handler */
  onClick?: () => void
  
  /** Loading state */
  loading?: boolean
  
  /** Additional CSS classes */
  className?: string
}

export function StatCard({
  icon,
  label,
  value,
  iconColor = 'blue',
  trend,
  subtitle,
  onClick,
  loading,
  className,
}: StatCardProps) {
  const isPositiveTrend = trend?.startsWith('+')
  
  return (
    <Card
      className={cn(
        'transition-all',
        onClick && 'cursor-pointer hover:shadow-md',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <CardContent className="p-6">
        <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            {loading ? (
              <div className="h-8 w-24 animate-pulse bg-muted rounded" />
            ) : (
              <p className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl font-bold">{value}</p>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <IconWrapper
            icon={icon}
            size="lg"
            background={iconColor}
            decorative
          />
        </div>
        {trend && (
          <div className="mt-4 flex flex-wrap flex-col md:flex-row items-center gap-1">
            <span
              className={cn(
                'text-sm font-medium',
                isPositiveTrend ? 'text-green-600' : 'text-red-600'
              )}
            >
              {trend}
            </span>
            <span className="text-sm text-muted-foreground">vs last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
