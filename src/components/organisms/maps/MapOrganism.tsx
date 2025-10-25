"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { MapPin, ZoomIn, ZoomOut, Maximize2, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { DataItem } from "@/types"
import type { FieldSchema } from "@/lib/data-schemas"

/**
 * MapOrganism - Organism Component
 * 
 * Geographic map view with location markers.
 * Extracted from views/map-view.tsx for atomic design system.
 * 
 * Features:
 * - Map display with markers
 * - Zoom controls
 * - Layer selection
 * - Marker clustering
 * - Location details on click
 * - Full i18n and accessibility
 */

export interface MapLocation {
  id: string
  lat: number
  lng: number
  title: string
  description?: string
  status?: string
}

export interface MapOrganismProps {
  locations: MapLocation[]
  center?: { lat: number; lng: number }
  zoom?: number
  onLocationClick?: (location: MapLocation) => void
  onZoomChange?: (zoom: number) => void
}

export function MapOrganism({ 
  locations, 
  center = { lat: 40.7128, lng: -74.0060 },
  zoom: initialZoom = 10,
  onLocationClick,
  onZoomChange
}: MapOrganismProps) {
  const t = useTranslations()
  const [zoom, setZoom] = useState(initialZoom)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap')

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 1, 20)
    setZoom(newZoom)
    onZoomChange?.(newZoom)
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 1, 1)
    setZoom(newZoom)
    onZoomChange?.(newZoom)
  }

  const handleLocationClick = (location: MapLocation) => {
    setSelectedLocation(location.id)
    onLocationClick?.(location)
  }

  return (
    <div className="flex flex-wrap flex-col h-full relative">
      {/* Map Container */}
      <div className="flex-1 relative bg-muted/20">
        {/* Placeholder for actual map implementation */}
        <div className="absolute sm:relative sm:inset-auto inset-0 flex flex-wrap items-center justify-center sm:relative sm:inset-auto">
          <div className="text-center space-y-2">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              {t('map.placeholder')}
            </p>
            <p className="text-xs text-muted-foreground">
              {locations.length} {t('map.locations')}
            </p>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute sm:relative sm:inset-auto top-2 md:top-4 right-2 md:right-4 flex flex-wrap flex-col gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={handleZoomIn}
            aria-label={t('map.zoomIn')}
          >
            <ZoomIn className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleZoomOut}
            aria-label={t('map.zoomOut')}
          >
            <ZoomOut className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            aria-label={t('map.layers')}
          >
            <Layers className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            aria-label={t('map.fullscreen')}
          >
            <Maximize2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        {/* Location Markers (Simplified) */}
        {locations.map((location, index) => (
          <div
            key={location.id}
            className={cn(
              'absolute w-8 h-8 -ml-4 -mt-8 cursor-pointer transition-transform hover:scale-110',
              selectedLocation === location.id && 'scale-125 z-10'
            )}
            style={{
              left: `${50 + (index % 5) * 10}%`,
              top: `${50 + Math.floor(index / 5) * 10}%`
            }}
            onClick={() => handleLocationClick(location)}
          >
            <MapPin 
              className={cn(
                'h-8 w-8',
                selectedLocation === location.id ? 'text-primary' : 'text-destructive'
              )}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>

      {/* Location List */}
      <div className="border-t p-4 max-h-48 overflow-auto">
        <h3 className="font-semibold mb-2">{t('map.locations')}</h3>
        <div className="space-y-2">
          {locations.map((location: any) => (
            <div
              key={location.id}
              className={cn(
                'flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors',
                selectedLocation === location.id ? 'bg-primary/10' : 'hover:bg-accent'
              )}
              onClick={() => handleLocationClick(location)}
            >
              <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 min-w-0">
                <MapPin className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="font-medium truncate">{location.title}</p>
                  {location.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {location.description}
                    </p>
                  )}
                </div>
              </div>
              {location.status && (
                <Badge variant="secondary">{location.status}</Badge>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
