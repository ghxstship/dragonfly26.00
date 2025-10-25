"use client"

import { useState, useEffect } from "react"
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { 
  CalendarDays, 
  MapPin, 
  Users, 
  Clock,
  Search,
  Filter,
  Star,
  Share2,
  Bell,
  TrendingUp,
  Music,
  Ticket,
  ExternalLink
} from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { useCommunityData } from "@/hooks/use-community-data"

interface EventsTabProps {
  data?: any[]
  loading?: boolean
}

interface CommunityEvent {
  id: string
  title: string
  description: string
  organizer: string
  organizerImage?: string
  category: "concert" | "festival" | "theater" | "conference" | "workshop" | "networking"
  date: string
  time: string
  endDate?: string
  venue: string
  location: string
  image?: string
  attendees: number
  capacity: number
  price: "free" | "paid"
  priceAmount?: number
  visibility: "public"
  tags: string[]
  isAttending?: boolean
  isInterested?: boolean
  featured?: boolean
}

export function EventsTab({ data = [], loading: loadingProp = false }: EventsTabProps) {
  const { events: liveEvents, loading: liveLoading } = useCommunityData()
  const loading = loadingProp || liveLoading
  const t = useTranslations('community.events')
  const tCommon = useTranslations('common')
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState<Date | undefined>()
  const [categoryFilter, setCategoryFilter] = useState<"all" | CommunityEvent["category"]>("all")

  const [events, setEvents] = useState<CommunityEvent[]>([])

  // Transform and update events when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      const transformed: CommunityEvent[] = data.map((item: any) => {
        const record = item as any
        const startDate = new Date(record.start_time)
        const endDate = record.end_time ? new Date(record.end_time) : undefined
        
        return {
          id: record.id,
          title: record.name || 'Untitled Event',
          description: record.description || '',
          organizer: record.production?.name || 'Community',
          organizerImage: undefined,
          category: record.event_type || 'conference',
          date: startDate.toISOString().split('T')[0],
          time: startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          endDate: endDate?.toISOString().split('T')[0],
          venue: record.location?.name || 'TBA',
          location: record.location ? `${record.location.city}, ${record.location.state}` : 'TBA',
          image: undefined,
          attendees: 0, // Not tracked yet
          capacity: record.capacity || 1000,
          price: 'free', // Not tracked yet
          priceAmount: undefined,
          visibility: record.is_public ? 'public' : 'public',
          tags: [],
          isAttending: false,
          isInterested: false,
          featured: false
        }
      })
      setEvents(transformed)
    }
  }, [data])

  const handleAttend = (eventId: string) => {
    setEvents(events.map(event =>
      event.id === eventId
        ? { ...event, isAttending: true, isInterested: false, attendees: event.attendees + 1 }
        : event
    ))
  }

  const handleInterested = (eventId: string) => {
    setEvents(events.map(event =>
      event.id === eventId
        ? { ...event, isInterested: !event.isInterested }
        : event
    ))
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter
    
    const matchesDate = !dateFilter || 
                       new Date(event.date).toDateString() === dateFilter.toDateString()
    
    return matchesSearch && matchesCategory && matchesDate
  })

  const upcomingEvents = events.filter(e => new Date(e.date) > new Date())
  const attendingCount = events.filter(e => e.isAttending).length

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
        <Card>
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('upcoming')}</div>
            <CalendarDays className="h-4 w-4 text-muted-foreground"  aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{upcomingEvents.length}</div>
            <p className="text-xs text-muted-foreground">Public events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('attending')}</div>
            <Ticket className="h-4 w-4 text-muted-foreground"  aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{attendingCount as any}</div>
            <p className="text-xs text-muted-foreground">Your events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('interested')}</div>
            <Star className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
              {events.filter(e => e.isInterested).length}
            </div>
            <p className="text-xs text-muted-foreground">Saved events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('featured')}</div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
              {events.filter(e => e.featured).length}
            </div>
            <p className="text-xs text-muted-foreground">{t('highlighted')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="grid md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
        <Card className="md:col-span-2">
          <CardContent className="pt-6 space-y-4">
            <div className="relative">
              <Search className="absolute sm:relative sm:inset-auto left-3 top-3 h-4 w-4 text-muted-foreground sm:relative sm:inset-auto" aria-hidden="true" />
              <Input
                placeholder={t('searchEvents')}
                value={searchQuery as any}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={categoryFilter as any} onValueChange={(v) => setCategoryFilter(v as any)}>
              <TabsList className="w-full grid grid-cols-4 lg:grid-cols-7 max-w-full">
                <TabsTrigger value="all">{t('all')}</TabsTrigger>
                <TabsTrigger value="concert">{t('concert')}</TabsTrigger>
                <TabsTrigger value="festival">{t('festival')}</TabsTrigger>
                <TabsTrigger value="theater">{t('theater')}</TabsTrigger>
                <TabsTrigger value="conference">{t('conference')}</TabsTrigger>
                <TabsTrigger value="workshop">{t('workshop')}</TabsTrigger>
                <TabsTrigger value="networking">{t('network')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Filter by Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={dateFilter}
              onSelect={setDateFilter}
              className="rounded-md border"
            />
            {dateFilter && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2 max-w-full"
                onClick={() => setDateFilter(undefined)}
              >
                Clear Date
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="p-0">
              <EmptyState
                variant="inline"
                icon={CalendarDays}
                mainMessage={searchQuery || categoryFilter !== "all" ? t('noEventsFound') : t('nothingToSeeYet')}
                description={searchQuery || categoryFilter !== "all" ? t('tryAdjustingFilters') : t('createCommunityEvents')}
                actionLabel={!searchQuery && categoryFilter === "all" ? "Create Event" : undefined}
                onAction={!searchQuery && categoryFilter === "all" ? () => {} : undefined}
              />
            </CardContent>
          </Card>
        ) : (
          filteredEvents.map((event: any) => (
            <Card key={event.id} className="overflow-hidden md:block hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="md:flex">
                  {/* Event Image */}
                  {event.image && (
                    <div className="md:w-full sm:w-80 h-56 relative flex-shrink-0">
                      <div 
                        className="absolute sm:relative sm:inset-auto inset-0 bg-cover bg-center sm:relative sm:inset-auto"
                        style={{ backgroundImage: `url(${event.image})` }}
                      />
                      {event.featured && (
                        <Badge className="absolute sm:relative sm:inset-auto top-3 left-3 bg-orange-500 sm:relative sm:inset-auto">
                          <Star className="h-3 w-3 mr-1 fill-current" aria-hidden="true" />
                          Featured
                        </Badge>
                      )}
                      {event.price === "free" && (
                        <Badge className="absolute sm:relative sm:inset-auto top-2 md:top-3 right-2 md:right-3 bg-green-500">
                          FREE
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Event Details */}
                  <div className="p-6 flex-1">
                    <div className="flex flex-wrap flex-col md:flex-row items-start justify-between gap-2 md:gap-3 lg:gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 mb-2">
                          <Badge variant="outline" className="capitalize">
                            <Music className="h-3 w-3 mr-1"  aria-hidden="true" />
                            {event.category}
                          </Badge>
                          <Badge variant={event.price === "free" ? "secondary" : "default"}>
                            {event.price === "free" ? t('free') : `$${event.priceAmount}`}
                          </Badge>
                        </div>
                        <h3 className="text-base md:text-lg lg:text-xl font-semibold mb-2">{event.title}</h3>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Organizer */}
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 mb-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={event.organizerImage} />
                        <AvatarFallback>{event.organizer[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{event.organizer}</span>
                    </div>

                    {/* Event Info */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-muted-foreground">
                        <CalendarDays className="h-4 w-4"  aria-hidden="true" />
                        <span>
                          {new Date(event.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                          {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric' 
                          })}`}
                        </span>
                      </div>
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" aria-hidden="true" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4"  aria-hidden="true" />
                        <span>{event.venue}, {event.location}</span>
                      </div>
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" aria-hidden="true" />
                        <span>
                          {event.attendees.toLocaleString()} attending · {event.capacity.toLocaleString()} capacity
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.tags.map((tag: any) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {event.isAttending ? (
                        <Button variant="default" size="sm" disabled>
                          <Ticket className="h-4 w-4 mr-2"  aria-hidden="true" />
                          Attending
                        </Button>
                      ) : (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleAttend(event.id)}
                        >
                          <Ticket className="h-4 w-4 mr-2"  aria-hidden="true" />
                          Attend
                        </Button>
                      )}
                      <Button 
                        variant={event.isInterested ? "default" : "outline"} 
                        size="sm"
                        onClick={() => handleInterested(event.id)}
                      >
                        <Star className={`h-4 w-4 mr-2 ${event.isInterested ? 'fill-current' : ''}`} />
                        Interested
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />{tCommon('details')}</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
