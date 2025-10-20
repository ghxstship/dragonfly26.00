"use client"

import { cn } from "@/lib/utils"

/**
 * MetaText - Atomic Component
 * 
 * Reusable metadata text with consistent styling.
 * Used for dates, counts, secondary information.
 */

export interface MetaTextProps {
  children: React.ReactNode
  variant?: 'default' | 'muted' | 'subtle'
  size?: 'xs' | 'sm'
  className?: string
}

const variantClasses = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  subtle: 'text-muted-foreground/70',
}

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
}

export function MetaText({
  children,
  variant = 'muted',
  size = 'xs',
  className,
}: MetaTextProps) {
  return (
    <span className={cn(sizeClasses[size], variantClasses[variant], className)}>
      {children}
    </span>
  )
}
