"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GitCompare, TrendingUp, TrendingDown, Minus, Plus, AlertCircle } from "lucide-react"
import { CreateItemDialogEnhanced } from "@/components/shared/create-item-dialog-enhanced"

interface FinanceScenariosTabProps {
  data?: any[]
  loading?: boolean
}

// Mock data for demo/fallback
const MOCK_SCENARIOS = [
  {
    id: '1',
    type: 'optimistic',
    name: 'Best Case',
    probability: 20,
    projectedRevenue: 500000,
    projectedExpenses: 350000,
    projectedNet: 150000,
    variance: 30,
    description: 'All deals close, minimal overruns',
  },
  {
    id: '2',
    type: 'expected',
    name: 'Expected Case',
    probability: 60,
    projectedRevenue: 400000,
    projectedExpenses: 320000,
    projectedNet: 80000,
    variance: 0,
    description: 'Standard performance metrics',
    isBaseline: true,
  },
  {
    id: '3',
    type: 'pessimistic',
    name: 'Worst Case',
    probability: 20,
    projectedRevenue: 300000,
    projectedExpenses: 310000,
    projectedNet: -10000,
    variance: -22.5,
    description: 'Deals delayed, cost overruns',
  },
]

export function FinanceScenariosTab({ data, loading }: FinanceScenariosTabProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading scenarios...</p>
        </div>
      </div>
    )
  }

  // ✅ Use real data if available, otherwise mock
  const scenarios = (data && data.length > 0) ? data.slice(0, 5) : [
    ...MOCK_SCENARIOS
  ]

  const weightedAverage = scenarios.reduce((sum, s) => 
    sum + (s.projectedNet * s.probability / 100), 0
  )

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-green-600'
    if (variance < 0) return 'text-red-600'
    return 'text-muted-foreground'
  }

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp className="h-4 w-4" />
    if (variance < 0) return <TrendingDown className="h-4 w-4" />
    return <Minus className="h-4 w-4" />
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
    <div className="space-y-6">
      {/* Summary Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Scenarios</CardTitle>
            <GitCompare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scenarios.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all budgets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weighted Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Case</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${scenarios[0].projectedNet.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {scenarios[0].probability}% probability
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Worst Case</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Scenario Comparison</CardTitle>
              <CardDescription>Side-by-side analysis of financial projections</CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Scenario
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {scenarios.map((scenario) => (
              <Card 
                key={scenario.id} 
                className={`border-2 ${getScenarioColor(scenario.type)} ${
                  scenario.isBaseline ? 'ring-2 ring-primary ring-offset-2' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{scenario.name}</CardTitle>
                    {scenario.isBaseline && (
                      <Badge variant="secondary">Baseline</Badge>
                    )}
                  </div>
                  <CardDescription>{scenario.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Probability */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Probability</span>
                      <span className="font-semibold">{scenario.probability}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${scenario.probability}%` }}
                      />
                    </div>
                  </div>

                  {/* Revenue */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Projected Revenue</span>
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      ${scenario.projectedRevenue.toLocaleString()}
                    </div>
                  </div>

                  {/* Expenses */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Projected Expenses</span>
                    </div>
                    <div className="text-xl font-bold text-red-600">
                      ${scenario.projectedExpenses.toLocaleString()}
                    </div>
                  </div>

                  {/* Net */}
                  <div className="pt-3 border-t space-y-1">
                    <div className="flex items-center justify-between text-sm">
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
                  <div className="flex gap-2 pt-2">
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
          <div className="space-y-6">
            {/* Revenue Comparison */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Revenue Projections</h4>
              {scenarios.map((scenario) => (
                <div key={scenario.id} className="flex items-center gap-3">
                  <div className="w-32 text-sm text-muted-foreground">{scenario.name}</div>
                  <div className="flex-1">
                    <div className="w-full bg-secondary rounded-full h-6 relative">
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
              {scenarios.map((scenario) => (
                <div key={scenario.id} className="flex items-center gap-3">
                  <div className="w-32 text-sm text-muted-foreground">{scenario.name}</div>
                  <div className="flex-1">
                    <div className="w-full bg-secondary rounded-full h-6 relative">
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
              {scenarios.map((scenario) => (
                <div key={scenario.id} className="flex items-center gap-3">
                  <div className="w-32 text-sm text-muted-foreground">{scenario.name}</div>
                  <div className="flex-1">
                    <div className="w-full bg-secondary rounded-full h-6 relative">
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
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
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

      {/* Create Scenario Dialog */}
      <CreateItemDialogEnhanced
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        moduleId="finance"
        tabSlug="scenarios"
        onSuccess={(item) => {
          console.log("Created scenario:", item)
        }}
      />
    </div>
  )
}
