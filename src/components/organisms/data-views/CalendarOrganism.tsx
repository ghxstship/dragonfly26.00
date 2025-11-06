"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmptyState } from "@/components/shared/empty-state"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { DataItem } from "@/types"
import type { FieldSchema } from "@/lib/data-schemas"
import { getDisplayValue, getDateValue, getStatusValue } from "@/lib/schema-helpers"
import { getStatusColor } from "@/lib/design-system"

/**
 * CalendarOrganism - Organism Component
 * 
 * Calendar view with month/week/day modes and date-based item display.
 * Extracted from views/calendar-view.tsx for atomic design system.
 * 
 * Features:
 * - Month/week/day view modes
 * - Date navigation
 * - Item display by date
 * - Status color coding
 * - Empty state handling
 * - Full i18n and accessibility
 * 
 * Usage:
 * <CalendarOrganism
 *   data={items}
 *   columns={schema}
 *   onItemClick={handleClick}
 *   mode="month"
 * />
 */

export interface CalendarOrganismProps<T extends DataItem = DataItem> {
  data: T[]
  schema?: FieldSchema[]
  onItemClick?: (item: T) => void
  mode?: 'month' | 'week' | 'day'
  onModeChange?: (mode: 'month' | 'week' | 'day') => void
}

export function CalendarOrganism({ 
  data, 
  schema, 
  onItemClick,
  mode: controlledMode,
  onModeChange
}: CalendarOrganismProps) {
  const t = useTranslations()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [internalMode, setInternalMode] = useState<'month' | 'week' | 'day'>('month')
  
  const mode = controlledMode || internalMode
  const setMode = (newMode: 'month' | 'week' | 'day') => {
    if (onModeChange) {
      onModeChange(newMode)
    } else {
      setInternalMode(newMode)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)

  const getItemsForDate = (day: number) => {
    return data.filter((item: any) => {
      const dateValue = getDateValue(item, schema)
      if (!dateValue) return false
      const itemDate = new Date(dateValue)
      return (
        itemDate.getFullYear() === year &&
        itemDate.getMonth() === month &&
        itemDate.getDate() === day
      )
    })
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const monthNames = [
    t('calendar.january'), t('calendar.february'), t('calendar.march'),
    t('calendar.april'), t('calendar.may'), t('calendar.june'),
    t('calendar.july'), t('calendar.august'), t('calendar.september'),
    t('calendar.october'), t('calendar.november'), t('calendar.december')
  ]

  const dayNames = [
    t('calendar.sunday'), t('calendar.monday'), t('calendar.tuesday'),
    t('calendar.wednesday'), t('calendar.thursday'), t('calendar.friday'),
    t('calendar.saturday')
  ]

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-wrap flex-col h-full">
        {/* Header */}
        <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between border-b p-4">
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={previousMonth}
              aria-label={t('calendar.previousMonth')}
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={goToToday}>
              {t('calendar.today')}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextMonth}
              aria-label={t('calendar.nextMonth')}
            >
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </Button>
            <h3 className="font-semibold ml-4">
              {monthNames[month]} {year}
            </h3>
          </div>

          <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
            <TabsList>
              <TabsTrigger value="month">{t('calendar.month')}</TabsTrigger>
              <TabsTrigger value="week">{t('calendar.week')}</TabsTrigger>
              <TabsTrigger value="day">{t('calendar.day')}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto p-4">
          {data.length === 0 ? (
            <EmptyState
              icon={CalendarIcon}
              mainMessage={t('views.emptyState.nothingToSeeYet')}
              description={t('views.emptyState.calendarViewDescription')}
            />
          ) : mode === 'month' ? (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:grid-cols-3 md:grid-cols-2 lg:grid-cols-7 gap-2">
              {/* Day headers */}
              {dayNames.map((day, i) => (
                <div key={i} className="text-center font-semibold text-sm p-2">
                  {day}
                </div>
              ))}

              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="border rounded-lg p-2 bg-muted/20" />
              ))}

              {/* Days of month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const items = getItemsForDate(day)
                const isToday =
                  new Date().getDate() === day &&
                  new Date().getMonth() === month &&
                  new Date().getFullYear() === year

                return (
                  <div
                    key={day}
                    className={cn(
                      'border rounded-lg p-2 min-h-[100px] transition-colors',
                      isToday && 'border-primary bg-primary/5',
                      items.length > 0 && 'hover:bg-accent cursor-pointer'
                    )}
                  >
                    <div className="font-semibold text-sm mb-1">{day as any}</div>
                    <div className="space-y-1">
                      {items.slice(0, 3).map((item: any) => (
                        <Tooltip key={item.id}>
                          <TooltipTrigger asChild>
                            <div
                               role="button" tabIndex={0} onClick={() => onItemClick?.(item)}
                              className={cn(
                                'text-xs p-1 rounded truncate cursor-pointer',
                                getStatusColor(getStatusValue(item, schema))
                              )}
                            >
                              {getDisplayValue(item, schema)}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{getDisplayValue(item, schema)}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                      {items.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{items.length - 3} {t('calendar.more')}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-6 md:py-4 md:py-6 lg:py-8 lg:py-12 text-muted-foreground">
              {t('calendar.weekDayViewPlaceholder')}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
