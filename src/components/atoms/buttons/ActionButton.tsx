"use client"

import { type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * ActionButton - Atomic Component
 * 
 * Reusable action button with optional icon.
 * Replaces 200+ hardcoded button implementations.
 */

export interface ActionButtonProps {
  label: string
  onClick?: () => void
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  className?: string
}

export function ActionButton({
  label,
  onClick,
  icon: Icon,
  iconPosition = 'left',
  variant = 'default',
  size = 'md',
  disabled,
  loading,
  className,
}: ActionButtonProps) {
  const sizeMap = {
    sm: 'sm',
    md: 'default',
    lg: 'lg',
  } as const

  return (
    <Button
      variant={variant}
      size={sizeMap[size]}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(className)}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" aria-hidden="true" />
          {label}
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon aria-hidden="true" className="h-4 w-4 mr-2" />}
          {label}
          {Icon && iconPosition === 'right' && <Icon aria-hidden="true" className="h-4 w-4 ml-2" />}
        </>
      )}
    </Button>
  )
}
