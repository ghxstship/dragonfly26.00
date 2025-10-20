"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PTOCalendarWidgetProps {
  selectedDates?: Date[]
  onDateSelect?: (dates: Date[]) => void
  balance?: number
  policyType?: string
  blackoutDates?: Date[]
  approvedPTO?: Date[]
  pendingPTO?: Date[]
  onRequestPTO?: (dates: Date[]) => void
  className?: string
}

export function PTOCalendarWidget({
  selectedDates = [],
  onDateSelect,
  balance = 0,
  policyType = "Vacation",
  blackoutDates = [],
  approvedPTO = [],
  pendingPTO = [],
  onRequestPTO,
  className
}: PTOCalendarWidgetProps) {
  const [month, setMonth] = useState(new Date())
  const [selected, setSelected] = useState<Date[]>(selectedDates)

  const handleDateSelect = (dates: Date[] | undefined) => {
    const newDates = dates || []
    setSelected(newDates)
    onDateSelect?.(newDates)
  }

  const totalDays = selected.length
  const isAvailable = balance >= totalDays

  const modifiers = {
    blackout: blackoutDates,
    approved: approvedPTO,
    pending: pendingPTO,
    selected: selected
  }

  const modifiersStyles = {
    blackout: { 
      backgroundColor: 'rgb(239 68 68 / 0.1)',
      color: 'rgb(239 68 68)',
      textDecoration: 'line-through'
    },
    approved: {
      backgroundColor: 'rgb(34 197 94 / 0.2)',
      color: 'rgb(22 163 74)',
      fontWeight: 'bold'
    },
    pending: {
      backgroundColor: 'rgb(234 179 8 / 0.2)',
      color: 'rgb(161 98 7)',
      fontStyle: 'italic'
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>Request PTO</span>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Calendar */}
        <div className="border rounded-lg p-2">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => {
                const newMonth = new Date(month)
                newMonth.setMonth(month.getMonth() - 1)
                setMonth(newMonth)
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => {
                const newMonth = new Date(month)
                newMonth.setMonth(month.getMonth() + 1)
                setMonth(newMonth)
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Calendar
            mode="multiple"
            selected={selected}
            onSelect={handleDateSelect}
            month={month}
            onMonthChange={setMonth}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            className="w-full"
            disabled={(date) => 
              date < new Date() || 
              blackoutDates.some(bd => bd.toDateString() === date.toDateString())
            }
          />
        </div>

        {/* Selection Summary */}
        {selected.length > 0 && (
          <div className="p-3 bg-muted/50 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Selected</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleDateSelect([])}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="text-xs space-y-1">
              {selected.length === 1 ? (
                <p>{selected[0].toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}</p>
              ) : (
                <p>
                  {selected[0]?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {' - '}
                  {selected[selected.length - 1]?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              )}
              <div className="flex items-center justify-between pt-1">
                <span className="text-muted-foreground">Days:</span>
                <span className="font-bold">{totalDays}</span>
              </div>
            </div>
          </div>
        )}

        {/* Balance */}
        <div className="flex items-center justify-between p-2 border rounded">
          <span className="text-sm text-muted-foreground">Balance:</span>
          <div className="flex items-center gap-2">
            <span className="font-bold">{balance} days</span>
            {isAvailable ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-green-500/20 border border-green-500" />
            <span className="text-muted-foreground">Approved</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-yellow-500/20 border border-yellow-500" />
            <span className="text-muted-foreground">Pending</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-red-500/20 border border-red-500" />
            <span className="text-muted-foreground">Blackout</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-primary border border-primary" />
            <span className="text-muted-foreground">Selected</span>
          </div>
        </div>

        {/* Submit Button */}
        {onRequestPTO && selected.length > 0 && (
          <Button 
            className="w-full"
            onClick={() => onRequestPTO(selected)}
            disabled={!isAvailable}
          >
            {isAvailable ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Request PTO ({totalDays} days)
              </>
            ) : (
              <>
                <X className="h-4 w-4 mr-2" />
                Insufficient Balance
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Team PTO Calendar View (shows who's out)
export function TeamPTOCalendar({
  ptoRequests,
  onViewRequest
}: {
  ptoRequests: Array<{
    id: string
    personnelName: string
    dates: Date[]
    status: "approved" | "pending"
  }>
  onViewRequest?: (id: string) => void
}) {
  const [month, setMonth] = useState(new Date())

  // Group PTO by date
  const ptoByDate = ptoRequests.reduce((acc: any, request: any) => {
    request.dates.forEach(date => {
      const key = date.toISOString().split('T')[0]
      if (!acc[key]) acc[key] = []
      acc[key].push(request)
    })
    return acc
  }, {} as Record<string, typeof ptoRequests>)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Team PTO Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newMonth = new Date(month)
                newMonth.setMonth(month.getMonth() - 1)
                setMonth(newMonth)
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">
              {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newMonth = new Date(month)
                newMonth.setMonth(month.getMonth() + 1)
                setMonth(newMonth)
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* PTO List for selected month */}
          <div className="space-y-2">
            {Object.entries(ptoByDate)
              .filter(([dateStr]) => {
                const date = new Date(dateStr)
                return date.getMonth() === month.getMonth() && 
                       date.getFullYear() === month.getFullYear()
              })
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([dateStr, requests]) => (
                <div key={dateStr} className="border-b pb-2 last:border-0">
                  <p className="text-xs text-muted-foreground mb-1">
                    {new Date(dateStr).toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                  <div className="flex items-center gap-1 flex-wrap">
                    {(requests as any[]).map((req: any) => (
                      <Badge 
                        key={req.id}
                        variant={req.status === "approved" ? "default" : "secondary"}
                        className="text-xs cursor-pointer"
                        onClick={() => onViewRequest?.(req.id)}
                      >
                        {req.personnelName}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
