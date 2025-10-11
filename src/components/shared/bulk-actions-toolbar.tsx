"use client"

import { X, Trash2, Edit, Copy, Archive, Tag, UserPlus, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface BulkActionsToolbarProps {
  selectedCount: number
  onClearSelection: () => void
  onDelete: () => void
  onDuplicate: () => void
  onArchive: () => void
  onAssign?: () => void
  onSetDueDate?: () => void
  onAddTags?: () => void
}

export function BulkActionsToolbar({
  selectedCount,
  onClearSelection,
  onDelete,
  onDuplicate,
  onArchive,
  onAssign,
  onSetDueDate,
  onAddTags,
}: BulkActionsToolbarProps) {
  const t = useTranslations()
  if (selectedCount === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-primary text-primary-foreground rounded-lg shadow-lg border flex items-center gap-2 px-4 py-3">
        <span className="font-medium">{selectedCount} selected</span>
        
        <div className="h-6 w-px bg-primary-foreground/20 mx-2" />

        {/* Quick Actions */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
          onClick={onDuplicate}
        >
          <Copy className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
          onClick={onArchive}
        >
          <Archive className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        {/* More Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-primary-foreground hover:bg-primary-foreground/20"
            >
              More actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Bulk edit
            </DropdownMenuItem>
            {onAssign && (
              <DropdownMenuItem onClick={onAssign}>
                <UserPlus className="h-4 w-4 mr-2" />
                Assign to
              </DropdownMenuItem>
            )}
            {onSetDueDate && (
              <DropdownMenuItem onClick={onSetDueDate}>
                <Calendar className="h-4 w-4 mr-2" />
                Set due date
              </DropdownMenuItem>
            )}
            {onAddTags && (
              <DropdownMenuItem onClick={onAddTags}>
                <Tag className="h-4 w-4 mr-2" />
                Add tags
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onArchive}>
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-6 w-px bg-primary-foreground/20 mx-2" />

        {/* Clear Selection */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
          onClick={onClearSelection}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function onEdit() {
  // Placeholder for bulk edit
}
