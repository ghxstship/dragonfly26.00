"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

/**
 * DateInput - Atomic Component
 * 
 * Date picker input with calendar popup.
 * 
 * Features:
 * - Calendar popup
 * - Date formatting
 * - Optional label
 * - Error state handling
 * - Accessibility
 * 
 * Usage:
 * <DateInput label="Start Date" value={date} onChange={setDate} />
 * <DateInput label="Due Date" required error="Date is required" />
 */

export interface DateInputProps {
  /** Input label */
  label?: string
  
  /** Selected date */
  value?: Date
  
  /** Change handler */
  onChange?: (date: Date | undefined) => void
  
  /** Error message */
  error?: string
  
  /** Helper text */
  helperText?: string
  
  /** Placeholder text */
  placeholder?: string
  
  /** Required field */
  required?: boolean
  
  /** Disabled state */
  disabled?: boolean
  
  /** Container class name */
  containerClassName?: string
  
  /** Button class name */
  className?: string
}

export function DateInput({
  label,
  value,
  onChange,
  error,
  helperText,
  placeholder = "Pick a date",
  required,
  disabled,
  containerClassName,
  className,
}: DateInputProps) {
  const inputId = React.useId()
  const errorId = `${inputId}-error`
  const helperId = `${inputId}-helper`

  return (
    <div className={cn('space-y-1.5', containerClassName)}>
      {label && (
        <Label htmlFor={inputId} className={cn(required && 'after:content-["*"] after:ml-0.5 after:text-destructive')}>
          {label}
        </Label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={inputId}
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground',
              error && 'border-destructive',
              className
            )}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={cn(
              error && errorId,
              helperText && helperId
            )}
          >
            <CalendarIcon aria-hidden="true" className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent aria-hidden="true" className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
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
