"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { DataItem } from "@/types"
import type { FieldSchema } from "@/lib/data-schemas"
import { getDisplayValue, getStartDateValue, getEndDateValue, getStatusValue } from "@/lib/schema-helpers"
import { getStatusColor } from "@/lib/design-system"

/**
 * TimelineOrganism - Organism Component
 * 
 * Gantt-style timeline view with date ranges and zoom levels.
 * Extracted from views/timeline-view.tsx for atomic design system.
 * 
 * Features:
 * - Gantt-style timeline bars
 * - Zoom levels (days, weeks, months, quarters)
 * - Date range navigation
 * - Status color coding
 * - Tooltip on hover
 * - Full i18n and accessibility
 */

export interface TimelineOrganismProps<T extends DataItem = DataItem> {
  data: T[]
  schema?: FieldSchema[]
  onItemClick?: (item: T) => void
}

type ZoomLevel = "days" | "weeks" | "months" | "quarters"

export function TimelineOrganism({ data, schema, onItemClick }: TimelineOrganismProps) {
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

  const filteredData = data.filter((item: any) => {
    const startDate = getStartDateValue(item, schema)
    const endDate = getEndDateValue(item, schema)
    if (!startDate && !endDate) return false
    const itemStart = startDate ? new Date(startDate) : new Date(endDate!)
    const itemEnd = endDate ? new Date(endDate) : itemStart
    return itemEnd >= start && itemStart <= end
  })

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

  const zoomIn = () => {
    const levels: ZoomLevel[] = ["quarters", "months", "weeks", "days"]
    const currentIndex = levels.indexOf(zoomLevel)
    if (currentIndex < levels.length - 1) {
      setZoomLevel(levels[currentIndex + 1])
    }
  }

  const zoomOut = () => {
    const levels: ZoomLevel[] = ["quarters", "months", "weeks", "days"]
    const currentIndex = levels.indexOf(zoomLevel)
    if (currentIndex > 0) {
      setZoomLevel(levels[currentIndex - 1])
    }
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-wrap flex-col h-full">
        {/* Header */}
        <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between border-b p-4">
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={previousPeriod}
              aria-label={t('timeline.previousPeriod')}
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={goToToday}>
              {t('timeline.today')}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextPeriod}
              aria-label={t('timeline.nextPeriod')}
            >
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={zoomOut}
              disabled={zoomLevel === "quarters"}
              aria-label={t('timeline.zoomOut')}
            >
              <ZoomOut aria-hidden="true" className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground capitalize">{zoomLevel}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={zoomIn}
              disabled={zoomLevel === "days"}
              aria-label={t('timeline.zoomIn')}
            >
              <ZoomIn aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-auto p-4">
          <div className="relative min-h-[400px]">
            {/* Time scale */}
            <div className="h-8 border-b mb-4 relative">
              <div className="absolute sm:relative sm:inset-auto inset-0 flex flex-wrap sm:relative sm:inset-auto">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="flex-1 border-r text-xs text-center text-muted-foreground">
                    {start.getMonth() + i}
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline items */}
            <div className="space-y-2">
              {filteredData.map((item, index) => {
                const position = getItemPosition(item)
                const status = getStatusValue(item, schema)
                
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <div className="relative h-10">
                        <div
                          className={cn(
                            'absolute h-8 rounded px-2 flex items-center cursor-pointer transition-all hover:shadow-md',
                            getStatusColor(status)
                          )}
                          style={position}
                           role="button" tabIndex={0} onClick={() => onItemClick?.(item)}
                        >
                          <span className="text-xs font-medium truncate">
                            {getDisplayValue(item, schema)}
                          </span>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p className="font-medium">{getDisplayValue(item, schema)}</p>
                        <p className="text-xs">
                          {getStartDateValue(item, schema)} - {getEndDateValue(item, schema)}
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>

            {/* Today marker */}
            <div
              className="absolute sm:relative sm:inset-auto top-0 bottom-0 w-0.5 bg-primary pointer-events-none sm:relative sm:inset-auto"
              style={{
                left: `${((new Date().getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
