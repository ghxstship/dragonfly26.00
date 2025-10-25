"use client"

import { useState, useEffect } from "react"
import { X, Save, Trash2, Copy, Edit, Calendar, User, Tag, Paperclip, Clock } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { CommentsSection } from "./comments-section"
import { ActivityFeed } from "./activity-feed"
import type { DataItem } from "@/types"
import type { FieldSchema } from "@/lib/data-schemas"

interface CrudDrawerProps {
  mode: 'view' | 'create' | 'edit'
  item?: DataItem | null
  schema: FieldSchema[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate?: (data: Record<string, any>) => Promise<void>
  onUpdate?: (id: string, updates: Record<string, any>) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  onDuplicate?: (item: DataItem) => Promise<void>
  title?: string
  loading?: boolean
}

export function CrudDrawer({
  mode,
  item,
  schema,
  open,
  onOpenChange,
  onCreate,
  onUpdate,
  onDelete,
  onDuplicate,
  title,
  loading = false,
}: CrudDrawerProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSaving, setIsSaving] = useState(false)
  
  const isReadOnly = mode === 'view'
  const isCreating = mode === 'create'

  // Initialize form data
  useEffect(() => {
    if (isCreating) {
      const defaults: Record<string, any> = {}
      schema.forEach(field => {
        if (field.defaultValue !== undefined) {
          defaults[field.id] = field.defaultValue
        }
      })
      setFormData(defaults)
    } else if (item) {
      setFormData({ ...item })
    }
  }, [item, schema, isCreating, open])

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      if (isCreating) {
        await onCreate?.(formData)
      } else if (item?.id) {
        await onUpdate?.(item.id, formData)
      }
      onOpenChange(false)
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!item?.id || !confirm('Are you sure you want to delete this item?')) return
    setIsSaving(true)
    try {
      await onDelete?.(item.id)
      onOpenChange(false)
    } catch (error) {
      console.error('Delete failed:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDuplicate = async () => {
    if (!item) return
    setIsSaving(true)
    try {
      await onDuplicate?.(item)
      onOpenChange(false)
    } catch (error) {
      console.error('Duplicate failed:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const renderField = (field: FieldSchema) => {
    const value = formData[field.id]

    switch (field.type) {
      // Text types
      case 'text':
      case 'email':
      case 'phone':
      case 'url':
      case 'address':
      case 'location':
        return (
          <Input
            type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            disabled={isReadOnly}
            required={field.required}
          />
        )

      case 'textarea':
      case 'richtext':
      case 'markdown':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            disabled={isReadOnly}
            required={field.required}
            rows={field.type === 'textarea' ? 4 : 8}
          />
        )

      // Number types
      case 'number':
      case 'decimal':
      case 'autonumber':
      case 'count':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, parseFloat(e.target.value))}
            placeholder={field.placeholder}
            disabled={isReadOnly || field.type === 'autonumber' || field.type === 'count'}
            required={field.required}
            min={field.validation?.min}
            max={field.validation?.max}
            step={field.type === 'decimal' ? '0.01' : '1'}
          />
        )

      case 'currency':
        return (
          <div className="relative">
            <span className="absolute sm:relative sm:inset-auto left-3 top-2.5 text-muted-foreground sm:relative sm:inset-auto">$</span>
            <Input
              type="number"
              value={value || ''}
              onChange={(e) => handleFieldChange(field.id, parseFloat(e.target.value))}
              placeholder={field.placeholder}
              disabled={isReadOnly}
              required={field.required}
              className="pl-7"
              step="0.01"
            />
          </div>
        )

      case 'percent':
        return (
          <div className="relative">
            <Input
              type="number"
              value={value || ''}
              onChange={(e) => handleFieldChange(field.id, parseFloat(e.target.value))}
              placeholder={field.placeholder}
              disabled={isReadOnly}
              required={field.required}
              min={0}
              max={100}
              className="pr-8"
            />
            <span className="absolute sm:relative sm:inset-auto right-3 top-2.5 text-muted-foreground sm:relative sm:inset-auto">%</span>
          </div>
        )

      case 'duration':
        return (
          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Hours"
              value={Math.floor((value || 0) / 60)}
              onChange={(e) => {
                const hours = parseInt(e.target.value) || 0
                const mins = (value || 0) % 60
                handleFieldChange(field.id, hours * 60 + mins)
              }}
              disabled={isReadOnly}
              min={0}
            />
            <Input
              type="number"
              placeholder="Minutes"
              value={(value || 0) % 60}
              onChange={(e) => {
                const hours = Math.floor((value || 0) / 60)
                const mins = parseInt(e.target.value) || 0
                handleFieldChange(field.id, hours * 60 + mins)
              }}
              disabled={isReadOnly}
              min={0}
              max={59}
            />
          </div>
        )

      case 'progress':
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
              <Input
                type="number"
                value={value || 0}
                onChange={(e) => handleFieldChange(field.id, Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                disabled={isReadOnly}
                min={0}
                max={100}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden md:block">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${value || 0}%` }}
              />
            </div>
          </div>
        )

      // Date/Time types
      case 'date':
        return (
          <Input
            type="date"
            value={value?.split('T')[0] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            disabled={isReadOnly}
            required={field.required}
          />
        )

      case 'datetime':
        return (
          <Input
            type="datetime-local"
            value={value ? new Date(value).toISOString().slice(0, 16) : ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            disabled={isReadOnly}
            required={field.required}
          />
        )

      case 'time':
        return (
          <Input
            type="time"
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            disabled={isReadOnly}
            required={field.required}
          />
        )

      case 'daterange':
        return (
          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2">
            <Input
              type="date"
              placeholder="Start date"
              value={value?.start?.split('T')[0] || ''}
              onChange={(e) => handleFieldChange(field.id, { ...value, start: e.target.value })}
              disabled={isReadOnly}
            />
            <Input
              type="date"
              placeholder="End date"
              value={value?.end?.split('T')[0] || ''}
              onChange={(e) => handleFieldChange(field.id, { ...value, end: e.target.value })}
              disabled={isReadOnly}
            />
          </div>
        )

      // Selection types
      case 'select':
      case 'status':
      case 'priority':
      case 'label':
        return (
          <Select
            value={value || ''}
            onValueChange={(val) => handleFieldChange(field.id, val)}
            disabled={isReadOnly}
            required={field.required}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                    {option.color && (
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: option.color }} />
                    )}
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <div key={option.value} className="flex flex-wrap md:flex-nowrap items-center space-x-2">
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  disabled={isReadOnly}
                  className="h-4 w-4"
                />
                <Label>{option.label}</Label>
              </div>
            ))}
          </div>
        )

      case 'multiselect':
      case 'tags':
      case 'badge':
        return (
          <div className="flex flex-wrap gap-2">
            {(value || []).map((val: string, idx: number) => (
              <Badge key={idx} variant="secondary">
                {val}
                {!isReadOnly && (
                  <button
                    onClick={() => {
                      const newValues = [...(value || [])]
                      newValues.splice(idx, 1)
                      handleFieldChange(field.id, newValues)
                    }}
                    className="ml-1"
                  >
                    ×
                  </button>
                )}
              </Badge>
            ))}
            {!isReadOnly && (
              <Button variant="outline" size="sm">
                <Tag className="h-3 w-3 mr-1" />
                Add
              </Button>
            )}
          </div>
        )

      case 'checkbox':
      case 'toggle':
        return (
          <div className="flex flex-wrap md:flex-nowrap items-center space-x-2">
            <Switch
              checked={value || false}
              onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
              disabled={isReadOnly}
            />
            <Label>{value ? 'Yes' : 'No'}</Label>
          </div>
        )

      // User types
      case 'user':
      case 'createdby':
      case 'modifiedby':
        return (
          <Select
            value={value || ''}
            onValueChange={(val) => handleFieldChange(field.id, val)}
            disabled={isReadOnly || field.type === 'createdby' || field.type === 'modifiedby'}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user1">John Doe</SelectItem>
              <SelectItem value="user2">Jane Smith</SelectItem>
              <SelectItem value="user3">Bob Wilson</SelectItem>
            </SelectContent>
          </Select>
        )

      case 'users':
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {(value || []).map((userId: string, idx: number) => (
                <Badge key={idx} variant="secondary">
                  <User className="h-3 w-3 mr-1" />
                  User {userId}
                  {!isReadOnly && (
                    <button
                      onClick={() => {
                        const newUsers = [...(value || [])]
                        newUsers.splice(idx, 1)
                        handleFieldChange(field.id, newUsers)
                      }}
                      className="ml-1"
                    >
                      ×
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {!isReadOnly && (
              <Button variant="outline" size="sm">
                <User className="h-3 w-3 mr-1" />
                Add user
              </Button>
            )}
          </div>
        )

      // Media types
      case 'file':
      case 'image':
      case 'signature':
        return (
          <div className="space-y-2">
            {value && (
              <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 p-2 border rounded">
                <Paperclip className="h-4 w-4" />
                <span className="text-sm">{value.name || 'File attached'}</span>
              </div>
            )}
            {!isReadOnly && (
              <Button variant="outline" size="sm" className="w-full max-w-full">
                <Paperclip className="h-4 w-4 mr-2" />
                Upload {field.type}
              </Button>
            )}
          </div>
        )

      case 'files':
      case 'images':
        return (
          <div className="space-y-2">
            {(value || []).length > 0 && (
              <div className="space-y-1">
                {(value || []).map((file: any, idx: number) => (
                  <div key={idx} className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between p-2 border rounded">
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                      <Paperclip className="h-4 w-4" />
                      <span className="text-sm">{file.name || `File ${idx + 1}`}</span>
                    </div>
                    {!isReadOnly && (
                      <button
                        onClick={() => {
                          const newFiles = [...(value || [])]
                          newFiles.splice(idx, 1)
                          handleFieldChange(field.id, newFiles)
                        }}
                        className="text-destructive"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {!isReadOnly && (
              <Button variant="outline" size="sm" className="w-full max-w-full">
                <Paperclip className="h-4 w-4 mr-2" />
                Upload {field.type}
              </Button>
            )}
          </div>
        )

      // Visual types
      case 'color':
        return (
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <Input
              type="color"
              value={value || '#000000'}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              disabled={isReadOnly}
              className="w-20 h-10"
            />
            <Input
              type="text"
              value={value || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder="#000000"
              disabled={isReadOnly}
              className="flex-1"
            />
          </div>
        )

      case 'rating':
        return (
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => !isReadOnly && handleFieldChange(field.id, star)}
                disabled={isReadOnly}
                className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl"
              >
                {star <= (value || 0) ? '★' : '☆'}
              </button>
            ))}
          </div>
        )

      case 'avatar':
      case 'icon':
        return (
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex flex-wrap items-center justify-center">
              {value ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={value} alt="Avatar" className="w-full h-full rounded-full object-cover max-w-full" />
              ) : (
                <User className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            {!isReadOnly && (
              <Button variant="outline" size="sm">
                Upload {field.type}
              </Button>
            )}
          </div>
        )

      // Advanced types
      case 'relation':
      case 'lookup':
        return (
          <Select
            value={value || ''}
            onValueChange={(val) => handleFieldChange(field.id, val)}
            disabled={isReadOnly || field.type === 'lookup'}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rel1">Related Item 1</SelectItem>
              <SelectItem value="rel2">Related Item 2</SelectItem>
              <SelectItem value="rel3">Related Item 3</SelectItem>
            </SelectContent>
          </Select>
        )

      case 'formula':
      case 'rollup':
        return (
          <Input
            value={value || ''}
            disabled
            className="bg-muted"
            placeholder="Calculated value"
          />
        )

      // Specialized types
      case 'barcode':
      case 'qrcode':
        return (
          <div className="space-y-2">
            <Input
              value={value || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={`Enter ${field.type} value`}
              disabled={isReadOnly}
            />
            {value && (
              <div className="p-4 border rounded bg-muted flex flex-wrap items-center justify-center">
                <div className="text-sm text-muted-foreground">
                  {field.type.toUpperCase()} Preview: {value}
                </div>
              </div>
            )}
          </div>
        )

      case 'button':
        return (
          <Button
            variant="outline"
            onClick={() => {/* Custom button action */}}
            disabled={isReadOnly}
          >
            {value || field.label}
          </Button>
        )

      case 'json':
        return (
          <Textarea
            value={typeof value === 'object' ? JSON.stringify(value, null, 2) : value || ''}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value)
                handleFieldChange(field.id, parsed)
              } catch {
                handleFieldChange(field.id, e.target.value)
              }
            }}
            placeholder={field.placeholder || '{}'}
            disabled={isReadOnly}
            rows={6}
            className="font-mono text-sm"
          />
        )

      // Location types
      case 'coordinates':
        return (
          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Latitude"
              value={value?.lat || ''}
              onChange={(e) => handleFieldChange(field.id, { ...value, lat: parseFloat(e.target.value) })}
              disabled={isReadOnly}
              step="0.000001"
            />
            <Input
              type="number"
              placeholder="Longitude"
              value={value?.lng || ''}
              onChange={(e) => handleFieldChange(field.id, { ...value, lng: parseFloat(e.target.value) })}
              disabled={isReadOnly}
              step="0.000001"
            />
          </div>
        )

      case 'timezone':
        return (
          <Select
            value={value || ''}
            onValueChange={(val) => handleFieldChange(field.id, val)}
            disabled={isReadOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="America/New_York">Eastern Time</SelectItem>
              <SelectItem value="America/Chicago">Central Time</SelectItem>
              <SelectItem value="America/Denver">Mountain Time</SelectItem>
              <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
              <SelectItem value="UTC">UTC</SelectItem>
            </SelectContent>
          </Select>
        )

      case 'country':
        return (
          <Select
            value={value || ''}
            onValueChange={(val) => handleFieldChange(field.id, val)}
            disabled={isReadOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="CA">Canada</SelectItem>
              <SelectItem value="GB">United Kingdom</SelectItem>
              <SelectItem value="AU">Australia</SelectItem>
            </SelectContent>
          </Select>
        )

      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            disabled={isReadOnly}
          />
        )
    }
  }

  // Get fields to show in form
  const formFields = schema.filter(f => 
    isCreating ? f.showInCreate !== false && f.showInForm !== false : f.showInForm !== false
  ).sort((a, b) => (a.order || 99) - (b.order || 99))

  const displayName = formData[schema.find(f => f.id === 'name' || f.id === 'title')?.id || 'name'] || 
    (isCreating ? 'New Item' : 'Item Details')

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-800px lg:w-[800px] sm:max-w-[800px] p-0 flex flex-wrap flex-col">
        {/* Header */}
        <SheetHeader className="border-b px-4 md:px-6 py-4">
          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-3">
              <SheetTitle className="text-base md:text-lg lg:text-xl">
                {title || (isCreating ? 'Create New' : displayName)}
              </SheetTitle>
              {!isCreating && !isReadOnly && (
                <Badge variant="outline">Editing</Badge>
              )}
            </div>
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
              {!isCreating && mode !== 'edit' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Switch to edit mode */}}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              {!isCreating && onDuplicate && (
                <Button variant="outline" size="sm" onClick={handleDuplicate} disabled={isSaving}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
              )}
              {!isCreating && onDelete && (
                <Button variant="outline" size="sm" onClick={handleDelete} disabled={isSaving}>
                  <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 flex flex-wrap overflow-hidden md:block">
          {/* Main Form */}
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-3 md:space-y-4 lg:space-y-6">
              {/* Form Fields */}
              <div className="space-y-4">
                {formFields.map(field => (
                  <div key={field.id} className="space-y-2">
                    <Label className="text-sm font-medium">
                      {field.label}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    {field.description && (
                      <p className="text-xs text-muted-foreground">{field.description}</p>
                    )}
                    {renderField(field)}
                  </div>
                ))}
              </div>

              {/* Metadata */}
              {!isCreating && item && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4 text-sm">
                    {formData.created_at && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Created</Label>
                        <div className="flex flex-wrap flex-col md:flex-row items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          {new Date(formData.created_at).toLocaleString()}
                        </div>
                      </div>
                    )}
                    {formData.updated_at && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Last Updated</Label>
                        <div className="flex flex-wrap flex-col md:flex-row items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          {new Date(formData.updated_at).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          {/* Activity Panel (only in view/edit mode) */}
          {!isCreating && item && (
            <div className="w-full sm:w-80 border-l flex flex-wrap flex-col">
              <Tabs defaultValue="activity" className="flex-1 flex flex-wrap flex-col">
                <TabsList className="w-full justify-start rounded-none border-b px-4 max-w-full">
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                </TabsList>
                <ScrollArea className="flex-1">
                  <TabsContent value="activity" className="p-4 m-0">
                    <ActivityFeed />
                  </TabsContent>
                  <TabsContent value="comments" className="p-4 m-0">
                    <CommentsSection entityType="item" entityId={item.id} />
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!isReadOnly && (
          <div className="border-t px-4 md:px-6 py-4 flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving || loading}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : (isCreating ? 'Create' : 'Save Changes')}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
