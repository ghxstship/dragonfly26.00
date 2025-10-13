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
import type { DataItem } from "@/types"
import { BoardColumn } from "./board-column"
import { BoardCard } from "./board-card"

interface BoardViewProps {
  data: DataItem[]
  onItemClick?: (item: DataItem) => void
}

export function BoardView({ data, onItemClick }: BoardViewProps) {
  const t = useTranslations()
  const [activeId, setActiveId] = useState<string | null>(null)

  const defaultColumns = [
    { id: "todo", title: "To Do", color: "#94a3b8" },
    { id: "in_progress", title: t('statuses.inProgress'), color: "#3b82f6" },
    { id: "review", title: "Review", color: "#f59e0b" },
    { id: "done", title: "Done", color: "#10b981" },
  ]

  // Group data by status
  const columnData = defaultColumns.map((column) => ({
    ...column,
    items: data.filter((item) => item.status === column.id),
  }))

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      // Handle item reordering or moving between columns
      console.log(t('views.moveItem'), active.id, "to", over.id)
    }
    
    setActiveId(null)
  }

  const activeItem = activeId ? data.find((item) => item.id === activeId) : null

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 h-full overflow-x-auto pb-4 relative">
        {columnData.map((column) => (
          <BoardColumn
            key={column.id}
            column={column}
            items={column.items}
            onItemClick={onItemClick}
          />
        ))}

        {/* Add Column */}
        <div className="flex-shrink-0 w-80">
          <Button variant="ghost" className="w-full justify-start gap-2 h-10">
            <Plus className="h-4 w-4" />
            Add column
          </Button>
        </div>

        {/* Empty State Overlay when no data */}
        {data.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-8 text-center max-w-md pointer-events-auto">
              <Badge variant="outline" className="mb-3 text-xs uppercase tracking-wider">
                {t('views.emptyState.boardView')}
              </Badge>
              <h3 className="text-xl font-bold mb-2">{t('views.emptyState.nothingToSeeYet')}</h3>
              <p className="text-sm text-muted-foreground mb-6">
                {t('views.emptyState.boardViewDescription')}
              </p>
              <Button size="lg">
                <Plus className="h-4 w-4 mr-2" />
                {t('views.emptyState.createFirstItem')}
              </Button>
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
