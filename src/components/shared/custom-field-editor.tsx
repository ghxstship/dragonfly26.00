"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Plus, GripVertical, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { CustomField, CustomFieldType } from "@/types"

const FIELD_TYPES: { value: CustomFieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "select", label: "Select" },
  { value: "multi-select", label: "Multi-select" },
  { value: "checkbox", label: "Checkbox" },
  { value: "url", label: "URL" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "currency", label: "Currency" },
  { value: "percent", label: "Percent" },
  { value: "duration", label: "Duration" },
  { value: "rating", label: "Rating" },
  { value: "file", label: "File" },
  { value: "user", label: "User" },
  { value: "relation", label: "Relation" },
]

interface CustomFieldEditorProps {
  fields: CustomField[]
  onFieldsChange: (fields: CustomField[]) => void
}

export function CustomFieldEditor({ fields, onFieldsChange }: CustomFieldEditorProps) {
  const t = useTranslations()
  const [isCreating, setIsCreating] = useState(false)
  const [newField, setNewField] = useState<Partial<CustomField>>({
    name: "",
    type: "text",
    required: false,
  })

  const createField = () => {
    if (!newField.name) return

    const field: CustomField = {
      id: `field-${Date.now()}`,
      workspace_id: "current", // Would come from context
      name: newField.name,
      type: newField.type as CustomFieldType,
      required: newField.required || false,
      order: fields.length,
      created_at: new Date().toISOString(),
    }

    onFieldsChange([...fields, field])
    setNewField({ name: "", type: "text", required: false })
    setIsCreating(false)
  }

  const updateField = (id: string, updates: Partial<CustomField>) => {
    onFieldsChange(
      fields.map((field) => (field.id === id ? { ...field, ...updates } : field))
    )
  }

  const deleteField = (id: string) => {
    onFieldsChange(fields.filter((field: any) => field.id !== id))
  }

  return (
    <div className="space-y-2">
      {fields.map((field) => (
        <div
          key={field.id}
          className="flex items-center gap-2 p-3 border rounded-lg hover:bg-accent/50"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          <div className="flex-1">
            <div className="font-medium">{field.name}</div>
            <div className="text-sm text-muted-foreground capitalize">
              {field.type}
              {field.required && " • Required"}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => deleteField(field.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full gap-2">
            <Plus className="h-4 w-4" />
            Add custom field
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Custom Field</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Field Name</Label>
              <Input
                placeholder="e.g., Priority, Department"
                value={newField.name}
                onChange={(e) => setNewField({ ...newField, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Field Type</Label>
              <Select
                value={newField.type}
                onValueChange={(value) =>
                  setNewField({ ...newField, type: value as CustomFieldType })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label>Required field</Label>
              <Switch
                checked={newField.required}
                onCheckedChange={(checked) =>
                  setNewField({ ...newField, required: checked })
                }
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreating(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={createField} className="flex-1">
                Create Field
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
