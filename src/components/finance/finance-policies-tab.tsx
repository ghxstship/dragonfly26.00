"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, CreditCard, AlertTriangle, CheckCircle2, XCircle, Plus, Settings } from "lucide-react"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { formatCurrency, formatDate, formatPercentage, formatNumber } from "@/lib/utils/locale-formatting"

interface FinancePoliciesTabProps {
  data?: any[]
  loading?: boolean
}

// Mock data for demo/fallback - will be replaced with t() calls in component
const MOCK_POLICIES = [
  {
    id: '1',
    nameKey: 'mockData.policies.travelExpense.name',
    descriptionKey: 'mockData.policies.travelExpense.description',
    type: 'expense',
    maxAmount: 500,
    requiresApproval: true,
    isActive: true,
    applicableToKey: 'mockData.policies.applicableTo.allEmployees',
    violations: 2,
  },
  {
    id: '2',
    nameKey: 'mockData.policies.equipmentPurchase.name',
    descriptionKey: 'mockData.policies.equipmentPurchase.description',
    type: 'purchase',
    maxAmount: 1000,
    requiresApproval: true,
    isActive: true,
    applicableToKey: 'mockData.policies.applicableTo.departmentHeads',
    violations: 0,
  },
  {
    id: '3',
    nameKey: 'mockData.policies.mealEntertainment.name',
    descriptionKey: 'mockData.policies.mealEntertainment.description',
    type: 'expense',
    maxAmount: 100,
    requiresApproval: false,
    isActive: true,
    applicableToKey: 'mockData.policies.applicableTo.allEmployees',
    violations: 5,
  },
]

export function FinancePoliciesTab({ data, loading }: FinancePoliciesTabProps) {
  const t = useTranslations('business.finance.policies')
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
  const spendingPolicies = (data && data.length > 0) ? data.slice(0, 10) : [
    ...MOCK_POLICIES
  ]

  const corporateCards = [
    {
      id: '1',
      cardHolder: 'John Smith',
      cardNumber: '****4532',
      spendingLimit: 5000,
      spentCurrentPeriod: 3200,
      status: 'active',
      policyName: 'Travel Expense Policy',
    },
    {
      id: '2',
      cardHolder: 'Sarah Johnson',
      cardNumber: '****8821',
      spendingLimit: 10000,
      spentCurrentPeriod: 8900,
      status: 'active',
      policyName: 'Equipment Purchase Policy',
    },
    {
      id: '3',
      cardHolder: 'Mike Chen',
      cardNumber: '****2341',
      spendingLimit: 2000,
      spentCurrentPeriod: 450,
      status: 'active',
      policyName: 'Meal & Entertainment',
    },
    {
      id: '4',
      cardHolder: 'Emily Davis',
      cardNumber: '****9087',
      spendingLimit: 3000,
      spentCurrentPeriod: 0,
      status: 'suspended',
      policyName: null,
    },
  ]

  const recentViolations = [
    {
      id: '1',
      policyName: 'Meal & Entertainment',
      violatedBy: 'Mike Chen',
      transactionAmount: 145,
      violationDate: '2024-10-14',
      reason: 'Exceeded per diem limit',
      status: 'pending',
      exceptionApproved: false,
    },
    {
      id: '2',
      policyName: 'Travel Expense Policy',
      violatedBy: 'John Smith',
      transactionAmount: 650,
      violationDate: '2024-10-12',
      reason: 'Hotel exceeded maximum rate',
      status: 'pending',
      exceptionApproved: false,
    },
    {
      id: '3',
      policyName: 'Meal & Entertainment',
      violatedBy: 'Sarah Johnson',
      transactionAmount: 125,
      violationDate: '2024-10-10',
      reason: 'Exceeded per diem limit',
      status: 'resolved',
      exceptionApproved: true,
    },
  ]

  const totalPolicies = spendingPolicies.length
  const activePolicies = spendingPolicies.filter(p => p.isActive).length
  const totalViolations = spendingPolicies.reduce((sum: number, p) => sum + p.violations, 0)
  const pendingViolations = recentViolations.filter(v => v.status === 'pending').length

  const getCardUtilization = (spent: number, limit: number) => {
    return (spent / limit) * 100
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600'
    if (utilization >= 75) return 'text-orange-600'
    return 'text-green-600'
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Spending policies, corporate cards & policy violations
        </p>
        <div className="flex gap-2">
          <Button size="sm">
            <Plus className="h-4 w-4" aria-hidden="true"  />
            New Policy
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <ShieldCheck className="h-4 w-4" aria-hidden="true"  />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePolicies}</div>
            <p className="text-xs text-muted-foreground">
              {totalPolicies} total policies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Corporate Cards</CardTitle>
            <CreditCard className="h-4 w-4" aria-hidden="true"  />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {corporateCards.filter(c => c.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {corporateCards.length} total cards
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Policy Violations</CardTitle>
            <AlertTriangle className="h-4 w-4" aria-hidden="true"  />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingViolations}</div>
            <p className="text-xs text-muted-foreground">
              {totalViolations} total this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4" aria-hidden="true"  />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94%</div>
            <p className="text-xs text-muted-foreground">
              Transactions in compliance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Policies */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Policies</CardTitle>
          <CardDescription>Configure and manage organizational spending controls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {spendingPolicies.map((policy) => (
              <Card key={policy.id} className={!policy.isActive ? 'opacity-60' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{policy.nameKey ? t(policy.nameKey) : policy.name}</h4>
                        <Badge variant={policy.isActive ? 'default' : 'secondary'}>
                          {policy.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {policy.violations > 0 && (
                          <Badge variant="destructive">
                            {policy.violations} violations
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{policy.descriptionKey ? t(policy.descriptionKey) : policy.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Type: {policy.type}</span>
                        <span>•</span>
                        <span>Max Amount: ${policy.maxAmount.toLocaleString()}</span>
                        <span>•</span>
                        <span>Applies to: {policy.applicableToKey ? t(policy.applicableToKey) : policy.applicableTo}</span>
                        <span>•</span>
                        <span>{policy.requiresApproval ? 'Requires Approval' : 'Auto-approved'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" aria-hidden="true"  />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Corporate Cards */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Corporate Cards</CardTitle>
              <CardDescription>Manage card assignments and spending limits</CardDescription>
            </div>
            <Button variant="outline">
              <Plus className="h-4 w-4" aria-hidden="true"  />
              Issue Card
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {corporateCards.map((card) => {
              const utilization = getCardUtilization(card.spentCurrentPeriod, card.spendingLimit)
              return (
                <Card key={card.id} className={card.status === 'suspended' ? 'opacity-60 border-red-300' : ''}>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{card.cardHolder}</h4>
                            <Badge variant={card.status === 'active' ? 'default' : 'destructive'}>
                              {card.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Card: {card.cardNumber}
                          </p>
                          {card.policyName && (
                            <p className="text-xs text-muted-foreground">
                              Policy: {card.policyName}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${getUtilizationColor(utilization)}`}>
                            {utilization.toFixed(0)}%
                          </p>
                          <p className="text-xs text-muted-foreground">utilized</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Spent: ${card.spentCurrentPeriod.toLocaleString()}</span>
                          <span>Limit: ${card.spendingLimit.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              utilization >= 90 ? 'bg-red-500' :
                              utilization >= 75 ? 'bg-orange-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(utilization, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Remaining: ${(card.spendingLimit - card.spentCurrentPeriod).toLocaleString()}
                        </p>
                      </div>

                      {card.status === 'active' && (
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            Adjust Limit
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            View Transactions
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 text-red-600">
                            Suspend
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Violations */}
      <Card>
        <CardHeader>
          <CardTitle>Policy Violations</CardTitle>
          <CardDescription>Review and resolve policy exceptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentViolations.length > 0 ? (
              recentViolations.map((violation) => (
                <Card
                  key={violation.id}
                  className={`border-l-4 ${
                    violation.status === 'pending' ? 'border-l-orange-500' : 'border-l-green-500'
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{violation.policyName}</h4>
                          <Badge variant={violation.status === 'pending' ? 'destructive' : 'default'}>
                            {violation.status}
                          </Badge>
                          {violation.exceptionApproved && (
                            <Badge variant="outline" className="border-green-500 text-green-600">
                              Exception Approved
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">Violator: {violation.violatedBy}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">Date: {violation.violationDate}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{violation.reason}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-red-600">
                          ${violation.transactionAmount.toLocaleString()}
                        </p>
                        {violation.status === 'pending' && (
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline">
                              <CheckCircle2 className="h-4 w-4" aria-hidden="true"  />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline">
                              <XCircle className="h-4 w-4" aria-hidden="true"  />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <div className="text-center">
                  <CheckCircle2 className="h-8 w-8" aria-hidden="true"  />
                  <p className="text-sm">No policy violations</p>
                  <p className="text-xs mt-1">All spending is in compliance</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Trends</CardTitle>
            <CardDescription>Policy adherence over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">This Month</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-secondary rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }} />
                    </div>
                    <span className="font-medium text-green-600">94%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Month</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-secondary rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '96%' }} />
                    </div>
                    <span className="font-medium text-green-600">96%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">3 Months Ago</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-secondary rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '91%' }} />
                    </div>
                    <span className="font-medium text-green-600">91%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Violated Policies</CardTitle>
            <CardDescription>Policies with most exceptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Meal & Entertainment</span>
                <Badge variant="destructive">5 violations</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Travel Expense Policy</span>
                <Badge variant="destructive">2 violations</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Equipment Purchase Policy</span>
                <Badge variant="secondary">0 violations</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
