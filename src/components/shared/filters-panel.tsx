"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { X, Plus, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { FilterConfig, FilterOperator } from "@/types"

interface FiltersPanelProps {
  filters: FilterConfig[]
  onFiltersChange: (filters: FilterConfig[]) => void
  availableFields: { id: string; label: string; type: string }[]
}

const getOperators = (t: any): Record<string, { value: FilterOperator; label: string }[]> => ({
  text: [
    { value: "equals", label: t('common.equals') },
    { value: "not_equals", label: t('filters.doesNotEqual') },
    { value: "contains", label: t('filters.contains') },
    { value: "not_contains", label: t('filters.doesNotContain') },
    { value: "starts_with", label: t('filters.startsWith') },
    { value: "ends_with", label: t('filters.endsWith') },
    { value: "is_empty", label: t('filters.isEmpty') },
    { value: "is_not_empty", label: t('filters.isNotEmpty') },
  ],
  number: [
    { value: "equals", label: t('common.equals') },
    { value: "not_equals", label: t('filters.doesNotEqual') },
    { value: "greater_than", label: t('filters.greaterThan') },
    { value: "less_than", label: t('filters.lessThan') },
    { value: "greater_than_or_equal", label: t('filters.greaterThanOrEqual') },
    { value: "less_than_or_equal", label: t('filters.lessThanOrEqual') },
  ],
  date: [
    { value: "is_on", label: t('filters.isOn') },
    { value: "is_before", label: t('filters.isBefore') },
    { value: "is_after", label: t('filters.isAfter') },
    { value: "is_between", label: t('filters.isBetween') },
  ],
})

export function FiltersPanel({ filters, onFiltersChange, availableFields }: FiltersPanelProps) {
  const t = useTranslations()
  const [open, setOpen] = useState(false)
  const OPERATORS = getOperators(t)

  const addFilter = () => {
    const newFilter: FilterConfig = {
      id: `filter-${Date.now()}`,
      field: availableFields[0]?.id || "",
      operator: "equals",
      value: "",
      condition: "AND",
    }
    onFiltersChange([...filters, newFilter])
  }

  const updateFilter = (id: string, updates: Partial<FilterConfig>) => {
    onFiltersChange(
      filters.map((filter) =>
        filter.id === id ? { ...filter, ...updates } : filter
      )
    )
  }

  const removeFilter = (id: string) => {
    onFiltersChange(filters.filter((filter: any) => filter.id !== id))
  }

  const clearAllFilters = () => {
    onFiltersChange([])
  }

  const getOperatorsForField = (fieldId: string) => {
    const field = availableFields.find((f) => f.id === fieldId)
    if (!field) return OPERATORS.text
    return OPERATORS[field.type as keyof typeof OPERATORS] || OPERATORS.text
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Filter aria-hidden="true" className="h-4 w-4" />
          {filters.length > 0 && (
            <span className="absolute sm:relative sm:inset-auto -top-2 md:top-1 -right-2 md:right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex flex-wrap items-center justify-center">
              {filters.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent aria-hidden="true" className="w-full md:w-96">
        <SheetHeader>
          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
            <SheetTitle>Filters</SheetTitle>
            {filters.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea aria-hidden="true" className="h-[calc(100vh-8rem)] mt-4">
          <div className="space-y-4">
            {filters.map((filter: any, index: number) => {
              const field = availableFields.find((f) => f.id === filter.field)
              const operators = getOperatorsForField(filter.field)

              return (
                <div key={filter.id} className="space-y-2 p-3 border rounded-lg">
                  {/* Condition (AND/OR) */}
                  {index > 0 && (
                    <Select
                      value={filter.condition}
                      onValueChange={(value) =>
                        updateFilter(filter.id, { condition: value as "AND" | "OR" })
                      }
                    >
                      <SelectTrigger aria-hidden="true" className="w-20 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">AND</SelectItem>
                        <SelectItem value="OR">OR</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  {/* Field */}
                  <Select
                    value={filter.field}
                    onValueChange={(value) => updateFilter(filter.id, { field: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('filters.selectField')} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields.map((field) => (
                        <SelectItem key={field.id} value={field.id}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Operator */}
                  <Select
                    value={filter.operator}
                    onValueChange={(value) =>
                      updateFilter(filter.id, { operator: value as FilterOperator })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('filters.selectOperator')} />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Value */}
                  {!["is_empty", "is_not_empty"].includes(filter.operator) && (
                    <Input
                      placeholder="Value"
                      value={filter.value}
                      onChange={(e) =>
                        updateFilter(filter.id, { value: e.target.value })
                      }
                    />
                  )}

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full gap-2 max-w-full"
                    onClick={() => removeFilter(filter.id)}
                  >
                    <X aria-hidden="true" className="h-4 w-4" />
                    Remove filter
                  </Button>
                </div>
              )
            })}

            {/* Add Filter Button */}
            <Button
              variant="outline"
              className="w-full gap-2 max-w-full"
              onClick={addFilter}
            >
              <Plus aria-hidden="true" className="h-4 w-4" />
              Add filter
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
