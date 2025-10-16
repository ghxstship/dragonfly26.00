"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Waves, TrendingUp, TrendingDown, AlertCircle, DollarSign, Calendar } from "lucide-react"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { formatCurrency, formatDate, formatPercentage, formatNumber } from "@/lib/utils/locale-formatting"

interface FinanceCashFlowTabProps {
  data?: any[]
  loading?: boolean
}

// Mock data for demo/fallback
const MOCK_MONTHLY_DATA = [
  { month: 'Oct 2024', inflows: 150000, outflows: 125000, net: 25000, balance: 125000 },
  { month: 'Nov 2024', inflows: 120000, outflows: 135000, net: -15000, balance: 110000 },
  { month: 'Dec 2024', inflows: 180000, outflows: 145000, net: 35000, balance: 145000 },
  { month: 'Jan 2025', inflows: 100000, outflows: 130000, net: -30000, balance: 115000 },
  { month: 'Feb 2025', inflows: 140000, outflows: 128000, net: 12000, balance: 127000 },
  { month: 'Mar 2025', inflows: 160000, outflows: 135000, net: 25000, balance: 152000 },
]

export function FinanceCashFlowTab({ data, loading }: FinanceCashFlowTabProps) {
  const t = useTranslations('business.finance.cashFlow')
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
  const monthlyData = (data && data.length > 0) ? data.slice(0, 12) : [
    ...MOCK_MONTHLY_DATA
  ]

  const currentBalance = monthlyData[0]?.balance || 125000
  const projectedBalance = monthlyData[monthlyData.length - 1]?.balance || 98000
  const cashRunway = 16 // weeks

  const inflowCategories = [
    { name: t('mockData.inflows.clientPayments'), amount: 85000, percent: 57 },
    { name: t('mockData.inflows.grantsFunding'), amount: 40000, percent: 27 },
    { name: t('mockData.inflows.ticketSales'), amount: 15000, percent: 10 },
    { name: t('mockData.inflows.otherIncome'), amount: 10000, percent: 6 },
  ]

  const outflowCategories = [
    { name: t('mockData.outflows.payroll'), amount: 60000, percent: 48 },
  ]

  const maxAmount = Math.max(...monthlyData.map(d => Math.max(d.inflows, d.outflows)))

  return (
    <div className="space-y-6">
      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Cash flow management
        </p>
        <Button size="sm">
          <Plus className="h-4 w-4" aria-hidden="true"  />
          Create
        </Button>
      </div>


      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <DollarSign className="h-4 w-4" aria-hidden="true"  />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              As of today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projected (30d)</CardTitle>
            <Waves className="h-4 w-4" aria-hidden="true"  />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${projectedBalance < currentBalance ? 'text-red-600' : 'text-green-600'}`}>
              ${projectedBalance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {projectedBalance < currentBalance ? '-' : '+'}${Math.abs(projectedBalance - currentBalance).toLocaleString()} change
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Runway</CardTitle>
            <Calendar className="h-4 w-4" aria-hidden="true"  />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cashRunway} weeks</div>
            <p className="text-xs text-muted-foreground">
              At current burn rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Burn Rate</CardTitle>
            <TrendingDown className="h-4 w-4" aria-hidden="true"  />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">$7,800</div>
            <p className="text-xs text-muted-foreground">
              Per week average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Projection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>6-Month Cash Flow Projection</CardTitle>
              <CardDescription>Projected inflows, outflows, and ending balance</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Export Projection
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Waterfall Chart */}
            {monthlyData.map((month, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{month.month}</span>
                  <Badge variant={month.net >= 0 ? 'default' : 'destructive'}>
                    {month.net >= 0 ? '+' : ''}${month.net.toLocaleString()} net
                  </Badge>
                </div>

                {/* Inflows */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-16">Inflows</span>
                  <div className="flex-1">
                    <div className="w-full bg-secondary rounded-full h-6 relative">
                      <div
                        className="bg-green-500 h-6 rounded-full transition-all flex items-center justify-end pr-2"
                        style={{ width: `${(month.inflows / maxAmount) * 100}%` }}
                      >
                        <span className="text-xs font-medium text-white">
                          ${(month.inflows / 1000).toFixed(0)}k
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outflows */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-16">Outflows</span>
                  <div className="flex-1">
                    <div className="w-full bg-secondary rounded-full h-6 relative">
                      <div
                        className="bg-red-500 h-6 rounded-full transition-all flex items-center justify-end pr-2"
                        style={{ width: `${(month.outflows / maxAmount) * 100}%` }}
                      >
                        <span className="text-xs font-medium text-white">
                          ${(month.outflows / 1000).toFixed(0)}k
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Balance */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-16">Balance</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="text-sm font-semibold">
                      ${month.balance.toLocaleString()}
                    </div>
                  </div>
                </div>

                {index < monthlyData.length - 1 && (
                  <div className="border-b my-3" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Breakdown & Upcoming */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Inflow Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" aria-hidden="true"  />
              Inflow Breakdown
            </CardTitle>
            <CardDescription>Sources of cash inflows this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inflowCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-green-600 font-semibold">
                      ${category.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${category.percent}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right">
                      {category.percent}%
                    </span>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between font-semibold">
                  <span>Total Inflows</span>
                  <span className="text-green-600">
                    ${inflowCategories.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Outflow Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" aria-hidden="true"  />
              Outflow Breakdown
            </CardTitle>
            <CardDescription>Cash outflows by category this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {outflowCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-red-600 font-semibold">
                      ${category.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all"
                        style={{ width: `${category.percent}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right">
                      {category.percent}%
                    </span>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between font-semibold">
                  <span>Total Outflows</span>
                  <span className="text-red-600">
                    ${outflowCategories.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Payments</CardTitle>
          <CardDescription>Scheduled payments in the next 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingPayments.map((payment, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  payment.critical ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950' : 'bg-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  {payment.critical && (
                    <AlertCircle className="h-4 w-4" aria-hidden="true"  />
                  )}
                  <div>
                    <p className="font-medium text-sm">{payment.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{payment.date}</span>
                      <span>•</span>
                      <span>{payment.category}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">${payment.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
            <div className="pt-3 border-t">
              <div className="flex items-center justify-between font-semibold">
                <span>Total Due (30 days)</span>
                <span className="text-red-600">
                  ${upcomingPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert */}
      {cashRunway < 20 && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" aria-hidden="true"  />
              Cash Runway Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                Your current cash runway is <strong>{cashRunway} weeks</strong>. Consider the following actions:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                <li>Accelerate receivables collection from clients</li>
                <li>Review and defer non-critical expenses</li>
                <li>Explore additional funding sources or credit lines</li>
                <li>Negotiate extended payment terms with vendors</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
