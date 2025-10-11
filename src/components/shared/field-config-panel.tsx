"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { GripVertical, Eye, EyeOff, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

interface Field {
  id: string
  name: string
  label: string
  visible: boolean
  locked?: boolean
  width?: number
}

interface FieldConfigPanelProps {
  onFieldsChange?: (fields: Field[]) => void
}

export function FieldConfigPanel({ onFieldsChange }: FieldConfigPanelProps) {
  const t = useTranslations()
  const [fields, setFields] = useState<Field[]>([
    { id: "name", name: "name", label: t('fields.name'), visible: true, locked: true },
    { id: "status", name: "status", label: t('fields.status'), visible: true },
    { id: "priority", name: "priority", label: t('fields.priority'), visible: true },
    { id: "assignee", name: "assignee", label: t('fields.assignee'), visible: true },
    { id: "due_date", name: "due_date", label: t('fields.dueDate'), visible: true },
    { id: "start_date", name: "start_date", label: t('fields.startDate'), visible: false },
    { id: "created_at", name: "created_at", label: "Created", visible: true },
    { id: "updated_at", name: "updated_at", label: "Updated", visible: false },
    { id: "tags", name: "tags", label: t('fields.tags'), visible: true },
    { id: "description", name: "description", label: t('fields.description'), visible: false },
    { id: "comments_count", name: "comments_count", label: "Comments", visible: true },
    { id: "attachments_count", name: "attachments_count", label: "Attachments", visible: false },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const toggleFieldVisibility = (id: string) => {
    const updatedFields = fields.map((field) =>
      field.id === id ? { ...field, visible: !field.visible } : field
    )
    setFields(updatedFields)
    if (onFieldsChange) {
      onFieldsChange(updatedFields)
    }
  }

  const showAllFields = () => {
    const updatedFields = fields.map((field) => ({ ...field, visible: true }))
    setFields(updatedFields)
    if (onFieldsChange) {
      onFieldsChange(updatedFields)
    }
  }

  const hideAllFields = () => {
    const updatedFields = fields.map((field) =>
      field.locked ? field : { ...field, visible: false }
    )
    setFields(updatedFields)
    if (onFieldsChange) {
      onFieldsChange(updatedFields)
    }
  }

  const handleDragStart = (id: string) => {
    setDraggedItem(id)
  }

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    if (draggedItem && draggedItem !== id) {
      const draggedIndex = fields.findIndex((f) => f.id === draggedItem)
      const targetIndex = fields.findIndex((f) => f.id === id)

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newFields = [...fields]
        const [removed] = newFields.splice(draggedIndex, 1)
        newFields.splice(targetIndex, 0, removed)
        setFields(newFields)
      }
    }
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    if (onFieldsChange) {
      onFieldsChange(fields)
    }
  }

  const filteredFields = fields.filter((field) =>
    field.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const visibleCount = fields.filter((f) => f.visible).length
  const totalCount = fields.length

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Field Configuration</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Show, hide, and reorder fields to customize your view.
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div className="text-sm">
          <span className="font-medium">{visibleCount}</span> of{" "}
          <span className="font-medium">{totalCount}</span> fields visible
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={showAllFields}>
            Show All
          </Button>
          <Button variant="ghost" size="sm" onClick={hideAllFields}>
            Hide All
          </Button>
        </div>
      </div>

      {/* Search */}
      <div>
        <Input
          placeholder="Search fields..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9"
        />
      </div>

      {/* Fields List */}
      <div className="space-y-2">
        <Label>Fields</Label>
        <div className="space-y-1">
          {filteredFields.map((field) => (
            <div
              key={field.id}
              draggable={!field.locked}
              onDragStart={() => handleDragStart(field.id)}
              onDragOver={(e) => handleDragOver(e, field.id)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors ${
                draggedItem === field.id ? "opacity-50" : ""
              } ${field.locked ? "cursor-default" : "cursor-grab active:cursor-grabbing"}`}
            >
              {!field.locked && (
                <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
              {field.locked && <div className="w-4" />}

              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{field.label}</div>
                {field.locked && (
                  <div className="text-xs text-muted-foreground">Required field</div>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={() => toggleFieldVisibility(field.id)}
                disabled={field.locked}
              >
                {field.visible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Field Width Settings (for table view) */}
      <div className="space-y-3 pt-4 border-t">
        <Label>Display Options</Label>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm">Auto-fit columns</div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">Wrap text</div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">Show row numbers</div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="space-y-3 pt-4 border-t">
        <Label>Field Presets</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm">
            <Settings2 className="h-3 w-3 mr-2" />
            Basic
          </Button>
          <Button variant="outline" size="sm">
            <Settings2 className="h-3 w-3 mr-2" />
            Detailed
          </Button>
          <Button variant="outline" size="sm">
            <Settings2 className="h-3 w-3 mr-2" />
            Compact
          </Button>
          <Button variant="outline" size="sm">
            <Settings2 className="h-3 w-3 mr-2" />
            Custom
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="w-full">
          Save Current as Preset
        </Button>
      </div>
    </div>
  )
}
