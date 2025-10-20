"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

/**
 * FormFieldGroup - Molecular Component
 * 
 * Complete form field with label, input, error, and helper text.
 * Provides consistent form field layout across the application.
 * 
 * Features:
 * - Flexible input slot
 * - Error handling
 * - Helper text
 * - Required indicator
 * - Full accessibility
 * 
 * Usage:
 * <FormFieldGroup label="Email" required error="Invalid email">
 *   <Input type="email" />
 * </FormFieldGroup>
 */

export interface FormFieldGroupProps {
  /** Field label */
  label: string
  
  /** Input element */
  children: React.ReactNode
  
  /** Error message */
  error?: string
  
  /** Helper text */
  helperText?: string
  
  /** Required field */
  required?: boolean
  
  /** Field ID for label association */
  htmlFor?: string
  
  /** Container class name */
  className?: string
}

export function FormFieldGroup({
  label,
  children,
  error,
  helperText,
  required,
  htmlFor,
  className,
}: FormFieldGroupProps) {
  const generatedId = React.useId()
  const fieldId = htmlFor || generatedId
  const errorId = `${fieldId}-error`
  const helperId = `${fieldId}-helper`

  return (
    <div className={cn('space-y-2', className)}>
      <Label 
        htmlFor={fieldId}
        className={cn(required && 'after:content-["*"] after:ml-0.5 after:text-destructive')}
      >
        {label}
      </Label>
      
      {React.isValidElement(children) &&
        React.cloneElement(children as React.ReactElement<any>, {
          id: fieldId,
          'aria-invalid': !!error,
          'aria-describedby': cn(
            error && errorId,
            helperText && helperId
          ),
        })}
      
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
