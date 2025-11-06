"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Play, Pause, Square, Loader2, Clock, Trash2 } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/hooks-client"
import { useUIStore } from "@/store/ui-store"
import { useToast } from "@/lib/hooks/use-toast"

interface TimeEntry {
  id: string
  start_time: string
  end_time: string | null
  duration: string | null
  notes: string | null
  billable: boolean
  created_at: string
}

export function TimeTracker() {
  const t = useTranslations()
  const { toast } = useToast()
  const supabase = getSupabaseClient()
  const { currentWorkspace } = useUIStore()
  
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null)
  const [manualTime, setManualTime] = useState("")
  const [notes, setNotes] = useState("")
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    fetchUser()
  }, [supabase])

  // Fetch time entries
  useEffect(() => {
    const fetchEntries = async () => {
      if (!currentWorkspace?.id || !currentUser) return
      
      try {
        const { data, error } = await supabase
          .from('time_entries')
          .select('*')
          .eq('workspace_id', currentWorkspace.id)
          .order('created_at', { ascending: false })
          .limit(10)

        if (error) throw error
        setEntries(data || [])
      } catch (error: any) {
        console.error('Error fetching time entries:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEntries()
  }, [supabase, currentWorkspace?.id, currentUser])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isRunning && startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000)
        setTime(elapsed)
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, startTime])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatDuration = (pgInterval: string | null) => {
    if (!pgInterval) return '0h 0m'
    // Parse PostgreSQL interval format
    const match = pgInterval.match(/(\d+):(\d+):(\d+)/)
    if (!match) return '0h 0m'
    const [, hours, minutes] = match
    return `${hours}h ${minutes}m`
  }

  const handleStart = async () => {
    if (!currentWorkspace?.id || !currentUser) return
    
    setIsSaving(true)
    try {
      const now = new Date()
      const { data, error } = await supabase
        .from('time_entries')
        .insert({
          workspace_id: currentWorkspace.id,
          personnel_id: currentUser.id,
          start_time: now.toISOString(),
          billable: true,
          notes: notes || null,
        })
        .select()
        .single()

      if (error) throw error

      setStartTime(now)
      setIsRunning(true)
      setCurrentEntryId(data.id)
      setTime(0)
      
      toast({
        title: "Timer Started",
        description: "Time tracking has begun",
      })
    } catch (error: any) {
      console.error('Error starting timer:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to start timer",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleStop = async () => {
    if (!currentEntryId || !currentWorkspace?.id) return
    
    setIsSaving(true)
    try {
      const now = new Date()
      const duration = `${Math.floor(time / 3600)}:${Math.floor((time % 3600) / 60)}:${time % 60}`
      
      const { error } = await supabase
        .from('time_entries')
        .update({
          end_time: now.toISOString(),
          duration: duration,
          notes: notes || null,
        })
        .eq('id', currentEntryId)

      if (error) throw error

      setIsRunning(false)
      setTime(0)
      setStartTime(null)
      setCurrentEntryId(null)
      setNotes("")
      
      // Refresh entries
      const { data } = await supabase
        .from('time_entries')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (data) setEntries(data)
      
      toast({
        title: "Timer Stopped",
        description: "Time entry saved successfully",
      })
    } catch (error: any) {
      console.error('Error stopping timer:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to stop timer",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleManualAdd = async () => {
    if (!manualTime.trim() || !currentWorkspace?.id || !currentUser) return
    
    setIsSaving(true)
    try {
      // Parse manual time (e.g., "2h 30m" or "1.5h")
      const timeMatch = manualTime.match(/(\d+(?:\.\d+)?)\s*(h|m)/gi)
      if (!timeMatch) {
        throw new Error("Invalid time format. Use format like '2h 30m' or '1.5h'")
      }
      
      let totalSeconds = 0
      timeMatch.forEach(match => {
        const value = parseFloat(match)
        if (match.toLowerCase().includes('h')) {
          totalSeconds += value * 3600
        } else if (match.toLowerCase().includes('m')) {
          totalSeconds += value * 60
        }
      })
      
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = Math.floor(totalSeconds % 60)
      const duration = `${hours}:${minutes}:${seconds}`
      
      const now = new Date()
      const startTime = new Date(now.getTime() - totalSeconds * 1000)
      
      const { data, error } = await supabase
        .from('time_entries')
        .insert({
          workspace_id: currentWorkspace.id,
          personnel_id: currentUser.id,
          start_time: startTime.toISOString(),
          end_time: now.toISOString(),
          duration: duration,
          billable: true,
          notes: notes || null,
        })
        .select()

      if (error) throw error

      setManualTime("")
      setNotes("")
      
      // Refresh entries
      const { data: entriesData } = await supabase
        .from('time_entries')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (entriesData) setEntries(entriesData)
      
      toast({
        title: "Time Entry Added",
        description: "Manual time entry saved successfully",
      })
    } catch (error: any) {
      console.error('Error adding manual entry:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to add time entry",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!currentWorkspace?.id) return
    
    try {
      const { error } = await supabase
        .from('time_entries')
        .delete()
        .eq('id', id)

      if (error) throw error

      setEntries(entries.filter(e => e.id !== id))
      
      toast({
        title: "Entry Deleted",
        description: "Time entry removed successfully",
      })
    } catch (error: any) {
      console.error('Error deleting entry:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete entry",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-wrap items-center justify-center py-4 md:py-6 lg:py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Timer Display */}
      <div className="text-center">
        <div className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl font-mono font-bold">{formatTime(time)}</div>
        {isRunning && (
          <p className="text-xs text-muted-foreground mt-1">
            Started {startTime?.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Notes */}
      <div>
        <Textarea
          placeholder="What are you working on?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="resize-none"
          rows={2}
          disabled={isSaving}
        />
      </div>

      {/* Timer Controls */}
      <div className="flex flex-wrap gap-2 justify-center">
        {!isRunning ? (
          <Button onClick={handleStart} className="gap-2" disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play aria-hidden="true" className="h-4 w-4" />
            )}
            Start
          </Button>
        ) : (
          <Button onClick={handleStop} variant="secondary" className="gap-2" disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Square aria-hidden="true" className="h-4 w-4" />
            )}
            Stop
          </Button>
        )}
      </div>

      {/* Manual Entry */}
      <div className="border-t pt-4">
        <label className="text-sm font-medium mb-2 block">Manual Entry</label>
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="e.g., 2h 30m"
            value={manualTime}
            onChange={(e) => setManualTime(e.target.value)}
            disabled={isSaving}
          />
          <Button variant="outline" onClick={handleManualAdd} disabled={!manualTime.trim() || isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add'}
          </Button>
        </div>
      </div>

      {/* Time Entries */}
      <div className="border-t pt-4">
        <label className="text-sm font-medium mb-2 block">Recent Entries</label>
        <div className="space-y-2">
          {entries.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No time entries yet
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-sm p-2 rounded border">
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                  <Clock aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatDuration(entry.duration)}</span>
                  {entry.notes && (
                    <span className="text-muted-foreground text-xs">- {entry.notes}</span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleDelete(entry.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
