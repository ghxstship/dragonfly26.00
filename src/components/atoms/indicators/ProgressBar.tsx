"use client"

import { cn } from "@/lib/utils"

/**
 * ProgressBar - Atomic Component
 * 
 * Reusable progress bar with consistent styling.
 * Replaces 50+ hardcoded progress bars.
 */

export interface ProgressBarProps {
  value: number
  max?: number
  showLabel?: boolean
  label?: string
  variant?: 'default' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const variantColors = {
  default: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  label,
  variant = 'default',
  size = 'md',
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const barColor = variantColors[variant]
  
  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs mb-1">
          {label && <span className="text-muted-foreground">{label}</span>}
          <span className="font-medium">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn("bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden", sizeClasses[size])}>
        <div 
          className={cn("h-full transition-all duration-300", barColor)}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  )
}
