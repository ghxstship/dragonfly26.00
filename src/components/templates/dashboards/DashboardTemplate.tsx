"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Settings, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * DashboardTemplate - Template Component
 * 
 * Standard template for dashboard pages with widgets and stats.
 * Provides consistent layout for overview/dashboard pages.
 * 
 * Features:
 * - Header with title and actions
 * - Grid layout for widgets
 * - Responsive columns
 * - Optional sidebar
 * - Refresh functionality
 * 
 * Usage:
 * <DashboardTemplate
 *   title="Dashboard"
 *   widgets={[
 *     <StatCard key="1" ... />,
 *     <ChartWidget key="2" ... />
 *   ]}
 *   onRefresh={handleRefresh}
 * />
 */

export interface DashboardTemplateProps {
  /** Page title */
  title: string
  
  /** Subtitle or description */
  subtitle?: string
  
  /** Dashboard widgets */
  widgets: React.ReactNode[]
  
  /** Sidebar content */
  sidebar?: React.ReactNode
  
  /** Refresh handler */
  onRefresh?: () => void
  
  /** Settings handler */
  onSettings?: () => void
  
  /** Additional header actions */
  headerActions?: React.ReactNode
  
  /** Grid columns (responsive) */
  columns?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  
  /** Loading state */
  loading?: boolean
  
  /** Additional CSS classes */
  className?: string
}

export function DashboardTemplate({
  title,
  subtitle,
  widgets,
  sidebar,
  onRefresh,
  onSettings,
  headerActions,
  columns = { default: 1, md: 2, lg: 3 },
  loading,
  className,
}: DashboardTemplateProps) {
  const t = useTranslations()

  const gridClasses = cn(
    'grid gap-4 md:gap-6',
    columns.default === 1 && 'grid-cols-1',
    columns.default === 2 && 'grid-cols-2',
    columns.default === 3 && 'grid-cols-3',
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`
  )

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-4 md:p-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {headerActions}
            {onRefresh && (
              <Button
                variant="outline"
                size="icon"
                onClick={onRefresh}
                disabled={loading}
                aria-label="Refresh dashboard"
              >
                <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} aria-hidden="true" />
              </Button>
            )}
            {onSettings && (
              <Button
                variant="outline"
                size="icon"
                onClick={onSettings}
                aria-label="Dashboard settings"
              >
                <Settings className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className={cn('flex gap-6', sidebar ? 'p-4 md:p-6' : 'p-4 md:p-6')}>
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className={gridClasses}>
              {widgets.map((widget, index) => (
                <React.Fragment key={index}>{widget}</React.Fragment>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          {sidebar && (
            <aside className="hidden xl:block w-80 flex-shrink-0">
              {sidebar}
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
