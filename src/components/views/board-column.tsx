"use client"

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
import { cn } from "@/lib/utils"
import type { DataItem } from "@/types"
import { BoardCard } from "./board-card"

interface BoardColumnProps {
  column: {
    id: string
    title: string
    color: string
  }
  items: DataItem[]
  onItemClick?: (item: DataItem) => void
}

export function BoardColumn({ column, items, onItemClick }: BoardColumnProps) {
  const t = useTranslations()
  const { setNodeRef } = useDroppable({ id: column.id })

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex-shrink-0 w-80 flex flex-col bg-muted/30 rounded-lg">
        {/* Column Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: column.color }}
            />
            <span className="font-semibold">{column.title}</span>
            <span className="text-sm text-muted-foreground">({items.length})</span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-4 w-4" />
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
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div ref={setNodeRef} className="space-y-2">
            {items.map((item) => (
              <BoardCard
                key={item.id}
                item={item}
                onClick={() => onItemClick?.(item)}
              />
            ))}
            
            {/* Add Card */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
            >
              <Plus className="h-4 w-4" />
              Add card
            </Button>
          </div>
        </SortableContext>
      </ScrollArea>
      </div>
    </TooltipProvider>
  )
}
