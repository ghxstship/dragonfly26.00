"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatCard } from "@/components/molecules"
import { cn } from "@/lib/utils"
import type { DataItem } from "@/types"
import type { FieldSchema } from "@/lib/data-schemas"

/**
 * FinancialDashboardOrganism - Organism Component
 * 
 * Financial dashboard with metrics, charts, and expense breakdown.
 * Extracted from views/financial-view.tsx for atomic design system.
 * 
 * Features:
 * - Revenue/expense/profit metrics
 * - Period selection (month/quarter/year)
 * - Expense breakdown by category
 * - Budget tracking
 * - Trend indicators
 * - Full i18n and accessibility
 */

export interface FinancialDashboardOrganismProps<T extends DataItem = DataItem> {
  data: T[]
  schema?: FieldSchema[]
  onItemClick?: (item: T) => void
}

interface FinancialMetrics {
  revenue: number
  expenses: number
  profit: number
  budget: number
}

export function FinancialDashboardOrganism({ data, schema, onItemClick }: FinancialDashboardOrganismProps) {
  const t = useTranslations()
  const [period, setPeriod] = useState<"month" | "quarter" | "year">("month")

  // Calculate financial metrics
  const metrics: FinancialMetrics = data.reduce(
    (acc, item) => {
      const amount = (item as any).amount || 0
      const type = (item as any).type
      
      if (type === "revenue" || amount > 0) {
        acc.revenue += Math.abs(amount)
      } else if (type === "expense" || amount < 0) {
        acc.expenses += Math.abs(amount)
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
    .filter((item: any) => item.type === "expense" || (item.amount && item.amount < 0))
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
          <DollarSign className="h-5 w-5" aria-hidden="true" />
          <h3 className="font-semibold">{t('financial.dashboard')}</h3>
        </div>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as any)}>
          <TabsList>
            <TabsTrigger value="month">{t('financial.month')}</TabsTrigger>
            <TabsTrigger value="quarter">{t('financial.quarter')}</TabsTrigger>
            <TabsTrigger value="year">{t('financial.year')}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto space-y-3 md:space-y-4 lg:space-y-6 px-4 md:px-6 lg:px-8">
          {/* Key Metrics */}
          <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={DollarSign}
              label={t('financial.revenue')}
              value={`$${metrics.revenue.toLocaleString()}`}
              iconColor="green"
            />
            <StatCard
              icon={TrendingDown}
              label={t('financial.expenses')}
              value={`$${metrics.expenses.toLocaleString()}`}
              iconColor="red"
            />
            <StatCard
              icon={metrics.profit >= 0 ? TrendingUp : TrendingDown}
              label={t('financial.profit')}
              value={`$${metrics.profit.toLocaleString()}`}
              iconColor={metrics.profit >= 0 ? "green" : "red"}
              trend={`${profitMargin.toFixed(1)}%`}
            />
            <StatCard
              icon={DollarSign}
              label={t('financial.budget')}
              value={`${budgetUsed.toFixed(1)}%`}
              subtitle={`$${metrics.expenses.toLocaleString()} / $${metrics.budget.toLocaleString()}`}
              iconColor="blue"
            />
          </div>

          {/* Expense Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>{t('financial.topExpenses')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topExpenses.map(([category, amount]: [string, any]) => {
                  const percentage = (amount / metrics.expenses) * 100
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-sm">
                        <span className="font-medium">{category}</span>
                        <span className="text-muted-foreground">
                          ${(amount as number).toLocaleString()} ({percentage.toFixed(1)}%)
                        </span>
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

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>{t('financial.recentTransactions')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.slice(0, 10).map((item: any) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row flex-col md:flex-row items-center justify-between p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => onItemClick?.(item)}
                  >
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-3">
                      <div className={cn(
                        'p-2 rounded-full',
                        item.amount > 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-red-100 dark:bg-red-950'
                      )}>
                        {item.amount > 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" aria-hidden="true" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" aria-hidden="true" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{item.name || item.description}</p>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      </div>
                    </div>
                    <span className={cn(
                      'font-semibold',
                      item.amount > 0 ? 'text-green-600' : 'text-red-600'
                    )}>
                      {item.amount > 0 ? '+' : ''}${Math.abs(item.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
