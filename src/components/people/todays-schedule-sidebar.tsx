"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Clock, 
  Users, 
  AlertCircle,
  Calendar,
  ChevronRight,
  Plus
} from "lucide-react"
import { StatusDot } from "./status-badge"
import { cn } from "@/lib/utils"

interface PersonnelShift {
  id: string
  personnelId: string
  name: string
  avatar?: string
  startTime: string
  endTime: string
  location?: string
}

interface TodaysScheduleSidebarProps {
  onDuty: PersonnelShift[]
  comingSoon: PersonnelShift[]
  openShifts: Array<{ time: string; count: number; location?: string }>
  outToday: Array<{ name: string; reason: "pto" | "sick"; avatar?: string }>
  onViewFullSchedule?: () => void
  onAssignShift?: () => void
  className?: string
}

export function TodaysScheduleSidebar({
  onDuty,
  comingSoon,
  openShifts,
  outToday,
  onViewFullSchedule,
  onAssignShift,
  className
}: TodaysScheduleSidebarProps) {
  return (
    <Card aria-hidden="true" className={cn("w-full max-w-sm", className)}>
      <CardHeader aria-hidden="true" className="pb-3">
        <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
          <CardTitle aria-hidden="true" className="text-base">Today&apos;s Schedule</CardTitle>
          <Clock aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
          })}
        </p>
      </CardHeader>
      <CardContent aria-hidden="true" className="space-y-4">
        <ScrollArea aria-hidden="true" className="h-[300px] md:h-[500px] pr-4">
          {/* On Duty */}
          <div className="space-y-2">
            <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
              <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                <StatusDot status="success" size="md" />
                <h4 className="text-sm font-medium">On Duty</h4>
              </div>
              <Badge variant="outline">{onDuty.length}</Badge>
            </div>
            {onDuty.length === 0 ? (
              <p className="text-xs text-muted-foreground pl-5">No one on duty</p>
            ) : (
              <div className="space-y-1 pl-5">
                {onDuty.slice(0, 5).map((shift: any) => (
                  <PersonnelShiftItem key={shift.id} shift={shift} />
                ))}
                {onDuty.length > 5 && (
                  <Button variant="ghost" size="sm" className="w-full h-7 text-xs max-w-full">
                    +{onDuty.length - 5} more
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Coming Soon */}
          {comingSoon.length > 0 && (
            <div className="space-y-2 mt-4">
              <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                  <StatusDot status="info" size="md" />
                  <h4 className="text-sm font-medium">Coming Soon</h4>
                </div>
                <Badge variant="outline">{comingSoon.length}</Badge>
              </div>
              <div className="space-y-1 pl-5">
                {comingSoon.map((shift: any) => (
                  <PersonnelShiftItem key={shift.id} shift={shift} showTime />
                ))}
              </div>
            </div>
          )}

          {/* Open Shifts */}
          {openShifts.length > 0 && (
            <div className="space-y-2 mt-4">
              <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                  <StatusDot status="warning" size="md" />
                  <h4 className="text-sm font-medium">Open Shifts</h4>
                </div>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                  {openShifts.reduce((sum: any, s: any) => sum + s.count, 0)}
                </Badge>
              </div>
              <div className="space-y-1 pl-5">
                {openShifts.map((shift, i) => (
                  <div 
                    key={i} 
                    className="flex flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-xs p-2 rounded hover:bg-muted/50 cursor-pointer"
                  >
                    <div>
                      <p className="font-medium">{shift.time}</p>
                      {shift.location && (
                        <p className="text-muted-foreground">{shift.location}</p>
                      )}
                    </div>
                    <Badge variant="outline" className="h-5">
                      {shift.count}
                    </Badge>
                  </div>
                ))}
                {onAssignShift && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full h-7 mt-1 max-w-full"
                    onClick={onAssignShift}
                  >
                    <Plus aria-hidden="true" className="h-3 w-3 mr-1" />
                    Assign Shifts
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Out Today */}
          {outToday.length > 0 && (
            <div className="space-y-2 mt-4">
              <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                  <Calendar aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-medium">Out Today</h4>
                </div>
                <Badge variant="outline">{outToday.length}</Badge>
              </div>
              <div className="space-y-1 pl-5">
                {outToday.map((person, i) => (
                  <div key={i} className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-xs p-1">
                    <Avatar aria-hidden="true" className="h-5 w-5">
                      <AvatarImage src={person.avatar} />
                      <AvatarFallback aria-hidden="true" className="text-[10px]">
                        {person.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1 truncate">{person.name}</span>
                    <Badge variant="outline" className="h-4 text-[10px]">
                      {person.reason === "pto" ? "PTO" : "Sick"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>

        {onViewFullSchedule && (
          <Button 
            variant="outline" 
            className="w-full max-w-full"
            onClick={onViewFullSchedule}
          >
            View Full Schedule
            <ChevronRight aria-hidden="true" className="h-4 w-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

function PersonnelShiftItem({ 
  shift, 
  showTime = false 
}: { 
  shift: PersonnelShift
  showTime?: boolean 
}) {
  return (
    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-xs p-1.5 rounded hover:bg-muted/50">
      <Avatar aria-hidden="true" className="h-6 w-6">
        <AvatarImage src={shift.avatar} />
        <AvatarFallback aria-hidden="true" className="text-[10px]">
          {shift.name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{shift.name}</p>
        {showTime && (
          <p className="text-muted-foreground">{shift.startTime}</p>
        )}
      </div>
      {shift.location && (
        <Badge variant="outline" className="h-4 text-[10px]">
          {shift.location}
        </Badge>
      )}
    </div>
  )
}

// Compact version for dashboard
export function TodaysScheduleCompact({
  onDutyCount,
  comingSoonCount,
  openShiftsCount,
  onViewSchedule
}: {
  onDutyCount: number
  comingSoonCount: number
  openShiftsCount: number
  onViewSchedule?: () => void
}) {
  return (
    <div className="p-4 bg-card border rounded-lg space-y-3">
      <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
        <h4 className="text-sm font-medium">Today&apos;s Schedule</h4>
        <Clock aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-sm">
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <StatusDot status="success" size="sm" />
            <span className="text-muted-foreground">On duty</span>
          </div>
          <span className="font-medium">{onDutyCount}</span>
        </div>

        <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-sm">
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <StatusDot status="info" size="sm" />
            <span className="text-muted-foreground">Coming</span>
          </div>
          <span className="font-medium">{comingSoonCount}</span>
        </div>

        {openShiftsCount > 0 && (
          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-sm">
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
              <StatusDot status="warning" size="sm" />
              <span className="text-muted-foreground">Open</span>
            </div>
            <span className="font-medium text-yellow-600">{openShiftsCount}</span>
          </div>
        )}
      </div>

      {onViewSchedule && (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full max-w-full"
          onClick={onViewSchedule}
        >
          View Schedule
        </Button>
      )}
    </div>
  )
}
