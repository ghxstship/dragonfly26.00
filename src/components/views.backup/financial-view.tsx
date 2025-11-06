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
import type { FieldSchema } from "@/lib/data-schemas"
import { getDisplayValue } from "@/lib/schema-helpers"

interface FinancialViewProps {
  data: DataItem[]
  schema?: FieldSchema[]
  onItemClick?: (item: DataItem) => void
  createActionLabel?: string
  onCreateAction?: () => void
}

interface FinancialMetrics {
  revenue: number
  expenses: number
  profit: number
  budget: number
}

interface FinancialSummary {
  total: number
  income: number
  expenses: number
  budget: number
}

export function FinancialView({ data, schema, onItemClick, createActionLabel, onCreateAction }: FinancialViewProps) {
  const t = useTranslations()
  const [period, setPeriod] = useState<"month" | "quarter" | "year">("month")

  // Calculate financial metrics
  const metrics: FinancialMetrics = data.reduce(
    (acc, item) => {
      if ((item as any).type === "revenue" || item.amount > 0) {
        acc.revenue += Math.abs(item.amount || 0)
      } else if ((item as any).type === "expense" || item.amount < 0) {
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
    .filter((item: any) => (item as any).type === "expense" || (item.amount && item.amount < 0))
    .reduce((acc: any, item: any) => {
      const category = item.category || "Other"
      if (!acc[category]) acc[category] = 0
      acc[category] += Math.abs(item.amount || 0)
      return acc
    }, {} as Record<string, number>)

  const topExpenses = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5)

  return (
    <div className="h-full flex flex-wrap flex-col">
      {/* Header */}
      <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between p-4 border-b">
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
          <DollarSign aria-hidden="true" className="h-5 w-5" />
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
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        {data.length === 0 ? (
          <EmptyState
            mainMessage={t('views.emptyState.nothingToSeeYet')}
            description={t('views.emptyState.financialViewDescription')}
            actionLabel={createActionLabel || t('views.emptyState.createFirstItem')}
            onAction={onCreateAction}
          />
        ) : (
          <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto space-y-3 md:space-y-4 lg:space-y-6 px-4 md:px-6 lg:px-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
            <Card>
              <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between pb-2">
                <CardTitle aria-hidden="true" className="text-sm font-medium">Revenue</CardTitle>
                <TrendingUp aria-hidden="true" className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">${metrics.revenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500 inline-flex items-center">
                    <ArrowUpRight aria-hidden="true" className="h-3 w-3 mr-1" />
                    12.5%
                  </span>{" "}
                  from last {period}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between pb-2">
                <CardTitle aria-hidden="true" className="text-sm font-medium">Expenses</CardTitle>
                <TrendingDown aria-hidden="true" className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">${metrics.expenses.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-red-500 inline-flex items-center">
                    <ArrowUpRight aria-hidden="true" className="h-3 w-3 mr-1" />
                    5.2%
                  </span>{" "}
                  from last {period}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between pb-2">
                <CardTitle aria-hidden="true" className="text-sm font-medium">Profit</CardTitle>
                <DollarSign aria-hidden="true" className="h-4 w-4 text-primary" />
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
              <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between pb-2">
                <CardTitle aria-hidden="true" className="text-sm font-medium">Budget</CardTitle>
                <Badge variant={budgetUsed > 90 ? "destructive" : "secondary"}>
                  {budgetUsed.toFixed(0)}%
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">${metrics.budget.toLocaleString()}</div>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden md:block">
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
          <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-3 md:gap-2 md:gap-3 lg:gap-4 lg:gap-6">
            {/* Revenue vs Expenses */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 md:h-56 lg:h-64 flex flex-wrap items-end justify-around gap-2 md:gap-3 lg:gap-4 pb-4">
                  <div className="flex flex-col md:flex-row-1 flex flex-wrap flex-col items-center gap-2">
                    <div
                      className="w-full bg-green-500 rounded-t-lg transition-all max-w-full"
                      style={{ height: `${(metrics.revenue / Math.max(metrics.revenue, metrics.expenses)) * 100}%` }}
                    />
                    <div className="text-sm font-medium">Revenue</div>
                    <div className="text-xs text-muted-foreground">${metrics.revenue.toLocaleString()}</div>
                  </div>
                  <div className="flex flex-col md:flex-row-1 flex flex-wrap flex-col items-center gap-2">
                    <div
                      className="w-full bg-red-500 rounded-t-lg transition-all max-w-full"
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
                    const amountNum = amount as number
                    const percentage = (amountNum / metrics.expenses) * 100
                    return (
                      <div key={category}>
                        <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between mb-1">
                          <span className="text-sm font-medium">{category}</span>
                          <span className="text-sm text-muted-foreground">${amountNum.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden md:block">
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
                {data.slice(0, 10).map((item: any) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row flex-col md:flex-row items-center justify-between p-3 hover:bg-accent rounded-lg transition-colors cursor-pointer"
                     role="button" tabIndex={0} onClick={() => onItemClick?.(item)}
                  >
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-3">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          (item as any).type === "revenue" || (item.amount && item.amount > 0) ? "bg-green-500" : "bg-red-500"
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
                          (item as any).type === "revenue" || (item.amount && item.amount > 0)
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
