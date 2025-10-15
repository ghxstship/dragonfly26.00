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
  RefreshCw
} from "lucide-react"
import { useModuleData } from "@/hooks/use-module-data"
import type { TabComponentProps } from "@/types"

export function FinanceOverviewTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const { data: financeData, loading } = useModuleData(workspaceId, 'finance', 'overview')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading financial data...</p>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
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
    { category: 'Payroll', amount: 680000, percentage: 36 },
    { category: 'Equipment', amount: 450000, percentage: 24 },
    { category: 'Venues', amount: 340000, percentage: 18 },
    { category: 'Marketing', amount: 230000, percentage: 12 },
    { category: 'Other', amount: 190000, percentage: 10 },
  ]

  const alerts = [
    { id: 1, type: 'warning', message: 'Budget variance exceeds 15% in Equipment category', priority: 'high' },
    { id: 2, type: 'info', message: '3 invoices pending approval', priority: 'medium' },
    { id: 3, type: 'success', message: 'Cash flow forecast positive for next quarter', priority: 'low' },
  ]

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue))
  const maxExpense = Math.max(...monthlyData.map(d => d.expenses))
  const maxValue = Math.max(maxRevenue, maxExpense)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Financial Overview</h2>
          <p className="text-muted-foreground">
            Real-time financial metrics and performance indicators
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overview.totalRevenue)}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              {formatPercentage(overview.revenueChange)} vs last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overview.totalExpenses)}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              {formatPercentage(overview.expenseChange)} vs last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(overview.netIncome)}</div>
            <div className="text-xs text-muted-foreground">
              {((overview.netIncome / overview.totalRevenue) * 100).toFixed(1)}% profit margin
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash on Hand</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overview.cashOnHand)}</div>
            <div className="text-xs text-muted-foreground">
              {(overview.cashOnHand / overview.burnRate).toFixed(1)} months runway
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue vs Expenses Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Monthly comparison (Last 6 months)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{data.month}</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(data.revenue - data.expenses)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="relative h-6 bg-gray-100 dark:bg-gray-800 rounded">
                      <div
                        className="absolute inset-y-0 left-0 bg-green-500 rounded"
                        style={{ width: `${(data.revenue / maxValue) * 100}%` }}
                      >
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white font-medium">
                          {formatCurrency(data.revenue)}
                        </span>
                      </div>
                    </div>
                    <div className="relative h-6 bg-gray-100 dark:bg-gray-800 rounded">
                      <div
                        className="absolute inset-y-0 left-0 bg-red-500 rounded"
                        style={{ width: `${(data.expenses / maxValue) * 100}%` }}
                      >
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white font-medium">
                          {formatCurrency(data.expenses)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span className="text-sm">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
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
              {spendingByCategory.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{category.category}</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(category.amount)} ({category.percentage}%)
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
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Budget Health</CardTitle>
            <CardDescription>Overall budget utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-5xl font-bold">{overview.budgetHealth}%</div>
                <div className="text-sm text-muted-foreground mt-1">On track</div>
              </div>
              <Progress value={overview.budgetHealth} className="h-4" />
              <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t">
                <div>
                  <div className="text-2xl font-bold text-green-600">15</div>
                  <div className="text-xs text-muted-foreground">Under Budget</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">8</div>
                  <div className="text-xs text-muted-foreground">On Track</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">3</div>
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
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    alert.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200' :
                    alert.type === 'success' ? 'bg-green-50 dark:bg-green-950 border-green-200' :
                    'bg-blue-50 dark:bg-blue-950 border-blue-200'
                  }`}
                >
                  <AlertCircle className={`h-5 w-5 mt-0.5 ${
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
