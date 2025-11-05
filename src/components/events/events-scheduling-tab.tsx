"use client"

import { useTranslations } from 'next-intl'
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, MapPin, Plus, Filter, Search } from "lucide-react"
import { useModuleData } from "@/hooks/use-module-data"
import type { TabComponentProps } from "@/types"

export function EventsSchedulingTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const t = useTranslations('production.events.scheduling')
  const tCommon = useTranslations('common')
  const { data: schedules, loading, error } = useModuleData(workspaceId, 'events', 'scheduling')
  const [filterStatus, setFilterStatus] = useState<string>('all')

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

  const mockSchedules = [
    {
      id: 1,
      event_name: 'Main Stage Setup',
      start_time: '2025-11-05T08:00:00',
      end_time: '2025-11-05T12:00:00',
      assigned_crew: 12,
      location: 'Main Stage',
      status: 'scheduled',
      priority: 'high'
    },
    {
      id: 2,
      event_name: 'Sound Check',
      start_time: '2025-11-05T13:00:00',
      end_time: '2025-11-05T15:00:00',
      assigned_crew: 8,
      location: 'Main Stage',
      status: 'in_progress',
      priority: 'high'
    },
    {
      id: 3,
      event_name: 'Lighting Setup',
      start_time: '2025-11-05T14:00:00',
      end_time: '2025-11-05T18:00:00',
      assigned_crew: 6,
      location: 'Secondary Stage',
      status: 'scheduled',
      priority: 'medium'
    }
  ]

  const scheduleData = schedules?.length > 0 ? schedules : mockSchedules

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'scheduled': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400',
      'in_progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
      'completed': 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
      'cancelled': 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400',
    }
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400'
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'high': 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400',
      'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
      'low': 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
    }
    return colors[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400'
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full" role="alert" aria-live="assertive">
        <div className="text-center">
          <Calendar className="h-8 w-8 text-destructive mx-auto mb-4" aria-hidden="true" />
          <p className="text-muted-foreground">Failed to load data</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </div>
      </div>
    )
  }


  return (
    <main role="main" aria-label={t('title')}>
      <div className="space-y-3 md:space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">{t('title')}</h2>
            <p className="text-muted-foreground">{t('description')}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" aria-hidden="true" />
              {tCommon('filter')}
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              {t('addSchedule')}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('stats.totalSchedules')}</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduleData.length}</div>
              <p className="text-xs text-muted-foreground">{t('stats.totalSchedulesDesc')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('stats.inProgress')}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {scheduleData.filter((s: any) => s.status === 'in_progress').length}
              </div>
              <p className="text-xs text-muted-foreground">{t('stats.inProgressDesc')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('stats.totalCrew')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {scheduleData.reduce((sum: number, s: any) => sum + (s.assigned_crew || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">{t('stats.totalCrewDesc')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('stats.locations')}</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(scheduleData.map((s: any) => s.location)).size}
              </div>
              <p className="text-xs text-muted-foreground">{t('stats.locationsDesc')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Schedule List */}
        <div className="space-y-3">
          {scheduleData.map((schedule: any) => (
            <Card key={schedule.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{schedule.event_name}</CardTitle>
                    <CardDescription>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className={getStatusColor(schedule.status)}>
                          {t(`status.${schedule.status}`)}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(schedule.priority)}>
                          {t(`priority.${schedule.priority}`)}
                        </Badge>
                      </div>
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    {tCommon('edit')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <div className="text-sm">
                      <div className="font-medium">{t('startTime')}</div>
                      <div className="text-muted-foreground">
                        {new Date(schedule.start_time).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <div className="text-sm">
                      <div className="font-medium">{t('endTime')}</div>
                      <div className="text-muted-foreground">
                        {new Date(schedule.end_time).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <div className="text-sm">
                      <div className="font-medium">{t('assignedCrew')}</div>
                      <div className="text-muted-foreground">{schedule.assigned_crew} {t('people')}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <div className="text-sm">
                      <div className="font-medium">{t('location')}</div>
                      <div className="text-muted-foreground">{schedule.location}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
