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

const OPERATORS: Record<string, { value: FilterOperator; label: string }[]> = {
  text: [
    { value: "equals", label: "Equals" },
    { value: "not_equals", label: "Does not equal" },
    { value: "contains", label: "Contains" },
    { value: "not_contains", label: "Does not contain" },
    { value: "starts_with", label: "Starts with" },
    { value: "ends_with", label: "Ends with" },
    { value: "is_empty", label: "Is empty" },
    { value: "is_not_empty", label: "Is not empty" },
  ],
  number: [
    { value: "equals", label: "Equals" },
    { value: "not_equals", label: "Does not equal" },
    { value: "greater_than", label: "Greater than" },
    { value: "less_than", label: "Less than" },
    { value: "greater_than_or_equal", label: "Greater than or equal" },
    { value: "less_than_or_equal", label: "Less than or equal" },
  ],
  date: [
    { value: "is_on", label: "Is on" },
    { value: "is_before", label: "Is before" },
    { value: "is_after", label: "Is after" },
    { value: "is_between", label: "Is between" },
  ],
}

export function FiltersPanel({ filters, onFiltersChange, availableFields }: FiltersPanelProps) {
  const t = useTranslations()
  const [open, setOpen] = useState(false)

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
    onFiltersChange(filters.filter((filter) => filter.id !== id))
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
          <Filter className="h-4 w-4" />
          {filters.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {filters.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-96">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Filters</SheetTitle>
            {filters.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          <div className="space-y-4">
            {filters.map((filter, index) => {
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
                      <SelectTrigger className="w-20 h-8">
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
                      <SelectValue placeholder="Select field" />
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
                      <SelectValue placeholder="Select operator" />
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
                    className="w-full gap-2"
                    onClick={() => removeFilter(filter.id)}
                  >
                    <X className="h-4 w-4" />
                    Remove filter
                  </Button>
                </div>
              )
            })}

            {/* Add Filter Button */}
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={addFilter}
            >
              <Plus className="h-4 w-4" />
              Add filter
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
