"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { LayoutGrid, MoreHorizontal, Eye, Edit, Star, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
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

interface BoxViewProps {
  data: DataItem[]
  onItemClick?: (item: DataItem) => void
  createActionLabel?: string
  onCreateAction?: () => void
}

export function BoxView({ data, onItemClick, createActionLabel, onCreateAction }: BoxViewProps) {
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-5 w-5" />
          <h3 className="font-semibold">Card Grid</h3>
          <Badge variant="secondary">{data.length} items</Badge>
        </div>
        <div className="flex items-center gap-2">
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
          {data.map((item) => {
            const isFavorite = favorites.has(item.id)
            
            return (
              <Card
                key={item.id}
                className="group relative hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                onClick={() => onItemClick?.(item)}
              >
                {/* Cover Image */}
                {item.cover_image && (
                  <div className="aspect-video bg-muted overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.cover_image}
                      alt={item.name || "Cover"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}

                <CardContent className={cn("p-4", !item.cover_image && "pt-6")}>
                  {/* Header */}
                  <div className="flex items-start gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm line-clamp-2">
                        {item.name || item.title || "Untitled"}
                      </h4>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(item.id)
                        }}
                      >
                        <Star
                          className={cn(
                            "h-3 w-3",
                            isFavorite && "fill-yellow-400 text-yellow-400"
                          )}
                        />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
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
                  <div className="flex items-center gap-2 flex-wrap">
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
                    <div className="flex gap-1 mt-2 flex-wrap">
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
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <h3 className="text-xl font-bold mb-2">{t('views.emptyState.nothingToSeeYet')}</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              {t('views.emptyState.boxViewDescription')}
            </p>
            {(createActionLabel || onCreateAction) && (
              <Button size="lg" onClick={onCreateAction}>
                <Plus className="h-4 w-4 mr-2" />
                {createActionLabel || t('views.emptyState.createFirstItem')}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
