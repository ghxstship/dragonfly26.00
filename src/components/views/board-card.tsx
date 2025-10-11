"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, MessageSquare, Paperclip } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, getInitials } from "@/lib/utils"
import type { DataItem } from "@/types"

interface BoardCardProps {
  item: DataItem
  onClick?: () => void
  isDragging?: boolean
}

export function BoardCard({ item, onClick, isDragging }: BoardCardProps) {
  const t = useTranslations()
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
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        <div
          {...attributes}
          {...listeners}
          className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="flex-1 min-w-0 space-y-2">
          {/* Title */}
          <div className="font-medium">
            {item.name || item.title || "Untitled"}
          </div>

          {/* Description */}
          {item.description && (
            <div className="text-sm text-muted-foreground line-clamp-2">
              {item.description}
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
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              {item.comments_count && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{item.comments_count}</span>
                </div>
              )}
              {item.attachments_count && (
                <div className="flex items-center gap-1">
                  <Paperclip className="h-3 w-3" />
                  <span>{item.attachments_count}</span>
                </div>
              )}
            </div>

            {/* Assignee */}
            {item.assignee_name && (
              <Avatar className="h-6 w-6">
                <AvatarImage src={item.assignee_avatar} />
                <AvatarFallback className="text-xs">
                  {getInitials(item.assignee_name)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>

          {/* Due Date */}
          {item.due_date && (
            <div className="text-xs text-muted-foreground">
              Due {new Date(item.due_date).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
