"use client"

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

export function DashboardMyExpensesTab() {
  // User's expense reports and submissions
  const expenses = [
    {
      id: "EXP-2024-045",
      title: "Equipment Rental & Supplies",
      project: "Summer Music Festival",
      date: "Oct 8, 2024",
      submittedDate: "Oct 9, 2024",
      status: "approved",
      category: "Equipment",
      amount: "$1,245.50",
      itemCount: 8,
      approver: "Sarah Johnson",
      approvedDate: "Oct 10, 2024",
      reimbursementDate: "Oct 12, 2024",
      items: [
        { description: "Wireless mic batteries", amount: "$125.00" },
        { description: "Gaffer tape (10 rolls)", amount: "$85.50" },
        { description: "Equipment rental deposit", amount: "$500.00" },
        { description: "Cable adapters", amount: "$235.00" },
        { description: "Stage markers", amount: "$45.00" },
        { description: "Tools & hardware", amount: "$155.00" },
        { description: "Safety equipment", amount: "$75.00" },
        { description: "Misc supplies", amount: "$25.00" },
      ],
    },
    {
      id: "EXP-2024-046",
      title: "Client Meeting & Travel",
      project: "Corporate Gala",
      date: "Oct 10, 2024",
      submittedDate: "Oct 11, 2024",
      status: "pending",
      category: "Travel",
      amount: "$385.75",
      itemCount: 5,
      items: [
        { description: "Taxi to airport", amount: "$45.00" },
        { description: "Flight ticket", amount: "$220.00" },
        { description: "Taxi from airport", amount: "$40.00" },
        { description: "Lunch with client", amount: "$65.75" },
        { description: "Parking", amount: "$15.00" },
      ],
    },
    {
      id: "EXP-2024-047",
      title: "Emergency Equipment Purchase",
      project: "Fashion Week",
      date: "Oct 11, 2024",
      submittedDate: "Oct 11, 2024",
      status: "under_review",
      category: "Equipment",
      amount: "$820.00",
      itemCount: 3,
      items: [
        { description: "Replacement lighting fixtures", amount: "$650.00" },
        { description: "Cables and connectors", amount: "$120.00" },
        { description: "Rush shipping", amount: "$50.00" },
      ],
    },
    {
      id: "EXP-2024-048",
      title: "Crew Meals & Catering",
      project: "Theater Revival",
      date: "Oct 9, 2024",
      submittedDate: "Oct 10, 2024",
      status: "approved",
      category: "Meals",
      amount: "$480.25",
      itemCount: 4,
      approver: "Mike Chen",
      approvedDate: "Oct 11, 2024",
      reimbursementDate: "Oct 13, 2024",
      items: [
        { description: "Lunch catering - Day 1", amount: "$145.50" },
        { description: "Dinner catering - Day 1", amount: "$185.00" },
        { description: "Lunch catering - Day 2", amount: "$125.75" },
        { description: "Coffee & snacks", amount: "$24.00" },
      ],
    },
    {
      id: "EXP-2024-044",
      title: "Software & Subscriptions",
      project: "Multiple Projects",
      date: "Oct 1, 2024",
      submittedDate: "Oct 2, 2024",
      status: "rejected",
      category: "Software",
      amount: "$199.00",
      itemCount: 2,
      rejectionReason: "Personal use subscription not eligible for reimbursement",
      items: [
        { description: "Design software monthly", amount: "$99.00" },
        { description: "Cloud storage", amount: "$100.00" },
      ],
    },
  ]

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
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                My Expenses
              </CardTitle>
              <CardDescription>
                Your expense reports and submissions
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                New Expense
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{summary.totalExpenses}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Reports</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{summary.pending + summary.underReview}</p>
              <p className="text-xs text-muted-foreground mt-1">Pending Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{summary.totalAmount}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Amount</p>
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
            {expenses.map((expense) => {
              const StatusIcon = getStatusIcon(expense.status)
              return (
                <div
                  key={expense.id}
                  className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
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
                      <span>Submitted: {expense.submittedDate}</span>
                      {expense.approver && (
                        <>
                          <span>•</span>
                          <span>Approver: {expense.approver}</span>
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
                        {expense.items.map((item, idx) => (
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
  )
}
