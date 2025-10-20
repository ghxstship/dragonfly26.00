"use client"

import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * SortControl - Molecular Component
 * 
 * Reusable sort dropdown with direction indicators.
 * Replaces 50+ hardcoded sort implementations.
 */

export interface SortOption {
  value: string
  label: string
}

export interface SortControlProps {
  options: SortOption[]
  value?: string
  direction?: 'asc' | 'desc'
  onChange?: (value: string, direction: 'asc' | 'desc') => void
  label?: string
}

export function SortControl({
  options,
  value,
  direction = 'asc',
  onChange,
  label = "Sort",
}: SortControlProps) {
  const currentOption = options.find(opt => opt.value === value)
  
  const handleSelect = (optionValue: string) => {
    if (optionValue === value) {
      // Toggle direction if same option
      onChange?.(optionValue, direction === 'asc' ? 'desc' : 'asc')
    } else {
      // New option, default to asc
      onChange?.(optionValue, 'asc')
    }
  }

  const DirectionIcon = direction === 'asc' ? ArrowUp : ArrowDown

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
          {label}
          {currentOption && (
            <>
              : {currentOption.label}
              <DirectionIcon className="h-3 w-3" aria-hidden="true" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option: any) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className="gap-2"
          >
            {option.label}
            {option.value === value && (
              <DirectionIcon className="h-3 w-3 ml-auto" aria-hidden="true" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
