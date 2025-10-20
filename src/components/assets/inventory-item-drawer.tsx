"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Edit, Trash2, QrCode, Tag, Clock, TrendingUp, Package, MapPin, Calendar } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface InventoryItemDrawerProps {
  item: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: () => void
  onDelete: () => void
  onAdjustStock: () => void
}

export function InventoryItemDrawer({ item, open, onOpenChange, onEdit, onDelete, onAdjustStock }: InventoryItemDrawerProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  if (!item) return null

  const photos = item.photos || []
  const hasPhotos = photos.length > 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 pb-4 border-b">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <SheetTitle className="text-2xl">{item.name}</SheetTitle>
                <p className="text-sm text-muted-foreground mt-1">SKU: {item.sku || 'N/A'}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {/* Photo Gallery */}
              {hasPhotos && (
                <div className="space-y-2">
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                    <Image
                      src={photos[currentPhotoIndex]}
                      alt={`${item.name} - Photo ${currentPhotoIndex + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {photos.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {photos.map((photo: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentPhotoIndex(idx)}
                          className={`relative w-16 h-16 rounded border-2 transition-all ${
                            idx === currentPhotoIndex ? 'border-primary' : 'border-transparent'
                          }`}
                        >
                          <Image src={photo} alt={`Thumbnail ${idx + 1}`} fill className="object-cover rounded" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button onClick={onAdjustStock} className="flex-1">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Adjust Stock
                </Button>
                <Button variant="outline" onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="icon">
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>

              {/* Key Info Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Stock Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{item.stock_quantity || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Low threshold: {item.low_stock_threshold || 'Not set'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Unit Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">${item.unit_cost?.toLocaleString() || '0'}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total: ${((item.unit_cost || 0) * (item.stock_quantity || 0)).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge>{item.status?.replace(/_/g, ' ')}</Badge>
              </div>

              {/* Tabs for Details */}
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <DetailRow icon={<Package />} label="Category" value={item.category || 'Uncategorized'} />
                    <DetailRow icon={<MapPin />} label="Location" value={item.folder_name || 'No location'} />
                    <DetailRow icon={<Tag />} label="Barcode" value={item.barcode || 'Not set'} />
                    <DetailRow icon={<QrCode />} label="QR Code" value={item.qr_code ? 'Generated' : 'Not generated'} />
                    <DetailRow icon={<Calendar />} label="Last Counted" value={item.last_counted_at ? new Date(item.last_counted_at).toLocaleDateString() : 'Never'} />
                  </div>

                  {item.description && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium text-sm mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </>
                  )}

                  {item.tags && item.tags.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium text-sm mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="history" className="mt-4">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">Stock movement history will appear here</p>
                    {/* Stock movements would be loaded and displayed here */}
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="mt-4">
                  <div className="space-y-3">
                    {item.notes ? (
                      <p className="text-sm">{item.notes}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">No notes yet</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>

          {/* Footer Actions */}
          <div className="border-t p-4 flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onEdit}>
              Edit Item
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-muted-foreground">{icon as any}</div>
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{value}</p>
      </div>
    </div>
  )
}
