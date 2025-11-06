"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GitCompare, TrendingUp, TrendingDown, Minus, Plus, AlertCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { formatCurrency, formatDate, formatPercentage, formatNumber } from "@/lib/utils/locale-formatting"

interface FinanceScenariosTabProps {
  data?: Record<string, unknown>[]
  loading?: boolean
}

interface Scenario {
  id: string | number
  type: string
  nameKey?: string
  name?: string
  probability: number
  projectedRevenue: number
  projectedExpenses: number
  projectedNet: number
  variance: number
  descriptionKey?: string
  description?: string
  isBaseline?: boolean
}

// Type guard to ensure scenario has required properties
function isValidScenario(obj: any): obj is Scenario {
  if (typeof obj !== 'object' || obj === null) return false
  const s = obj as Record<string, unknown>
  return (
    (typeof s.id === 'string' || typeof s.id === 'number') &&
    typeof s.type === 'string' &&
    typeof s.probability === 'number' &&
    typeof s.projectedRevenue === 'number' &&
    typeof s.projectedExpenses === 'number' &&
    typeof s.projectedNet === 'number' &&
    typeof s.variance === 'number'
  )
}

// Mock data for demo/fallback - will be replaced with t() calls in component
const MOCK_SCENARIOS: Scenario[] = [
  {
    id: '1',
    type: 'optimistic',
    nameKey: 'mockData.scenarios.bestCase.name',
    probability: 20,
    projectedRevenue: 500000,
    projectedExpenses: 350000,
    projectedNet: 150000,
    variance: 30,
    descriptionKey: 'mockData.scenarios.bestCase.description',
  },
  {
    id: '2',
    type: 'expected',
    nameKey: 'mockData.scenarios.expectedCase.name',
    probability: 60,
    projectedRevenue: 400000,
    projectedExpenses: 320000,
    projectedNet: 80000,
    variance: 0,
    descriptionKey: 'mockData.scenarios.expectedCase.description',
    isBaseline: true,
  },
  {
    id: '3',
    type: 'pessimistic',
    nameKey: 'mockData.scenarios.worstCase.name',
    probability: 20,
    projectedRevenue: 300000,
    projectedExpenses: 310000,
    projectedNet: -10000,
    variance: -22.5,
    descriptionKey: 'mockData.scenarios.worstCase.description',
  },
]

export function FinanceScenariosTab({ data, loading }: FinanceScenariosTabProps) {
  const t = useTranslations('business.finance.scenarios')
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
  let scenarios: Scenario[] = MOCK_SCENARIOS
  if (data && data.length > 0) {
    // Filter and type-assert after validation
    const validScenarios = data.filter(isValidScenario) as unknown as Scenario[]
    if (validScenarios.length > 0) {
      scenarios = validScenarios.slice(0, 5)
    }
  }

  const weightedAverage = scenarios.reduce((sum: number, s) => {
    return sum + (s.projectedNet * s.probability / 100)
  }, 0)

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-green-600'
    if (variance < 0) return 'text-red-600'
    return 'text-muted-foreground'
  }

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp aria-hidden="true" className="h-4 w-4" />
    if (variance < 0) return <TrendingDown aria-hidden="true" className="h-4 w-4" />
    return <Minus aria-hidden="true" className="h-4 w-4" />
  }

  const getScenarioColor = (type: string) => {
    switch (type) {
      case 'optimistic': return 'border-green-500'
      case 'expected': return 'border-blue-500'
      case 'pessimistic': return 'border-red-500'
      default: return 'border-gray-500'
    }
  }

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Summary Metrics */}
      <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-4">
        <Card>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">Active Scenarios</CardTitle>
            <GitCompare aria-hidden="true" className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{scenarios.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all budgets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">Weighted Average</CardTitle>
            <TrendingUp aria-hidden="true" className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${weightedAverage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${weightedAverage.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Probability-weighted net
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">Best Case</CardTitle>
            <TrendingUp aria-hidden="true" className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-green-600">
              ${scenarios[0].projectedNet.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {scenarios[0].probability}% probability
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">Worst Case</CardTitle>
            <TrendingDown aria-hidden="true" className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-red-600">
              ${scenarios[2].projectedNet.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {scenarios[2].probability}% probability
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Scenario Comparison */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
            <div>
              <CardTitle>Scenario Comparison</CardTitle>
              <CardDescription>Side-by-side analysis of financial projections</CardDescription>
            </div>
            <Button>
              <Plus aria-hidden="true" className="h-4 w-4" />
              New Scenario
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((scenario: any) => (
              <Card 
                key={scenario.id} 
                className={`border-2 ${getScenarioColor(scenario.type)} ${
                  scenario.isBaseline ? 'ring-2 ring-primary ring-offset-2' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                    <CardTitle aria-hidden="true" className="text-lg">{scenario.nameKey ? t(scenario.nameKey) : scenario.name}</CardTitle>
                    {scenario.isBaseline && (
                      <Badge variant="secondary">Baseline</Badge>
                    )}
                  </div>
                  <CardDescription>{scenario.descriptionKey ? t(scenario.descriptionKey) : scenario.description}</CardDescription>
                </CardHeader>
                <CardContent aria-hidden="true" className="space-y-4">
                  {/* Probability */}
                  <div>
                    <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Probability</span>
                      <span className="font-semibold">{scenario.probability}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 max-w-full">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${scenario.probability}%` }}
                      />
                    </div>
                  </div>

                  {/* Revenue */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-sm">
                      <span className="text-muted-foreground">Projected Revenue</span>
                    </div>
                    <div className="text-base md:text-lg lg:text-xl font-bold text-green-600">
                      ${scenario.projectedRevenue.toLocaleString()}
                    </div>
                  </div>

                  {/* Expenses */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-sm">
                      <span className="text-muted-foreground">Projected Expenses</span>
                    </div>
                    <div className="text-base md:text-lg lg:text-xl font-bold text-red-600">
                      ${scenario.projectedExpenses.toLocaleString()}
                    </div>
                  </div>

                  {/* Net */}
                  <div className="pt-3 border-t space-y-1">
                    <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-sm">
                      <span className="text-muted-foreground">Net Profit</span>
                      <div className={`flex items-center gap-1 ${getVarianceColor(scenario.variance)}`}>
                        {getVarianceIcon(scenario.variance)}
                        <span className="text-xs font-medium">
                          {scenario.variance > 0 && '+'}{scenario.variance}%
                        </span>
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${
                      scenario.projectedNet >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${scenario.projectedNet.toLocaleString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Chart Area */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Metrics Comparison</CardTitle>
          <CardDescription>Visual comparison across all scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4 lg:space-y-6">
            {/* Revenue Comparison */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Revenue Projections</h4>
              {scenarios.map((scenario: any) => (
                <div key={scenario.id} className="flex flex-wrap flex-col md:flex-row items-center gap-3">
                  <div className="w-32 text-sm text-muted-foreground">{scenario.nameKey ? t(scenario.nameKey) : scenario.name}</div>
                  <div className="flex-1">
                    <div className="w-full bg-secondary rounded-full h-6 relative max-w-full">
                      <div
                        className="bg-green-500 h-6 rounded-full transition-all flex items-center justify-end pr-2"
                        style={{ width: `${(scenario.projectedRevenue / 500000) * 100}%` }}
                      >
                        <span className="text-xs font-medium text-white">
                          ${(scenario.projectedRevenue / 1000).toFixed(0)}k
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Expense Comparison */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Expense Projections</h4>
              {scenarios.map((scenario: any) => (
                <div key={scenario.id} className="flex flex-wrap flex-col md:flex-row items-center gap-3">
                  <div className="w-32 text-sm text-muted-foreground">{scenario.nameKey ? t(scenario.nameKey) : scenario.name}</div>
                  <div className="flex-1">
                    <div className="w-full bg-secondary rounded-full h-6 relative max-w-full">
                      <div
                        className="bg-red-500 h-6 rounded-full transition-all flex items-center justify-end pr-2"
                        style={{ width: `${(scenario.projectedExpenses / 500000) * 100}%` }}
                      >
                        <span className="text-xs font-medium text-white">
                          ${(scenario.projectedExpenses / 1000).toFixed(0)}k
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Net Comparison */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Net Profit/Loss</h4>
              {scenarios.map((scenario: any) => (
                <div key={scenario.id} className="flex flex-wrap flex-col md:flex-row items-center gap-3">
                  <div className="w-32 text-sm text-muted-foreground">{scenario.nameKey ? t(scenario.nameKey) : scenario.name}</div>
                  <div className="flex-1">
                    <div className="w-full bg-secondary rounded-full h-6 relative max-w-full">
                      <div
                        className={`${scenario.projectedNet >= 0 ? 'bg-green-500' : 'bg-red-500'} h-6 rounded-full transition-all flex items-center justify-end pr-2`}
                        style={{ width: `${Math.abs(scenario.projectedNet / 150000) * 100}%` }}
                      >
                        <span className="text-xs font-medium text-white">
                          {scenario.projectedNet >= 0 ? '+' : '-'}${Math.abs(scenario.projectedNet / 1000).toFixed(0)}k
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card aria-hidden="true" className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
        <CardHeader>
          <CardTitle aria-hidden="true" className="flex flex-col md:flex-row items-center gap-2">
            <AlertCircle aria-hidden="true" className="h-5 w-5" />
            Scenario Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              • <strong>Probability-weighted outcome:</strong> ${weightedAverage.toLocaleString()} net profit
            </p>
            <p>
              • <strong>Risk range:</strong> ${Math.abs(scenarios[2].projectedNet - scenarios[0].projectedNet).toLocaleString()} between best and worst case
            </p>
            <p>
              • <strong>Recommendation:</strong> Maintain contingency reserves of at least ${Math.abs(scenarios[2].projectedNet).toLocaleString()} to cover worst-case scenario
            </p>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
