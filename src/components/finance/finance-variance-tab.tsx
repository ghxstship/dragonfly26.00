"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Info, ChevronRight, Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { formatCurrency, formatDate, formatPercentage, formatNumber } from "@/lib/utils/locale-formatting"

interface FinanceVarianceTabProps {
  data?: Record<string, unknown>[]
  loading?: boolean
}

interface Variance {
  id: string | number
  categoryKey?: string
  category?: string
  budgeted: number
  actual: number
  variance: number
  variancePercent: number
  type: string
  rootCauseKey?: string
  rootCause?: string
  requiresAction: boolean
  actionTaken: boolean
  period: string
}

// Type guard to ensure variance has required properties
function isValidVariance(obj: any): obj is Variance {
  if (typeof obj !== 'object' || obj === null) return false
  const v = obj as Record<string, unknown>
  return (
    (typeof v.id === 'string' || typeof v.id === 'number') &&
    typeof v.budgeted === 'number' &&
    typeof v.actual === 'number' &&
    typeof v.variance === 'number' &&
    typeof v.variancePercent === 'number' &&
    typeof v.type === 'string' &&
    typeof v.requiresAction === 'boolean' &&
    typeof v.actionTaken === 'boolean' &&
    typeof v.period === 'string'
  )
}

// Mock data for demo/fallback - will be replaced with t() calls in component
const MOCK_VARIANCES: Variance[] = [
  {
    id: '1',
    categoryKey: 'mockData.categories.equipmentRental',
    budgeted: 50000,
    actual: 55000,
    variance: -5000,
    variancePercent: -10,
    type: 'unfavorable',
    rootCauseKey: 'mockData.rootCauses.additionalEquipment',
    requiresAction: true,
    actionTaken: false,
    period: 'Q3 2024',
  },
  {
    id: '2',
    categoryKey: 'mockData.categories.postProduction',
    budgeted: 80000,
    actual: 72000,
    variance: 8000,
    variancePercent: 10,
    type: 'favorable',
    rootCauseKey: 'mockData.rootCauses.negotiatedRates',
    requiresAction: false,
    actionTaken: false,
    period: 'Q3 2024',
  },
  {
    id: '3',
    categoryKey: 'mockData.categories.travelAccommodation',
    budgeted: 30000,
    actual: 38000,
    variance: -8000,
    variancePercent: -26.7,
    type: 'unfavorable',
    rootCauseKey: 'mockData.rootCauses.locationChanges',
    requiresAction: true,
    actionTaken: false,
    period: 'Q3 2024',
  },
  {
    id: '4',
    categoryKey: 'mockData.categories.catering',
    budgeted: 25000,
    actual: 23500,
    variance: 1500,
    variancePercent: 6,
    type: 'favorable',
    rootCauseKey: 'mockData.rootCauses.reducedCrewSize',
    requiresAction: false,
    actionTaken: false,
    period: 'Q3 2024',
  },
]

export function FinanceVarianceTab({ data, loading }: FinanceVarianceTabProps) {
  const t = useTranslations('business.finance.variance')
  const tCommon = useTranslations('business.common')
  const locale = useLocale()
  if (loading) {
    return (
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="flex items-center justify-center h-full"
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"
            aria-hidden="true"
          ></div>
          <p className="text-muted-foreground">
            {tCommon('loading', { resource: t('title') })}
          </p>
        </div>
      </div>
    )
  }

  // ✅ Use real data if available, otherwise mock
  let variances: Variance[] = MOCK_VARIANCES
  if (data && data.length > 0) {
    const validVariances = data.filter(isValidVariance) as unknown as Variance[]
    if (validVariances.length > 0) {
      variances = validVariances.slice(0, 10)
    }
  }

  const totalBudgeted = variances.reduce((sum: number, v) => sum + v.budgeted, 0)
  const totalActual = variances.reduce((sum: number, v) => sum + v.actual, 0)
  const totalVariance = totalActual - totalBudgeted
  const totalVariancePercent = ((totalVariance / totalBudgeted) * 100).toFixed(1)

  const favorableCount = variances.filter(v => v.type === 'favorable').length
  const unfavorableCount = variances.filter(v => v.type === 'unfavorable').length
  const favorableAmount = variances.filter(v => v.type === 'favorable').reduce((sum: number, v) => sum + v.variance, 0)
  const unfavorableAmount = variances.filter(v => v.type === 'unfavorable').reduce((sum: number, v) => sum + Math.abs(v.variance), 0)
  const actionRequiredCount = variances.filter(v => v.requiresAction && !v.actionTaken).length

  const rootCauseCategories: Array<{ category: string; count: number; amount: number }> = [
    { category: t('mockData.rootCauseCategories.scopeChanges'), count: 2, amount: 13000 },
    { category: t('mockData.rootCauseCategories.vendorNegotiations'), count: 1, amount: 8000 },
    { category: t('mockData.rootCauseCategories.resourceOptimization'), count: 1, amount: 1500 },
  ]

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-4">
        <Card>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">Total Variance</CardTitle>
            {totalVariance >= 0 ? (
              <TrendingUp aria-hidden="true" className="h-4 w-4" />
            ) : (
              <TrendingDown aria-hidden="true" className="h-4 w-4" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalVariance >= 0 ? '+' : ''}${totalVariance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalVariance >= 0 ? '+' : ''}{totalVariancePercent}% vs budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">Favorable</CardTitle>
            <TrendingUp aria-hidden="true" className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-green-600">
              {favorableCount}
            </div>
            <p className="text-xs text-muted-foreground">
              +${favorableAmount.toLocaleString()} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">Unfavorable</CardTitle>
            <TrendingDown aria-hidden="true" className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-red-600">
              {unfavorableCount}
            </div>
            <p className="text-xs text-muted-foreground">
              -${unfavorableAmount.toLocaleString()} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">Action Required</CardTitle>
            <AlertTriangle aria-hidden="true" className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-orange-600">
              {actionRequiredCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Items need review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Variance Details */}
      <Card>
        <CardHeader>
          <CardTitle>Variance by Category</CardTitle>
          <CardDescription>Detailed breakdown of budget vs actual performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {variances.map((variance: any) => (
              <Card key={variance.id} className={`border-l-4 ${
                variance.type === 'favorable' ? 'border-l-green-500' : 'border-l-red-500'
              }`}>
                <CardContent aria-hidden="true" className="pt-6">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                          <h4 className="font-semibold">{variance.categoryKey ? t(variance.categoryKey) : variance.category}</h4>
                          <Badge variant={variance.type === 'favorable' ? 'default' : 'destructive'}>
                            {variance.type}
                          </Badge>
                          {variance.requiresAction && (
                            <Badge variant="outline" className="border-orange-500 text-orange-600">
                              Action Required
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{variance.period}</p>
                      </div>
                      <div className={`text-right ${
                        variance.type === 'favorable' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
                          {variance.variance >= 0 ? '+' : ''}${variance.variance.toLocaleString()}
                        </div>
                        <div className="text-sm font-medium">
                          {variance.variance >= 0 ? '+' : ''}{variance.variancePercent.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    {/* Budget vs Actual */}
                    <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Budgeted:</span>
                        <span className="ml-2 font-semibold">${variance.budgeted.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Actual:</span>
                        <span className="ml-2 font-semibold">${variance.actual.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Root Cause */}
                    <div className="flex items-start gap-2 p-3 bg-muted rounded-md">
                      <Info aria-hidden="true" className="h-4 w-4" />
                      <div className="space-y-1 flex-1">
                        <p className="text-xs font-medium">Root Cause</p>
                        <p className="text-sm text-muted-foreground">{variance.rootCauseKey ? t(variance.rootCauseKey) : variance.rootCause}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    {variance.requiresAction && !variance.actionTaken && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          Add Corrective Action
                        </Button>
                        <Button size="sm" className="flex-1">
                          Mark Reviewed
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Sections */}
      <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-2">
        {/* Root Cause Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Root Cause Analysis</CardTitle>
            <CardDescription>Primary drivers of budget variances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rootCauseCategories.map((cause, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                    <h4 className="font-medium text-sm">{cause.category}</h4>
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                      <span className="text-sm font-semibold">
                        ${Math.abs(cause.amount).toLocaleString()}
                      </span>
                      <ChevronRight aria-hidden="true" className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-xs text-muted-foreground">
                    <span>{cause.count} {cause.count === 1 ? 'item' : 'items'}</span>
                    <span>•</span>
                    <span>{((Math.abs(cause.amount) / unfavorableAmount) * 100).toFixed(0)}% of unfavorable</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 max-w-full">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(Math.abs(cause.amount) / unfavorableAmount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Variance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Variance Trends</CardTitle>
            <CardDescription>Historical variance patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-sm">
                  <span className="text-muted-foreground">Q1 2024</span>
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                    <div className="w-24 bg-secondary rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }} />
                    </div>
                    <span className="text-green-600 font-medium">+$4.5k</span>
                  </div>
                </div>
                <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-sm">
                  <span className="text-muted-foreground">Q2 2024</span>
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                    <div className="w-24 bg-secondary rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }} />
                    </div>
                    <span className="text-green-600 font-medium">+$2.1k</span>
                  </div>
                </div>
                <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-sm">
                  <span className="text-muted-foreground">Q3 2024</span>
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                    <div className="w-24 bg-secondary rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '50%' }} />
                    </div>
                    <span className="text-red-600 font-medium">-$3.5k</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" aria-hidden="true"  />
                  <span className="text-muted-foreground">Average variance: <strong className="text-green-600">+$1.0k</strong></span>
                </div>
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-sm mt-2">
                  <AlertTriangle aria-hidden="true" className="h-4 w-4" />
                  <span className="text-muted-foreground">Trending: <strong className="text-orange-600">Worsening</strong></span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Budget Performance</CardTitle>
          <CardDescription>Cumulative budget vs actual comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Budgeted</p>
                <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">${totalBudgeted.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Actual</p>
                <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">${totalActual.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Variance</p>
                <p className={`text-2xl font-bold ${totalVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalVariance >= 0 ? '+' : ''}${totalVariance.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="relative pt-1">
              <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground">Budget Utilization</span>
                <span className="text-xs font-semibold">{((totalActual / totalBudgeted) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-3 max-w-full">
                <div
                  className={`h-3 rounded-full transition-all ${
                    totalActual > totalBudgeted ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((totalActual / totalBudgeted) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
