"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, closestCorners } from "@dnd-kit/core"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-is-mobile"
import type { DataItem } from "@/types"
import type { FieldSchema } from "@/lib/data-schemas"
import { getGroupingField } from "@/lib/schema-helpers"
import { BoardColumn, BoardCard } from "@/components/molecules"

/**
 * BoardViewOrganism - Organism Component
 * 
 * Kanban board view with drag-and-drop.
 * Extracted from views/board-view.tsx for reusability.
 * 
 * Features:
 * - Drag and drop cards
 * - Customizable columns
 * - Mobile responsive
 * - Empty state
 * 
 * Usage:
 * <BoardViewOrganism 
 *   data={items} 
 *   columns={schema}
 *   columns={columns}
 *   onItemClick={handleClick}
 * />
 */

export interface BoardColumn {
  id: string
  title: string
  color: string
}

export interface BoardViewOrganismProps<T extends DataItem = DataItem> {
  data: T[]
  schema?: FieldSchema[]
  columns?: BoardColumn[]
  onItemClick?: (item: T) => void
  createActionLabel?: string
  onCreateAction?: () => void
}

export function BoardViewOrganism({ 
  data, 
  schema, 
  columns: customColumns,
  onItemClick, 
  createActionLabel, 
  onCreateAction 
}: BoardViewOrganismProps) {
  const t = useTranslations()
  const isMobile = useIsMobile()
  const [activeId, setActiveId] = useState<string | null>(null)

  const groupingField = getGroupingField(schema)

  const defaultColumns: BoardColumn[] = [
    { id: "todo", title: "To Do", color: "#94a3b8" },
    { id: "in_progress", title: t('statuses.inProgress'), color: "#3b82f6" },
    { id: "review", title: "Review", color: "#f59e0b" },
    { id: "done", title: "Done", color: "#10b981" },
  ]

  const columns = customColumns || defaultColumns

  const columnData = columns.map((column: any) => ({
    ...column,
    items: data.filter((item: any) => item[groupingField] === column.id),
  }))

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      console.log(t('views.moveItem'), active.id, "to", over.id)
    }
    
    setActiveId(null)
  }

  const activeItem = activeId ? data.find((item: any) => item.id === activeId) : null

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={cn(
        "h-full pb-4 relative",
        isMobile 
          ? "flex flex-col space-y-4 overflow-y-auto" 
          : "flex gap-4 overflow-x-auto"
      )}>
        {columnData.map((column: any) => (
          <div key={column.id} className={isMobile ? "w-full" : "w-80 flex-shrink-0"}>
            <BoardColumn
              column={column}
              items={column.items}
              schema={schema}
              onItemClick={onItemClick}
            />
          </div>
        ))}

        {!isMobile && (
          <div className="flex-shrink-0 w-80">
            <Button variant="ghost" className="w-full justify-start gap-2 h-10">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add column
            </Button>
          </div>
        )}

        {data.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg pointer-events-auto">
              <EmptyState
                variant="inline"
                mainMessage={t('views.emptyState.nothingToSeeYet')}
                description={t('views.emptyState.boardViewDescription')}
                actionLabel={createActionLabel || t('views.emptyState.createFirstItem')}
                onAction={onCreateAction}
              />
            </div>
          </div>
        )}
      </div>

      <DragOverlay>
        {activeItem ? (
          <BoardCard item={activeItem} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
