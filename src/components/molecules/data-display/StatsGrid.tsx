"use client"

import { StatCard, type StatCardProps } from "@/components/atoms/cards/StatCard"
import { cn } from "@/lib/utils"

/**
 * StatsGrid - Molecular Component
 * 
 * Grid layout for displaying multiple stat cards.
 * Replaces 100+ hardcoded stat grid implementations.
 * 
 * Features:
 * - Responsive column layouts (2-6 columns)
 * - Consistent spacing via design tokens
 * - Automatic wrapping on mobile
 * - ARIA region for accessibility
 * 
 * Usage:
 * <StatsGrid 
 *   stats={[
 *     { label: "Total", value: 42, variant: "default" },
 *     { label: "Active", value: 12, variant: "success" },
 *   ]}
 *   columns={4}
 * />
 */

export interface StatsGridProps {
  /** Array of stat configurations */
  stats: StatCardProps[]
  
  /** Number of columns in the grid (2-6) */
  columns?: 2 | 3 | 4 | 5 | 6
  
  /** Additional CSS classes */
  className?: string
  
  /** ARIA label for the stats region */
  ariaLabel?: string
}

const gridColumns = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
  5: 'grid-cols-2 md:grid-cols-5',
  6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
} as const

export function StatsGrid({
  stats,
  columns = 4,
  className,
  ariaLabel = "Statistics",
}: StatsGridProps) {
  if (stats.length === 0) return null
  
  return (
    <section 
      role="region" 
      aria-label={ariaLabel}
      className={cn("grid gap-4", gridColumns[columns], className)}
    >
      {stats.map((stat, index) => (
        <StatCard 
          key={stat.label || index} 
          {...stat}
        />
      ))}
    </section>
  )
}
