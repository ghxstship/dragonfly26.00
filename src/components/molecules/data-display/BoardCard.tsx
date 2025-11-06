"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, MessageSquare, Paperclip } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, getInitials } from "@/lib/utils"
import type { DataItem } from "@/types"
import type { FieldSchema } from "@/lib/data-schemas"
import { getDisplayValue, getAssigneeValue, getDateValue, getDescriptionValue } from "@/lib/schema-helpers"

/**
 * BoardCard - Molecule Component
 * 
 * Draggable card for Kanban board views.
 * Displays item information with drag handle, tags, assignee, and metadata.
 * 
 * Features:
 * - Drag and drop support via @dnd-kit
 * - Shows title, description, tags
 * - Displays assignee avatar
 * - Shows comment and attachment counts
 * - Due date display
 * 
 * Usage:
 * <BoardCard 
 *   item={dataItem} 
 *   columns={fieldSchema}
 *   onClick={handleClick}
 * />
 */

export interface BoardCardProps {
  item: DataItem
  schema?: FieldSchema[]
  onClick?: () => void
  isDragging?: boolean
}

export function BoardCard({ item, schema, onClick, isDragging }: BoardCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group bg-background border rounded-lg p-3 cursor-pointer hover:border-primary/50 transition-colors",
        (isDragging || isSortableDragging) && "opacity-50"
      )}
       role="button" tabIndex={0} onClick={onClick}
    >
      <div className="flex items-start gap-2">
        <div
          {...attributes}
          {...listeners}
          className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing"
        >
          <GripVertical aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="flex-1 min-w-0 space-y-2">
          {/* Title */}
          <div className="font-medium">
            {getDisplayValue(item, schema)}
          </div>

          {/* Description */}
          {getDescriptionValue(item, schema) && (
            <div className="text-sm text-muted-foreground line-clamp-2">
              {getDescriptionValue(item, schema)}
            </div>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-3">
              {item.comments_count && (
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                  <MessageSquare aria-hidden="true" className="h-3 w-3" />
                  <span>{item.comments_count}</span>
                </div>
              )}
              {item.attachments_count && (
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                  <Paperclip aria-hidden="true" className="h-3 w-3" />
                  <span>{item.attachments_count}</span>
                </div>
              )}
            </div>

            {/* Assignee */}
            {getAssigneeValue(item, schema) && (
              <Avatar aria-hidden="true" className="h-6 w-6">
                <AvatarImage src={item.assignee_avatar} />
                <AvatarFallback aria-hidden="true" className="text-xs">
                  {getInitials(getAssigneeValue(item, schema)!)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>

          {/* Due Date */}
          {getDateValue(item, schema) && (
            <div className="text-xs text-muted-foreground">
              Due {new Date(getDateValue(item, schema)!).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
