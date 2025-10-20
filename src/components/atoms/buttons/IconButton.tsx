"use client"

import { type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * IconButton - Atomic Component
 * 
 * Reusable icon button with consistent sizing and styling.
 * Replaces 100+ hardcoded icon button implementations.
 */

export interface IconButtonProps {
  icon: LucideIcon
  label: string
  onClick?: () => void
  variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
}

const iconSizes = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
}

export function IconButton({
  icon: Icon,
  label,
  onClick,
  variant = 'ghost',
  size = 'md',
  disabled,
  className,
}: IconButtonProps) {
  return (
    <Button
      variant={variant}
      size="icon"
      onClick={onClick}
      disabled={disabled}
      className={cn(sizeClasses[size], className)}
      aria-label={label}
      title={label}
    >
      <Icon className={iconSizes[size]} aria-hidden="true" />
    </Button>
  )
}
