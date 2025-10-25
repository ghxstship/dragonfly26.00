"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

/**
 * FormTemplate - Template Component
 * 
 * Standard template for form pages with sections and actions.
 * Provides consistent layout for create/edit forms.
 * 
 * Features:
 * - Header with title
 * - Form sections with cards
 * - Sticky footer with actions
 * - Cancel/Save buttons
 * - Loading states
 * 
 * Usage:
 * <FormTemplate
 *   title="Create Project"
 *   sections={[
 *     { title: 'Basic Info', content: <BasicInfoFields /> },
 *     { title: 'Settings', content: <SettingsFields /> }
 *   ]}
 *   onSave={handleSave}
 *   onCancel={handleCancel}
 * />
 */

export interface FormSection {
  title: string
  description?: string
  content: React.ReactNode
}

export interface FormTemplateProps {
  /** Form title */
  title: string
  
  /** Subtitle or description */
  subtitle?: string
  
  /** Form sections */
  sections: FormSection[]
  
  /** Save button label */
  saveLabel?: string
  
  /** Cancel button label */
  cancelLabel?: string
  
  /** Save handler */
  onSave?: () => void
  
  /** Cancel handler */
  onCancel?: () => void
  
  /** Additional footer actions */
  footerActions?: React.ReactNode
  
  /** Loading state */
  loading?: boolean
  
  /** Disable save button */
  saveDisabled?: boolean
  
  /** Additional CSS classes */
  className?: string
}

export function FormTemplate({
  title,
  subtitle,
  sections,
  saveLabel,
  cancelLabel,
  onSave,
  onCancel,
  footerActions,
  loading,
  saveDisabled,
  className,
}: FormTemplateProps) {
  const t = useTranslations()

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-4 md:p-6">
          <h1 className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto p-4 md:p-6 space-y-3 md:space-y-4 lg:space-y-6">
          {sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                {section.description && (
                  <CardDescription>{section.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>{section.content}</CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between p-4 md:p-6">
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            {footerActions}
          </div>
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="gap-2"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                {cancelLabel || t('common.cancel')}
              </Button>
            )}
            {onSave && (
              <Button
                onClick={onSave}
                disabled={loading || saveDisabled}
                className="gap-2"
              >
                <Save className="h-4 w-4" aria-hidden="true" />
                {saveLabel || t('common.save')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
