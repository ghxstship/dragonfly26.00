"use client"

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plane, Hotel, Car, MapPin, Calendar, Clock, DollarSign, Plus, CheckCircle2, AlertCircle } from "lucide-react"
import { useMyTravel } from "@/hooks/use-dashboard-data"
import { useRouter } from "@/i18n/navigation"
import type { DashboardTabProps } from "@/lib/dashboard-tab-components"

export function DashboardMyTravelTab({ workspaceId = '', userId = '' }: DashboardTabProps) {
  const router = useRouter()
  const t = useTranslations('dashboard.my-travel')
  const tCommon = useTranslations('common')
  const { travels, loading } = useMyTravel(workspaceId, userId)
  

  
  const travelsList = travels.map(travel => ({
    id: travel.id,
    title: travel.title || 'Travel',
    destination: travel.destination || 'TBD',
    departureDate: new Date(travel.departure_date).toLocaleDateString(),
    returnDate: new Date(travel.return_date).toLocaleDateString(),
    status: travel.status || 'pending',
    type: travel.type || 'Other',
    purpose: travel.purpose || '',
    totalCost: `$${travel.total_cost || 0}`,
    flights: travel.flight_details || {},
    hotel: travel.hotel_details,
    groundTransport: travel.ground_transport || {},
    project: travel.production?.name || 'No Project',
  }))
  
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
    <main role="main" aria-label={t('title')}>
      <div className="space-y-6">
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
              <p className="text-xs text-muted-foreground mt-1">{t('confirmed')}</p>
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
            {travelsList.map((travel) => (
              <div
                key={travel.id}
                className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                onClick={() => console.log('Travel details:', travel.id)}
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
                          <CheckCircle2 className="h-4 w-4 mr-1" aria-hidden="true" />
                        ) : (
                          <AlertCircle className="h-4 w-4 mr-1" aria-hidden="true" />
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
                      <Plane className="h-4 w-4 text-blue-600 mt-0.5" aria-hidden="true" />
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
                        <Hotel className="h-4 w-4 text-purple-600 mt-0.5" aria-hidden="true" />
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
                      <Car className="h-4 w-4 text-orange-600 mt-0.5" aria-hidden="true" />
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
    </main>
  )
}
