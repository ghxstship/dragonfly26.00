"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Plus, Download, Upload, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchWithFilters } from "@/components/molecules"
import { cn } from "@/lib/utils"

/**
 * DataViewTemplate - Template Component
 * 
 * Standard template for data view pages with toolbar and view switching.
 * Provides consistent layout across all data-heavy pages.
 * 
 * Features:
 * - Header with title and actions
 * - Search and filter toolbar
 * - View tabs (table, board, list, etc.)
 * - Bulk actions when items selected
 * - Responsive layout
 * 
 * Usage:
 * <DataViewTemplate
 *   title="Projects"
 *   views={[
 *     { id: 'table', label: 'Table', content: <TableView /> },
 *     { id: 'board', label: 'Board', content: <BoardView /> }
 *   ]}
 *   onCreateClick={handleCreate}
 * />
 */

export interface DataView {
  id: string
  label: string
  icon?: React.ReactNode
  content: React.ReactNode
}

export interface DataViewTemplateProps {
  /** Page title */
  title: string
  
  /** Subtitle or description */
  subtitle?: string
  
  /** Available views */
  views: DataView[]
  
  /** Default view ID */
  defaultView?: string
  
  /** Create button label */
  createLabel?: string
  
  /** Create button handler */
  onCreateClick?: () => void
  
  /** Search value */
  searchValue?: string
  
  /** Search change handler */
  onSearchChange?: (value: string) => void
  
  /** Filter click handler */
  onFilterClick?: () => void
  
  /** Active filters */
  activeFilters?: string[]
  
  /** Remove filter handler */
  onRemoveFilter?: (filter: string) => void
  
  /** Clear filters handler */
  onClearFilters?: () => void
  
  /** Additional header actions */
  headerActions?: React.ReactNode
  
  /** Bulk actions (shown when items selected) */
  bulkActions?: React.ReactNode
  
  /** Number of selected items */
  selectedCount?: number
  
  /** Additional CSS classes */
  className?: string
}

export function DataViewTemplate({
  title,
  subtitle,
  views,
  defaultView,
  createLabel,
  onCreateClick,
  searchValue = '',
  onSearchChange,
  onFilterClick,
  activeFilters,
  onRemoveFilter,
  onClearFilters,
  headerActions,
  bulkActions,
  selectedCount = 0,
  className,
}: DataViewTemplateProps) {
  const t = useTranslations()

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between p-4 md:p-6">
          <div>
            <h1 className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            {headerActions}
            {onCreateClick && (
              <Button onClick={onCreateClick} className="gap-2">
                <Plus className="h-4 w-4" aria-hidden="true" />
                {createLabel || t('common.create')}
              </Button>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-4 md:px-4 md:px-6 pb-4">
          {selectedCount > 0 ? (
            <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
              </span>
              {bulkActions}
            </div>
          ) : (
            onSearchChange && (
              <SearchWithFilters
                value={searchValue}
                onChange={onSearchChange}
                onFilterClick={onFilterClick}
                activeFilters={activeFilters}
                onRemoveFilter={onRemoveFilter}
                onClearFilters={onClearFilters}
              />
            )
          )}
        </div>
      </div>

      {/* Views */}
      <div className="flex-1 overflow-hidden md:block">
        {views.length === 1 ? (
          <div className="h-full p-4 md:p-6 overflow-auto">
            {views[0].content}
          </div>
        ) : (
          <Tabs defaultValue={defaultView || views[0].id} className="h-full flex flex-wrap flex-col">
            <div className="border-b px-4 md:px-4 md:px-6">
              <TabsList>
                {views.map((view: any) => (
                  <TabsTrigger key={view.id} value={view.id} className="gap-2">
                    {view.icon}
                    {view.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            {views.map((view: any) => (
              <TabsContent key={view.id} value={view.id} className="flex-1 overflow-auto p-4 md:p-6 mt-0">
                {view.content}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  )
}
