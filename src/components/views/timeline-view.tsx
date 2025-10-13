"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { DataItem } from "@/types"

interface TimelineViewProps {
  data: DataItem[]
  onItemClick?: (item: DataItem) => void
}

type ZoomLevel = "days" | "weeks" | "months" | "quarters"

export function TimelineView({ data, onItemClick }: TimelineViewProps) {
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
    if (!item.start_date && !item.due_date) return false
    const itemStart = item.start_date ? new Date(item.start_date) : new Date(item.due_date!)
    const itemEnd = item.due_date ? new Date(item.due_date) : itemStart
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
    const itemStart = item.start_date ? new Date(item.start_date) : new Date(item.due_date!)
    const itemEnd = item.due_date ? new Date(item.due_date) : itemStart
    
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
                {getDaysInRange().map((day, index) => {
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
              filteredData.map((item, index) => {
                const position = getItemPosition(item)
                return (
                  <div key={item.id} className="flex h-12 items-center hover:bg-accent/50">
                    <div className="w-48 flex-shrink-0 border-r px-4 text-sm font-medium truncate">
                      {item.name || item.title || "Untitled"}
                    </div>
                    <div className="flex-1 relative h-full">
                      <div
                        className="absolute top-2 bottom-2 rounded-md bg-primary/80 hover:bg-primary cursor-pointer flex items-center px-2 text-xs text-primary-foreground font-medium overflow-hidden"
                        style={position}
                        onClick={() => onItemClick?.(item)}
                      >
                        <span className="truncate">{item.name || item.title}</span>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Badge variant="outline" className="mb-3 text-xs uppercase tracking-wider">
                  {t('views.emptyState.timelineView')}
                </Badge>
                <h3 className="text-xl font-bold mb-2">{t('views.emptyState.nothingToSeeYet')}</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                  {t('views.emptyState.timelineViewDescription')}
                </p>
                <Button size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('views.emptyState.createFirstItem')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </TooltipProvider>
  )
}
