"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Plus, X, ArrowUp, ArrowDown, GripVertical, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SortRule {
  id: string
  field: string
  direction: "asc" | "desc"
}

interface SortPanelProps {
  onSortChange?: (sorts: SortRule[]) => void
}

export function SortPanel({ onSortChange }: SortPanelProps) {
  const t = useTranslations()
  const [sorts, setSorts] = useState<SortRule[]>([])
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const fields = [
    { value: "name", label: t('fields.name') },
    { value: "status", label: t('fields.status') },
    { value: "priority", label: t('fields.priority') },
    { value: "assignee", label: t('fields.assignee') },
    { value: "due_date", label: t('fields.dueDate') },
    { value: "created_at", label: "Created Date" },
    { value: "updated_at", label: "Updated Date" },
    { value: "start_date", label: t('fields.startDate') },
    { value: "tags", label: t('fields.tags') },
    { value: "comments_count", label: "Comments" },
    { value: "attachments_count", label: "Attachments" },
  ]

  const addSort = () => {
    const newSort: SortRule = {
      id: Math.random().toString(36).substr(2, 9),
      field: fields[0].value,
      direction: "asc",
    }
    const updatedSorts = [...sorts, newSort]
    setSorts(updatedSorts)
    if (onSortChange) {
      onSortChange(updatedSorts)
    }
  }

  const removeSort = (id: string) => {
    const updatedSorts = sorts.filter((s) => s.id !== id)
    setSorts(updatedSorts)
    if (onSortChange) {
      onSortChange(updatedSorts)
    }
  }

  const updateSort = (id: string, updates: Partial<SortRule>) => {
    const updatedSorts = sorts.map((s) => (s.id === id ? { ...s, ...updates } : s))
    setSorts(updatedSorts)
    if (onSortChange) {
      onSortChange(updatedSorts)
    }
  }

  const toggleDirection = (id: string) => {
    const sort = sorts.find((s) => s.id === id)
    if (sort) {
      updateSort(id, { direction: sort.direction === "asc" ? "desc" : "asc" })
    }
  }

  const clearAllSorts = () => {
    setSorts([])
    if (onSortChange) {
      onSortChange([])
    }
  }

  const handleDragStart = (id: string) => {
    setDraggedItem(id)
  }

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    if (draggedItem && draggedItem !== id) {
      const draggedIndex = sorts.findIndex((s) => s.id === draggedItem)
      const targetIndex = sorts.findIndex((s) => s.id === id)

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newSorts = [...sorts]
        const [removed] = newSorts.splice(draggedIndex, 1)
        newSorts.splice(targetIndex, 0, removed)
        setSorts(newSorts)
      }
    }
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    if (onSortChange) {
      onSortChange(sorts)
    }
  }

  const applySavedSort = (sortName: string) => {
    let newSorts: SortRule[] = []
    
    switch (sortName) {
      case "priority-high":
        newSorts = [
          { id: "1", field: "priority", direction: "desc" },
          { id: "2", field: "due_date", direction: "asc" },
        ]
        break
      case "due-date":
        newSorts = [
          { id: "1", field: "due_date", direction: "asc" },
          { id: "2", field: "priority", direction: "desc" },
        ]
        break
      case "recent":
        newSorts = [
          { id: "1", field: "updated_at", direction: "desc" },
        ]
        break
      case "alphabetical":
        newSorts = [
          { id: "1", field: "name", direction: "asc" },
        ]
        break
    }
    
    setSorts(newSorts)
    if (onSortChange) {
      onSortChange(newSorts)
    }
  }

  return (
    <div className="space-y-4">
      {/* Sort Priority Info */}
      {sorts.length > 1 && (
        <div className="bg-muted/50 rounded-lg p-3 text-sm">
          <p className="text-muted-foreground">
            Items are sorted by the first rule, then by the second rule for ties, and so on.
          </p>
        </div>
      )}

      {/* Sort Rules */}
      <div className="space-y-3">
        {sorts.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <ArrowUpDown className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">No sorting applied</p>
            <Button onClick={addSort} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Sort
            </Button>
          </div>
        ) : (
          sorts.map((sort, index) => (
            <div
              key={sort.id}
              draggable
              onDragStart={() => handleDragStart(sort.id)}
              onDragOver={(e) => handleDragOver(e, sort.id)}
              onDragEnd={handleDragEnd}
              className={`space-y-2 p-3 border rounded-lg cursor-grab active:cursor-grabbing ${
                draggedItem === sort.id ? "opacity-50" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-xs font-medium">Sort {index + 1}</Label>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeSort(sort.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Select
                  value={sort.field}
                  onValueChange={(value) => updateSort(sort.id, { field: value })}
                >
                  <SelectTrigger className="h-9 flex-1">
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
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 flex-shrink-0"
                  onClick={() => toggleDirection(sort.id)}
                  title={sort.direction === "asc" ? "Ascending" : "Descending"}
                >
                  {sort.direction === "asc" ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {sort.direction === "asc" ? "A → Z, 0 → 9" : "Z → A, 9 → 0"}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Actions */}
      {sorts.length > 0 && (
        <div className="flex gap-2">
          <Button onClick={addSort} variant="outline" className="flex-1">
            <Plus className="h-4 w-4 mr-2" />
            Add Sort
          </Button>
          <Button onClick={clearAllSorts} variant="outline">
            Clear All
          </Button>
        </div>
      )}

      {/* Quick Sort Options */}
      <div className="space-y-3 pt-4 border-t">
        <Label>Quick Sort</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => applySavedSort("priority-high")}
            className="justify-start"
          >
            <ArrowDown className="h-3 w-3 mr-2" />
            High Priority
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applySavedSort("due-date")}
            className="justify-start"
          >
            <ArrowUp className="h-3 w-3 mr-2" />
            Due Date
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applySavedSort("recent")}
            className="justify-start"
          >
            <ArrowDown className="h-3 w-3 mr-2" />
            Most Recent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applySavedSort("alphabetical")}
            className="justify-start"
          >
            <ArrowUp className="h-3 w-3 mr-2" />
            A to Z
          </Button>
        </div>
      </div>

      {/* Saved Sorts */}
      <div className="space-y-3 pt-4 border-t">
        <Label>Saved Sorts</Label>
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            size="sm"
            onClick={() => applySavedSort("priority-high")}
          >
            <ArrowUpDown className="h-3 w-3 mr-2" />
            Priority: High to Low, Due Date
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            size="sm"
            onClick={() => applySavedSort("due-date")}
          >
            <ArrowUpDown className="h-3 w-3 mr-2" />
            Due Date (Soonest First)
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            size="sm"
            onClick={() => applySavedSort("recent")}
          >
            <ArrowUpDown className="h-3 w-3 mr-2" />
            Recently Updated
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="w-full">
          Save Current Sort
        </Button>
      </div>
    </div>
  )
}
