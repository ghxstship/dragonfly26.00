"use client"

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Receipt,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Plus,
  Filter
} from "lucide-react"
import { useMyExpenses } from "@/hooks/use-dashboard-data"
import { useRouter } from "@/i18n/navigation"
import type { DashboardTabProps } from "@/lib/dashboard-tab-components"

interface ExpenseItem {
  description: string
  amount: string
}

export function DashboardMyExpensesTab({ workspaceId = '', userId = '' }: DashboardTabProps) {
  const router = useRouter()
  const t = useTranslations('dashboard.expenses')
  const tCommon = useTranslations('common')
  const { expenses, loading } = useMyExpenses(workspaceId, userId)
  

  
  const expensesList = expenses.map(exp => ({
    id: exp.id,
    title: exp.title || 'Expense Report',
    project: exp.production?.name || 'No Project',
    date: exp.transaction_date || exp.created_at,
    submittedDate: exp.submitted_date,
    status: exp.status || 'pending',
    category: exp.category || 'General',
    amount: `$${exp.total_amount || 0}`,
    itemCount: exp.items?.length || 0,
    items: exp.items || [],
    approver: exp.approved_by_name || null,
    approvedDate: exp.approved_date || null,
    reimbursementDate: null,
    rejectionReason: exp.notes || null,
  }))
  
  if (loading) {
    return (
      <div 
        className="flex items-center justify-center h-full"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" aria-hidden="true"></div>
          <p className="text-muted-foreground">{t('loadingMessage')}</p>
        </div>
      </div>
    )
  }

  const summary = {
    totalExpenses: 48,
    pending: 1,
    underReview: 1,
    approved: 42,
    rejected: 4,
    totalAmount: "$28,450",
    pending_amount: "$385.75",
    thisMonth: "$3,930.50",
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400"
      case "under_review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return CheckCircle2
      case "pending":
        return Clock
      case "under_review":
        return FileText
      case "rejected":
        return XCircle
      default:
        return Clock
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Equipment":
        return "text-purple-600"
      case "Travel":
        return "text-blue-600"
      case "Meals":
        return "text-green-600"
      case "Software":
        return "text-cyan-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <main role="main" aria-label={t('title')}>
      <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{summary.totalExpenses}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('totalReports')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{summary.pending + summary.underReview}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('pendingReview')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{summary.totalAmount}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('totalAmount')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{summary.thisMonth}</p>
              <p className="text-xs text-muted-foreground mt-1">This Month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Expense Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expensesList.map((expense) => {
              const StatusIcon = getStatusIcon(expense.status)
              return (
                <div
                  key={expense.id}
                  className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => router.push(`/workspace/${workspaceId}/finance/expenses?id=${expense.id}`)}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{expense.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {expense.id} • {expense.project}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">{expense.amount}</p>
                        <p className="text-xs text-muted-foreground">{expense.itemCount} items</p>
                      </div>
                    </div>

                    {/* Status & Category */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className={getStatusColor(expense.status)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {expense.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className={getCategoryColor(expense.category)}>
                        {expense.category}
                      </Badge>
                    </div>

                    {/* Dates & Approval Info */}
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Date: {expense.date}
                      </div>
                      <span>•</span>
                      <span>{t('submitted')}: {expense.submittedDate}</span>
                      {expense.approver && (
                        <>
                          <span>•</span>
                          <span>{t('approver')}: {expense.approver}</span>
                        </>
                      )}
                      {expense.approvedDate && (
                        <>
                          <span>•</span>
                          <span className="text-green-600">Approved: {expense.approvedDate}</span>
                        </>
                      )}
                      {expense.reimbursementDate && (
                        <>
                          <span>•</span>
                          <span className="text-blue-600">Reimbursed: {expense.reimbursementDate}</span>
                        </>
                      )}
                      {expense.rejectionReason && (
                        <>
                          <span>•</span>
                          <span className="text-red-600">Reason: {expense.rejectionReason}</span>
                        </>
                      )}
                    </div>

                    {/* Expense Items */}
                    <details className="pt-2 border-t">
                      <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                        View {expense.itemCount} items
                      </summary>
                      <div className="mt-3 space-y-2">
                        {expense.items.map((item: ExpenseItem, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-sm pl-4">
                            <span className="text-muted-foreground">{item.description}</span>
                            <span className="font-medium">{item.amount}</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Expense Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Expense Breakdown This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <p className="text-xl font-bold text-purple-600">$1,245</p>
              <p className="text-xs text-muted-foreground mt-1">Equipment</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-xl font-bold text-blue-600">$385</p>
              <p className="text-xs text-muted-foreground mt-1">Travel</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-xl font-bold text-green-600">$480</p>
              <p className="text-xs text-muted-foreground mt-1">Meals</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-xl font-bold text-cyan-600">$1,820</p>
              <p className="text-xs text-muted-foreground mt-1">Other</p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </main>
  )
}
