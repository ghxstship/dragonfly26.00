"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Play, Pause, Square } from "lucide-react"

export function TimeTracker() {
  const t = useTranslations()
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [manualTime, setManualTime] = useState("")

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleStop = () => {
    setIsRunning(false)
    setTime(0)
  }

  return (
    <div className="space-y-4">
      {/* Timer Display */}
      <div className="text-center">
        <div className="text-3xl font-mono font-bold">{formatTime(time)}</div>
      </div>

      {/* Timer Controls */}
      <div className="flex gap-2 justify-center">
        {!isRunning ? (
          <Button onClick={handleStart} className="gap-2">
            <Play className="h-4 w-4" />
            Start
          </Button>
        ) : (
          <Button onClick={handlePause} variant="secondary" className="gap-2">
            <Pause className="h-4 w-4" />
            Pause
          </Button>
        )}
        <Button onClick={handleStop} variant="outline" className="gap-2">
          <Square className="h-4 w-4" />
          Stop
        </Button>
      </div>

      {/* Manual Entry */}
      <div className="border-t pt-4">
        <label className="text-sm font-medium mb-2 block">Manual Entry</label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g., 2h 30m"
            value={manualTime}
            onChange={(e) => setManualTime(e.target.value)}
          />
          <Button variant="outline">Add</Button>
        </div>
      </div>

      {/* Time Entries */}
      <div className="border-t pt-4">
        <label className="text-sm font-medium mb-2 block">Time Entries</label>
        <div className="text-sm text-muted-foreground">
          No time entries yet
        </div>
      </div>
    </div>
  )
}
