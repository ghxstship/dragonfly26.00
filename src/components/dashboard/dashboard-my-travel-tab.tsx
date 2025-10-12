"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Plane,
  Hotel,
  Car,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Plus,
  CheckCircle2,
  AlertCircle
} from "lucide-react"

export function DashboardMyTravelTab() {
  // User's travel arrangements and itineraries
  const travels = [
    {
      id: "TRV-2024-001",
      title: "Site Survey - Theater Revival",
      project: "Theater Revival",
      destination: "Los Angeles, CA",
      departureDate: "Oct 18, 2024",
      returnDate: "Oct 20, 2024",
      status: "confirmed",
      type: "Site Visit",
      flights: {
        departure: "JFK → LAX • AA 123 • 9:00 AM",
        return: "LAX → JFK • AA 456 • 6:00 PM",
        cost: "$450",
      },
      hotel: {
        name: "Marriott Downtown LA",
        checkIn: "Oct 18, 3:00 PM",
        checkOut: "Oct 20, 11:00 AM",
        cost: "$320",
      },
      groundTransport: {
        type: "Rental Car",
        details: "Economy • Enterprise",
        cost: "$120",
      },
      totalCost: "$890",
      purpose: "Technical site survey and venue assessment",
    },
    {
      id: "TRV-2024-002",
      title: "Load-In Supervision - Festival",
      project: "Summer Music Festival",
      destination: "Nashville, TN",
      departureDate: "Oct 25, 2024",
      returnDate: "Oct 28, 2024",
      status: "confirmed",
      type: "Production",
      flights: {
        departure: "JFK → BNA • DL 789 • 7:30 AM",
        return: "BNA → JFK • DL 101 • 8:15 PM",
        cost: "$380",
      },
      hotel: {
        name: "Hilton Nashville Downtown",
        checkIn: "Oct 25, 2:00 PM",
        checkOut: "Oct 28, 12:00 PM",
        cost: "$450",
      },
      groundTransport: {
        type: "Uber/Lyft",
        details: "As needed",
        cost: "$80",
      },
      totalCost: "$910",
      purpose: "Oversee load-in and equipment setup",
    },
    {
      id: "TRV-2024-003",
      title: "Client Meeting - Corporate Gala",
      project: "Corporate Gala",
      destination: "Boston, MA",
      departureDate: "Nov 5, 2024",
      returnDate: "Nov 5, 2024",
      status: "pending",
      type: "Meeting",
      flights: {
        departure: "JFK → BOS • B6 234 • 8:00 AM",
        return: "BOS → JFK • B6 567 • 7:00 PM",
        cost: "$220",
      },
      hotel: null,
      groundTransport: {
        type: "Taxi",
        details: "Airport to venue",
        cost: "$60",
      },
      totalCost: "$280",
      purpose: "Final planning meeting with client",
    },
    {
      id: "TRV-2024-004",
      title: "Equipment Pickup - Multi-City",
      project: "Concert Series",
      destination: "Chicago, IL",
      departureDate: "Nov 12, 2024",
      returnDate: "Nov 14, 2024",
      status: "pending",
      type: "Logistics",
      flights: {
        departure: "JFK → ORD • UA 890 • 10:00 AM",
        return: "ORD → JFK • UA 345 • 5:30 PM",
        cost: "$340",
      },
      hotel: {
        name: "Hampton Inn O'Hare",
        checkIn: "Nov 12, 3:00 PM",
        checkOut: "Nov 14, 11:00 AM",
        cost: "$280",
      },
      groundTransport: {
        type: "Rental Truck",
        details: "Box Truck • U-Haul",
        cost: "$200",
      },
      totalCost: "$820",
      purpose: "Pick up specialized equipment from vendor",
    },
  ]

  const summary = {
    upcomingTrips: 4,
    confirmed: 2,
    pending: 2,
    totalCost: "$2,900",
    daysAway: 28,
    thisYear: 18,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Production":
        return "text-purple-600"
      case "Site Visit":
        return "text-blue-600"
      case "Meeting":
        return "text-green-600"
      case "Logistics":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Book Travel
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{summary.upcomingTrips}</p>
              <p className="text-xs text-muted-foreground mt-1">Upcoming Trips</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{summary.confirmed}</p>
              <p className="text-xs text-muted-foreground mt-1">Confirmed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{summary.totalCost}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Cost</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{summary.daysAway}</p>
              <p className="text-xs text-muted-foreground mt-1">Days Away This Year</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Travel List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upcoming Travel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {travels.map((travel) => (
              <div
                key={travel.id}
                className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{travel.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{travel.project}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">{travel.totalCost}</p>
                      <Badge variant="secondary" className={getStatusColor(travel.status)}>
                        {travel.status === "confirmed" ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {travel.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Destination & Dates */}
                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {travel.destination}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {travel.departureDate} - {travel.returnDate}
                    </div>
                    <Badge variant="outline" className={getTypeColor(travel.type)}>
                      {travel.type}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">{travel.purpose}</p>

                  {/* Travel Details */}
                  <div className="space-y-2 pt-2 border-t">
                    {/* Flights */}
                    <div className="flex items-start gap-2">
                      <Plane className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Flights</p>
                          <p className="text-sm text-muted-foreground">{travel.flights.cost}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{travel.flights.departure}</p>
                        <p className="text-xs text-muted-foreground">{travel.flights.return}</p>
                      </div>
                    </div>

                    {/* Hotel */}
                    {travel.hotel && (
                      <div className="flex items-start gap-2">
                        <Hotel className="h-4 w-4 text-purple-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{travel.hotel.name}</p>
                            <p className="text-sm text-muted-foreground">{travel.hotel.cost}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Check-in: {travel.hotel.checkIn} • Check-out: {travel.hotel.checkOut}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Ground Transport */}
                    <div className="flex items-start gap-2">
                      <Car className="h-4 w-4 text-orange-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{travel.groundTransport.type}</p>
                          <p className="text-sm text-muted-foreground">{travel.groundTransport.cost}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{travel.groundTransport.details}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Travel Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Travel Statistics This Year</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <p className="text-2xl font-bold">{summary.thisYear}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Trips</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-2xl font-bold">{summary.daysAway}</p>
              <p className="text-xs text-muted-foreground mt-1">Days Away</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-2xl font-bold">$14.2k</p>
              <p className="text-xs text-muted-foreground mt-1">Total Spent</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
