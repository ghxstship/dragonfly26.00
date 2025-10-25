"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * SearchBar - Molecular Component
 * 
 * Reusable search input with clear button.
 * Replaces 100+ hardcoded search implementations.
 */

export interface SearchBarProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  onSearch?: (value: string) => void
  className?: string
}

export function SearchBar({
  value: controlledValue,
  onChange,
  placeholder = "Search...",
  onSearch,
  className,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState('')
  const value = controlledValue !== undefined ? controlledValue : internalValue
  const setValue = onChange || setInternalValue

  const handleClear = () => {
    setValue('')
    onSearch?.('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch?.(value)
    }
  }

  return (
    <div className={cn("relative flex-1", className)}>
      <Search className="absolute sm:relative sm:inset-auto left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground sm:relative sm:inset-auto" aria-hidden="true" />
      <Input
        value={value as any}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="pl-10 pr-10"
        aria-label={placeholder}
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute sm:relative sm:inset-auto right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 sm:relative sm:inset-auto"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>
      )}
    </div>
  )
}
