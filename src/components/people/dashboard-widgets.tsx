"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Calendar,
  TrendingUp,
  ArrowRight
} from "lucide-react"
import { StatusDot } from "./status-badge"

interface HeadcountWidgetProps {
  activeCount: number
  fullTimeCount: number
  partTimeCount: number
  contractorCount: number
  onViewDetails?: () => void
}

export function HeadcountWidget({
  activeCount,
  fullTimeCount,
  partTimeCount,
  contractorCount,
  onViewDetails
}: HeadcountWidgetProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Headcount</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{activeCount as any}</div>
        <p className="text-xs text-muted-foreground mt-1">Active employees</p>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Full-time</span>
            <span className="font-medium">{fullTimeCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Part-time</span>
            <span className="font-medium">{partTimeCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Contractors</span>
            <span className="font-medium">{contractorCount}</span>
          </div>
        </div>

        {onViewDetails && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-4"
            onClick={onViewDetails}
          >
            View Details
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

interface TodaysScheduleWidgetProps {
  onDutyCount: number
  comingCount: number
  openShiftsCount: number
  onViewSchedule?: () => void
  shifts?: Array<{ time: string; count: number }>
}

export function TodaysScheduleWidget({
  onDutyCount,
  comingCount,
  openShiftsCount,
  onViewSchedule,
  shifts = []
}: TodaysScheduleWidgetProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Today&apos;s Schedule</CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusDot status="success" size="md" />
              <span className="text-sm">On duty</span>
            </div>
            <span className="text-lg font-bold">{onDutyCount}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusDot status="info" size="md" />
              <span className="text-sm">Coming soon</span>
            </div>
            <span className="text-lg font-bold">{comingCount}</span>
          </div>

          {openShiftsCount > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusDot status="warning" size="md" />
                <span className="text-sm">Open shifts</span>
              </div>
              <span className="text-lg font-bold text-yellow-600">{openShiftsCount}</span>
            </div>
          )}
        </div>

        {shifts.length > 0 && (
          <div className="mt-4 pt-4 border-t space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Upcoming shifts</p>
            {shifts.map((shift, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{shift.time}</span>
                <Badge variant="outline" className="h-5">
                  {shift.count}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {onViewSchedule && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-4"
            onClick={onViewSchedule}
          >
            View Full Schedule
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

interface PendingApprovalsWidgetProps {
  totalCount: number
  ptoCount: number
  timesheetsCount: number
  shiftsCount: number
  onReviewAll?: () => void
}

export function PendingApprovalsWidget({
  totalCount,
  ptoCount,
  timesheetsCount,
  shiftsCount,
  onReviewAll
}: PendingApprovalsWidgetProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalCount as any}</div>
        <p className="text-xs text-muted-foreground mt-1">Items need your review</p>
        
        <div className="mt-4 space-y-2">
          {ptoCount > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">PTO requests</span>
              <Badge variant="secondary">{ptoCount}</Badge>
            </div>
          )}
          {timesheetsCount > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Timesheets</span>
              <Badge variant="secondary">{timesheetsCount}</Badge>
            </div>
          )}
          {shiftsCount > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Shift swaps</span>
              <Badge variant="secondary">{shiftsCount}</Badge>
            </div>
          )}
        </div>

        {onReviewAll && (
          <Button 
            variant="default" 
            size="sm" 
            className="w-full mt-4"
            onClick={onReviewAll}
          >
            Review All
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

interface AlertsWidgetProps {
  alertCount: number
  alerts: Array<{ type: "compliance" | "expiring" | "other"; message: string }>
  onReviewAlerts?: () => void
}

export function AlertsWidget({
  alertCount,
  alerts,
  onReviewAlerts
}: AlertsWidgetProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Alerts</CardTitle>
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
      </CardHeader>
      <CardContent>
        {alertCount === 0 ? (
          <div className="text-center py-4">
            <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">All clear!</p>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold text-yellow-600">{alertCount as any}</div>
            <p className="text-xs text-muted-foreground mt-1">Items need attention</p>
            
            <div className="mt-4 space-y-2">
              {alerts.slice(0, 3).map((alert, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <StatusDot 
                    status={alert.type === "compliance" ? "error" : "warning"} 
                    size="sm" 
                    className="mt-1 flex-shrink-0"
                  />
                  <span className="text-muted-foreground text-xs">{alert.message}</span>
                </div>
              ))}
            </div>

            {onReviewAlerts && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4"
                onClick={onReviewAlerts}
              >
                Review All Alerts
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

interface QuickStatsWidgetProps {
  onboardingCount: number
  reviewsDueCount: number
  ptoRequestsCount?: number
  onViewReports?: () => void
}

export function QuickStatsWidget({
  onboardingCount,
  reviewsDueCount,
  ptoRequestsCount = 0,
  onViewReports
}: QuickStatsWidgetProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Onboarding</span>
            <Badge variant={onboardingCount > 0 ? "secondary" : "outline"}>
              {onboardingCount}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Reviews due</span>
            <Badge variant={reviewsDueCount > 0 ? "secondary" : "outline"}>
              {reviewsDueCount}
            </Badge>
          </div>

          {ptoRequestsCount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">PTO pending</span>
              <Badge variant="secondary">
                {ptoRequestsCount}
              </Badge>
            </div>
          )}
        </div>

        {onViewReports && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-4"
            onClick={onViewReports}
          >
            View Reports
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Mini PTO Calendar Widget
interface UpcomingPTOWidgetProps {
  upcomingPTO: Array<{
    date: string
    personnel: string[]
  }>
}

export function UpcomingPTOWidget({ upcomingPTO }: UpcomingPTOWidgetProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Upcoming PTO</CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingPTO.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming time off
          </p>
        ) : (
          <div className="space-y-2">
            {upcomingPTO.slice(0, 5).map((item, i) => (
              <div key={i} className="flex justify-between text-sm border-b pb-2 last:border-0">
                <span className="text-muted-foreground">{item.date}</span>
                <Badge variant="outline" className="h-5">
                  {item.personnel.length}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
