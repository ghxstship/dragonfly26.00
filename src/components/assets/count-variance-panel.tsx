"use client"

import { useTranslations } from 'next-intl'
import { AlertTriangle, CheckCircle, Image as ImageIcon, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

interface CountVariancePanelProps {
  countId: string
  variances: Array<{
    id: string
    item_name: string
    expected_quantity: number
    counted_quantity: number
    variance: number
    variance_percentage: number
    photos: string[]
  }>
  onAccept: (lineItemId: string, reason: string) => void
  onRecount: (lineItemId: string) => void
  onAcceptAll: () => void
}

export function CountVariancePanel({ countId, variances, onAccept, onRecount, onAcceptAll }: CountVariancePanelProps) {
  const t = useTranslations('production.assets')
  if (variances.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Variances Found</h3>
        <p className="text-muted-foreground">All counted quantities match expected values</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Variance Review</h3>
          <p className="text-sm text-muted-foreground">
            {variances.length} item{variances.length !== 1 ? 's' : ''} with discrepancies
          </p>
        </div>
        <Button onClick={onAcceptAll}>
          Accept All & Adjust Stock
        </Button>
      </div>

      <Separator />

      {/* Variance List */}
      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {variances.map((variance) => (
            <Card key={variance.id} className="p-4">
              <div className="space-y-4">
                {/* Item Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{variance.item_name}</h4>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Expected:</span>
                        <span className="ml-2 font-medium">{variance.expected_quantity}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Counted:</span>
                        <span className="ml-2 font-medium">{variance.counted_quantity}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Variance:</span>
                        <Badge variant={variance.variance < 0 ? "destructive" : "default"} className="ml-2">
                          {variance.variance > 0 ? '+' : ''}{variance.variance} ({variance.variance_percentage.toFixed(1)}%)
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                </div>

                {/* Photos from count */}
                {variance.photos && variance.photos.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Photos from count:</p>
                    <div className="flex gap-2">
                      {variance.photos.map((photo, idx) => (
                        <div key={idx} className="relative w-20 h-20 rounded border bg-muted">
                          <ImageIcon className="absolute inset-0 m-auto h-8 w-8 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Possible Reasons */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Possible reason:</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t('assets.variance.selectReason')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lost">Lost/Missing</SelectItem>
                      <SelectItem value="damaged">Damaged</SelectItem>
                      <SelectItem value="stolen">Stolen</SelectItem>
                      <SelectItem value="miscounted">Miscounted</SelectItem>
                      <SelectItem value="transferred">Transferred (not recorded)</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => onAccept(variance.id, 'accepted')}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept & Adjust Stock
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onRecount(variance.id)}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Recount
                  </Button>
                  <Button variant="ghost" size="sm">
                    Investigate
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
