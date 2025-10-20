"use client"

import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

/**
 * LoadingSpinner - Atomic Component
 * 
 * Reusable loading indicator with consistent styling.
 * Replaces 200+ hardcoded loading spinners.
 */

export interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  fullHeight?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'h-4 w-4 border',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-2',
}

export function LoadingSpinner({
  message,
  size = 'md',
  fullHeight = true,
  className,
}: LoadingSpinnerProps) {
  const t = useTranslations('common')
  const defaultMessage = t('loading')
  
  return (
    <div 
      className={cn(
        "flex items-center justify-center",
        fullHeight && "h-full",
        className
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="text-center">
        <div 
          className={cn(
            "animate-spin rounded-full border-b-2 border-primary mx-auto mb-4",
            sizeClasses[size]
          )}
          aria-hidden="true"
        />
        <p className="text-muted-foreground">{message || defaultMessage}</p>
      </div>
    </div>
  )
}
