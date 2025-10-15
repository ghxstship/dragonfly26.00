"use client"

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
  
  // Use real data hook
  const { events, loading } = useMyAgenda(workspaceId, userId)
  
  // Transform real events data
  const upcomingEvents = events.map(event => ({
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
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your agenda...</p>
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
  events.forEach(event => {
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
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button 
          size="sm" 
          className="gap-2"
          onClick={() => router.push(`/workspace/${workspaceId}/events/all-events`)}
        >
          <Plus className="h-4 w-4" />
          New Event
        </Button>
      </div>

      {/* Week Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2">
            {weekSummary.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-purple-500 rounded-t"
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

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Upcoming Events</h3>
              <p className="text-muted-foreground mb-4">You don&apos;t have any events scheduled yet.</p>
              <Button 
                size="sm"
                onClick={() => router.push(`/workspace/${workspaceId}/events/all-events`)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
              <div
                key={event.id || index}
                className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                onClick={() => event.id && router.push(`/workspace/${workspaceId}/events/all-events?id=${event.id}`)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{event.title}</h3>
                      {event.isOrganizer && (
                        <Badge variant="outline" className="text-xs">
                          Organizer
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1">
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
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {event.attendees} attendees
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={getTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                      <Badge variant="secondary" className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{events.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Events</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{events.filter(e => e.created_by === userId).length}</p>
              <p className="text-xs text-muted-foreground mt-1">As Organizer</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{events.filter(e => e.created_by !== userId).length}</p>
              <p className="text-xs text-muted-foreground mt-1">As Attendee</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">
                {events.reduce((total, e) => {
                  const start = new Date(e.start_time)
                  const end = new Date(e.end_time)
                  return total + Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60))
                }, 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Hours Scheduled</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
