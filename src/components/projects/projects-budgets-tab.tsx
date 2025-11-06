"use client"

import { useTranslations } from 'next-intl'
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Plus, Filter } from "lucide-react"
import type { TabComponentProps } from "@/types"

export function ProjectsBudgetsTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const t = useTranslations('production.projects.budgets')
  const tCommon = useTranslations('common')
  const { data: budgets, loading, error } = useModuleData(workspaceId, 'projects', 'budgets')
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-full" role="alert" aria-live="assertive">
        <div className="text-center">
          <DollarSign aria-hidden="true" className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">Failed to load budgets</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </div>
      </div>
    )
  }

  const mockBudgets = [
    {
      id: 1,
      project_name: 'Festival Main Stage',
      category: 'Production',
      allocated: 500000,
      spent: 387500,
      remaining: 112500,
      status: 'on_track',
      variance: -2.5,
      last_updated: '2025-11-05T10:00:00'
    },
    {
      id: 2,
      project_name: 'Artist Hospitality',
      category: 'Operations',
      allocated: 150000,
      spent: 142000,
      remaining: 8000,
      status: 'at_risk',
      variance: 5.3,
      last_updated: '2025-11-05T09:30:00'
    },
    {
      id: 3,
      project_name: 'Marketing Campaign',
      category: 'Marketing',
      allocated: 200000,
      spent: 95000,
      remaining: 105000,
      status: 'under_budget',
      variance: -12.5,
      last_updated: '2025-11-05T08:15:00'
    }
  ]

  const budgetData = budgets?.length > 0 ? budgets : mockBudgets

  const totalAllocated = budgetData.reduce((sum: number, b: any) => sum + b.allocated, 0)
  const totalSpent = budgetData.reduce((sum: number, b: any) => sum + b.spent, 0)
  const totalRemaining = budgetData.reduce((sum: number, b: any) => sum + b.remaining, 0)

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'on_track': 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
      'at_risk': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
      'over_budget': 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400',
      'under_budget': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400',
    }
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
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
              <Filter aria-hidden="true" className="mr-2 h-4 w-4" />
              {tCommon('filter')}
            </Button>
            <Button size="sm">
              <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
              {t('addBudget')}
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-3">
          <Card>
            <CardHeader aria-hidden="true" className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle aria-hidden="true" className="text-sm font-medium">{t('stats.totalAllocated')}</CardTitle>
              <DollarSign aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalAllocated)}</div>
              <p className="text-xs text-muted-foreground">{t('stats.totalAllocatedDesc')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader aria-hidden="true" className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle aria-hidden="true" className="text-sm font-medium">{t('stats.totalSpent')}</CardTitle>
              <TrendingUp aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
              <p className="text-xs text-muted-foreground">
                {((totalSpent / totalAllocated) * 100).toFixed(1)}% {t('stats.utilized')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader aria-hidden="true" className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle aria-hidden="true" className="text-sm font-medium">{t('stats.totalRemaining')}</CardTitle>
              <TrendingDown aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRemaining)}</div>
              <p className="text-xs text-muted-foreground">
                {((totalRemaining / totalAllocated) * 100).toFixed(1)}% {t('stats.available')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Budget List */}
        <div className="space-y-3">
          {budgetData.map((budget: any) => (
            <Card key={budget.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle aria-hidden="true" className="text-lg">{budget.project_name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {budget.category}
                      </Badge>
                    </div>
                    <CardDescription>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className={getStatusColor(budget.status)}>
                          {t(`status.${budget.status}`)}
                        </Badge>
                        {Math.abs(budget.variance) > 5 && (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400">
                            <AlertCircle aria-hidden="true" className="mr-1 h-3 w-3" />
                            {formatPercentage(budget.variance)} {t('variance')}
                          </Badge>
                        )}
                      </div>
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    {tCommon('view')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Budget Breakdown */}
                  <div className="grid gap-3 md:grid-cols-3">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">{t('allocated')}</div>
                      <div className="text-lg font-bold">{formatCurrency(budget.allocated)}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">{t('spent')}</div>
                      <div className="text-lg font-bold text-red-600">{formatCurrency(budget.spent)}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">{t('remaining')}</div>
                      <div className="text-lg font-bold text-green-600">{formatCurrency(budget.remaining)}</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{t('utilization')}</span>
                      <span>{((budget.spent / budget.allocated) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          budget.status === 'over_budget'
                            ? 'bg-red-500'
                            : budget.status === 'at_risk'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((budget.spent / budget.allocated) * 100, 100)}%` }}
                        role="progressbar"
                        aria-valuenow={(budget.spent / budget.allocated) * 100}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div className="text-xs text-muted-foreground">
                    {t('lastUpdated')}: {new Date(budget.last_updated).toLocaleString()}
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
