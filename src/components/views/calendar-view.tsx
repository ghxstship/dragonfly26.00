"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { DataItem, CalendarMode } from "@/types"
import type { FieldSchema } from "@/lib/data-schemas"
import { getDisplayValue, getDateValue, getPriorityValue, getAssigneeValue, getStatusValue } from "@/lib/schema-helpers"

interface CalendarViewProps {
  data: DataItem[]
  schema?: FieldSchema[]
  onItemClick?: (item: DataItem) => void
}

export function CalendarView({ data, schema, onItemClick }: CalendarViewProps) {
  const t = useTranslations()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [mode, setMode] = useState<CalendarMode>("month")

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

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

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getItemsForDate = (day: number) => {
    return data.filter((item) => {
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

  const getWeekDates = () => {
    const curr = new Date(currentDate)
    const first = curr.getDate() - curr.getDay()
    const dates = []
    for (let i = 0; i < 7; i++) {
      dates.push(new Date(curr.getFullYear(), curr.getMonth(), first + i))
    }
    return dates
  }

  const getItemsForWeekDate = (date: Date) => {
    return data.filter((item) => {
      const dateValue = getDateValue(item, schema)
      if (!dateValue) return false
      const itemDate = new Date(dateValue)
      return (
        itemDate.getFullYear() === date.getFullYear() &&
        itemDate.getMonth() === date.getMonth() &&
        itemDate.getDate() === date.getDate()
      )
    })
  }

  const getTodayItems = () => {
    const today = new Date()
    return data.filter((item) => {
      const dateValue = getDateValue(item, schema)
      if (!dateValue) return false
      const itemDate = new Date(dateValue)
      return (
        itemDate.getFullYear() === today.getFullYear() &&
        itemDate.getMonth() === today.getMonth() &&
        itemDate.getDate() === today.getDate()
      )
    })
  }

  const getAllUpcomingItems = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return data
      .filter((item) => {
        const dateValue = getDateValue(item, schema)
        return dateValue && new Date(dateValue) >= today
      })
      .sort((a, b) => {
        const aDate = getDateValue(a, schema)
        const bDate = getDateValue(b, schema)
        return new Date(aDate!).getTime() - new Date(bDate!).getTime()
      })
  }

  const renderCalendarDays = () => {
    const days = []
    const totalCells = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - startingDayOfWeek + 1
      const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth
      const isToday =
        isCurrentMonth &&
        dayNumber === new Date().getDate() &&
        month === new Date().getMonth() &&
        year === new Date().getFullYear()

      const dayItems = isCurrentMonth ? getItemsForDate(dayNumber) : []

      days.push(
        <div
          key={i}
          className={cn(
            "min-h-[100px] border-r border-b p-2",
            !isCurrentMonth && "bg-muted/30 text-muted-foreground",
            isToday && "bg-primary/5"
          )}
        >
          {isCurrentMonth && (
            <>
              <div
                className={cn(
                  "text-sm font-medium mb-2",
                  isToday && "flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                )}
              >
                {dayNumber}
              </div>
              <div className="space-y-1">
                {dayItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="text-xs p-1 rounded bg-primary/10 hover:bg-primary/20 cursor-pointer truncate"
                    onClick={() => onItemClick?.(item)}
                  >
                    {getDisplayValue(item, schema)}
                  </div>
                ))}
                {dayItems.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{dayItems.length - 3} more
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )
    }

    return days
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={previousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Previous month</p>
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
                  <Button variant="outline" size="icon" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Next month</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

        <div className="flex items-center gap-2">
          {(["month", "week", "day", "agenda"] as CalendarMode[]).map((m) => (
            <Button
              key={m}
              variant={mode === m ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode(m)}
              className="capitalize"
            >
              {m}
            </Button>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      {mode === "month" && (
        <div className="flex-1 border">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="p-2 text-center text-sm font-medium border-r last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>
          {/* Days */}
          <div className="grid grid-cols-7">{renderCalendarDays()}</div>
        </div>
      )}

      {/* Week View */}
      {mode === "week" && (
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-7 border-t">
            {getWeekDates().map((date, idx) => {
              const items = getItemsForWeekDate(date)
              const isToday = date.toDateString() === new Date().toDateString()
              return (
                <div key={idx} className="border-r last:border-r-0 min-h-[500px]">
                  <div className={cn("p-3 border-b text-center", isToday && "bg-primary/5")}>
                    <div className="text-xs text-muted-foreground">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][idx]}
                    </div>
                    <div
                      className={cn(
                        "text-lg font-medium mt-1",
                        isToday && "flex h-8 w-8 mx-auto items-center justify-center rounded-full bg-primary text-primary-foreground"
                      )}
                    >
                      {date.getDate()}
                    </div>
                  </div>
                  <div className="p-2 space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="text-sm p-2 rounded bg-primary/10 hover:bg-primary/20 cursor-pointer"
                        onClick={() => onItemClick?.(item)}
                      >
                        <div className="font-medium truncate">{getDisplayValue(item, schema)}</div>
                        {getPriorityValue(item, schema) && (
                          <div className="text-xs text-muted-foreground mt-1 capitalize">
                            {getPriorityValue(item, schema)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Day View */}
      {mode === "day" && (
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-2xl font-bold mb-6">
              {currentDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="space-y-3">
              {getTodayItems().length === 0 ? (
                <EmptyState
                  variant="compact"
                  mainMessage="No items scheduled for this day"
                  showIcon={false}
                />
              ) : (
                getTodayItems().map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => onItemClick?.(item)}
                  >
                    <div className="font-medium">{getDisplayValue(item, schema)}</div>
                    {item.description && (
                      <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      {getPriorityValue(item, schema) && <span className="capitalize">Priority: {getPriorityValue(item, schema)}</span>}
                      {getAssigneeValue(item, schema) && <span>Assigned to: {getAssigneeValue(item, schema)}</span>}
                      {getStatusValue(item, schema) && <span className="capitalize">Status: {getStatusValue(item, schema)}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Agenda View */}
      {mode === "agenda" && (
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-bold mb-6">Upcoming Items</h3>
            <div className="space-y-6">
              {getAllUpcomingItems().length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No upcoming items
                </div>
              ) : (
                getAllUpcomingItems().reduce((acc: any, item: any) => {
                  const dateValue = getDateValue(item, schema)
                  if (!dateValue) return acc
                  const dateKey = new Date(dateValue).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                  const existingGroup = acc.find((g: { date: string; items: DataItem[] }) => g.date === dateKey)
                  if (existingGroup) {
                    existingGroup.items.push(item)
                  } else {
                    acc.push({ date: dateKey, items: [item] })
                  }
                  return acc
                }, [] as { date: string; items: DataItem[] }[]).map((group: { date: string; items: DataItem[] }) => (
                  <div key={group.date}>
                    <div className="text-sm font-semibold text-muted-foreground mb-3">
                      {group.date}
                    </div>
                    <div className="space-y-2">
                      {group.items.map((item: DataItem) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors"
                          onClick={() => onItemClick?.(item)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium">{getDisplayValue(item, schema)}</div>
                              {item.description && (
                                <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {item.description}
                                </div>
                              )}
                            </div>
                            {getPriorityValue(item, schema) && (
                              <span
                                className={cn(
                                  "text-xs px-2 py-1 rounded-full capitalize",
                                  getPriorityValue(item, schema) === "urgent" && "bg-red-100 text-red-700",
                                  getPriorityValue(item, schema) === "high" && "bg-orange-100 text-orange-700",
                                  getPriorityValue(item, schema) === "normal" && "bg-blue-100 text-blue-700",
                                  getPriorityValue(item, schema) === "low" && "bg-gray-100 text-gray-700"
                                )}
                              >
                                {getPriorityValue(item, schema)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            {getAssigneeValue(item, schema) && <span>{getAssigneeValue(item, schema)}</span>}
                            {getStatusValue(item, schema) && <span className="capitalize">{String(getStatusValue(item, schema)).replace(/_/g, " ")}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </TooltipProvider>
  )
}
