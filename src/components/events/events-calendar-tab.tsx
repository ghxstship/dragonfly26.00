"use client"

import { useTranslations } from 'next-intl'
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Filter, Clock, MapPin, Users } from "lucide-react"
import { useModuleData } from "@/hooks/use-module-data"
import type { TabComponentProps } from "@/types"

export function EventsCalendarTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const t = useTranslations('production.events.calendar')
  const tCommon = useTranslations('common')
  const { data: events, loading, error } = useModuleData(workspaceId, 'events', 'all-events')
  const [currentDate, setCurrentDate] = useState(new Date())

  if (loading) {
    return (
      <div 
        className="flex items-center justify-center h-full"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" aria-hidden="true"></div>
          <p className="text-muted-foreground">{t('loadingMessage')}</p>
        </div>
      </div>
    )
  }

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    return { daysInMonth, startingDayOfWeek }
  }

  const getEventsForDay = (day: number) => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const targetDate = new Date(year, month, day)
    
    return events.filter((event: any) => {
      const eventDate = new Date(event.start_time || event.start_date)
      return eventDate.getDate() === day && 
             eventDate.getMonth() === month && 
             eventDate.getFullYear() === year
    })
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const today = new Date()
  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: startingDayOfWeek }, (_, i) => i)

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'performance': 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400',
      'rehearsal': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400',
      'meeting': 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
      'class': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
      'workshop': 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-400',
    }
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400'
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full" role="alert" aria-live="assertive">
        <div className="text-center">
          <CalendarIcon className="h-8 w-8 text-destructive mx-auto mb-4" aria-hidden="true" />
          <p className="text-muted-foreground">Failed to load data</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </div>
      </div>
    )
  }


  return (
    <main role="main" aria-label={t('title')}>
      <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Stats */}
      <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">Total events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
              {getEventsForDay(today.getDate()).length}
            </div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performances</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
              {events.filter((e: any) => (e as any).type === 'performance').length}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rehearsals</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
              {events.filter((e: any) => (e as any).type === 'rehearsal').length}
            </div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
            <CardTitle>{getMonthName(currentDate)}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="icon" onClick={previousMonth} aria-label="Previous month">
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth} aria-label="Next month">
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:grid-cols-3 md:grid-cols-2 lg:grid-cols-7 gap-2">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day: any) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
            
            {/* Empty cells for days before month starts */}
            {emptyDays.map((i: any) => (
              <div key={`empty-${i}`} className="min-h-24 border rounded-lg bg-muted/20" />
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((day: any) => {
              const dayEvents = getEventsForDay(day)
              const isToday = 
                day === today.getDate() && 
                currentDate.getMonth() === today.getMonth() && 
                currentDate.getFullYear() === today.getFullYear()
              
              return (
                <div 
                  key={day} 
                  className={`min-h-24 border rounded-lg p-2 hover:bg-accent/50 transition-colors ${
                    isToday ? 'border-primary border-2 bg-primary/5' : ''
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event: any) => (
                      <div 
                        key={event.id}
                        className={`text-xs p-1 rounded truncate ${getEventTypeColor(event.type)}`}
                      >
                        {event.name}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground pl-1">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Today's Events */}
      {getEventsForDay(today.getDate()).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Events</CardTitle>
            <CardDescription>
              {getEventsForDay(today.getDate()).length} events scheduled for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getEventsForDay(today.getDate()).map((event: any) => (
                <div 
                  key={event.id}
                  className="flex flex-col sm:flex-row flex-col md:flex-row items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-3">
                    <div className="flex flex-wrap flex-col">
                      <span className="font-medium">{event.name}</span>
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" aria-hidden="true" />
                        <span>
                          {new Date(event.start_time || event.start_date).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </span>
                        {event.location && (
                          <>
                            <MapPin className="h-4 w-4 ml-2" aria-hidden="true" />
                            <span>{event.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                    <Badge className={getEventTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
    </main>
  )
}
