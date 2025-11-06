"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  RefreshCw, Calendar} from "lucide-react"
import { Plus } from "lucide-react"
import type { TabComponentProps } from "@/types"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { useModuleData } from "@/hooks/use-module-data"
import { formatCurrency, formatDate, formatPercentage, formatNumber } from "@/lib/utils/locale-formatting"

export function FinanceOverviewTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const t = useTranslations('business.finance.overview')
  const tCommon = useTranslations('business.common')
  const locale = useLocale()
  const { data: financeData, loading, error } = useModuleData(workspaceId, 'finance', 'overview')

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

  // Sample data structure
  const overview = {
    totalRevenue: 2450000,
    totalExpenses: 1890000,
    netIncome: 560000,
    cashOnHand: 875000,
    revenueChange: 12.3,
    expenseChange: -5.2,
    budgetHealth: 78,
    burnRate: 185000,
  }

  const monthlyData = [
    { month: 'Jan', revenue: 180000, expenses: 155000 },
    { month: 'Feb', revenue: 195000, expenses: 160000 },
    { month: 'Mar', revenue: 210000, expenses: 165000 },
    { month: 'Apr', revenue: 205000, expenses: 158000 },
    { month: 'May', revenue: 225000, expenses: 172000 },
    { month: 'Jun', revenue: 240000, expenses: 180000 },
  ]

  const spendingByCategory = [
    { category: t('mockData.categories.payroll'), amount: 680000, percentage: 36 },
    { category: t('mockData.categories.equipment'), amount: 450000, percentage: 24 },
    { category: t('mockData.categories.venues'), amount: 340000, percentage: 18 },
    { category: t('mockData.categories.marketing'), amount: 230000, percentage: 12 },
    { category: t('mockData.categories.other'), amount: 190000, percentage: 10 },
  ]

  const alerts = [
    { id: 1, type: 'warning', message: t('mockData.alerts.budgetVariance'), priority: 'high' },
    { id: 2, type: 'info', message: t('mockData.alerts.invoicesPending'), priority: 'medium' },
    { id: 3, type: 'success', message: t('mockData.alerts.cashFlowPositive'), priority: 'low' },
  ]

  const maxRevenue = Math.max(...monthlyData.map((d: any) => d.revenue))
  const maxExpense = Math.max(...monthlyData.map((d: any) => d.expenses))
  const maxValue = Math.max(maxRevenue, maxExpense)

  if (error) {
    return (
      <div className="flex items-center justify-center h-full" role="alert" aria-live="assertive">
        <div className="text-center">
          <Calendar aria-hidden="true" className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">Failed to load data</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </div>
      </div>
    )
  }


  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-4">
        <Card>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign aria-hidden="true" className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{formatCurrency(overview.totalRevenue, locale)}</div>
            <div className="flex flex-wrap items-center text-xs text-green-600">
              <TrendingUp aria-hidden="true" className="h-3 w-3" />
              {formatPercentage(overview.revenueChange)} vs last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownRight aria-hidden="true" className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{formatCurrency(overview.totalExpenses, locale)}</div>
            <div className="flex flex-wrap items-center text-xs text-green-600">
              <TrendingDown aria-hidden="true" className="h-3 w-3" />
              {formatPercentage(overview.expenseChange)} vs last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">Net Income</CardTitle>
            <TrendingUp aria-hidden="true" className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-green-600">{formatCurrency(overview.netIncome, locale)}</div>
            <div className="text-xs text-muted-foreground">
              {((overview.netIncome / overview.totalRevenue) * 100).toFixed(1)}% profit margin
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">Cash on Hand</CardTitle>
            <Wallet aria-hidden="true" className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{formatCurrency(overview.cashOnHand, locale)}</div>
            <div className="text-xs text-muted-foreground">
              {(overview.cashOnHand / overview.burnRate).toFixed(1)} months runway
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 md:gap-2 md:gap-3 lg:gap-4 lg:gap-6 md:grid-cols-2">
        {/* Revenue vs Expenses Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Monthly comparison (Last 6 months)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex flex-wrap justify-between text-sm">
                    <span className="font-medium">{data.month}</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(data.revenue - data.expenses, locale)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="relative h-6 bg-gray-100 dark:bg-gray-800 rounded">
                      <div
                        className="absolute sm:relative sm:inset-auto inset-y-0 left-0 bg-green-500 rounded sm:relative sm:inset-auto"
                        style={{ width: `${(data.revenue / maxValue) * 100}%` }}
                      >
                        <span className="absolute sm:relative sm:inset-auto right-2 top-1/2 -translate-y-1/2 text-xs text-white font-medium sm:relative sm:inset-auto">
                          {formatCurrency(data.revenue, locale)}
                        </span>
                      </div>
                    </div>
                    <div className="relative h-6 bg-gray-100 dark:bg-gray-800 rounded">
                      <div
                        className="absolute sm:relative sm:inset-auto inset-y-0 left-0 bg-red-500 rounded sm:relative sm:inset-auto"
                        style={{ width: `${(data.expenses / maxValue) * 100}%` }}
                      >
                        <span className="absolute sm:relative sm:inset-auto right-2 top-1/2 -translate-y-1/2 text-xs text-white font-medium sm:relative sm:inset-auto">
                          {formatCurrency(data.expenses, locale)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4 mt-4 pt-4 border-t">
              <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span className="text-sm">Revenue</span>
              </div>
              <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded" />
                <span className="text-sm">Expenses</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spending by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>YTD expense breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {spendingByCategory.map((category: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex flex-wrap justify-between text-sm">
                    <span className="font-medium">{category.category}</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(category.amount, locale)} ({category.percentage}%)
                    </span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Health & Alerts */}
      <div className="grid gap-3 md:gap-2 md:gap-3 lg:gap-4 lg:gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Budget Health</CardTitle>
            <CardDescription>Overall budget utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl md:text-2xl md:text-3xl lg:text-4xl lg:text-3xl md:text-4xl lg:text-5xl font-bold">{overview.budgetHealth}%</div>
                <div className="text-sm text-muted-foreground mt-1">On track</div>
              </div>
              <Progress value={overview.budgetHealth} className="h-4" />
              <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4 text-center pt-4 border-t">
                <div>
                  <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-green-600">15</div>
                  <div className="text-xs text-muted-foreground">Under Budget</div>
                </div>
                <div>
                  <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-blue-600">8</div>
                  <div className="text-xs text-muted-foreground">On Track</div>
                </div>
                <div>
                  <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-red-600">3</div>
                  <div className="text-xs text-muted-foreground">Over Budget</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alerts & Notifications</CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert: any) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    alert.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200' :
                    alert.type === 'success' ? 'bg-green-50 dark:bg-green-950 border-green-200' :
                    'bg-blue-50 dark:bg-blue-950 border-blue-200'
                  }`}
                >
                  <AlertCircle aria-hidden="true" className={`h-5 w-5 mt-0.5 ${
                    alert.type === 'warning' ? 'text-yellow-600' :
                    alert.type === 'success' ? 'text-green-600' :
                    'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{alert.message}</div>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {alert.priority} priority
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">View Cash Flow</Button>
            <Button variant="outline">Budget Scenarios</Button>
            <Button variant="outline">Variance Analysis</Button>
            <Button variant="outline">Generate Report</Button>
            <Button variant="outline">Approve Invoices</Button>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
