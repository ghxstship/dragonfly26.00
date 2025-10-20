"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { MapPin, Filter, Maximize2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { EmptyState } from "@/components/shared/empty-state"
import { cn } from "@/lib/utils"
import type { DataItem } from "@/types"
import type { FieldSchema } from "@/lib/data-schemas"

interface MapViewProps {
  data: DataItem[]
  schema?: FieldSchema[]
  onItemClick?: (item: DataItem) => void
  createActionLabel?: string
  onCreateAction?: () => void
}

export function MapView({ data, schema, onItemClick, createActionLabel, onCreateAction }: MapViewProps) {
  const t = useTranslations()
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null)

  // Filter items with location data
  const itemsWithLocation = data.filter((item: any) => item.latitude && item.longitude)

  // Group by proximity (example clustering)
  const clusters = itemsWithLocation.reduce((acc: any, item: any) => {
    const region = item.region || "Other"
    if (!acc[region]) acc[region] = []
    acc[region].push(item)
    return acc
  }, {} as Record<string, DataItem[]>)

  return (
    <div className="flex h-full gap-4">
      {/* Map Area */}
      <div className="flex-1 relative bg-muted/30 rounded-lg border overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {data.length === 0 ? (
            <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg">
              <EmptyState
                variant="inline"
                icon={MapPin}
                mainMessage={t('views.emptyState.nothingToSeeYet')}
                description={t('views.emptyState.mapViewDescription')}
                actionLabel={createActionLabel || t('views.emptyState.createFirstItem')}
                onAction={onCreateAction}
              />
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="h-12 w-12 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Map View</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Geographic visualization of {itemsWithLocation.length} items with location data.
                  Map integration available with external mapping services.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filter locations</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="icon">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Fullscreen</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Marker indicators (placeholder) */}
        <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur rounded-lg border p-3 shadow-lg">
          <div className="text-xs font-semibold mb-2">Clusters</div>
          <div className="space-y-1">
            {Object.entries(clusters).map(([region, items]) => (
              <div key={region} className="flex items-center gap-2 text-sm">
                <MapPin className="h-3 w-3 text-primary" />
                <span>{region}</span>
                <Badge variant="secondary" className="ml-auto">
                  {(items as any[]).length}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Item List Sidebar */}
      <div className="w-80 border rounded-lg bg-background overflow-hidden flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Locations</h3>
          <p className="text-sm text-muted-foreground">
            {itemsWithLocation.length} items
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {itemsWithLocation.length === 0 ? (
            <EmptyState
              variant="compact"
              icon={MapPin}
              mainMessage={t('views.emptyState.nothingToSeeYet')}
              description={t('views.emptyState.mapViewDescription')}
            />
          ) : (
            <div className="divide-y">
              {itemsWithLocation.map((item: any) => (
                <div
                  key={item.id}
                  className={cn(
                    "p-3 hover:bg-accent transition-colors cursor-pointer",
                    selectedItem?.id === item.id && "bg-accent"
                  )}
                  onClick={() => {
                    setSelectedItem(item)
                    onItemClick?.(item)
                  }}
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">
                        {item.name || item.title || "Untitled"}
                      </div>
                      {item.address && (
                        <div className="text-xs text-muted-foreground truncate">
                          {item.address}
                        </div>
                      )}
                      {item.region && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {item.region}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
