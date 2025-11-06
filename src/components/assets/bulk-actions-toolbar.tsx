"use client"

import { FolderInput, Tag, Trash2, FileDown, Printer, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface BulkActionsToolbarProps {
  selectedCount: number
  onMoveToFolder: () => void
  onChangeCategory: () => void
  onBulkAdjust: () => void
  onPrintLabels: () => void
  onExport: () => void
  onDelete: () => void
  onClearSelection: () => void
}

export function BulkActionsToolbar({
  selectedCount,
  onMoveToFolder,
  onChangeCategory,
  onBulkAdjust,
  onPrintLabels,
  onExport,
  onDelete,
  onClearSelection
}: BulkActionsToolbarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="border-b bg-muted/50 px-4 py-2">
      <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
        <Badge variant="secondary" className="gap-1">
          <span className="font-semibold">{selectedCount}</span>
          <span>item{selectedCount !== 1 ? 's' : ''} selected</span>
        </Badge>

        <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
          <Button variant="outline" size="sm" onClick={onMoveToFolder}>
            <FolderInput aria-hidden="true" className="h-4 w-4 mr-2" />
            Move to Folder
          </Button>

          <Button variant="outline" size="sm" onClick={onChangeCategory}>
            <Tag aria-hidden="true" className="h-4 w-4 mr-2" />
            Set Category
          </Button>

          <Button variant="outline" size="sm" onClick={onPrintLabels}>
            <Printer aria-hidden="true" className="h-4 w-4 mr-2" />
            Print Labels
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal aria-hidden="true" className="h-4 w-4 mr-2" />
                More
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onBulkAdjust}>
                Bulk Adjust Stock
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExport}>
                <FileDown aria-hidden="true" className="h-4 w-4 mr-2" />
                Export Selected
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex-1" />

        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          Clear Selection
        </Button>
      </div>
    </div>
  )
}
