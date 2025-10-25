"use client"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, X, ExternalLink, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ComplianceAlert {
  id: string
  type: "hours" | "certification" | "break" | "other"
  severity: "info" | "warning" | "critical"
  message: string
  personnel?: string
  actionUrl?: string
}

interface ComplianceAlertsBannerProps {
  alerts: ComplianceAlert[]
  onDismiss?: (alertId: string) => void
  onViewAll?: () => void
  className?: string
}

export function ComplianceAlertsBanner({
  alerts,
  onDismiss,
  onViewAll,
  className
}: ComplianceAlertsBannerProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())

  if (alerts.length === 0) return null

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id))
  
  if (visibleAlerts.length === 0) return null

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]))
    onDismiss?.(alertId)
  }

  const criticalCount = visibleAlerts.filter(a => a.severity === "critical").length
  const warningCount = visibleAlerts.filter(a => a.severity === "warning").length

  return (
    <div className={cn("space-y-2", className)}>
      {visibleAlerts.map(alert => (
        <ComplianceAlertItem
          key={alert.id}
          alert={alert}
          onDismiss={() => handleDismiss(alert.id)}
        />
      ))}

      {visibleAlerts.length > 1 && onViewAll && (
        <div className="flex flex-wrap justify-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onViewAll}
          >
            View All {visibleAlerts.length} Alerts
            <ExternalLink className="h-3 w-3 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}

function ComplianceAlertItem({
  alert,
  onDismiss
}: {
  alert: ComplianceAlert
  onDismiss: () => void
}) {
  const severityConfig = {
    info: {
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-800",
      icon: <Clock className="h-4 w-4 text-blue-600" />,
      badge: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
    },
    warning: {
      bg: "bg-yellow-50 dark:bg-yellow-950/30",
      border: "border-yellow-200 dark:border-yellow-800",
      icon: <AlertTriangle className="h-4 w-4 text-yellow-600" />,
      badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
    },
    critical: {
      bg: "bg-red-50 dark:bg-red-950/30",
      border: "border-red-200 dark:border-red-800",
      icon: <AlertCircle className="h-4 w-4 text-red-600" />,
      badge: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
    }
  }

  const config = severityConfig[alert.severity]

  return (
    <Alert className={cn(config.bg, config.border, "relative pr-12")}>
      <div className="flex flex-wrap flex-col md:flex-row items-start gap-3">
        <div className="mt-0.5">{config.icon}</div>
        <div className="flex-1 min-w-0">
          <AlertDescription className="text-sm">
            {alert.personnel && (
              <span className="font-medium">{alert.personnel}: </span>
            )}
            {alert.message}
          </AlertDescription>
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 mt-2">
            <Badge className={cn("text-xs", config.badge)}>
              {alert.type}
            </Badge>
            {alert.actionUrl && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                asChild
              >
                <a href={alert.actionUrl}>
                  View Details
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute sm:relative sm:inset-auto top-2 md:top-2 right-2 md:right-2 h-6 w-6"
          onClick={onDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  )
}

// Compact compliance summary for dashboard
export function ComplianceStatusSummary({
  totalViolations,
  criticalCount,
  warningCount,
  onViewAll
}: {
  totalViolations: number
  criticalCount: number
  warningCount: number
  onViewAll?: () => void
}) {
  if (totalViolations === 0) {
    return (
      <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex flex-wrap items-center justify-center">
          <Clock className="h-4 w-4 text-green-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-green-900 dark:text-green-100">
            All Compliant
          </p>
          <p className="text-xs text-green-700 dark:text-green-300">
            No violations detected
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
      <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex flex-wrap items-center justify-center">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
          {totalViolations} Compliance {totalViolations === 1 ? 'Alert' : 'Alerts'}
        </p>
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 mt-1">
          {criticalCount > 0 && (
            <Badge className="h-5 text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
              {criticalCount} Critical
            </Badge>
          )}
          {warningCount > 0 && (
            <Badge className="h-5 text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
              {warningCount} Warning
            </Badge>
          )}
        </div>
      </div>
      {onViewAll && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll}
        >
          Review
        </Button>
      )}
    </div>
  )
}
