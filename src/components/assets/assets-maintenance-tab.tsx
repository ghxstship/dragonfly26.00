"use client"

import { useTranslations } from 'next-intl'
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Wrench,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter
} from "lucide-react"
import { useModuleData } from "@/hooks/use-module-data"
import type { TabComponentProps } from "@/types"

export function AssetsMaintenanceTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const t = useTranslations('production.assets.maintenance')
  const tCommon = useTranslations('common')
  const { data: maintenanceItems, loading } = useModuleData(workspaceId, 'assets', 'maintenance')
  const [currentDate, setCurrentDate] = useState(new Date())

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

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    return { daysInMonth: lastDay.getDate(), startingDayOfWeek: firstDay.getDay() }
  }

  const getMaintenanceForDay = (day: number) => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const targetDate = new Date(year, month, day)
    
    return (maintenanceItems as any[]).filter((item: any) => {
      const itemDate = new Date(item.scheduled_date || item.due_date)
      return itemDate.getDate() === day && 
             itemDate.getMonth() === month && 
             itemDate.getFullYear() === year
    })
  }

  const getMaintenanceTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'preventive': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400',
      'reactive': 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400',
      'inspection': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
      'calibration': 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400',
    }
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400'
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: startingDayOfWeek }, (_, i) => i)

  const today = new Date()
  const overdueMaintenance = (maintenanceItems as any[]).filter((item: any) => 
    new Date(item.due_date) < today && item.status !== 'completed'
  )
  const upcomingMaintenance = (maintenanceItems as any[]).filter((item: any) => {
    const dueDate = new Date(item.due_date)
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilDue >= 0 && daysUntilDue <= 7 && item.status !== 'completed'
  })

  return (
    <main role="main" aria-label={t('title')}>
      <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Stats */}
      <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{maintenanceItems.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-900">
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('overdue')}</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-red-600">{overdueMaintenance.length}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 dark:border-yellow-900">
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-yellow-600">{upcomingMaintenance.length}</div>
            <p className="text-xs text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('completed')}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
              {(maintenanceItems as any[]).filter((i: any) => (i as any).status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
            <CardTitle>
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="icon" onClick={previousMonth} aria-label="Previous month">
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth} aria-label="Next month">
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:grid-cols-3 md:grid-cols-2 lg:grid-cols-7 gap-2">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day: any) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
            
            {/* Empty cells */}
            {emptyDays.map((i: any) => (
              <div key={`empty-${i}`} className="min-h-24 border rounded-lg bg-muted/20" />
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((day: any) => {
              const dayMaintenance = getMaintenanceForDay(day)
              const isToday = 
                day === today.getDate() && 
                currentDate.getMonth() === today.getMonth() && 
                currentDate.getFullYear() === today.getFullYear()
              
              return (
                <div 
                  key={day} 
                  className={`min-h-24 border rounded-lg p-2 hover:bg-accent/50 transition-colors ${
                    isToday ? 'border-primary border-2 bg-primary/5' : ''
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {(dayMaintenance as any[]).slice(0, 3).map((item: any) => {
                      const isOverdue = new Date(item.due_date) < today && item.status !== 'completed'
                      return (
                        <div 
                          key={item.id}
                          className={`text-xs p-1 rounded truncate ${
                            isOverdue 
                              ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400'
                              : getMaintenanceTypeColor(item.type)
                          }`}
                        >
                          <Wrench className="h-4 w-4 inline mr-1" aria-hidden="true" />
                          {item.asset_name}
                        </div>
                      )
                    })}
                    {dayMaintenance.length > 3 && (
                      <div className="text-xs text-muted-foreground pl-1">
                        +{dayMaintenance.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Overdue Items */}
      {overdueMaintenance.length > 0 && (
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="text-red-600 flex flex-wrap flex-col md:flex-row items-center gap-2">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              Overdue Maintenance
            </CardTitle>
            <CardDescription>{overdueMaintenance.length} items need immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueMaintenance.map((item: any) => (
                <div key={item.id} className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between p-3 border rounded-lg">
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-3">
                    <Wrench className="h-4 w-4 text-red-600" aria-hidden="true" />
                    <div>
                      <div className="font-medium">{item.asset_name}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4">
                    <Badge variant="secondary" className={getMaintenanceTypeColor(item.type)}>
                      {item.type}
                    </Badge>
                    <div className="text-sm text-red-600">
                      Due: {new Date(item.due_date).toLocaleDateString()}
                    </div>
                    <Button size="sm">Complete</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
    </main>
  )
}
