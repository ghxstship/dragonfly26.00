"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GitCompare, CheckCircle2, XCircle, AlertTriangle, Clock, Search, Filter, FileText, Receipt, Package } from "lucide-react"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { formatCurrency as formatCurrencyLocale } from "@/lib/utils/locale-formatting"
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

const getMatchStatusBadge = (status: string, t: any) => {
  const variants: Record<string, { variant: any, icon: any, labelKey: string }> = {
    matched: { variant: "default", icon: CheckCircle2, labelKey: "matched" },
    partial_match: { variant: "secondary", icon: AlertTriangle, labelKey: "partial_match" },
    no_match: { variant: "destructive", icon: XCircle, labelKey: "no_match" },
    pending: { variant: "outline", icon: Clock, labelKey: "pending" },
    approved: { variant: "default", icon: CheckCircle2, labelKey: "approved" },
    rejected: { variant: "destructive", icon: XCircle, labelKey: "rejected" },
  }
  const config = variants[status] || variants.pending
  const Icon = config.icon
  
  return (
    <Badge variant={config.variant as any} className="gap-1">
      <Icon className="h-3 w-3" />
      {t(config.labelKey)}
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

const getPriorityBadge = (priority: string, t: any) => {
  const variants: Record<string, { variant: any, labelKey: string }> = {
    urgent: { variant: "destructive", labelKey: "urgent" },
    high: { variant: "default", labelKey: "high" },
    normal: { variant: "secondary", labelKey: "normal" },
    low: { variant: "outline", labelKey: "low" },
  }
  const config = variants[priority] || variants.normal
  return <Badge variant={config.variant as any}>{t(config.labelKey)}</Badge>
}

export function ProcurementMatchingTab({ data = [], loading }: ProcurementMatchingTabProps) {
  const t = useTranslations('business.procurement.matching')
  const tCommon = useTranslations('business.common')
  const locale = useLocale()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const formatCurrency = (amount: number) => {
    return formatCurrencyLocale(amount, locale)
  }

  if (loading) {
    return (
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="flex items-center justify-center h-64"
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
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('stats.totalMatches')}</CardTitle>
            <GitCompare className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{t('allRecords')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('stats.matched')}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.matched}</div>
            <p className="text-xs text-muted-foreground">{t('perfectAlignment')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('stats.partialMatch')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.partialMatch}</div>
            <p className="text-xs text-muted-foreground">{t('minorVariances')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('stats.noMatch')}</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.noMatch}</div>
            <p className="text-xs text-muted-foreground">{t('needsResolution')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('stats.approved')}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-600" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedForPayment}</div>
            <p className="text-xs text-muted-foreground">{t('readyForPayment')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('stats.totalVariance')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalVariance)}</div>
            <p className="text-xs text-muted-foreground">{t('acrossAllRecords')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
              aria-label={t('aria.searchMatching')}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                aria-label={t('filterByStatus')}
              >
                <Filter className="h-4 w-4" aria-hidden="true" />
                {t('filterByStatus')}: {statusFilter === 'all' ? t('allStatuses') : statusFilter.replace('_', ' ')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('filterByStatus')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>{t('allStatuses')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('pending')}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('matched')}>Matched</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('partial_match')}>Partial Match</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('no_match')}>No Match</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('approved')}>Approved</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            aria-label={t('exportReport')}
          >
            {t('exportReport')}
          </Button>
        </div>
      </div>

      {/* Matching Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('matchingRecords')} ({filteredData.length})</CardTitle>
          <CardDescription>{t('reviewApprove')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table role="table" aria-label={t('aria.matchingTable')}>
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
                    {tCommon('emptyState.title', { resource: t('matchingRecords') })}. {tCommon('emptyState.description')}.
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
                    <TableCell>{getMatchStatusBadge(item.match_status, t)}</TableCell>
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
                    <TableCell>{getPriorityBadge(item.priority, t)}</TableCell>
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
