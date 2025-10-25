"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { LayoutGrid, MoreHorizontal, Eye, Edit, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { DataItem } from "@/types"
import type { FieldSchema } from "@/lib/data-schemas"

/**
 * BoxViewOrganism - Organism Component
 * 
 * Card grid view with adjustable sizing.
 * Displays items as cards with cover images and metadata.
 * 
 * Features:
 * - Responsive grid layout
 * - Three size options (small, medium, large)
 * - Cover image support
 * - Favorite toggle
 * - Action menu per card
 * - Tags and metadata display
 * 
 * Usage:
 * <BoxViewOrganism 
 *   data={items} 
 *   columns={schema}
 *   onItemClick={handleClick}
 * />
 */

export interface BoxViewOrganismProps<T extends DataItem = DataItem> {
  data: T[]
  schema?: FieldSchema[]
  onItemClick?: (item: T) => void
  createActionLabel?: string
  onCreateAction?: () => void
}

export function BoxViewOrganism({ 
  data, 
  schema, 
  onItemClick, 
  createActionLabel, 
  onCreateAction 
}: BoxViewOrganismProps) {
  const t = useTranslations()
  const [gridSize, setGridSize] = useState<"small" | "medium" | "large">("medium")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const getGridClass = () => {
    switch (gridSize) {
      case "small":
        return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
      case "medium":
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      case "large":
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    }
  }

  return (
    <div className="h-full flex flex-wrap flex-col">
      {/* Header */}
      <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between p-4 border-b">
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
          <LayoutGrid className="h-5 w-5" aria-hidden="true" />
          <h3 className="font-semibold">Card Grid</h3>
          <Badge variant="secondary">{data.length} items</Badge>
        </div>
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
          <Button
            variant={gridSize === "small" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setGridSize("small")}
          >
            Small
          </Button>
          <Button
            variant={gridSize === "medium" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setGridSize("medium")}
          >
            Medium
          </Button>
          <Button
            variant={gridSize === "large" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setGridSize("large")}
          >
            Large
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className={cn("grid gap-4", getGridClass())}>
          {data.map((item: any) => {
            const isFavorite = favorites.has(item.id)
            
            return (
              <Card
                key={item.id}
                className="group relative hover:shadow-lg transition-all cursor-pointer overflow-hidden md:block"
                onClick={() => onItemClick?.(item)}
              >
                {/* Cover Image */}
                {item.cover_image && (
                  <div className="aspect-video bg-muted overflow-hidden md:block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.cover_image}
                      alt={item.name || "Cover"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform max-w-full"
                    />
                  </div>
                )}

                <CardContent className={cn("p-4", !item.cover_image && "pt-6")}>
                  {/* Header */}
                  <div className="flex flex-wrap flex-col md:flex-row items-start gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm line-clamp-2">
                        {item.name || item.title || "Untitled"}
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(item.id)
                        }}
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Star
                          className={cn(
                            "h-3 w-3",
                            isFavorite && "fill-yellow-400 text-yellow-400"
                          )}
                          aria-hidden="true"
                        />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="More options">
                            <MoreHorizontal className="h-3 w-3" aria-hidden="true" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" aria-hidden="true" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Description */}
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {item.description}
                    </p>
                  )}

                  {/* Metadata */}
                  <div className="flex flex-col md:flex-row items-center gap-2 flex-wrap">
                    {item.status && (
                      <Badge variant="secondary" className="text-xs">
                        {item.status}
                      </Badge>
                    )}
                    {item.priority && (
                      <Badge
                        variant={
                          item.priority === "urgent" || item.priority === "high"
                            ? "destructive"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {item.priority}
                      </Badge>
                    )}
                    {item.due_date && (
                      <span className="text-xs text-muted-foreground">
                        Due {new Date(item.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  {item.tags && Array.isArray(item.tags) && item.tags.length > 0 && (
                    <div className="flex flex-col sm:flex-row gap-1 mt-2 flex-wrap">
                      {item.tags.slice(0, 3).map((tag: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {data.length === 0 && (
          <EmptyState
            variant="inline"
            mainMessage={t('views.emptyState.nothingToSeeYet')}
            description="Start by creating your first item"
            actionLabel={createActionLabel || t('views.emptyState.createFirstItem')}
            onAction={onCreateAction}
          />
        )}
      </div>
    </div>
  )
}
