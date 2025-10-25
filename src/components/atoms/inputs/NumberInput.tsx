"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

/**
 * NumberInput - Atomic Component
 * 
 * Number input with validation and formatting.
 * 
 * Features:
 * - Min/max validation
 * - Step control
 * - Optional label
 * - Error state handling
 * - Accessibility
 * 
 * Usage:
 * <NumberInput label="Quantity" min={0} max={100} />
 * <NumberInput label="Price" step={0.01} prefix="$" />
 */

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Input label */
  label?: string
  
  /** Error message */
  error?: string
  
  /** Helper text */
  helperText?: string
  
  /** Input size */
  inputSize?: 'sm' | 'md' | 'lg'
  
  /** Prefix text (e.g., "$") */
  prefix?: string
  
  /** Suffix text (e.g., "kg") */
  suffix?: string
  
  /** Container class name */
  containerClassName?: string
}

const sizeClasses = {
  sm: 'h-8 text-sm',
  md: 'h-10 text-base',
  lg: 'h-12 text-lg',
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    inputSize = 'md',
    prefix,
    suffix,
    containerClassName,
    className,
    id,
    required,
    ...props 
  }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`

    return (
      <div className={cn('space-y-1.5', containerClassName)}>
        {label && (
          <Label htmlFor={inputId} className={cn(required && 'after:content-["*"] after:ml-0.5 after:text-destructive')}>
            {label}
          </Label>
        )}
        <div className="relative">
          {prefix && (
            <span className="absolute sm:relative sm:inset-auto left-3 top-1/2 -translate-y-1/2 text-muted-foreground sm:relative sm:inset-auto">
              {prefix}
            </span>
          )}
          <Input
            ref={ref}
            type="number"
            id={inputId}
            className={cn(
              sizeClasses[inputSize],
              prefix && 'pl-8',
              suffix && 'pr-12',
              error && 'border-destructive focus-visible:ring-destructive',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={cn(
              error && errorId,
              helperText && helperId
            )}
            required={required}
            {...props}
          />
          {suffix && (
            <span className="absolute sm:relative sm:inset-auto right-3 top-1/2 -translate-y-1/2 text-muted-foreground sm:relative sm:inset-auto">
              {suffix}
            </span>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

NumberInput.displayName = 'NumberInput'
