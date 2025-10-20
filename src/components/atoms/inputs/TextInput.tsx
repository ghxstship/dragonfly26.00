"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

/**
 * TextInput - Atomic Component
 * 
 * Basic text input with consistent styling.
 * Wraps shadcn/ui Input with additional features.
 * 
 * Features:
 * - Optional label
 * - Error state handling
 * - Helper text
 * - Required indicator
 * - Full accessibility
 * 
 * Usage:
 * <TextInput label="Name" placeholder="Enter name" />
 * <TextInput label="Email" type="email" required error="Invalid email" />
 */

export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input label */
  label?: string
  
  /** Error message */
  error?: string
  
  /** Helper text */
  helperText?: string
  
  /** Input size */
  inputSize?: 'sm' | 'md' | 'lg'
  
  /** Container class name */
  containerClassName?: string
}

const sizeClasses = {
  sm: 'h-8 text-sm',
  md: 'h-10 text-base',
  lg: 'h-12 text-lg',
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    inputSize = 'md',
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
        <Input
          ref={ref}
          id={inputId}
          className={cn(
            sizeClasses[inputSize],
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

TextInput.displayName = 'TextInput'
