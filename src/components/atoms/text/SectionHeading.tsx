"use client"

import { cn } from "@/lib/utils"

/**
 * SectionHeading - Atomic Component
 * 
 * Reusable section heading with consistent styling.
 * Used within cards and sections, NOT for page titles.
 */

export interface SectionHeadingProps {
  children: React.ReactNode
  level?: 2 | 3 | 4
  className?: string
  id?: string
}

export function SectionHeading({
  children,
  level = 3,
  className,
  id,
}: SectionHeadingProps) {
  const Component = `h${level}` as 'h2' | 'h3' | 'h4'
  
  const sizeClasses = {
    2: 'text-base font-semibold',
    3: 'text-sm font-semibold',
    4: 'text-xs font-semibold uppercase tracking-wide',
  }
  
  return (
    <Component 
      id={id}
      className={cn(sizeClasses[level], className)}
    >
      {children}
    </Component>
  )
}
