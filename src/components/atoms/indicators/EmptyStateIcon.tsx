"use client"

import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * EmptyStateIcon - Atomic Component
 * 
 * Reusable empty state icon with consistent styling.
 * Replaces 100+ hardcoded empty state icons.
 */

export interface EmptyStateIconProps {
  icon: LucideIcon
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'muted' | 'primary'
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
}

const variantClasses = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  primary: 'text-primary',
}

export function EmptyStateIcon({
  icon: Icon,
  size = 'md',
  variant = 'muted',
  className,
}: EmptyStateIconProps) {
  return (
    <Icon 
      className={cn(
        sizeClasses[size],
        variantClasses[variant],
        className
      )} 
      aria-hidden="true"
    />
  )
}
