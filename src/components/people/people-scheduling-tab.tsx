"use client"

import { useTranslations } from 'next-intl'
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Download
} from "lucide-react"
import { useModuleData } from "@/hooks/use-module-data"
import type { TabComponentProps } from "@/types"

export function PeopleSchedulingTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const t = useTranslations('production.people.scheduling')
  const tCommon = useTranslations('common')
  const { data: shifts, loading } = useModuleData(workspaceId, 'people', 'scheduling')
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week')
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

  const getShiftTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'morning': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
      'afternoon': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400',
      'evening': 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400',
      'night': 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400',
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getWeekDays = () => {
    const start = new Date(currentDate)
    start.setDate(start.getDate() - start.getDay()) // Start from Sunday
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      return day
    })
  }

  const getShiftsForDay = (date: Date, personId?: string) => {
    return shifts.filter((shift: any) => {
      const shiftDate = new Date(shift.date)
      const sameDay = shiftDate.toDateString() === date.toDateString()
      return personId ? sameDay && shift.person_id === personId : sameDay
    })
  }

  const personnel = Array.from(new Set(shifts.map((s: any) => s.person_id)))
    .map(id => ({
      id,
      name: shifts.find((s: any) => s.person_id === id)?.person_name || 'Unknown',
      role: shifts.find((s: any) => s.person_id === id)?.person_role || 'Staff'
    }))

  const weekDays = getWeekDays()
  const conflicts = shifts.filter((s: any) => s.has_conflict).length
  const overtimeShifts = shifts.filter((s: any) => s.is_overtime).length
  const totalHours = shifts.reduce((sum: number, s: any) => sum + (s.hours || 8), 0)

  return (
    <main role="main" aria-label={t('title')}>
      <div className="space-y-6">
      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Personnel scheduling
        </p>
        <Button size="sm">
          <Plus className="h-4 w-4" aria-hidden="true" className="mr-2" />
          Create
        </Button>
      </div>


      {/* Actions */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Shift assignments and availability management
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" aria-hidden="true" className="mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4" aria-hidden="true" className="mr-2" />
            Add Shift
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shifts</CardTitle>
            <Calendar className="h-4 w-4" aria-hidden="true" className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shifts.length}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4" aria-hidden="true" className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours}</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>

        <Card className={conflicts > 0 ? "border-yellow-200 dark:border-yellow-900" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conflicts</CardTitle>
            <AlertTriangle className="h-4 w-4" aria-hidden="true" className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${conflicts > 0 ? 'text-yellow-600' : ''}`}>
              {conflicts}
            </div>
            <p className="text-xs text-muted-foreground">Need resolution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overtime</CardTitle>
            <Users className="h-4 w-4" aria-hidden="true" className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overtimeShifts}</div>
            <p className="text-xs text-muted-foreground">Shifts</p>
          </CardContent>
        </Card>
      </div>

      {/* View Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Schedule Grid</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant={viewMode === 'week' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('week')}
              >
                Week
              </Button>
              <Button 
                variant={viewMode === 'month' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('month')}
              >
                Month
              </Button>
              <div className="border-l pl-2 ml-2 flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => {
                  const newDate = new Date(currentDate)
                  newDate.setDate(newDate.getDate() - 7)
                  setCurrentDate(newDate)
                }}>
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
                <Button variant="ghost" size="icon" onClick={() => {
                  const newDate = new Date(currentDate)
                  newDate.setDate(newDate.getDate() + 7)
                  setCurrentDate(newDate)
                }}>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Week View Grid */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-muted font-medium text-sm w-32">{t('title')}</th>
                  {weekDays.map((day, index) => {
                    const isToday = day.toDateString() === new Date().toDateString()
                    return (
                      <th 
                        key={index} 
                        className={`border p-2 text-sm font-medium ${
                          isToday ? 'bg-primary/10' : 'bg-muted'
                        }`}
                      >
                        <div>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div className="text-muted-foreground font-normal">
                          {day.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {personnel.map((person) => (
                  <tr key={person.id}>
                    <td className="border p-2 bg-muted/50">
                      <div className="font-medium text-sm">{person.name}</div>
                      <div className="text-xs text-muted-foreground">{person.role}</div>
                    </td>
                    {weekDays.map((day, dayIndex) => {
                      const dayShifts = getShiftsForDay(day, person.id)
                      const isToday = day.toDateString() === new Date().toDateString()
                      
                      return (
                        <td 
                          key={dayIndex} 
                          className={`border p-1 align-top ${
                            isToday ? 'bg-primary/5' : ''
                          }`}
                        >
                          <div className="space-y-1 min-h-16">
                            {dayShifts.map((shift: any) => (
                              <div
                                key={shift.id}
                                className={`text-xs p-1.5 rounded ${getShiftTypeColor(shift.shift_type)}`}
                              >
                                <div className="font-medium">{shift.start_time} - {shift.end_time}</div>
                                <div className="flex items-center gap-1 mt-0.5">
                                  {shift.is_overtime && (
                                    <Badge variant="outline" className="text-[10px] px-1 py-0">OT</Badge>
                                  )}
                                  {shift.has_conflict && (
                                    <AlertTriangle className="h-4 w-4" aria-hidden="true" className="text-yellow-600" />
                                  )}
                                  {shift.is_confirmed && (
                                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" className="text-green-600" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-100 dark:bg-yellow-950 rounded" />
              <span>{t('morning')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-100 dark:bg-blue-950 rounded" />
              <span>{t('afternoon')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-100 dark:bg-purple-950 rounded" />
              <span>{t('evening')}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" className="text-yellow-600" />
              <span>{t('conflict')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" className="text-green-600" />
              <span>{t('confirmed')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {conflicts > 0 && (
        <Card className="border-yellow-200 dark:border-yellow-900">
          <CardHeader>
            <CardTitle className="text-yellow-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              Scheduling Conflicts
            </CardTitle>
            <CardDescription>{t('needsAttention')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {shifts.filter((s: any) => s.has_conflict).slice(0, 5).map((shift: any) => (
                <div key={shift.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span className="font-medium">{shift.person_name}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {new Date(shift.date).toLocaleDateString()} {shift.start_time}-{shift.end_time}
                    </span>
                  </div>
                  <Button size="sm" variant="outline">{tCommon('resolve')}</Button>
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
