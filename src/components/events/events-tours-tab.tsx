"use client"

import { useTranslations } from 'next-intl'
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MapPin, Calendar, Plane, Hotel, Truck, DollarSign, Users, Clock, Plus, Download, Navigation } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { useModuleData } from "@/hooks/use-module-data"
import type { TabComponentProps } from "@/types"

export function EventsToursTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const t = useTranslations('production.events.tours')
  const tCommon = useTranslations('common')
  const { data: tourStops, loading } = useModuleData(workspaceId, 'events', 'tours')
  const [selectedStop, setSelectedStop] = useState<any>(null)

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400'
      case 'tentative': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400'
    }
  }

  const totalShows = tourStops.filter((s: any) => s.type === 'show').length
  const totalTravelDays = tourStops.filter((s: any) => s.type === 'travel').length
  const totalBudget = tourStops.reduce((sum: number, s: any) => sum + (Number(s.budget) || 0), 0)
  const completedStops = tourStops.filter((s: any) => s.status === 'completed').length

  return (
    <main role="main" aria-label={t('title')}>
      <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shows</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShows as any}</div>
            <p className="text-xs text-muted-foreground">
              {completedStops} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Travel Days</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTravelDays as any}</div>
            <p className="text-xs text-muted-foreground">Between venues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-muted-foreground">Across all stops</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tourStops.length > 0 ? Math.round((completedStops / tourStops.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Tour completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Tour Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Tour Route & Timeline</CardTitle>
          <CardDescription>City-by-city schedule with travel days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
            
            {/* Tour stops */}
            <div className="space-y-6">
              {tourStops.map((stop: any, index: number) => {
                const isShow = stop.type === 'show'
                const isTravel = stop.type === 'travel'
                
                return (
                  <div key={stop.id} className="relative pl-16">
                    {/* Timeline dot */}
                    <div className={`absolute left-6 w-5 h-5 rounded-full border-4 border-background ${
                      isShow ? 'bg-primary' : 'bg-muted-foreground'
                    }`} />
                    
                    <Card 
                      className={`cursor-pointer transition-shadow hover:shadow-lg ${
                        selectedStop?.id === stop.id ? 'border-primary border-2' : ''
                      }`}
                      onClick={() => setSelectedStop(stop)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-3">
                              {isShow ? (
                                <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                              ) : (
                                <Truck className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                              )}
                              <div>
                                <h3 className="font-semibold text-lg">{stop.city}, {stop.state || stop.country}</h3>
                                <p className="text-sm text-muted-foreground">{stop.venue_name}</p>
                              </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid gap-3 md:grid-cols-3">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                                <span>{formatDate(stop.date)}</span>
                              </div>
                              
                              {stop.load_in_time && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                                  <span>{t('loadIn')}: {stop.load_in_time}</span>
                                </div>
                              )}
                              
                              {stop.capacity && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                                  <span>{t('capacity')}: {stop.capacity.toLocaleString()}</span>
                                </div>
                              )}
                              
                              {stop.distance_from_previous && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Navigation className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                                  <span>{stop.distance_from_previous} {t('miles')}</span>
                                </div>
                              )}
                              
                              {stop.hotel && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Hotel className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                                  <span>{stop.hotel}</span>
                                </div>
                              )}
                              
                              {stop.budget && (
                                <div className="flex items-center gap-2 text-sm">
                                  <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                                  <span>{formatCurrency(stop.budget)}</span>
                                </div>
                              )}
                            </div>

                            {/* Tags and Status */}
                            <div className="flex items-center gap-2 mt-3">
                              <Badge className={getStatusColor(stop.status)}>
                                {stop.status}
                              </Badge>
                              {isShow && (
                                <Badge variant="outline">{t('showDay')}</Badge>
                              )}
                              {isTravel && (
                                <Badge variant="outline">{t('travelDay')}</Badge>
                              )}
                              {stop.is_festival && (
                                <Badge variant="secondary">{t('festival')}</Badge>
                              )}
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex flex-col gap-2">
                            <Button variant="outline" size="sm">
                              {t('details')}
                            </Button>
                            {isShow && (
                              <Button variant="ghost" size="sm">
                                {t('runOfShow')}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Stop Details */}
      {selectedStop && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>{t('stopDetails')}: {selectedStop.city}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">{t('venueInformation')}</h4>
                <div className="space-y-1 text-sm">
                  <div><span className="text-muted-foreground">{t('name')}:</span> {selectedStop.venue_name}</div>
                  <div><span className="text-muted-foreground">{t('address')}:</span> {selectedStop.venue_address}</div>
                  <div><span className="text-muted-foreground">{t('capacity')}:</span> {selectedStop.capacity?.toLocaleString()}</div>
                  <div><span className="text-muted-foreground">{t('contact')}:</span> {selectedStop.venue_contact}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">{t('logistics')}</h4>
                <div className="space-y-1 text-sm">
                  <div><span className="text-muted-foreground">{t('loadIn')}:</span> {selectedStop.load_in_time}</div>
                  <div><span className="text-muted-foreground">{t('soundCheck')}:</span> {selectedStop.sound_check_time}</div>
                  <div><span className="text-muted-foreground">{t('doors')}:</span> {selectedStop.doors_time}</div>
                  <div><span className="text-muted-foreground">Show Time:</span> {selectedStop.show_time}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Accommodation</h4>
                <div className="space-y-1 text-sm">
                  <div><span className="text-muted-foreground">Hotel:</span> {selectedStop.hotel}</div>
                  <div><span className="text-muted-foreground">Check-in:</span> {selectedStop.hotel_checkin}</div>
                  <div><span className="text-muted-foreground">Check-out:</span> {selectedStop.hotel_checkout}</div>
                  <div><span className="text-muted-foreground">Rooms:</span> {selectedStop.rooms_booked}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Notes</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedStop.notes || t('noAdditionalNotes')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {tourStops.length === 0 && (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              variant="inline"
              icon={MapPin}
              mainMessage="NOTHING TO SEE HERE... (YET)"
              description="Create your first tour stop to start planning your route"
              actionLabel="Add Tour Stop"
              onAction={() => {}}
            />
          </CardContent>
        </Card>
      )}
    </div>
    </main>
  )
}
