"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ChevronDown, ChevronRight, MoreHorizontal, Plus, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EmptyState } from "@/components/shared/empty-state"
import { cn } from "@/lib/utils"
import type { DataItem } from "@/types"
import type { FieldSchema } from "@/lib/data-schemas"
import { getDisplayValue, getStatusValue, getAssigneeValue, getDateValue, getDescriptionValue, getGroupingField } from "@/lib/schema-helpers"

/**
 * ListViewOrganism - Organism Component
 * 
 * Grouped list view with expand/collapse and selection.
 * Extracted from views/list-view.tsx for reusability.
 * 
 * Features:
 * - Grouped by schema field
 * - Expand/collapse groups
 * - Item selection
 * - Action menu per item
 * - Empty state
 * 
 * Usage:
 * <ListViewOrganism 
 *   data={items} 
 *   columns={schema}
 *   onItemClick={handleClick}
 *   onCreateAction={handleCreate}
 * />
 */

export interface ListViewOrganismProps<T extends DataItem = DataItem> {
  data: T[]
  schema?: FieldSchema[]
  onItemClick?: (item: T) => void
  createActionLabel?: string
  onCreateAction?: () => void
}

export function ListViewOrganism({ data, schema, onItemClick, createActionLabel, onCreateAction }: ListViewOrganismProps) {
  const t = useTranslations()
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["todo"]))
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  const groupingField = getGroupingField(schema)

  const groupedData = data.reduce((acc: any, item: any) => {
    const groupValue = item[groupingField] || "ungrouped"
    if (!acc[groupValue]) acc[groupValue] = []
    acc[groupValue].push(item)
    return acc
  }, {} as Record<string, DataItem[]>)

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(group)) {
        newSet.delete(group)
      } else {
        newSet.add(group)
      }
      return newSet
    })
  }

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-2">
      {data.length === 0 ? (
        <div className="border rounded-lg">
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 p-3 bg-muted/50 border-b">
            <List aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-muted-foreground">Items</span>
          </div>
          <EmptyState
            variant="inline"
            icon={List}
            mainMessage={t('views.emptyState.nothingToSeeYet')}
            description={t('views.emptyState.listViewDescription')}
            actionLabel={createActionLabel || t('views.emptyState.createFirstItem')}
            onAction={onCreateAction}
          />
        </div>
      ) : (
        Object.entries(groupedData).map(([group, items]) => {
        const isExpanded = expandedGroups.has(group)
        
        return (
          <div key={group} className="border rounded-lg">
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 p-3 bg-muted/50 border-b hover:bg-muted/70 transition-colors">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleGroup(group)}
                className="h-6 w-6 p-0"
                aria-label={isExpanded ? `Collapse ${group}` : `Expand ${group}`}
              >
                {isExpanded ? (
                  <ChevronDown aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <ChevronRight aria-hidden="true" className="h-4 w-4" />
                )}
              </Button>
              <span className="font-semibold capitalize">{group}</span>
              <span className="text-sm text-muted-foreground">({(items as any[]).length})</span>
            </div>

            {isExpanded && (
              <div className="divide-y">
                {(items as any[]).map((item: any) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center gap-3 p-3 hover:bg-accent transition-colors cursor-pointer",
                      selectedItems.has(item.id) && "bg-accent"
                    )}
                     role="button" tabIndex={0} onClick={() => onItemClick?.(item)}
                  >
                    <Checkbox
                      checked={selectedItems.has(item.id)}
                      onCheckedChange={() => toggleItem(item.id)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Select ${getDisplayValue(item, schema)}`}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{getDisplayValue(item, schema)}</div>
                      {getDescriptionValue(item, schema) && (
                        <div className="text-sm text-muted-foreground truncate">
                          {getDescriptionValue(item, schema)}
                        </div>
                      )}
                    </div>

                    {getAssigneeValue(item, schema) && (
                      <div className="text-sm text-muted-foreground">
                        {getAssigneeValue(item, schema)}
                      </div>
                    )}

                    {getDateValue(item, schema) && (
                      <div className="text-sm text-muted-foreground">
                        {new Date(getDateValue(item, schema)!).toLocaleDateString()}
                      </div>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Actions">
                          <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem aria-hidden="true" className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}

                <div className="p-3">
                  <Button variant="ghost" size="sm" className="gap-2 w-full justify-start max-w-full">
                    <Plus aria-hidden="true" className="h-4 w-4" />
                    Add item
                  </Button>
                </div>
              </div>
            )}
          </div>
        )
      })
      )}
    </div>
  )
}
