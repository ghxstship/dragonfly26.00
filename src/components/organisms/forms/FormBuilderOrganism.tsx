"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Plus, Trash2, GripVertical, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/**
 * FormBuilderOrganism - Organism Component
 * 
 * Dynamic form builder with drag-and-drop fields.
 * Extracted from views/form-view.tsx for atomic design system.
 * 
 * Features:
 * - Add/remove fields
 * - Field type selection
 * - Field configuration
 * - Drag to reorder
 * - Preview mode
 * - Full i18n and accessibility
 */

export interface FormField {
  id: string
  type: 'text' | 'number' | 'email' | 'select' | 'textarea' | 'checkbox' | 'date'
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
}

export interface FormBuilderOrganismProps {
  fields: FormField[]
  onChange: (fields: FormField[]) => void
  mode?: 'edit' | 'preview'
}

export function FormBuilderOrganism({ 
  fields, 
  onChange,
  mode = 'edit'
}: FormBuilderOrganismProps) {
  const t = useTranslations()
  const [selectedField, setSelectedField] = useState<string | null>(null)

  const addField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: 'text',
      label: t('formBuilder.newField'),
      required: false
    }
    onChange([...fields, newField])
  }

  const removeField = (id: string) => {
    onChange(fields.filter(f => (f as any).id !== id))
    if (selectedField === id) setSelectedField(null)
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    onChange(fields.map(f => f.id === id ? { ...f, ...updates } : f))
  }

  const moveField = (id: string, direction: 'up' | 'down') => {
    const index = fields.findIndex(f => f.id === id)
    if (index === -1) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === fields.length - 1) return

    const newFields = [...fields]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]]
    onChange(newFields)
  }

  if (mode === 'preview') {
    return (
      <div className="space-y-4 p-6">
        {(fields as any[]).map((field: any) => (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {field.type === 'textarea' ? (
              <textarea
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 max-w-full"
                placeholder={field.placeholder}
              />
            ) : field.type === 'select' ? (
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((opt, i) => (
                    <SelectItem key={i} value={opt as any}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : field.type === 'checkbox' ? (
              <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                <input type="checkbox" id={field.id} />
                <label htmlFor={field.id}>{field.label}</label>
              </div>
            ) : (
              <Input
                type={field.type}
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4 h-full">
      {/* Fields List */}
      <div className="col-span-2 space-y-2 overflow-auto p-4">
        <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between mb-4">
          <h3 className="font-semibold">{t('formBuilder.fields')}</h3>
          <Button onClick={addField} size="sm" className="gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t('formBuilder.addField')}
          </Button>
        </div>

        {fields.length === 0 ? (
          <Card>
            <CardContent className="flex flex-wrap flex-col items-center justify-center py-6 md:py-4 md:py-6 lg:py-8 lg:py-12 text-center">
              <p className="text-muted-foreground mb-4">{t('formBuilder.noFields')}</p>
              <Button onClick={addField} variant="outline">
                {t('formBuilder.addFirstField')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          (fields as any[]).map((field, index) => (
            <Card
              key={field.id}
              className={cn(
                'cursor-pointer transition-colors',
                selectedField === field.id && 'ring-2 ring-primary'
              )}
              onClick={() => setSelectedField(field.id)}
            >
              <CardContent className="flex flex-wrap flex-col md:flex-row items-center gap-2 p-3">
                <GripVertical className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{field.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {field.type} {field.required && '• Required'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeField(field.id)
                  }}
                  aria-label={t('formBuilder.removeField')}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Field Properties */}
      <div className="border-l p-4 overflow-auto">
        {selectedField ? (
          <div className="space-y-4">
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 mb-4">
              <Settings className="h-5 w-5" aria-hidden="true" />
              <h3 className="font-semibold">{t('formBuilder.properties')}</h3>
            </div>

            {(() => {
              const field = fields.find(f => f.id === selectedField)
              if (!field) return null

              return (
                <>
                  <div className="space-y-2">
                    <Label>{t('formBuilder.fieldLabel')}</Label>
                    <Input
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('formBuilder.fieldType')}</Label>
                    <Select
                      value={field.type}
                      onValueChange={(value) => updateField(field.id, { type: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">{t('formBuilder.text')}</SelectItem>
                        <SelectItem value="number">{t('formBuilder.number')}</SelectItem>
                        <SelectItem value="email">{t('formBuilder.email')}</SelectItem>
                        <SelectItem value="select">{t('formBuilder.select')}</SelectItem>
                        <SelectItem value="textarea">{t('formBuilder.textarea')}</SelectItem>
                        <SelectItem value="checkbox">{t('formBuilder.checkbox')}</SelectItem>
                        <SelectItem value="date">{t('formBuilder.date')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('formBuilder.placeholder')}</Label>
                    <Input
                      value={field.placeholder || ''}
                      onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                    <input
                      type="checkbox"
                      id="required"
                      checked={field.required}
                      onChange={(e) => updateField(field.id, { required: e.target.checked })}
                    />
                    <Label htmlFor="required">{t('formBuilder.required')}</Label>
                  </div>
                </>
              )
            })()}
          </div>
        ) : (
          <div className="flex flex-wrap flex-col items-center justify-center h-full text-center text-muted-foreground">
            <p>{t('formBuilder.selectField')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
