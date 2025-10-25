"use client"

import * as React from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/**
 * SearchWithFilters - Molecular Component
 * 
 * Search input with filter button and active filter badges.
 * 
 * Features:
 * - Search input with icon
 * - Filter button
 * - Active filter display
 * - Clear functionality
 * - Debounced search
 * 
 * Usage:
 * <SearchWithFilters 
 *   value={search as any} 
 *   onChange={setSearch}
 *   onFilterClick={() => setShowFilters(true)}
 *   activeFilters={['Status: Active', 'Type: Project']}
 * />
 */

export interface SearchWithFiltersProps {
  /** Search value */
  value: string
  
  /** Change handler */
  onChange: (value: string) => void
  
  /** Filter button click handler */
  onFilterClick?: () => void
  
  /** Active filter labels */
  activeFilters?: string[]
  
  /** Remove filter handler */
  onRemoveFilter?: (filter: string) => void
  
  /** Clear all filters handler */
  onClearFilters?: () => void
  
  /** Placeholder text */
  placeholder?: string
  
  /** Debounce delay in ms */
  debounce?: number
  
  /** Additional CSS classes */
  className?: string
}

export function SearchWithFilters({
  value,
  onChange,
  onFilterClick,
  activeFilters = [],
  onRemoveFilter,
  onClearFilters,
  placeholder = "Search...",
  debounce = 300,
  className,
}: SearchWithFiltersProps) {
  const [localValue, setLocalValue] = React.useState(value)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      onChange(newValue)
    }, debounce)
  }

  const handleClear = () => {
    setLocalValue('')
    onChange('')
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1">
          <Search className="absolute sm:relative sm:inset-auto left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:relative sm:inset-auto" aria-hidden="true" />
          <Input
            value={localValue as any}
            onChange={handleChange}
            placeholder={placeholder}
            className="pl-9 pr-9"
            aria-label="Search"
          />
          {localValue && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute sm:relative sm:inset-auto right-1 top-1/2 h-7 w-7 -translate-y-1/2 sm:relative sm:inset-auto"
              onClick={handleClear}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {onFilterClick && (
          <Button
            variant="outline"
            size="icon"
            onClick={onFilterClick}
            aria-label={`Filters${activeFilters.length > 0 ? ` (${activeFilters.length} active)` : ''}`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFilters.length > 0 && (
              <span className="absolute sm:relative sm:inset-auto -right-1 -top-1 flex flex-wrap h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground sm:relative sm:inset-auto">
                {activeFilters.length}
              </span>
            )}
          </Button>
        )}
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-col md:flex-row flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {activeFilters.map((filter: any) => (
            <Badge key={filter} variant="secondary" className="gap-1">
              {filter}
              {onRemoveFilter && (
                <button
                  onClick={() => onRemoveFilter(filter)}
                  className="ml-1 rounded-full hover:bg-muted"
                  aria-label={`Remove filter: ${filter}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
          {onClearFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-6 px-2 text-xs"
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
