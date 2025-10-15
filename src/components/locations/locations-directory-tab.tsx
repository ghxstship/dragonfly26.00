"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  MapPin,
  Building,
  Warehouse,
  Home,
  Plus,
  Filter,
  Search,
  Navigation,
  Phone,
  Mail,
  Globe,
  Map as MapIcon
} from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { useModuleData } from "@/hooks/use-module-data"
import type { TabComponentProps } from "@/types"

export function LocationsDirectoryTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const { data: locations, loading } = useModuleData(workspaceId, 'locations', 'directory')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading locations...</p>
        </div>
      </div>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'venue': return Building
      case 'warehouse': return Warehouse
      case 'office': return Home
      default: return MapPin
    }
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'venue': 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400',
      'warehouse': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400',
      'office': 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
      'studio': 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-400',
      'outdoor': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
    }
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400'
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400'
    }
  }

  const filteredLocations = locations.filter((location: any) =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.city?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Venues, offices, warehouses, rooms, and facilities
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <MapIcon className="h-4 w-4 mr-2" />
            Map View
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locations.length}</div>
            <p className="text-xs text-muted-foreground">
              {locations.filter((l: any) => l.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Venues</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {locations.filter((l: any) => l.type === 'venue').length}
            </div>
            <p className="text-xs text-muted-foreground">Event spaces</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warehouses</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {locations.filter((l: any) => l.type === 'warehouse').length}
            </div>
            <p className="text-xs text-muted-foreground">Storage facilities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offices</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {locations.filter((l: any) => l.type === 'office').length}
            </div>
            <p className="text-xs text-muted-foreground">Office spaces</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search locations, addresses, cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredLocations.map((location: any) => {
          const TypeIcon = getTypeIcon(location.type)

          return (
            <Card key={location.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <TypeIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg line-clamp-1">{location.name}</CardTitle>
                      {location.code && (
                        <CardDescription className="mt-1">{location.code}</CardDescription>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge className={getTypeColor(location.type)}>
                    {location.type}
                  </Badge>
                  <Badge className={getStatusColor(location.status)}>
                    {location.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Address */}
                {location.address && (
                  <div className="flex items-start gap-2 text-sm">
                    <Navigation className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div>{location.address}</div>
                      {(location.city || location.state || location.zip) && (
                        <div className="text-muted-foreground">
                          {[location.city, location.state, location.zip].filter(Boolean).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                {location.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>{location.phone}</span>
                  </div>
                )}

                {location.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{location.email}</span>
                  </div>
                )}

                {location.website && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4 flex-shrink-0" />
                    <a 
                      href={location.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="truncate hover:text-primary"
                    >
                      {location.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}

                {/* Capacity/Size */}
                {(location.capacity || location.square_feet) && (
                  <div className="flex justify-between pt-2 border-t text-sm">
                    {location.capacity && (
                      <div>
                        <div className="text-muted-foreground">Capacity</div>
                        <div className="font-medium">{location.capacity}</div>
                      </div>
                    )}
                    {location.square_feet && (
                      <div>
                        <div className="text-muted-foreground">Size</div>
                        <div className="font-medium">{location.square_feet.toLocaleString()} sq ft</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Amenities */}
                {location.amenities && location.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {location.amenities.slice(0, 3).map((amenity: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {location.amenities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{location.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MapIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredLocations.length === 0 && (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              variant="inline"
              icon={MapPin}
              mainMessage={searchQuery ? "No locations found" : "NOTHING TO SEE HERE... (YET)"}
              description={searchQuery ? "Try adjusting your search criteria" : "Add your first location to get started"}
              actionLabel={!searchQuery ? "Add Location" : undefined}
              onAction={!searchQuery ? () => {} : undefined}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
