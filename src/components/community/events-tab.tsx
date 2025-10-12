"use client"

import { useState } from "react"
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

export function EventsTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState<Date | undefined>()
  const [categoryFilter, setCategoryFilter] = useState<"all" | CommunityEvent["category"]>("all")

  const [events, setEvents] = useState<CommunityEvent[]>([
    {
      id: "1",
      title: "Global Music Awards 2024",
      description: "Join us for the biggest night in music! Featuring performances from world-renowned artists, cutting-edge production, and unforgettable moments. This premier event brings together industry professionals and music lovers.",
      organizer: "Stellar Events",
      organizerImage: "/api/placeholder/40/40",
      category: "concert",
      date: "2024-11-15",
      time: "19:00",
      venue: "Metro Arena",
      location: "Los Angeles, CA",
      image: "/api/placeholder/600/400",
      attendees: 4521,
      capacity: 15000,
      price: "paid",
      priceAmount: 75,
      visibility: "public",
      tags: ["Music", "Awards", "Entertainment"],
      isAttending: true,
      featured: true
    },
    {
      id: "2",
      title: "Summer Sound Festival",
      description: "Three days of incredible music across 5 stages! Experience 100+ artists from various genres in an outdoor paradise. Food, drinks, camping, and unforgettable memories await.",
      organizer: "Horizon Festivals",
      organizerImage: "/api/placeholder/40/40",
      category: "festival",
      date: "2024-12-01",
      time: "12:00",
      endDate: "2024-12-03",
      venue: "Riverside Park",
      location: "Austin, TX",
      image: "/api/placeholder/600/400",
      attendees: 12840,
      capacity: 50000,
      price: "paid",
      priceAmount: 299,
      visibility: "public",
      tags: ["Festival", "Music", "Outdoor"],
      isInterested: true,
      featured: true
    },
    {
      id: "3",
      title: "Production Tech Workshop: LED Walls",
      description: "Hands-on workshop covering LED wall technology, setup, troubleshooting, and creative applications. Learn from industry experts and get certified. Limited spots available!",
      organizer: "Event Tech Academy",
      organizerImage: "/api/placeholder/40/40",
      category: "workshop",
      date: "2024-10-28",
      time: "09:00",
      venue: "Tech Training Center",
      location: "New York, NY",
      image: "/api/placeholder/600/400",
      attendees: 45,
      capacity: 50,
      price: "paid",
      priceAmount: 499,
      visibility: "public",
      tags: ["Education", "Technology", "LED"],
      isAttending: true
    },
    {
      id: "4",
      title: "Broadway Spectacular: The Musical",
      description: "A dazzling new musical production featuring breathtaking choreography, stunning vocals, and state-of-the-art production design. Experience theater at its finest!",
      organizer: "Broadway Productions Inc",
      organizerImage: "/api/placeholder/40/40",
      category: "theater",
      date: "2024-11-08",
      time: "20:00",
      venue: "Grand Theater",
      location: "New York, NY",
      image: "/api/placeholder/600/400",
      attendees: 1834,
      capacity: 2500,
      price: "paid",
      priceAmount: 85,
      visibility: "public",
      tags: ["Theater", "Broadway", "Musical"],
      isInterested: true
    },
    {
      id: "5",
      title: "Live Event Production Conference 2024",
      description: "Industry conference bringing together production professionals from around the world. Keynote speakers, panel discussions, networking, and the latest tech demos.",
      organizer: "Production Network",
      organizerImage: "/api/placeholder/40/40",
      category: "conference",
      date: "2024-11-20",
      time: "08:00",
      endDate: "2024-11-22",
      venue: "Convention Center",
      location: "Las Vegas, NV",
      image: "/api/placeholder/600/400",
      attendees: 2456,
      capacity: 5000,
      price: "paid",
      priceAmount: 799,
      visibility: "public",
      tags: ["Conference", "Networking", "Industry"],
      isAttending: false,
      featured: true
    },
    {
      id: "6",
      title: "Community Networking Mixer",
      description: "Free networking event for production professionals! Meet colleagues, share experiences, and build connections in a relaxed atmosphere. Refreshments provided.",
      organizer: "Local Production Guild",
      organizerImage: "/api/placeholder/40/40",
      category: "networking",
      date: "2024-10-25",
      time: "18:00",
      venue: "The Production Loft",
      location: "Chicago, IL",
      image: "/api/placeholder/600/400",
      attendees: 87,
      capacity: 150,
      price: "free",
      visibility: "public",
      tags: ["Networking", "Community", "Social"],
      isInterested: true
    },
    {
      id: "7",
      title: "Jazz in the Park Series",
      description: "Weekly outdoor jazz performances featuring local and touring artists. Bring a blanket, enjoy great music, and support the arts in our community!",
      organizer: "City Arts Council",
      organizerImage: "/api/placeholder/40/40",
      category: "concert",
      date: "2024-10-30",
      time: "17:00",
      venue: "Central Park",
      location: "Denver, CO",
      image: "/api/placeholder/600/400",
      attendees: 234,
      capacity: 1000,
      price: "free",
      visibility: "public",
      tags: ["Jazz", "Outdoor", "Community"],
      isAttending: false
    },
    {
      id: "8",
      title: "Audio Engineering Masterclass",
      description: "Learn from Grammy-winning audio engineers! This intensive masterclass covers mixing, mastering, and advanced techniques. Includes hands-on session time.",
      organizer: "Sound Academy Pro",
      organizerImage: "/api/placeholder/40/40",
      category: "workshop",
      date: "2024-11-12",
      time: "10:00",
      endDate: "2024-11-13",
      venue: "Recording Studio Complex",
      location: "Nashville, TN",
      image: "/api/placeholder/600/400",
      attendees: 28,
      capacity: 30,
      price: "paid",
      priceAmount: 1299,
      visibility: "public",
      tags: ["Audio", "Education", "Masterclass"],
      isAttending: false
    }
  ])

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
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Upcoming</div>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
            <p className="text-xs text-muted-foreground">Public events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Attending</div>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendingCount}</div>
            <p className="text-xs text-muted-foreground">Your events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Interested</div>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter(e => e.isInterested).length}
            </div>
            <p className="text-xs text-muted-foreground">Saved events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Featured</div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter(e => e.featured).length}
            </div>
            <p className="text-xs text-muted-foreground">Highlighted</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardContent className="pt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events by title, location, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as any)}>
              <TabsList className="w-full grid grid-cols-4 lg:grid-cols-7">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="concert">Concert</TabsTrigger>
                <TabsTrigger value="festival">Festival</TabsTrigger>
                <TabsTrigger value="theater">Theater</TabsTrigger>
                <TabsTrigger value="conference">Conference</TabsTrigger>
                <TabsTrigger value="workshop">Workshop</TabsTrigger>
                <TabsTrigger value="networking">Network</TabsTrigger>
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
                className="w-full mt-2"
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
            <CardContent className="py-12 text-center">
              <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No events found matching your criteria</p>
            </CardContent>
          </Card>
        ) : (
          filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="md:flex">
                  {/* Event Image */}
                  {event.image && (
                    <div className="md:w-80 h-56 relative flex-shrink-0">
                      <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${event.image})` }}
                      />
                      {event.featured && (
                        <Badge className="absolute top-3 left-3 bg-orange-500">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Featured
                        </Badge>
                      )}
                      {event.price === "free" && (
                        <Badge className="absolute top-3 right-3 bg-green-500">
                          FREE
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Event Details */}
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="capitalize">
                            <Music className="h-3 w-3 mr-1" />
                            {event.category}
                          </Badge>
                          <Badge variant={event.price === "free" ? "secondary" : "default"}>
                            {event.price === "free" ? "Free" : `$${event.priceAmount}`}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Organizer */}
                    <div className="flex items-center gap-2 mb-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={event.organizerImage} />
                        <AvatarFallback>{event.organizer[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{event.organizer}</span>
                    </div>

                    {/* Event Info */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
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
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.venue}, {event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>
                          {event.attendees.toLocaleString()} attending · {event.capacity.toLocaleString()} capacity
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {event.isAttending ? (
                        <Button variant="default" size="sm" disabled>
                          <Ticket className="h-4 w-4 mr-2" />
                          Attending
                        </Button>
                      ) : (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleAttend(event.id)}
                        >
                          <Ticket className="h-4 w-4 mr-2" />
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
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Details
                      </Button>
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
