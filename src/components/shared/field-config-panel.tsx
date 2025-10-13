"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Eye, EyeOff } from "lucide-react"

interface Field {
  id: string
  name: string
  visible: boolean
  locked?: boolean
}

const mockFields = [
  { id: "name", name: "Name", visible: true, locked: true },
  { id: "status", name: "Status", visible: true },
  { id: "priority", name: "Priority", visible: true },
  { id: "assignee", name: "Assignee", visible: true },
  { id: "due_date", name: "Due Date", visible: true },
  { id: "start_date", name: "Start Date", visible: false },
  { id: "created_at", name: "Created", visible: true },
  { id: "updated_at", name: "Updated", visible: false },
  { id: "tags", name: "Tags", visible: true },
  { id: "description", name: "Description", visible: false },
]

export function FieldConfigPanel() {
  const t = useTranslations()
  const [fields, setFields] = useState<Field[]>(mockFields)
  const [searchQuery, setSearchQuery] = useState("")

  const toggleFieldVisibility = (id: string) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, visible: !field.visible } : field
      )
    )
  }

  const showAllFields = () => {
    setFields((prev) => prev.map((field) => ({ ...field, visible: true })))
  }

  const hideAllFields = () => {
    setFields((prev) =>
      prev.map((field) =>
        field.locked ? field : { ...field, visible: false }
      )
    )
  }

  const filteredFields = fields.filter((field) =>
    field.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const visibleCount = fields.filter((f) => f.visible).length
  const totalCount = fields.length

  return (
    <div className="space-y-4 [&>*:first-child]:mt-0">
      {/* Search */}
      <Input
        placeholder="Search fields..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="h-9"
      />

      {/* Stats & Actions */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {visibleCount} of {totalCount} visible
        </span>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={showAllFields} className="h-7 text-xs">
            Show All
          </Button>
          <Button variant="ghost" size="sm" onClick={hideAllFields} className="h-7 text-xs">
            Hide All
          </Button>
        </div>
      </div>

      {/* Fields List */}
      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-2">
        {filteredFields.map((field) => (
          <div
            key={field.id}
            className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{field.name}</div>
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

      {/* Display Options */}
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
    </div>
  )
}
