"use client"

import { cn } from "@/lib/utils"

/**
 * Value - Atomic Component
 * 
 * Text value display with consistent styling.
 * Pairs with Label for key-value displays.
 * 
 * Features:
 * - Consistent typography
 * - Optional emphasis
 * - Truncation support
 * 
 * Usage:
 * <Value>John Doe</Value>
 * <Value emphasis>$1,234.56</Value>
 * <Value truncate>Very long text that needs truncation</Value>
 */

export interface ValueProps {
  /** Value text */
  children: React.ReactNode
  
  /** Emphasize the value */
  emphasis?: boolean
  
  /** Truncate long text */
  truncate?: boolean
  
  /** Additional CSS classes */
  className?: string
}

export function Value({ children, emphasis, truncate, className }: ValueProps) {
  return (
    <span 
      className={cn(
        'text-sm',
        emphasis ? 'font-semibold text-foreground' : 'text-foreground',
        truncate && 'truncate',
        className
      )}
    >
      {children}
    </span>
  )
}
