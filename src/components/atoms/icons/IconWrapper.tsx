"use client"

import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { iconBackgroundColors, type IconBackgroundColor } from "@/design-tokens/colors"

/**
 * IconWrapper - Atomic Component
 * 
 * Consistent icon wrapper with sizing and background options.
 * Provides standardized icon presentation across the application.
 * 
 * Features:
 * - Consistent sizing (xs, sm, md, lg, xl)
 * - Optional background with design token colors
 * - Automatic ARIA handling
 * - Dark mode support
 * 
 * Usage:
 * <IconWrapper icon={User} size="md" />
 * <IconWrapper icon={Settings} size="lg" background="blue" />
 */

export interface IconWrapperProps {
  /** Lucide icon component */
  icon: LucideIcon
  
  /** Icon size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  
  /** Background color from design tokens */
  background?: IconBackgroundColor
  
  /** Icon color class */
  iconColor?: string
  
  /** Additional CSS classes */
  className?: string
  
  /** ARIA label for accessibility */
  ariaLabel?: string
  
  /** Whether icon is decorative (hides from screen readers) */
  decorative?: boolean
}

const sizeClasses = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
}

const containerSizeClasses = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
}

export function IconWrapper({
  icon: Icon,
  size = 'md',
  background,
  iconColor = 'text-foreground',
  className,
  ariaLabel,
  decorative = false,
}: IconWrapperProps) {
  const iconElement = (
    <Icon 
      className={cn(sizeClasses[size], iconColor)} 
      aria-hidden={decorative}
      aria-label={!decorative ? ariaLabel : undefined}
    />
  )

  if (background) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-lg',
          containerSizeClasses[size],
          iconBackgroundColors[background],
          className
        )}
        role={!decorative && ariaLabel ? 'img' : undefined}
        aria-label={!decorative ? ariaLabel : undefined}
      >
        {iconElement}
      </div>
    )
  }

  return iconElement
}
