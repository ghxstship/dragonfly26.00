"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, Loader2, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { getFormConfig } from "@/lib/modules/form-fields-registry"
import type { FormFieldConfig } from "@/lib/modules/form-fields-registry"
import { AssetCatalogAutocomplete } from "@/components/shared/asset-catalog-autocomplete"
import { getTableMapping } from "@/lib/modules/table-mapping"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/lib/hooks/use-toast"

interface CreateItemDialogEnhancedProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  moduleId: string
  tabSlug: string
  workspaceId?: string
  onSuccess?: (item: any) => void
}

export function CreateItemDialogEnhanced({
  open,
  onOpenChange,
  moduleId,
  tabSlug,
  workspaceId,
  onSuccess,
}: CreateItemDialogEnhancedProps) {
  const t = useTranslations()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const supabase = createClient()

  const config = getFormConfig(moduleId, tabSlug)
  const tableMapping = getTableMapping(moduleId, tabSlug)

  if (!config) {
    return null
  }

  // Initialize default values
  const initializeDefaults = () => {
    const defaults: Record<string, any> = {}
    config.fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        defaults[field.name] = field.defaultValue
      }
    })
    return defaults
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Prepare data for insertion
      const newData: Record<string, any> = {
        ...formData,
      }

      // Add workspace_id if required
      if (tableMapping?.requiresWorkspaceId && workspaceId) {
        newData.workspace_id = workspaceId
      }

      // Add created_by user_id if required
      if (tableMapping?.requiresUserId) {
        newData.created_by = user.id
      }

      // Insert into database if table mapping exists
      if (tableMapping) {
        const { data: newItem, error } = await supabase
          .from(tableMapping.tableName)
          .insert(newData)
          .select()
          .single()

        if (error) {
          console.error('Database error:', error)
          throw error
        }

        toast({
          title: "Success",
          description: `${config.title} created successfully`,
        })

        onSuccess?.(newItem)
      } else {
        // Fallback for tabs without table mapping (legacy support)
        const newItem = {
          id: Math.random().toString(36).substr(2, 9),
          ...newData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        onSuccess?.(newItem)
      }

      setIsLoading(false)
      onOpenChange(false)
      
      // Reset form
      setFormData(initializeDefaults())
    } catch (error: any) {
      console.error('Error creating item:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to create item. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const updateField = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
  }

  const renderField = (field: FormFieldConfig) => {
    const value = formData[field.name]

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'url':
        return (
          <div key={field.name} className="grid gap-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && '*'}
            </Label>
            <Input
              id={field.name}
              type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'}
              value={value || ''}
              onChange={(e) => updateField(field.name, e.target.value)}
              placeholder={field.placeholder || `${field.label}...`}
              required={field.required}
            />
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
          </div>
        )

      case 'textarea':
        return (
          <div key={field.name} className="grid gap-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && '*'}
            </Label>
            <Textarea
              id={field.name}
              value={value || ''}
              onChange={(e) => updateField(field.name, e.target.value)}
              placeholder={field.placeholder || `${field.label}...`}
              rows={3}
              required={field.required}
            />
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
          </div>
        )

      case 'number':
      case 'currency':
      case 'percentage':
        return (
          <div key={field.name} className="grid gap-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && '*'}
            </Label>
            <div className="relative">
              {field.type === 'currency' && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              )}
              <Input
                id={field.name}
                type="number"
                value={value || ''}
                onChange={(e) => updateField(field.name, parseFloat(e.target.value) || '')}
                placeholder={field.placeholder}
                required={field.required}
                min={field.validation?.min}
                max={field.validation?.max}
                className={field.type === 'currency' ? 'pl-7' : field.type === 'percentage' ? 'pr-7' : ''}
              />
              {field.type === 'percentage' && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
              )}
            </div>
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
          </div>
        )

      case 'select':
        return (
          <div key={field.name} className="grid gap-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && '*'}
            </Label>
            <Select
              value={value || field.defaultValue}
              onValueChange={(val) => updateField(field.name, val)}
              required={field.required}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
          </div>
        )

      case 'date':
      case 'datetime':
        return (
          <div key={field.name} className="grid gap-2">
            <Label>
              {field.label} {field.required && '*'}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value ? format(new Date(value), field.type === 'datetime' ? "PPP p" : "PPP") : `Pick a ${field.label.toLowerCase()}`}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={value ? new Date(value) : undefined}
                  onSelect={(date) => updateField(field.name, date?.toISOString())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
          </div>
        )

      case 'switch':
        return (
          <div key={field.name} className="flex items-center justify-between space-x-2">
            <Label htmlFor={field.name} className="flex flex-col space-y-1">
              <span>{field.label} {field.required && '*'}</span>
              {field.description && (
                <span className="text-xs font-normal text-muted-foreground">{field.description}</span>
              )}
            </Label>
            <Switch
              id={field.name}
              checked={value || false}
              onCheckedChange={(checked) => updateField(field.name, checked)}
            />
          </div>
        )

      case 'tags':
        return (
          <div key={field.name} className="grid gap-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && '*'}
            </Label>
            <div className="flex flex-wrap gap-2 p-2 min-h-[42px] border rounded-md">
              {(value || []).map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-primary/10 text-primary"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => {
                      const newTags = [...(value || [])]
                      newTags.splice(index, 1)
                      updateField(field.name, newTags)
                    }}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <Input
                className="flex-1 min-w-[120px] border-0 shadow-none focus-visible:ring-0 p-0"
                placeholder="Add tag..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const input = e.currentTarget
                    const tag = input.value.trim()
                    if (tag) {
                      updateField(field.name, [...(value || []), tag])
                      input.value = ''
                    }
                  }
                }}
              />
            </div>
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
          </div>
        )

      case 'autocomplete':
        // Use AssetCatalogAutocomplete for asset_item field
        if (field.name === 'asset_item') {
          const assetCategory = formData['asset_category']
          return (
            <AssetCatalogAutocomplete
              key={field.name}
              label={field.label}
              description={field.description}
              required={field.required}
              value={value || ''}
              assetCategory={assetCategory}
              onChange={(newValue, selectedItem) => {
                updateField(field.name, newValue)
                // Store the full catalog item data if selected
                if (selectedItem) {
                  updateField('_catalog_item', selectedItem)
                }
              }}
            />
          )
        }
        // Fall through to default autocomplete for other fields
      case 'user':
      case 'multiuser':
      case 'location':
        // These would need proper autocomplete/search components
        // For now, render as text input with placeholder
        return (
          <div key={field.name} className="grid gap-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && '*'}
            </Label>
            <Input
              id={field.name}
              value={value || ''}
              onChange={(e) => updateField(field.name, e.target.value)}
              placeholder={`Search for ${field.label.toLowerCase()}...`}
              required={field.required}
            />
            <p className="text-xs text-muted-foreground">
              {field.description || `Start typing to search ${field.label.toLowerCase()}`}
            </p>
          </div>
        )

      case 'richtext':
        // Render as textarea for now, could be replaced with rich text editor
        return (
          <div key={field.name} className="grid gap-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && '*'}
            </Label>
            <Textarea
              id={field.name}
              value={value || ''}
              onChange={(e) => updateField(field.name, e.target.value)}
              placeholder={field.placeholder || `${field.label}...`}
              rows={5}
              required={field.required}
            />
            {field.description && (
              <p className="text-xs text-muted-foreground">{field.description}</p>
            )}
          </div>
        )

      case 'multiselect':
        // Simplified multiselect - could be enhanced with a proper component
        return (
          <div key={field.name} className="grid gap-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && '*'}
            </Label>
            <Input
              id={field.name}
              value={value || ''}
              onChange={(e) => updateField(field.name, e.target.value)}
              placeholder={`Select multiple ${field.label.toLowerCase()}...`}
              required={field.required}
            />
            <p className="text-xs text-muted-foreground">
              {field.description || 'Multi-select functionality'}
            </p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{config.title}</DialogTitle>
            <DialogDescription>{config.description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {config.fields.map(field => renderField(field))}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                config.submitLabel || t('common.create')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
