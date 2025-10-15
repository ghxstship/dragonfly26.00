"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GitCompare, CheckCircle2, XCircle, AlertTriangle, Clock, Search, Filter, FileText, Receipt, Package } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ProcurementMatchingTabProps {
  data?: any[]
  loading?: boolean
}

const getMatchStatusBadge = (status: string) => {
  const variants: Record<string, { variant: any, icon: any, label: string }> = {
    matched: { variant: "default", icon: CheckCircle2, label: "Matched" },
    partial_match: { variant: "secondary", icon: AlertTriangle, label: "Partial Match" },
    no_match: { variant: "destructive", icon: XCircle, label: "No Match" },
    pending: { variant: "outline", icon: Clock, label: "Pending" },
    approved: { variant: "default", icon: CheckCircle2, label: "Approved" },
    rejected: { variant: "destructive", icon: XCircle, label: "Rejected" },
  }
  const config = variants[status] || variants.pending
  const Icon = config.icon
  
  return (
    <Badge variant={config.variant as any} className="gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}

const getVarianceBadge = (variancePercent: number) => {
  if (variancePercent === 0) {
    return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Exact Match</Badge>
  } else if (variancePercent <= 2) {
    return <Badge variant="secondary">Low Variance</Badge>
  } else if (variancePercent <= 5) {
    return <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200">Moderate Variance</Badge>
  } else {
    return <Badge variant="destructive">High Variance</Badge>
  }
}

const getPriorityBadge = (priority: string) => {
  const variants: Record<string, { variant: any, label: string }> = {
    urgent: { variant: "destructive", label: "Urgent" },
    high: { variant: "default", label: "High" },
    normal: { variant: "secondary", label: "Normal" },
    low: { variant: "outline", label: "Low" },
  }
  const config = variants[priority] || variants.normal
  return <Badge variant={config.variant as any}>{config.label}</Badge>
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function ProcurementMatchingTab({ data = [], loading }: ProcurementMatchingTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading matching records...</p>
        </div>
      </div>
    )
  }

  // Filter data
  const filteredData = data.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.po_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.invoice_number?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || item.match_status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Calculate summary stats
  const stats = {
    total: data.length,
    matched: data.filter((item: any) => item.match_status === 'matched').length,
    partialMatch: data.filter((item: any) => item.match_status === 'partial_match').length,
    noMatch: data.filter((item: any) => item.match_status === 'no_match').length,
    pending: data.filter((item: any) => item.match_status === 'pending').length,
    approvedForPayment: data.filter((item: any) => item.approved_for_payment).length,
    totalVariance: data.reduce((sum: number, item: any) => sum + (Math.abs(item.total_variance) || 0), 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Three-Way Matching</h2>
        <p className="text-muted-foreground">
          Verify PO + Receipt + Invoice alignment before payment approval
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
            <GitCompare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matched</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.matched}</div>
            <p className="text-xs text-muted-foreground">Perfect alignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partial Match</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.partialMatch}</div>
            <p className="text-xs text-muted-foreground">Minor variances</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No Match</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.noMatch}</div>
            <p className="text-xs text-muted-foreground">Needs resolution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedForPayment}</div>
            <p className="text-xs text-muted-foreground">Ready for payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Variance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalVariance)}</div>
            <p className="text-xs text-muted-foreground">Across all records</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices, POs, vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Status: {statusFilter === 'all' ? 'All' : statusFilter.replace('_', ' ')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Match Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Statuses</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('pending')}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('matched')}>Matched</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('partial_match')}>Partial Match</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('no_match')}>No Match</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('approved')}>Approved</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Export Report</Button>
        </div>
      </div>

      {/* Matching Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Matching Records ({filteredData.length})</CardTitle>
          <CardDescription>Review and approve invoice payments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice / PO</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Amounts</TableHead>
                <TableHead>Variance</TableHead>
                <TableHead>Match Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                    No matching records found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 font-medium">
                          <Receipt className="h-4 w-4 text-muted-foreground" />
                          {item.invoice_number}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="h-3 w-3" />
                          {item.po_number}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.vendor}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3 text-blue-600" />
                          <span>PO</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3 text-green-600" />
                          <span>REC</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Receipt className="h-3 w-3 text-purple-600" />
                          <span>INV</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="text-sm">
                          <span className="text-muted-foreground">PO:</span> <span className="font-medium">{formatCurrency(item.po_amount)}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">INV:</span> <span className="font-medium">{formatCurrency(item.invoice_amount)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="font-medium text-sm">
                          {item.total_variance >= 0 ? '+' : ''}{formatCurrency(item.total_variance)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.variance_percentage.toFixed(2)}%
                        </div>
                        {getVarianceBadge(item.variance_percentage)}
                      </div>
                    </TableCell>
                    <TableCell>{getMatchStatusBadge(item.match_status)}</TableCell>
                    <TableCell>
                      {item.approved_for_payment ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Approved
                        </Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.assignee_name}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">Actions</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Review Variance</DropdownMenuItem>
                          {!item.approved_for_payment && (
                            <DropdownMenuItem className="text-green-600">
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Approve Payment
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
