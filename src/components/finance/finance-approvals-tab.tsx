"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClipboardCheck, CheckCircle2, XCircle, Clock, AlertTriangle, ChevronRight, User } from "lucide-react"
import { useState } from "react"

interface FinanceApprovalsTabProps {
  data?: any[]
  loading?: boolean
}

// Mock data for demo/fallback
const MOCK_APPROVALS = [
  {
    id: '1',
    type: 'Purchase Order',
    reference: 'PO-2024-001',
    amount: 5000,
    requester: 'John Smith',
    category: 'Equipment',
    urgency: 'high',
    dueDate: '2024-10-16',
    description: 'Camera equipment rental',
  },
  {
    id: '2',
    type: 'Budget Change',
    reference: 'BCR-2024-015',
    amount: 15000,
    requester: 'Sarah Johnson',
    category: 'Production',
    urgency: 'medium',
    dueDate: '2024-10-18',
    description: 'Increase post-production budget',
  },
  {
    id: '3',
    type: 'Expense Report',
    reference: 'EXP-2024-234',
    amount: 1250,
    requester: 'Mike Chen',
    category: 'Travel',
    urgency: 'low',
    dueDate: '2024-10-20',
    description: 'Location scouting expenses',
  },
]

export function FinanceApprovalsTab({ data, loading }: FinanceApprovalsTabProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading approvals...</p>
        </div>
      </div>
    )
  }

  const handleApprove = async (approvalId: string) => {
    setActionLoading(approvalId)
    // TODO: Implement approval logic
    setTimeout(() => setActionLoading(null), 1000)
  }

  const handleReject = async (approvalId: string) => {
    setActionLoading(approvalId)
    // TODO: Implement rejection logic
    setTimeout(() => setActionLoading(null), 1000)
  }

  // ✅ Use real data if available, otherwise fall back to mock data
  const pendingApprovals = (data && data.length > 0) ? data.slice(0, 10) : [
    ...MOCK_APPROVALS
  ]

  const approvalChains = [
    {
      id: 'chain-1',
      name: 'Major Equipment Purchase',
      totalSteps: 4,
      completedSteps: 2,
      currentStep: 'Finance Manager Review',
      status: 'in_progress',
    },
    {
      id: 'chain-2',
      name: 'Production Budget Approval',
      totalSteps: 3,
      completedSteps: 1,
      currentStep: 'Department Head Review',
      status: 'in_progress',
    },
  ]

  const recentActivity = [
    { action: 'Approved', item: 'PO-2024-098', by: 'You', date: '2 hours ago' },
    { action: 'Rejected', item: 'EXP-2024-220', by: 'You', date: '5 hours ago' },
    { action: 'Approved', item: 'BCR-2024-012', by: 'You', date: '1 day ago' },
  ]

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApprovals.length}</div>
            <p className="text-xs text-muted-foreground">
              Require your approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {pendingApprovals.filter(a => a.urgency === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Due within 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Total value: $5,000
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chains</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalChains.length}</div>
            <p className="text-xs text-muted-foreground">
              Multi-step approvals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle>My Pending Approvals</CardTitle>
          <CardDescription>Items awaiting your review and approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingApprovals.length > 0 ? (
              pendingApprovals.map((approval) => (
                <Card key={approval.id} className="border-l-4 border-l-primary">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{approval.reference}</h4>
                          <Badge variant={getUrgencyColor(approval.urgency)}>
                            {approval.urgency}
                          </Badge>
                          <Badge variant="outline">{approval.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{approval.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {approval.requester}
                          </span>
                          <span>Category: {approval.category}</span>
                          <span>Due: {approval.dueDate}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <div className="text-2xl font-bold text-green-600">
                          ${approval.amount.toLocaleString()}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(approval.id)}
                            disabled={actionLoading === approval.id}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(approval.id)}
                            disabled={actionLoading === approval.id}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <div className="text-center">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No pending approvals</p>
                  <p className="text-xs mt-1">You&apos;re all caught up!</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Approval Chains & Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Approval Chains */}
        <Card>
          <CardHeader>
            <CardTitle>Approval Chains</CardTitle>
            <CardDescription>Multi-step approval workflows in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {approvalChains.map((chain) => (
                <div key={chain.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{chain.name}</h4>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Step {chain.completedSteps + 1} of {chain.totalSteps}</span>
                      <span>{Math.round((chain.completedSteps / chain.totalSteps) * 100)}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${(chain.completedSteps / chain.totalSteps) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Current: {chain.currentStep}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent approval actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    activity.action === 'Approved' 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' 
                      : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {activity.action === 'Approved' ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action} {activity.item}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
