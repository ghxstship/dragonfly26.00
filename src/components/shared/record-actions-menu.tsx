"use client"

import { MoreHorizontal, Eye, Edit, Copy, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface RecordActionsMenuProps {
  onViewDetails?: () => void
  onEdit?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
  customActions?: Array<{
    label: string
    icon?: React.ReactNode
    onClick: () => void
    variant?: 'default' | 'destructive'
  }>
}

export function RecordActionsMenu({
  onViewDetails,
  onEdit,
  onDuplicate,
  onDelete,
  customActions = [],
}: RecordActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {onViewDetails && (
          <DropdownMenuItem onClick={onViewDetails}>
            <Eye className="h-4 w-4 mr-2" />
            View details
          </DropdownMenuItem>
        )}
        
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
        )}
        
        {onDuplicate && (
          <DropdownMenuItem onClick={onDuplicate}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </DropdownMenuItem>
        )}

        {customActions.length > 0 && (
          <>
            <DropdownMenuSeparator />
            {customActions.map((action, index) => (
              <DropdownMenuItem
                key={index}
                onClick={action.onClick}
                className={action.variant === 'destructive' ? 'text-destructive' : ''}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </DropdownMenuItem>
            ))}
          </>
        )}

        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
