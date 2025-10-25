"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { 
  Bold, Italic, Underline, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, Link, Image as ImageIcon 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

/**
 * DocumentEditorOrganism - Organism Component
 * 
 * Rich text document editor with formatting toolbar.
 * Extracted from views/doc-view.tsx for atomic design system.
 * 
 * Features:
 * - Rich text editing
 * - Formatting toolbar
 * - Text alignment
 * - Lists and links
 * - Image insertion
 * - Full i18n and accessibility
 */

export interface DocumentEditorOrganismProps {
  content: string
  onChange: (content: string) => void
  readOnly?: boolean
  placeholder?: string
}

export function DocumentEditorOrganism({ 
  content, 
  onChange,
  readOnly = false,
  placeholder
}: DocumentEditorOrganismProps) {
  const t = useTranslations()
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())

  const toggleFormat = (format: string) => {
    setActiveFormats(prev => {
      const newSet = new Set(prev)
      if (newSet.has(format)) {
        newSet.delete(format)
      } else {
        newSet.add(format)
      }
      return newSet
    })
  }

  const toolbarButtons = [
    { id: 'bold', icon: Bold, label: t('editor.bold'), shortcut: 'Ctrl+B' },
    { id: 'italic', icon: Italic, label: t('editor.italic'), shortcut: 'Ctrl+I' },
    { id: 'underline', icon: Underline, label: t('editor.underline'), shortcut: 'Ctrl+U' },
  ]

  const alignmentButtons = [
    { id: 'left', icon: AlignLeft, label: t('editor.alignLeft') },
    { id: 'center', icon: AlignCenter, label: t('editor.alignCenter') },
    { id: 'right', icon: AlignRight, label: t('editor.alignRight') },
  ]

  const listButtons = [
    { id: 'ul', icon: List, label: t('editor.bulletList') },
    { id: 'ol', icon: ListOrdered, label: t('editor.numberedList') },
  ]

  return (
    <div className="flex flex-wrap flex-col h-full border rounded-lg">
      {/* Toolbar */}
      {!readOnly && (
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-1 p-2 border-b bg-muted/30">
          {/* Text Formatting */}
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
            {toolbarButtons.map((btn: any) => (
              <Button
                key={btn.id}
                variant={activeFormats.has(btn.id) ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => toggleFormat(btn.id)}
                aria-label={btn.label}
                title={`${btn.label} (${btn.shortcut})`}
              >
                <btn.icon className="h-4 w-4" aria-hidden="true" />
              </Button>
            ))}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Alignment */}
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
            {alignmentButtons.map((btn: any) => (
              <Button
                key={btn.id}
                variant={activeFormats.has(btn.id) ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => toggleFormat(btn.id)}
                aria-label={btn.label}
              >
                <btn.icon className="h-4 w-4" aria-hidden="true" />
              </Button>
            ))}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Lists */}
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
            {listButtons.map((btn: any) => (
              <Button
                key={btn.id}
                variant={activeFormats.has(btn.id) ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => toggleFormat(btn.id)}
                aria-label={btn.label}
              >
                <btn.icon className="h-4 w-4" aria-hidden="true" />
              </Button>
            ))}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Insert */}
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              aria-label={t('editor.insertLink')}
            >
              <Link className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              aria-label={t('editor.insertImage')}
            >
              <ImageIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <Textarea
          value={content as any}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || t('editor.startTyping')}
          className={cn(
            'min-h-full border-0 focus-visible:ring-0 resize-none',
            'font-serif text-base leading-relaxed p-6'
          )}
          readOnly={readOnly}
          aria-label={t('editor.documentContent')}
        />
      </div>

      {/* Status Bar */}
      <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between border-t p-2 text-xs text-muted-foreground bg-muted/30">
        <span>
          {content.length} {t('editor.characters')} • {content.split(/\s+/).filter(Boolean).length} {t('editor.words')}
        </span>
        {!readOnly && (
          <span>{t('editor.autoSaved')}</span>
        )}
      </div>
    </div>
  )
}
