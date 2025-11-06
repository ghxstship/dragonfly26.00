"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ChevronDown, Plus, Star, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  const [searchQuery, setSearchQuery] = useState("")

  const currentViewDef = VIEW_DEFINITIONS.find((v: any) => (v as any).type === currentView)

  // Filter views based on search query
  const filteredViews = VIEW_DEFINITIONS.filter((view: any) => view.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    view.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const groupedViews = {
    core: filteredViews.filter((v: any) => v.category === "core"),
    advanced: filteredViews.filter((v: any) => v.category === "advanced"),
    specialized: filteredViews.filter((v: any) => v.category === "specialized"),
  }

  const filteredFavoriteViews = favoriteViews.filter((viewType: any) => {
    const view = VIEW_DEFINITIONS.find((v: any) => (v as any).type === viewType)
    return view && (
      view.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      view.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
      {/* Current View */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <span>{currentViewDef?.name || "Select View"}</span>
            <ChevronDown aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-full sm:w-64 p-0">
          <div className="p-2 border-b sticky top-0 bg-background z-10">
            <DropdownMenuLabel aria-hidden="true" className="px-2 py-1.5">Switch View</DropdownMenuLabel>
            <div className="relative mt-2">
              <Search aria-hidden="true" className="absolute sm:relative sm:inset-auto left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground sm:relative sm:inset-auto" />
              <Input
                placeholder="Search views..."
                value={searchQuery as any}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9"
              />
            </div>
          </div>

          <div className="max-h-[252px] md:h-[420px] overflow-y-auto">
            <div className="p-2">
              {/* Favorites */}
              {filteredFavoriteViews.length > 0 && (
                <>
                  <DropdownMenuLabel aria-hidden="true" className="text-xs text-muted-foreground px-2">
                    Favorites
                  </DropdownMenuLabel>
                  {filteredFavoriteViews.map((viewType: any) => {
                    const view = VIEW_DEFINITIONS.find((v: any) => (v as any).type === viewType)
                    if (!view) return null
                    return (
                      <DropdownMenuItem
                        key={view.type}
                        onClick={() => onViewChange(view.type)}
                        className="gap-2"
                      >
                        <Star aria-hidden="true" className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {view.name}
                      </DropdownMenuItem>
                    )
                  })}
                  <DropdownMenuSeparator />
                </>
              )}

              {/* Core Views */}
              {groupedViews.core.length > 0 && (
                <>
                  <DropdownMenuLabel aria-hidden="true" className="text-xs text-muted-foreground px-2">
                    Core Views
                  </DropdownMenuLabel>
                  {groupedViews.core.map((view: any) => (
                    <DropdownMenuItem
                      key={view.type}
                      onClick={() => onViewChange(view.type)}
                    >
                      {view.name}
                    </DropdownMenuItem>
                  ))}
                </>
              )}

              {/* Advanced Views */}
              {groupedViews.advanced.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel aria-hidden="true" className="text-xs text-muted-foreground px-2">
                    Advanced Views
                  </DropdownMenuLabel>
                  {groupedViews.advanced.map((view: any) => (
                    <DropdownMenuItem
                      key={view.type}
                      onClick={() => onViewChange(view.type)}
                    >
                      {view.name}
                    </DropdownMenuItem>
                  ))}
                </>
              )}

              {/* Specialized Views */}
              {groupedViews.specialized.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel aria-hidden="true" className="text-xs text-muted-foreground px-2">
                    Specialized Views
                  </DropdownMenuLabel>
                  {groupedViews.specialized.map((view: any) => (
                    <DropdownMenuItem
                      key={view.type}
                      onClick={() => onViewChange(view.type)}
                    >
                      {view.name}
                    </DropdownMenuItem>
                  ))}
                </>
              )}

              {/* No results message */}
              {filteredViews.length === 0 && (
                <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                  No views found
                </div>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem aria-hidden="true" className="gap-2">
                <Plus aria-hidden="true" className="h-4 w-4" />
                Create custom view
              </DropdownMenuItem>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
