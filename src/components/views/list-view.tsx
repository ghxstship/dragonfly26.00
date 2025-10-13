"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ChevronDown, ChevronRight, MoreHorizontal, Plus, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EmptyState } from "@/components/shared/empty-state"
import { cn } from "@/lib/utils"
import type { DataItem } from "@/types"

interface ListViewProps {
  data: DataItem[]
  onItemClick?: (item: DataItem) => void
}

export function ListView({ data, onItemClick }: ListViewProps) {
  const t = useTranslations()
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["todo"]))
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  // Group data by status (example grouping)
  const groupedData = data.reduce((acc, item) => {
    const status = item.status || "todo"
    if (!acc[status]) acc[status] = []
    acc[status].push(item)
    return acc
  }, {} as Record<string, DataItem[]>)

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(group)) {
        newSet.delete(group)
      } else {
        newSet.add(group)
      }
      return newSet
    })
  }

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-2">
      {data.length === 0 ? (
        // Empty state with list skeleton
        <div className="border rounded-lg">
          <div className="flex items-center gap-2 p-3 bg-muted/50 border-b">
            <List className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-muted-foreground">Items</span>
          </div>
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <h3 className="text-xl font-bold mb-2">{t('views.emptyState.nothingToSeeYet')}</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              {t('views.emptyState.listViewDescription')}
            </p>
            <Button size="lg">
              <Plus className="h-4 w-4 mr-2" />
              {t('views.emptyState.createFirstItem')}
            </Button>
          </div>
        </div>
      ) : (
        Object.entries(groupedData).map(([group, items]) => {
        const isExpanded = expandedGroups.has(group)
        
        return (
          <div key={group} className="border rounded-lg">
            {/* Group Header */}
            <div className="flex items-center gap-2 p-3 bg-muted/50 border-b hover:bg-muted/70 transition-colors">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => toggleGroup(group)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              <span className="font-semibold capitalize">{group}</span>
              <span className="text-sm text-muted-foreground">({items.length})</span>
            </div>

            {/* Group Items */}
            {isExpanded && (
              <div className="divide-y">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center gap-3 p-3 hover:bg-accent transition-colors cursor-pointer",
                      selectedItems.has(item.id) && "bg-accent"
                    )}
                    onClick={() => onItemClick?.(item)}
                  >
                    <Checkbox
                      checked={selectedItems.has(item.id)}
                      onCheckedChange={() => toggleItem(item.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{item.name || item.title || "Untitled"}</div>
                      {item.description && (
                        <div className="text-sm text-muted-foreground truncate">
                          {item.description}
                        </div>
                      )}
                    </div>

                    {item.assignee && (
                      <div className="text-sm text-muted-foreground">
                        {item.assignee}
                      </div>
                    )}

                    {item.due_date && (
                      <div className="text-sm text-muted-foreground">
                        {new Date(item.due_date).toLocaleDateString()}
                      </div>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}

                {/* Add Item */}
                <div className="p-3">
                  <Button variant="ghost" size="sm" className="gap-2 w-full justify-start">
                    <Plus className="h-4 w-4" />
                    Add item
                  </Button>
                </div>
              </div>
            )}
          </div>
        )
      })
      )}
    </div>
  )
}
