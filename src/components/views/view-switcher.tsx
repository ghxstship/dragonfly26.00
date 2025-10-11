"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ChevronDown, Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { VIEW_DEFINITIONS } from "@/lib/views/registry"
import type { ViewType } from "@/types"

interface ViewSwitcherProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  moduleSlug: string
}

export function ViewSwitcher({ currentView, onViewChange, moduleSlug }: ViewSwitcherProps) {
  const t = useTranslations()
  const [favoriteViews, setFavoriteViews] = useState<ViewType[]>(["list", "board"])

  const currentViewDef = VIEW_DEFINITIONS.find((v) => v.type === currentView)

  const groupedViews = {
    core: VIEW_DEFINITIONS.filter((v) => v.category === "core"),
    advanced: VIEW_DEFINITIONS.filter((v) => v.category === "advanced"),
    specialized: VIEW_DEFINITIONS.filter((v) => v.category === "specialized"),
  }

  return (
    <div className="flex items-center gap-2">
      {/* Current View */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <span>{currentViewDef?.name || "Select View"}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel>Switch View</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Favorites */}
          {favoriteViews.length > 0 && (
            <>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Favorites
              </DropdownMenuLabel>
              {favoriteViews.map((viewType) => {
                const view = VIEW_DEFINITIONS.find((v) => v.type === viewType)
                if (!view) return null
                return (
                  <DropdownMenuItem
                    key={view.type}
                    onClick={() => onViewChange(view.type)}
                    className="gap-2"
                  >
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {view.name}
                  </DropdownMenuItem>
                )
              })}
              <DropdownMenuSeparator />
            </>
          )}

          {/* Core Views */}
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Core Views
          </DropdownMenuLabel>
          {groupedViews.core.map((view) => (
            <DropdownMenuItem
              key={view.type}
              onClick={() => onViewChange(view.type)}
            >
              {view.name}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          {/* Advanced Views */}
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Advanced Views
          </DropdownMenuLabel>
          {groupedViews.advanced.map((view) => (
            <DropdownMenuItem
              key={view.type}
              onClick={() => onViewChange(view.type)}
            >
              {view.name}
            </DropdownMenuItem>
          ))}

          {groupedViews.specialized.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Specialized Views
              </DropdownMenuLabel>
              {groupedViews.specialized.map((view) => (
                <DropdownMenuItem
                  key={view.type}
                  onClick={() => onViewChange(view.type)}
                >
                  {view.name}
                </DropdownMenuItem>
              ))}
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2">
            <Plus className="h-4 w-4" />
            Create custom view
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
