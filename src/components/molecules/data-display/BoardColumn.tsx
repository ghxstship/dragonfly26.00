"use client"

import { useTranslations } from "next-intl"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core"
import { Plus, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { DataItem } from "@/types"
import type { FieldSchema } from "@/lib/data-schemas"
import { BoardCard } from "./BoardCard"

/**
 * BoardColumn - Molecule Component
 * 
 * Kanban board column with droppable area and sortable cards.
 * Contains header with color indicator, title, count, and options.
 * 
 * Features:
 * - Droppable area for drag and drop
 * - Sortable card list
 * - Column header with color badge
 * - Item count display
 * - Add card button
 * - Column options menu
 * 
 * Usage:
 * <BoardColumn 
 *   column={{ id: "todo", title: "To Do", color: "#94a3b8" }}
 *   items={todoItems}
 *   columns={fieldSchema}
 *   onItemClick={handleClick}
 * />
 */

export interface BoardColumnProps {
  column: {
    id: string
    title: string
    color: string
  }
  items: DataItem[]
  schema?: FieldSchema[]
  onItemClick?: (item: DataItem) => void
}

export function BoardColumn({ column, items, schema, onItemClick }: BoardColumnProps) {
  const t = useTranslations()
  const { setNodeRef } = useDroppable({ id: column.id })

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex-shrink-0 w-full sm:w-80 flex flex-wrap flex-col bg-muted/30 rounded-lg">
        {/* Column Header */}
        <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between p-3 border-b">
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: column.color }}
              aria-hidden="true"
            />
            <span className="font-semibold">{column.title}</span>
            <span className="text-sm text-muted-foreground">({items.length})</span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Column options">
                <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Column options</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Cards */}
        <ScrollArea className="flex-1 p-3">
          <SortableContext
            items={items.map((item: any) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div ref={setNodeRef} className="space-y-2">
              {items.map((item: any) => (
                <BoardCard
                  key={item.id}
                  item={item}
                  schema={schema}
                  onClick={() => onItemClick?.(item)}
                />
              ))}
              
              {/* Add Card */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 max-w-full"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add card
              </Button>
            </div>
          </SortableContext>
        </ScrollArea>
      </div>
    </TooltipProvider>
  )
}
