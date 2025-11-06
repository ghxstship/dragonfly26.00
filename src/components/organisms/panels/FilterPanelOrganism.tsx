"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { X, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

/**
 * FilterPanelOrganism - Organism Component
 * 
 * Comprehensive filter panel with multiple filter types.
 * Can be used as a sheet (mobile) or sidebar (desktop).
 * 
 * Features:
 * - Multiple filter groups
 * - Checkbox filters
 * - Active filter count
 * - Clear all functionality
 * - Responsive design
 * 
 * Usage:
 * <FilterPanelOrganism 
 *   filters={filterGroups}
 *   values={activeFilters}
 *   onChange={setActiveFilters}
 * />
 */

export interface FilterOption {
  id: string
  label: string
  count?: number
}

export interface FilterGroup {
  id: string
  label: string
  options: FilterOption[]
}

export interface FilterPanelOrganismProps {
  /** Filter groups */
  filters: FilterGroup[]
  
  /** Active filter values */
  values: Record<string, string[]>
  
  /** Change handler */
  onChange: (values: Record<string, string[]>) => void
  
  /** Clear all handler */
  onClear?: () => void
  
  /** Trigger button (for sheet mode) */
  trigger?: React.ReactNode
  
  /** Display mode */
  mode?: 'sheet' | 'sidebar'
  
  /** Additional CSS classes */
  className?: string
}

function FilterContent({ filters, values, onChange, onClear }: Omit<FilterPanelOrganismProps, 'trigger' | 'mode' | 'className'>) {
  const t = useTranslations()

  const handleToggle = (groupId: string, optionId: string) => {
    const currentValues = values[groupId] || []
    const newValues = currentValues.includes(optionId)
      ? currentValues.filter(id => id !== optionId)
      : [...currentValues, optionId]
    
    onChange({
      ...values,
      [groupId]: newValues,
    })
  }

  const activeCount = Object.values(values).reduce((sum: any, arr: any) => sum + arr.length, 0)

  return (
    <div className="flex flex-wrap flex-col h-full">
      <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between p-4 border-b">
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
          <SlidersHorizontal aria-hidden="true" className="h-5 w-5" />
          <h3 className="font-semibold">Filters</h3>
          {activeCount > 0 && (
            <span className="text-sm text-muted-foreground">({activeCount})</span>
          )}
        </div>
        {activeCount > 0 && onClear && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear all
          </Button>
        )}
      </div>

      <ScrollArea aria-hidden="true" className="flex-1">
        <div className="p-4 space-y-3 md:space-y-4 lg:space-y-6">
          {filters.map((group: any) => (
            <div key={group.id} className="space-y-3">
              <Label aria-hidden="true" className="text-sm font-medium">{group.label}</Label>
              <div className="space-y-2">
                {group.options.map((option: any) => {
                  const isChecked = (values[group.id] || []).includes(option.id)
                  return (
                    <div key={option.id} className="flex flex-wrap md:flex-nowrap items-center space-x-2">
                      <Checkbox
                        id={`${group.id}-${option.id}`}
                        checked={isChecked}
                        onCheckedChange={() => handleToggle(group.id, option.id)}
                      />
                      <label
                        htmlFor={`${group.id}-${option.id}`}
                        className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                      >
                        {option.label}
                        {option.count !== undefined && (
                          <span className="ml-2 text-muted-foreground">({option.count})</span>
                        )}
                      </label>
                    </div>
                  )
                })}
              </div>
              <Separator />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export function FilterPanelOrganism({
  filters,
  values,
  onChange,
  onClear,
  trigger,
  mode = 'sheet',
  className,
}: FilterPanelOrganismProps) {
  if (mode === 'sidebar') {
    return (
      <div className={cn('w-64 border-r bg-background', className)}>
        <FilterContent filters={filters} values={values} onChange={onChange} onClear={onClear} />
      </div>
    )
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="outline" size="icon">
            <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-80 p-0">
        <FilterContent filters={filters} values={values} onChange={onChange} onClear={onClear} />
      </SheetContent>
    </Sheet>
  )
}
