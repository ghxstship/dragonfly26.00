"use client"

import { useTranslations } from 'next-intl'
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Map,
  ZoomIn,
  ZoomOut,
  Layers,
  MapPin,
  Zap,
  Wifi,
  Square,
  Download,
  Upload,
  Maximize2,
  Plus
} from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { useModuleData } from "@/hooks/use-module-data"
import type { TabComponentProps } from "@/types"

export function LocationsSiteMapsTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const t = useTranslations('production.locations.site_maps')
  const tCommon = useTranslations('common')
  const { data: siteMaps, loading } = useModuleData(workspaceId, 'locations', 'site-maps')
  const [selectedMap, setSelectedMap] = useState<any>(null)
  const [activeLayers, setActiveLayers] = useState<string[]>(['floor-plan'])
  const [zoom, setZoom] = useState(100)

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

  const toggleLayer = (layer: string) => {
    setActiveLayers(prev =>
      prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
    )
  }

  const layers = [
    { id: 'floor-plan', name: 'Floor Plan', icon: Square, color: 'text-blue-600' },
    { id: 'power', name: 'Power', icon: Zap, color: 'text-yellow-600' },
    { id: 'network', name: 'Network', icon: Wifi, color: 'text-purple-600' },
    { id: 'assets', name: 'Assets', icon: MapPin, color: 'text-green-600' },
  ]

  const zones = selectedMap?.zones || []
  const connections = selectedMap?.connections || []

  return (
    <main role="main" aria-label={t('title')}>
      <div className="space-y-6">
      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Site maps and layouts
        </p>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Create
        </Button>
      </div>


      {/* Actions */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Interactive floor plans and facility layouts
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
            Upload Map
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" aria-hidden="true" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Map List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Available Maps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {siteMaps.map((map: any) => (
                <button
                  key={map.id}
                  onClick={() => setSelectedMap(map)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedMap?.id === map.id
                      ? 'border-primary bg-primary/10'
                      : 'hover:bg-accent'
                  }`}
                >
                  <div className="font-medium text-sm">{map.name}</div>
                  <div className="text-xs text-muted-foreground">{map.location}</div>
                  {map.floor && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      Floor {map.floor}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Map Viewer */}
        <Card className="md:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedMap?.name || 'Select a map'}</CardTitle>
                <CardDescription>{selectedMap?.location}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setZoom(Math.max(50, zoom - 10))}>
                  <ZoomOut className="h-4 w-4" aria-hidden="true" />
                </Button>
                <span className="text-sm text-muted-foreground w-12 text-center">{zoom}%</span>
                <Button variant="outline" size="icon" onClick={() => setZoom(Math.min(200, zoom + 10))}>
                  <ZoomIn className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button variant="outline" size="icon">
                  <Maximize2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedMap ? (
              <div className="space-y-4">
                {/* Map Display Area */}
                <div 
                  className="border-2 border-dashed rounded-lg bg-gray-50 dark:bg-gray-900 p-8 min-h-[500px] relative overflow-auto"
                  style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
                >
                  {/* Placeholder for actual map image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Map className="h-16 w-16 mx-auto mb-4" />
                      <p>{t('mapVisualization')}</p>
                      <p className="text-sm mt-2">
                        {selectedMap.dimensions?.width} x {selectedMap.dimensions?.height} sq ft
                      </p>
                    </div>
                  </div>

                  {/* Zones (would be overlaid on actual map) */}
                  {zones.map((zone: any, index: number) => (
                    <div
                      key={zone.id}
                      className="absolute border-2 border-primary bg-primary/10 rounded flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors"
                      style={{
                        left: `${zone.x}%`,
                        top: `${zone.y}%`,
                        width: `${zone.width}%`,
                        height: `${zone.height}%`
                      }}
                      title={zone.name}
                    >
                      <span className="text-xs font-medium">{zone.name}</span>
                    </div>
                  ))}

                  {/* Power points (if layer active) */}
                  {activeLayers.includes('power') && selectedMap.power_points?.map((point: any) => (
                    <div
                      key={point.id}
                      className="absolute"
                      style={{ left: `${point.x}%`, top: `${point.y}%` }}
                    >
                      <Zap className="h-4 w-4 text-yellow-600" aria-hidden="true" />
                    </div>
                  ))}

                  {/* Network points (if layer active) */}
                  {activeLayers.includes('network') && selectedMap.network_points?.map((point: any) => (
                    <div
                      key={point.id}
                      className="absolute"
                      style={{ left: `${point.x}%`, top: `${point.y}%` }}
                    >
                      <Wifi className="h-4 w-4 text-purple-600" aria-hidden="true" />
                    </div>
                  ))}
                </div>

                {/* Map Info */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Area</div>
                    <div className="text-lg font-semibold">
                      {selectedMap.total_area?.toLocaleString()} sq ft
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Capacity</div>
                    <div className="text-lg font-semibold">
                      {selectedMap.capacity?.toLocaleString()} people
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Zones</div>
                    <div className="text-lg font-semibold">
                      {zones.length} areas
                    </div>
                  </div>
                </div>

                {/* Zones List */}
                {zones.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Zones & Areas</h4>
                    <div className="grid gap-2 md:grid-cols-2">
                      {zones.map((zone: any) => (
                        <div key={zone.id} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm font-medium">{zone.name}</span>
                          <div className="flex items-center gap-2">
                            {zone.capacity && (
                              <span className="text-xs text-muted-foreground">
                                {zone.capacity} cap
                              </span>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {zone.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[500px] text-muted-foreground">
                <div className="text-center">
                  <Map className="h-16 w-16 mx-auto mb-4" />
                  <p>{t('selectMap')}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Layers Panel */}
      {selectedMap && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-4 w-4" aria-hidden="true" />
              Map Layers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {layers.map((layer) => {
                const Icon = layer.icon
                const isActive = activeLayers.includes(layer.id)
                return (
                  <Button
                    key={layer.id}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleLayer(layer.id)}
                  >
                    <Icon className={`h-4 w-4 mr-2 ${layer.color}`} />
                    {layer.name}
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {siteMaps.length === 0 && (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              variant="inline"
              icon={Map}
              mainMessage="NOTHING TO SEE HERE... (YET)"
              description="Upload site maps and floor plans for your locations"
              actionLabel="Upload Site Map"
              onAction={() => {}}
            />
          </CardContent>
        </Card>
      )}
    </div>
    </main>
  )
}
