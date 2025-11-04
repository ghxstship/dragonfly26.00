"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, 
  Play, 
  Square, 
  MapPin, 
  CheckCircle2,
  AlertCircle,
  QrCode
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TimeClockWidgetProps {
  employeeName: string
  isClockedIn: boolean
  currentShift?: {
    startTime: string
    endTime: string
    location?: string
  }
  todayHours: number
  weekHours: number
  location?: {
    name: string
    withinGeofence: boolean
  }
  onClockIn?: () => void
  onClockOut?: () => void
  onQRScan?: () => void
  showQROption?: boolean
}

export function TimeClockWidget({
  employeeName,
  isClockedIn,
  currentShift,
  todayHours,
  weekHours,
  location,
  onClockIn,
  onClockOut,
  onQRScan,
  showQROption = true
}: TimeClockWidgetProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleClockAction = async () => {
    setIsProcessing(true)
    try {
      if (isClockedIn) {
        await onClockOut?.()
      } else {
        await onClockIn?.()
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="w-full max-w-full">
      <CardHeader>
        <CardTitle className="flex flex-wrap flex-col md:flex-row items-center gap-2">
          <Clock className="h-5 w-5" />
          Time Clock
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Greeting */}
        <div>
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <p className="font-medium">{employeeName}!</p>
        </div>

        {/* Status */}
        <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between p-3 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium">Status:</span>
          <Badge 
            variant={isClockedIn ? "default" : "outline"}
            className={cn(
              isClockedIn && "bg-green-500 hover:bg-green-600"
            )}
          >
            {isClockedIn ? (
              <>
                <Play className="h-3 w-3 mr-1" />
                Clocked In
              </>
            ) : (
              <>
                <Square className="h-3 w-3 mr-1" />
                Clocked Out
              </>
            )}
          </Badge>
        </div>

        {/* Clock In/Out Buttons */}
        <div className="space-y-2">
          <Button 
            className="w-full h-12 text-lg font-medium max-w-full"
            variant={isClockedIn ? "destructive" : "default"}
            onClick={handleClockAction}
            disabled={isProcessing}
          >
            {isProcessing ? (
              "Processing..."
            ) : isClockedIn ? (
              <>
                <Square className="h-5 w-5 mr-2" />
                Clock Out
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Clock In
              </>
            )}
          </Button>

          {showQROption && onQRScan && (
            <Button 
              variant="outline" 
              className="w-full max-w-full"
              onClick={onQRScan}
              disabled={isProcessing}
            >
              <QrCode className="h-4 w-4 mr-2" />
              Scan QR Code
            </Button>
          )}
        </div>

        {/* Location Info */}
        {location && (
          <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Location</p>
              <p className="text-sm text-muted-foreground truncate">
                {location.name}
              </p>
              <div className="flex flex-wrap flex-col md:flex-row items-center gap-1 mt-1">
                {location.withinGeofence ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                    <span className="text-xs text-green-600">Within geofence</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs text-yellow-600">Outside geofence</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Current Shift Info */}
        {currentShift && (
          <div className="p-3 border rounded-lg">
            <p className="text-xs text-muted-foreground font-medium mb-2">
              Current Shift
            </p>
            <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
              <span className="text-sm">{currentShift.startTime} - {currentShift.endTime}</span>
              {currentShift.location && (
                <Badge variant="outline" className="text-xs">
                  {currentShift.location}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Hours Summary */}
        <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Today</p>
            <p className="text-lg font-bold">{todayHours.toFixed(1)} hrs</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">This Week</p>
            <p className="text-lg font-bold">{weekHours.toFixed(1)} hrs</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Compact version for sidebar
export function TimeClockWidgetCompact({
  isClockedIn,
  todayHours,
  onClockIn,
  onClockOut
}: Pick<TimeClockWidgetProps, "isClockedIn" | "todayHours" | "onClockIn" | "onClockOut">) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleClockAction = async () => {
    setIsProcessing(true)
    try {
      if (isClockedIn) {
        await onClockOut?.()
      } else {
        await onClockIn?.()
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="p-4 bg-card border rounded-lg space-y-3">
      <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="font-medium text-sm">Time Clock</span>
        </div>
        <Badge 
          variant={isClockedIn ? "default" : "outline"}
          className={cn(
            "text-xs",
            isClockedIn && "bg-green-500"
          )}
        >
          {isClockedIn ? "In" : "Out"}
        </Badge>
      </div>

      <Button 
        className="w-full max-w-full"
        size="sm"
        variant={isClockedIn ? "destructive" : "default"}
        onClick={handleClockAction}
        disabled={isProcessing}
      >
        {isClockedIn ? "Clock Out" : "Clock In"}
      </Button>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">Today</p>
        <p className="text-lg font-bold">{todayHours.toFixed(1)} hrs</p>
      </div>
    </div>
  )
}
