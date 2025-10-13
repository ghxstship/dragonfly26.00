"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmptyState } from "@/components/shared/empty-state"
import { cn } from "@/lib/utils"
import type { DataItem } from "@/types"

interface FinancialViewProps {
  data: DataItem[]
  onItemClick?: (item: DataItem) => void
}

interface FinancialMetrics {
  revenue: number
  expenses: number
  profit: number
  budget: number
}

export function FinancialView({ data, onItemClick }: FinancialViewProps) {
  const t = useTranslations()
  const [period, setPeriod] = useState<"month" | "quarter" | "year">("month")

  // Calculate financial metrics
  const metrics: FinancialMetrics = data.reduce(
    (acc, item) => {
      if (item.type === "revenue" || item.amount > 0) {
        acc.revenue += Math.abs(item.amount || 0)
      } else if (item.type === "expense" || item.amount < 0) {
        acc.expenses += Math.abs(item.amount || 0)
      }
      return acc
    },
    { revenue: 0, expenses: 0, profit: 0, budget: 100000 }
  )

  metrics.profit = metrics.revenue - metrics.expenses
  const profitMargin = metrics.revenue > 0 ? (metrics.profit / metrics.revenue) * 100 : 0
  const budgetUsed = (metrics.expenses / metrics.budget) * 100

  // Group expenses by category
  const expensesByCategory = data
    .filter((item) => item.type === "expense" || (item.amount && item.amount < 0))
    .reduce((acc, item) => {
      const category = item.category || "Other"
      if (!acc[category]) acc[category] = 0
      acc[category] += Math.abs(item.amount || 0)
      return acc
    }, {} as Record<string, number>)

  const topExpenses = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          <h3 className="font-semibold">Financial Dashboard</h3>
        </div>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as any)}>
          <TabsList>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="quarter">Quarter</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center">
            <Badge variant="outline" className="mb-3 text-xs uppercase tracking-wider">
              {t('views.emptyState.financialView')}
            </Badge>
            <h3 className="text-xl font-bold mb-2">{t('views.emptyState.nothingToSeeYet')}</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              {t('views.emptyState.financialViewDescription')}
            </p>
            <Button size="lg">
              <Plus className="h-4 w-4 mr-2" />
              {t('views.emptyState.createFirstItem')}
            </Button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${metrics.revenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500 inline-flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    12.5%
                  </span>{" "}
                  from last {period}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${metrics.expenses.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-red-500 inline-flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    5.2%
                  </span>{" "}
                  from last {period}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Profit</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className={cn("text-2xl font-bold", metrics.profit >= 0 ? "text-green-500" : "text-red-500")}>
                  ${metrics.profit.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {profitMargin.toFixed(1)}% profit margin
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Budget</CardTitle>
                <Badge variant={budgetUsed > 90 ? "destructive" : "secondary"}>
                  {budgetUsed.toFixed(0)}%
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${metrics.budget.toLocaleString()}</div>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all",
                      budgetUsed > 90 ? "bg-red-500" : budgetUsed > 70 ? "bg-orange-500" : "bg-green-500"
                    )}
                    style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue vs Expenses */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-around gap-4 pb-4">
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-green-500 rounded-t-lg transition-all"
                      style={{ height: `${(metrics.revenue / Math.max(metrics.revenue, metrics.expenses)) * 100}%` }}
                    />
                    <div className="text-sm font-medium">Revenue</div>
                    <div className="text-xs text-muted-foreground">${metrics.revenue.toLocaleString()}</div>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-red-500 rounded-t-lg transition-all"
                      style={{ height: `${(metrics.expenses / Math.max(metrics.revenue, metrics.expenses)) * 100}%` }}
                    />
                    <div className="text-sm font-medium">Expenses</div>
                    <div className="text-xs text-muted-foreground">${metrics.expenses.toLocaleString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Expenses */}
            <Card>
              <CardHeader>
                <CardTitle>Top Expense Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topExpenses.map(([category, amount]) => {
                    const percentage = (amount / metrics.expenses) * 100
                    return (
                      <div key={category}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{category}</span>
                          <span className="text-sm text-muted-foreground">${amount.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.slice(0, 10).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 hover:bg-accent rounded-lg transition-colors cursor-pointer"
                    onClick={() => onItemClick?.(item)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          item.type === "revenue" || (item.amount && item.amount > 0) ? "bg-green-500" : "bg-red-500"
                        )}
                      />
                      <div>
                        <div className="font-medium text-sm">{item.name || item.description || "Transaction"}</div>
                        <div className="text-xs text-muted-foreground">{item.category}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={cn(
                          "font-semibold",
                          item.type === "revenue" || (item.amount && item.amount > 0)
                            ? "text-green-500"
                            : "text-red-500"
                        )}
                      >
                        {item.amount && item.amount > 0 ? "+" : ""}${Math.abs(item.amount || 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          </div>
        )}
      </div>
    </div>
  )
}
