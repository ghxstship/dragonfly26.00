"use client"

import { Label, Value } from "@/components/atoms"
import { cn } from "@/lib/utils"

/**
 * KeyValuePair - Molecular Component
 * 
 * Displays a key-value pair with consistent styling.
 * Combines Label and Value atoms.
 * 
 * Features:
 * - Consistent layout
 * - Horizontal or vertical orientation
 * - Optional emphasis
 * - Truncation support
 * 
 * Usage:
 * <KeyValuePair label="Status" value="Active" />
 * <KeyValuePair label="Total" value="$1,234.56" emphasis />
 * <KeyValuePair label="Description" value="Long text..." orientation="vertical" />
 */

export interface KeyValuePairProps {
  /** Key label */
  label: string
  
  /** Value content */
  value: React.ReactNode
  
  /** Layout orientation */
  orientation?: 'horizontal' | 'vertical'
  
  /** Emphasize the value */
  emphasis?: boolean
  
  /** Truncate long values */
  truncate?: boolean
  
  /** Container class name */
  className?: string
}

export function KeyValuePair({
  label,
  value,
  orientation = 'horizontal',
  emphasis,
  truncate,
  className,
}: KeyValuePairProps) {
  return (
    <div
      className={cn(
        orientation === 'horizontal' 
          ? 'flex items-center justify-between gap-4' 
          : 'flex flex-col gap-1',
        className
      )}
    >
      <Label>{label}</Label>
      {typeof value === 'string' || typeof value === 'number' ? (
        <Value emphasis={emphasis} truncate={truncate}>
          {value}
        </Value>
      ) : (
        value
      )}
    </div>
  )
}
