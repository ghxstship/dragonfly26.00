"use client"

import { useTranslations } from 'next-intl'
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play,
  Pause,
  SkipForward,
  Clock,
  Users,
  Lightbulb,
  Volume2,
  Video,
  AlertCircle,
  CheckCircle2,
  Plus,
  Download,
  Edit } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { useModuleData } from "@/hooks/use-module-data"
import type { TabComponentProps } from "@/types"

export function EventsRunOfShowTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const t = useTranslations('production.events.run_of_show')
  const tCommon = useTranslations('common')
  const { data, loading }: { data?: any, loading?: boolean } = useModuleData(workspaceId, 'events', 'run-of-show')
  const runOfShow = (data || []) as any[]
  const [currentCue, setCurrentCue] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showClock, setShowClock] = useState("00:00:00")

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

  const getCueTypeIcon = (type: string) => {
    switch (type) {
      case 'lighting': return Lightbulb
      case 'sound': return Volume2
      case 'video': return Video
      case 'stage': return Users
      default: return Clock
    }
  }

  const getCueTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'lighting': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
      'sound': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400',
      'video': 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400',
      'stage': 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
      'general': 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400',
    }
    return colors[type] || colors.general
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'in_progress': return 'text-blue-600'
      case 'pending': return 'text-gray-400'
      case 'warning': return 'text-yellow-600'
      default: return 'text-gray-400'
    }
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Group cues by act/segment
  const groupedCues = runOfShow.reduce((acc: Record<string, any[]>, cue: any) => {
    const act = cue.act || 'Pre-Show'
    if (!acc[act]) acc[act] = []
    acc[act].push(cue)
    return acc
  }, {} as Record<string, any[]>)

  const completedCues = runOfShow.filter((c: any) => c.status === 'completed').length
  const progress = runOfShow.length > 0 ? (completedCues / runOfShow.length) * 100 : 0

  return (
    <main role="main" aria-label={t('title')}>
      <div className="space-y-6">
      {/* Show Clock and Progress */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Show Clock</div>
              <div className="text-4xl font-mono font-bold">{showClock as any}</div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                size="lg" 
                variant={isRunning ? "outline" : "default"}
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? <Pause className="h-4 w-4 mr-2" aria-hidden="true" /> : <Play className="h-4 w-4 mr-2" aria-hidden="true" />}
                {isRunning ? 'Pause' : 'Start'}
              </Button>
              <Button size="lg" variant="outline">
                <SkipForward className="h-4 w-4 mr-2" aria-hidden="true" />
                Next Cue
              </Button>
            </div>

            <div className="space-y-2 min-w-48">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{completedCues}/{runOfShow.length} cues</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acts/Segments */}
      <div className="space-y-6">
        {Object.entries(groupedCues).map(([act, cues]: [string, any]) => (
          <Card key={act}>
            <CardHeader>
              <CardTitle className="text-lg">{act}</CardTitle>
              <CardDescription>{cues.length} cues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cues.map((cue: any, index: number) => {
                  const CueIcon = getCueTypeIcon(cue.type)
                  const isCurrent = currentCue === cue.number
                  
                  return (
                    <div
                      key={cue.id}
                      className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${
                        isCurrent 
                          ? 'bg-primary/10 border-primary' 
                          : 'hover:bg-accent/50'
                      }`}
                    >
                      {/* Cue Number */}
                      <div className={`flex-shrink-0 w-16 text-center ${getStatusColor(cue.status)}`}>
                        <div className="text-lg font-bold">
                          {cue.number || index + 1}
                        </div>
                        {(cue as any).status === 'completed' && (
                          <CheckCircle2 className="h-4 w-4 mx-auto" aria-hidden="true" />
                        )}
                        {(cue as any).status === 'warning' && (
                          <AlertCircle className="h-4 w-4 mx-auto" aria-hidden="true" />
                        )}
                      </div>

                      {/* Time */}
                      <div className="flex-shrink-0 w-24">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" aria-hidden="true" />
                          <span className="font-mono">{cue.time || '--:--'}</span>
                        </div>
                        {cue.duration && (
                          <div className="text-xs text-muted-foreground">
                            {cue.duration}m
                          </div>
                        )}
                      </div>

                      {/* Cue Type */}
                      <div className="flex-shrink-0">
                        <Badge variant="secondary" className={getCueTypeColor(cue.type)}>
                          <CueIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                          {cue.type}
                        </Badge>
                      </div>

                      {/* Cue Description */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{cue.name}</div>
                        {cue.description && (
                          <div className="text-sm text-muted-foreground truncate">
                            {cue.description}
                          </div>
                        )}
                      </div>

                      {/* Assigned Personnel */}
                      {cue.assignedTo && (
                        <div className="flex-shrink-0">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" aria-hidden="true" />
                            <span className="truncate max-w-32">{cue.assignedTo}</span>
                          </div>
                        </div>
                      )}

                      {/* Notes Indicator */}
                      {cue.notes && (
                        <div className="flex-shrink-0">
                          <Badge variant="outline" className="text-xs">
                            Notes
                          </Badge>
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="flex-shrink-0">
                        <Button
                          size="sm"
                          variant={isCurrent ? "default" : "ghost"}
                          onClick={() => setCurrentCue(cue.number)}
                        >
                          {(cue as any).status === 'completed' ? 'Review' : 'Execute'}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current Cue Detail Panel */}
      {currentCue > 0 && runOfShow.find((c: any) => c.number === currentCue) && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Current Cue Details</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const cue = runOfShow.find((c: any) => c.number === currentCue)
              return (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-sm text-muted-foreground">Technical Notes</div>
                    <div className="mt-1 text-sm">{cue.notes || 'No notes'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Equipment</div>
                    <div className="mt-1 text-sm">{cue.equipment || 'None specified'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Prerequisites</div>
                    <div className="mt-1 text-sm">{cue.prerequisites || 'None'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Follow-up</div>
                    <div className="mt-1 text-sm">{cue.followup || 'None'}</div>
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}

      {runOfShow.length === 0 && (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              variant="inline"
              icon={Clock}
              mainMessage="NOTHING TO SEE HERE... (YET)"
              description="Create your first cue to start building your show timeline"
              actionLabel="Add First Cue"
              onAction={() => {}}
            />
          </CardContent>
        </Card>
      )}
    </div>
    </main>
  )
}
