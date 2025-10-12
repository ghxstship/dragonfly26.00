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

export function DashboardMyAgendaTab() {
  // User's events including them or created by them
  const upcomingEvents = [
    {
      title: "Production Meeting",
      date: "Today",
      time: "10:00 AM - 11:00 AM",
      location: "Conference Room A",
      type: "Meeting",
      attendees: 8,
      status: "confirmed",
      isVirtual: false,
      isOrganizer: true,
    },
    {
      title: "Tech Rehearsal - Summer Festival",
      date: "Today",
      time: "2:00 PM - 6:00 PM",
      location: "Main Stage",
      type: "Rehearsal",
      attendees: 24,
      status: "confirmed",
      isVirtual: false,
      isOrganizer: false,
    },
    {
      title: "Budget Review Call",
      date: "Tomorrow",
      time: "9:00 AM - 10:00 AM",
      location: "Zoom",
      type: "Meeting",
      attendees: 5,
      status: "confirmed",
      isVirtual: true,
      isOrganizer: true,
    },
    {
      title: "Load-In Coordination",
      date: "Tomorrow",
      time: "1:00 PM - 3:00 PM",
      location: "Loading Dock B",
      type: "Logistics",
      attendees: 12,
      status: "tentative",
      isVirtual: false,
      isOrganizer: false,
    },
    {
      title: "Crew Check-In",
      date: "Wed, Oct 16",
      time: "8:00 AM - 9:00 AM",
      location: "Backstage",
      type: "Check-in",
      attendees: 30,
      status: "confirmed",
      isVirtual: false,
      isOrganizer: true,
    },
    {
      title: "Client Presentation",
      date: "Thu, Oct 17",
      time: "11:00 AM - 12:00 PM",
      location: "Client Office",
      type: "Presentation",
      attendees: 6,
      status: "confirmed",
      isVirtual: false,
      isOrganizer: true,
    },
  ]

  const weekSummary = [
    { day: "Mon", events: 3 },
    { day: "Tue", events: 5 },
    { day: "Wed", events: 4 },
    { day: "Thu", events: 6 },
    { day: "Fri", events: 2 },
  ]

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
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                My Agenda
              </CardTitle>
              <CardDescription>
                Events including you or created by you
              </CardDescription>
            </div>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Event
            </Button>
          </div>
        </CardHeader>
      </Card>

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
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
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
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">23</p>
              <p className="text-xs text-muted-foreground mt-1">Events This Month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">8</p>
              <p className="text-xs text-muted-foreground mt-1">As Organizer</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">15</p>
              <p className="text-xs text-muted-foreground mt-1">As Attendee</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">42</p>
              <p className="text-xs text-muted-foreground mt-1">Hours Scheduled</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
