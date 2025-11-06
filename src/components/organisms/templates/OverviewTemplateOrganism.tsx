"use client"

import { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"

/**
 * Overview Template Organism
 * 
 * Templatized overview page following atomic design system
 * Used as first tab in modules requiring overview functionality
 * 
 * Features:
 * - Stats grid with customizable metrics
 * - Quick actions section
 * - Activity summary
 * - Fully internationalized
 * - WCAG 2.1 AA compliant
 */

export interface OverviewStat {
  labelKey: string
  value: string
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  color: string
  bgColor: string
}

export interface OverviewQuickAction {
  labelKey: string
  icon: LucideIcon
  color: string
  action: () => void
}

export interface OverviewSummaryItem {
  labelKey: string
  value: string | number
  ariaLabel?: string
}

export interface OverviewTemplateProps {
  /** Translation namespace for the module (e.g., 'people', 'locations') */
  translationNamespace: string
  
  /** Array of statistics to display in the stats grid */
  stats: OverviewStat[]
  
  /** Array of quick action buttons */
  quickActions?: OverviewQuickAction[]
  
  /** Array of summary items for activity section */
  summaryItems?: OverviewSummaryItem[]
  
  /** Optional custom content to render below summary */
  customContent?: ReactNode
  
  /** Loading state */
  loading?: boolean
  
  /** Optional workspace ID */
  workspaceId?: string
  
  /** Optional user ID */
  userId?: string
}

export function OverviewTemplateOrganism({
  translationNamespace,
  stats,
  quickActions = [],
  summaryItems = [],
  customContent,
  loading = false,
}: OverviewTemplateProps): JSX.Element {
  const t = useTranslations(`${translationNamespace}.overview`)
  const tCommon = useTranslations('common')
  
  // Loading state
  if (loading) {
    return (
      <div 
        className="flex items-center justify-center h-full min-h-[400px]"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" aria-hidden="true" />
          <p className="text-muted-foreground">{tCommon('loading')}</p>
        </div>
      </div>
    )
  }
  
  return (
    <main role="main" aria-label={t('title')}>
      <div className="space-y-3 md:space-y-4 lg:space-y-6">
        {/* Stats Grid */}
        <section role="region" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">{t('statsHeading')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.labelKey}>
                  <CardHeader aria-hidden="true" className="pb-3">
                    <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                      <CardDescription aria-hidden="true" className="text-xs">{t(stat.labelKey)}</CardDescription>
                      <div className={`p-2 rounded-lg ${stat.bgColor}`} aria-hidden="true">
                        <Icon aria-hidden="true" className={`h-4 w-4 ${stat.color}`} />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-end justify-between">
                      <CardTitle aria-hidden="true" className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">{stat.value}</CardTitle>
                      {stat.change && (
                        <div className="text-xs text-muted-foreground">
                          {stat.change}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Quick Actions (if provided) */}
        {quickActions.length > 0 && (
          <section role="region" aria-labelledby="quick-actions-heading">
            <Card>
              <CardHeader>
                <CardTitle id="quick-actions-heading" className="text-base">{t('quickActions')}</CardTitle>
                <CardDescription>{t('quickActionsDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:grid-cols-4 gap-3">
                  {quickActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <Button
                        key={action.labelKey}
                        variant="outline"
                        className="h-auto py-4 flex flex-col md:flex-row flex-col items-center gap-2"
                        onClick={action.action}
                        aria-label={t(action.labelKey)}
                      >
                        <Icon aria-hidden="true" className={`h-5 w-5 ${action.color}`} />
                        <span className="text-sm">{t(action.labelKey)}</span>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Activity Summary (if provided) */}
        {summaryItems.length > 0 && (
          <section role="region" aria-labelledby="summary-heading">
            <Card>
              <CardHeader>
                <CardTitle id="summary-heading" className="text-base">{t('summaryTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
                  {summaryItems.map((item) => (
                    <div key={item.labelKey} className="text-center p-4 border rounded-lg">
                      <p 
                        className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold" 
                        aria-label={item.ariaLabel || `${item.value} ${t(item.labelKey)}`}
                      >
                        {item.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{t(item.labelKey)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Custom Content */}
        {customContent}
      </div>
    </main>
  )
}
