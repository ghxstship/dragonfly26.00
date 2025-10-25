"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { DndContext, DragEndEvent, DragOverlay, closestCorners } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Plus, MoreHorizontal, Columns3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EmptyState } from "@/components/shared/empty-state"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-is-mobile"
import type { DataItem } from "@/types"
import type { FieldSchema } from "@/lib/data-schemas"
import { getGroupingField } from "@/lib/schema-helpers"
import { BoardColumn } from "./board-column"
import { BoardCard } from "./board-card"

interface BoardViewProps {
  data: DataItem[]
  schema?: FieldSchema[]
  onItemClick?: (item: DataItem) => void
  createActionLabel?: string
  onCreateAction?: () => void
}

export function BoardView({ data, schema, onItemClick, createActionLabel, onCreateAction }: BoardViewProps) {
  const t = useTranslations()
  const isMobile = useIsMobile()
  const [activeId, setActiveId] = useState<string | null>(null)

  // Get the field to group by from schema
  const groupingField = getGroupingField(schema)

  const defaultColumns = [
    { id: "todo", title: "To Do", color: "#94a3b8" },
    { id: "in_progress", title: t('statuses.inProgress'), color: "#3b82f6" },
    { id: "review", title: "Review", color: "#f59e0b" },
    { id: "done", title: "Done", color: "#10b981" },
  ]

  // Group data by schema-defined grouping field
  const columnData = defaultColumns.map((column: any) => ({
    ...column,
    items: data.filter((item: any) => item[groupingField] === column.id),
  }))

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && activ(e as any).id !== over.id) {
      // Handle item reordering or moving between columns
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
              columns={schema}
              onItemClick={onItemClick}
            />
          </div>
        ))}

        {/* Add Column */}
        {!isMobile && (
          <div className="flex-shrink-0 w-full sm:w-80">
            <Button variant="ghost" className="w-full justify-start gap-2 h-10 max-w-full">
              <Plus className="h-4 w-4" />
              Add column
            </Button>
          </div>
        )}

        {/* Empty State Overlay when no data */}
        {data.length === 0 && (
          <div className="absolute sm:relative sm:inset-auto inset-0 flex flex-wrap items-center justify-center pointer-events-none sm:relative sm:inset-auto">
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
