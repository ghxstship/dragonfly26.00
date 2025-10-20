"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

/**
 * DateRangePicker - Molecular Component
 * 
 * Date range picker with calendar popup.
 * 
 * Features:
 * - Start and end date selection
 * - Calendar popup
 * - Date formatting
 * - Optional label
 * - Accessibility
 * 
 * Usage:
 * <DateRangePicker label="Date Range" value={range} onChange={setRange} />
 */

export interface DateRangePickerProps {
  /** Input label */
  label?: string
  
  /** Selected date range */
  value?: DateRange
  
  /** Change handler */
  onChange?: (range: DateRange | undefined) => void
  
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

export function DateRangePicker({
  label,
  value,
  onChange,
  placeholder = "Pick a date range",
  required,
  disabled,
  containerClassName,
  className,
}: DateRangePickerProps) {
  const inputId = React.useId()

  return (
    <div className={cn('space-y-1.5', containerClassName)}>
      {label && (
        <Label 
          htmlFor={inputId}
          className={cn(required && 'after:content-["*"] after:ml-0.5 after:text-destructive')}
        >
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
              className
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} -{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
