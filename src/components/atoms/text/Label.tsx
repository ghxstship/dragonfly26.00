"use client"

import { cn } from "@/lib/utils"

/**
 * Label - Atomic Component
 * 
 * Text label with consistent styling for data display.
 * Different from form Label - this is for key-value pairs.
 * 
 * Features:
 * - Consistent typography
 * - Muted color
 * - Optional required indicator
 * 
 * Usage:
 * <Label>Status</Label>
 * <Label required>Email</Label>
 */

export interface LabelProps {
  /** Label text */
  children: React.ReactNode
  
  /** Show required indicator */
  required?: boolean
  
  /** Additional CSS classes */
  className?: string
}

export function Label({ children, required, className }: LabelProps) {
  return (
    <span className={cn('text-sm font-medium text-muted-foreground', className)}>
      {children}
      {required && <span className="ml-0.5 text-destructive">*</span>}
    </span>
  )
}
