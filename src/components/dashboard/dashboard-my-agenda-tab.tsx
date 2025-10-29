"use client"

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  Plus,
  ChevronRight
} from "lucide-react"
import { useMyAgenda } from "@/hooks/use-dashboard-data"
import { useRouter } from "@/i18n/navigation"
import type { DashboardTabProps } from "@/lib/dashboard-tab-components"

export function DashboardMyAgendaTab({ workspaceId = '', userId = '' }: DashboardTabProps) {
  const router = useRouter()
  const t = useTranslations('dashboard.agenda')
  const tCommon = useTranslations('common')
  
  // Use real data hook
  const { events, loading } = useMyAgenda(workspaceId, userId)
  
  // Transform real events data
  const upcomingEvents = events.map((event: any) => ({
    title: event.title || event.name,
    date: new Date(event.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    time: `${new Date(event.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${new Date(event.end_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`,
    location: event.location?.name || event.location_name || 'TBD',
    type: event.type || 'Event',
    attendees: event.attendees?.length || 0,
    status: event.status || 'confirmed',
    isVirtual: event.is_virtual || false,
    isOrganizer: event.created_by === userId,
    id: event.id,
  }))
  
  // Show loading state
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

  // Calculate week summary from real data
  const weekSummary = [
    { day: "Mon", events: 0 },
    { day: "Tue", events: 0 },
    { day: "Wed", events: 0 },
    { day: "Thu", events: 0 },
    { day: "Fri", events: 0 },
  ]
  
  // Count events per day
  events.forEach((event: any) => {
    const dayOfWeek = new Date(event.start_time).getDay()
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      weekSummary[dayOfWeek - 1].events++
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400"
      case "tentative":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Meeting":
        return "text-blue-600"
      case "Rehearsal":
        return "text-purple-600"
      case "Logistics":
        return "text-orange-600"
      case "Check-in":
        return "text-green-600"
      case "Presentation":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <main role="main" aria-label={t('title')}>
      <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Week Overview */}
      <section role="region" aria-labelledby="week-overview">
        <Card>
          <CardHeader>
            <CardTitle id="week-overview" className="text-base">{t('thisWeek')}</CardTitle>
          </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end justify-between gap-2">
            {weekSummary.map((day: any) => (
              <div key={day.day} className="flex flex-col md:flex-row-1 flex flex-wrap flex-col items-center gap-2">
                <div 
                  className="w-full bg-purple-500 rounded-t max-w-full"
                  style={{ height: `${day.events * 20}px` }}
                />
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">{day.day}</p>
                  <p className="text-sm font-semibold">{day.events}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </section>

      {/* Upcoming Events */}
      <section role="region" aria-labelledby="upcoming-events">
        <Card>
          <CardHeader>
            <CardTitle id="upcoming-events" className="text-base">{t('upcomingEvents')}</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-6 md:py-4 md:py-6 lg:py-8 lg:py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-lg font-semibold mb-2">{t('noUpcomingEvents')}</h3>
                <p className="text-muted-foreground mb-4">{t('noEventsMessage')}</p>
                <Button 
                  size="sm"
                  onClick={() => router.push(`/workspace/${workspaceId}/events/all-events`)}
                  aria-label={t('createEvent')}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('createEvent')}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event: any, index: number) => (
              <div
                key={event.id}
                role="button"
                tabIndex={0}
                className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none"
                onClick={() => router.push(`/workspace/${workspaceId}/events/all-events?id=${event.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    router.push(`/workspace/${workspaceId}/events/all-events?id=${event.id}`)
                  }
                }}
                aria-label={t('viewEvent', { title: event.title as string })}
              >
                <div className="flex flex-wrap flex-col md:flex-row items-start justify-between gap-2 md:gap-3 lg:gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                      <h3 className="font-semibold">{event.title}</h3>
                      {event.isOrganizer && (
                        <Badge variant="outline" className="text-xs">
                          {t('organizer')}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {event.date}
                      </div>
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {event.time}
                      </div>
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                        {event.isVirtual ? (
                          <>
                            <Video className="h-3.5 w-3.5" />
                            {event.location}
                          </>
                        ) : (
                          <>
                            <MapPin className="h-3.5 w-3.5" />
                            {event.location}
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                        <Users className="h-3.5 w-3.5" aria-hidden="true" />
                        {event.attendees} {t('attendees')}
                      </div>
                    </div>

                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                      <Badge variant="secondary" className={getTypeColor(event.type as string)}>
                        {event.type}
                      </Badge>
                      <Badge variant="secondary" className={getStatusColor(event.status as string)}>
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="icon" aria-label="View event details">
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </section>

      {/* Summary Stats */}
      <section role="region" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Event Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl font-bold">{events.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Events</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl font-bold">{events.filter((e: any) => e.created_by === userId).length}</p>
                <p className="text-xs text-muted-foreground mt-1">As Organizer</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl font-bold">{events.filter((e: any) => e.created_by !== userId).length}</p>
                <p className="text-xs text-muted-foreground mt-1">As Attendee</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl font-bold">
                  {events.reduce((total: number, e: any) => {
                    const start = new Date(e.start_time)
                    const end = new Date(e.end_time)
                    return total + Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60))
                  }, 0)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{t('hoursScheduled')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      </div>
    </main>
  )
}
