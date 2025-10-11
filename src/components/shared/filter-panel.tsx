"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Plus, X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterRule {
  id: string
  field: string
  operator: string
  value: string
}

interface FilterPanelProps {
  onFiltersChange?: (filters: FilterRule[]) => void
}

export function FilterPanel({ onFiltersChange }: FilterPanelProps) {
  const t = useTranslations()
  const [filters, setFilters] = useState<FilterRule[]>([])
  const [filterLogic, setFilterLogic] = useState<"and" | "or">("and")

  const fields = [
    { value: "name", label: t('fields.name') },
    { value: "status", label: t('fields.status') },
    { value: "priority", label: t('fields.priority') },
    { value: "assignee", label: t('fields.assignee') },
    { value: "due_date", label: t('fields.dueDate') },
    { value: "created_at", label: "Created Date" },
    { value: "tags", label: t('fields.tags') },
  ]

  const operators = [
    { value: "equals", label: "equals" },
    { value: "not_equals", label: "does not equal" },
    { value: "contains", label: "contains" },
    { value: "not_contains", label: "does not contain" },
    { value: "starts_with", label: "starts with" },
    { value: "ends_with", label: "ends with" },
    { value: "is_empty", label: "is empty" },
    { value: "is_not_empty", label: "is not empty" },
    { value: "greater_than", label: "is greater than" },
    { value: "less_than", label: "is less than" },
  ]

  const addFilter = () => {
    const newFilter: FilterRule = {
      id: Math.random().toString(36).substr(2, 9),
      field: fields[0].value,
      operator: operators[0].value,
      value: "",
    }
    const updatedFilters = [...filters, newFilter]
    setFilters(updatedFilters)
    if (onFiltersChange) {
      onFiltersChange(updatedFilters)
    }
  }

  const removeFilter = (id: string) => {
    const updatedFilters = filters.filter((f) => f.id !== id)
    setFilters(updatedFilters)
    if (onFiltersChange) {
      onFiltersChange(updatedFilters)
    }
  }

  const updateFilter = (id: string, updates: Partial<FilterRule>) => {
    const updatedFilters = filters.map((f) => (f.id === id ? { ...f, ...updates } : f))
    setFilters(updatedFilters)
    if (onFiltersChange) {
      onFiltersChange(updatedFilters)
    }
  }

  const clearAllFilters = () => {
    setFilters([])
    if (onFiltersChange) {
      onFiltersChange([])
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add filters to narrow down your view. Multiple filters can be combined.
        </p>
      </div>

      {/* Filter Logic */}
      {filters.length > 1 && (
        <div className="space-y-2">
          <Label>Filter Logic</Label>
          <div className="flex gap-2">
            <Button
              variant={filterLogic === "and" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterLogic("and")}
            >
              AND
            </Button>
            <Button
              variant={filterLogic === "or" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterLogic("or")}
            >
              OR
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {filterLogic === "and"
              ? "Show items that match all filters"
              : "Show items that match any filter"}
          </p>
        </div>
      )}

      {/* Filter Rules */}
      <div className="space-y-3">
        {filters.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <Filter className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">No filters applied</p>
            <Button onClick={addFilter} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Filter
            </Button>
          </div>
        ) : (
          filters.map((filter, index) => (
            <div key={filter.id} className="space-y-2 p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Filter {index + 1}</Label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeFilter(filter.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="grid gap-2">
                <Select
                  value={filter.field}
                  onValueChange={(value) => updateFilter(filter.id, { field: value })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map((field) => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filter.operator}
                  onValueChange={(value) => updateFilter(filter.id, { operator: value })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!["is_empty", "is_not_empty"].includes(filter.operator) && (
                  <Input
                    placeholder="Enter value..."
                    value={filter.value}
                    onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                    className="h-9"
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Actions */}
      {filters.length > 0 && (
        <div className="flex gap-2">
          <Button onClick={addFilter} variant="outline" className="flex-1">
            <Plus className="h-4 w-4 mr-2" />
            Add Filter
          </Button>
          <Button onClick={clearAllFilters} variant="outline">
            Clear All
          </Button>
        </div>
      )}

      {/* Saved Filters */}
      <div className="space-y-3 pt-4 border-t">
        <Label>Saved Filters</Label>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Filter className="h-3 w-3 mr-2" />
            High Priority Tasks
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Filter className="h-3 w-3 mr-2" />
            Overdue Items
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Filter className="h-3 w-3 mr-2" />
            My Assignments
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="w-full">
          Save Current Filters
        </Button>
      </div>
    </div>
  )
}
