"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { DataItem } from "@/types"
import type { FieldSchema } from "@/lib/data-schemas"
import { getDisplayValue, getStartDateValue, getEndDateValue, getStatusValue } from "@/lib/schema-helpers"

interface TimelineViewProps {
  data: DataItem[]
  schema?: FieldSchema[]
  onItemClick?: (item: DataItem) => void
  createActionLabel?: string
  onCreateAction?: () => void
}

type ZoomLevel = "days" | "weeks" | "months" | "quarters"

export function TimelineView({ data, schema, onItemClick, createActionLabel, onCreateAction }: TimelineViewProps) {
  const t = useTranslations()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>("weeks")

  const getVisibleRange = () => {
    const start = new Date(currentDate)
    start.setDate(start.getDate() - 30)
    const end = new Date(currentDate)
    end.setDate(end.getDate() + 30)
    return { start, end }
  }

  const { start, end } = getVisibleRange()

  const filteredData = data.filter((item) => {
    const startDate = getStartDateValue(item, schema)
    const endDate = getEndDateValue(item, schema)
    if (!startDate && !endDate) return false
    const itemStart = startDate ? new Date(startDate) : new Date(endDate!)
    const itemEnd = endDate ? new Date(endDate) : itemStart
    return itemEnd >= start && itemStart <= end
  })

  const getDaysInRange = () => {
    const days = []
    const current = new Date(start)
    while (current <= end) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return days
  }

  const getItemPosition = (item: DataItem) => {
    const startDate = getStartDateValue(item, schema)
    const endDate = getEndDateValue(item, schema)
    const itemStart = startDate ? new Date(startDate) : new Date(endDate!)
    const itemEnd = endDate ? new Date(endDate) : itemStart
    
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    const startOffset = Math.ceil((itemStart.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    const duration = Math.max(1, Math.ceil((itemEnd.getTime() - itemStart.getTime()) / (1000 * 60 * 60 * 24)))
    
    const leftPercent = (startOffset / totalDays) * 100
    const widthPercent = (duration / totalDays) * 100
    
    return { left: `${leftPercent}%`, width: `${widthPercent}%` }
  }

  const previousPeriod = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentDate(newDate)
  }

  const nextPeriod = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Timeline</h2>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={previousPeriod}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Previous period</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={goToToday}>
                    Today
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Go to today</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={nextPeriod}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Next period</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom out</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="capitalize">
                  {zoomLevel}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom level</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom in</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-max">
          {/* Timeline Header */}
          <div className="sticky top-0 z-10 bg-background border-b">
            <div className="flex h-12 items-center">
              <div className="w-48 flex-shrink-0 border-r px-4 font-medium">
                Task
              </div>
              <div className="flex-1 relative">
                {getDaysInRange().map((day: any, index: number) => {
                  if (index % 7 === 0) {
                    return (
                      <div
                        key={day.toISOString()}
                        className="absolute inset-y-0 border-r px-2 text-xs text-muted-foreground flex items-center"
                        style={{ left: `${(index / getDaysInRange().length) * 100}%` }}
                      >
                        {day.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          </div>

          {/* Timeline Rows */}
          <div className="divide-y">
            {filteredData.length > 0 ? (
              filteredData.map((item: any, index: number) => {
                const position = getItemPosition(item)
                return (
                  <div key={item.id} className="flex h-12 items-center hover:bg-accent/50">
                    <div className="w-48 flex-shrink-0 border-r px-4 text-sm font-medium truncate">
                      {getDisplayValue(item, schema)}
                    </div>
                    <div className="flex-1 relative h-full">
                      <div
                        className="absolute top-2 bottom-2 rounded-md bg-primary/80 hover:bg-primary cursor-pointer flex items-center px-2 text-xs text-primary-foreground font-medium overflow-hidden"
                        style={position}
                        onClick={() => onItemClick?.(item)}
                      >
                        <span className="truncate">{getDisplayValue(item, schema)}</span>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <EmptyState
                variant="inline"
                mainMessage={t('views.emptyState.nothingToSeeYet')}
                description={t('views.emptyState.timelineViewDescription')}
                actionLabel={t('views.emptyState.createFirstItem')}
                onAction={onCreateAction}
              />
            )}
          </div>
        </div>
      </div>
      </div>
    </TooltipProvider>
  )
}
