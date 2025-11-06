"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PackageCheck, AlertCircle, CheckCircle2, XCircle, Clock, Search, Filter, Camera, FileText, Plus } from "lucide-react"
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
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { formatCurrency, formatDate, formatPercentage, formatNumber } from "@/lib/utils/locale-formatting"

interface ProcurementReceivingTabProps {
  data?: Record<string, unknown>[]
  loading?: boolean
}

const getInspectionStatusBadge = (status: string, t: any) => {
  const variants: Record<string, { variant: "default" | "destructive" | "secondary" | "outline", icon: React.ComponentType<{ className?: string }>, labelKey: string }> = {
    pass: { variant: "default", icon: CheckCircle2, labelKey: "pass" },
    fail: { variant: "destructive", icon: XCircle, labelKey: "fail" },
    pending: { variant: "secondary", icon: Clock, labelKey: "pending" },
    not_required: { variant: "outline", icon: PackageCheck, labelKey: "not_required" },
  }
  const config = variants[status] || variants.pending
  const Icon = config.icon
  
  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon aria-hidden="true" className="h-3 w-3" />
      {t(config.labelKey)}
    </Badge>
  )
}

const getStatusBadge = (status: string, t: (key: string) => string) => {
  const variants: Record<string, { variant: "default" | "destructive" | "secondary" | "outline", labelKey: string }> = {
    received: { variant: "secondary", labelKey: "received" },
    partially_received: { variant: "secondary", labelKey: "partially_received" },
    inspection: { variant: "secondary", labelKey: "inspection" },
    accepted: { variant: "default", labelKey: "accepted" },
    rejected: { variant: "destructive", labelKey: "rejected" },
  }
  const config = variants[status] || variants.received
  return <Badge variant={config.variant}>{t(config.labelKey)}</Badge>
}

const getPriorityBadge = (priority: string, t: any) => {
  const variants: Record<string, { variant: "default" | "destructive" | "secondary" | "outline", labelKey: string }> = {
    urgent: { variant: "destructive", labelKey: "urgent" },
    high: { variant: "default", labelKey: "high" },
    normal: { variant: "secondary", labelKey: "normal" },
    low: { variant: "outline", labelKey: "low" },
  }
  const config = variants[priority] || variants.normal
  return <Badge variant={config.variant}>{t(config.labelKey)}</Badge>
}

export function ProcurementReceivingTab({ data = [], loading }: ProcurementReceivingTabProps) {
  const t = useTranslations('business.procurement.receiving')
  const tCommon = useTranslations('business.common')
  const locale = useLocale()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

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

  // Filter data
  const filteredData = (data as any[]).filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.po_number?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || (item as any).status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Calculate summary stats
  const stats = {
    total: data.length,
    received: data.filter((item: any) => (item as any).status === 'received').length,
    accepted: data.filter((item: any) => (item as any).status === 'accepted').length,
    inspection: data.filter((item: any) => (item as any).status === 'inspection').length,
    withDiscrepancies: data.filter((item: any) => item.has_discrepancy).length,
  }

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">Total Receipts</CardTitle>
            <PackageCheck aria-hidden="true" className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">Received</CardTitle>
            <PackageCheck aria-hidden="true" className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{stats.received}</div>
            <p className="text-xs text-muted-foreground">Awaiting inspection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">In Inspection</CardTitle>
            <Clock aria-hidden="true" className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{stats.inspection}</div>
            <p className="text-xs text-muted-foreground">Under review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">Accepted</CardTitle>
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" aria-hidden="true"  />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{stats.accepted}</div>
            <p className="text-xs text-muted-foreground">Quality passed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">Discrepancies</CardTitle>
            <AlertCircle aria-hidden="true" className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{stats.withDiscrepancies}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between gap-2 md:gap-3 lg:gap-4">
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search aria-hidden="true" className="absolute sm:relative sm:inset-auto left-2.5 top-2.5 h-4 w-4 text-muted-foreground sm:relative sm:inset-auto" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={searchQuery as any}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter aria-hidden="true" className="h-4 w-4" />
                Status: {statusFilter === 'all' ? 'All' : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Statuses</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('received')}>Received</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('inspection')}>In Inspection</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('accepted')}>Accepted</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('rejected')}>Rejected</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Camera aria-hidden="true" className="h-4 w-4" />
            Scan Packing Slip
          </Button>
          <Button size="sm" className="gap-2">
            <PackageCheck aria-hidden="true" className="h-4 w-4" />
            Record Receipt
          </Button>
        </div>
      </div>

      {/* Receipts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Receipts ({filteredData.length})</CardTitle>
          <CardDescription>Track and inspect received goods</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt #</TableHead>
                <TableHead>PO Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Inspection</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Attachments</TableHead>
                <TableHead aria-hidden="true" className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-4 md:py-6 lg:py-8">
                    No receipts found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell aria-hidden="true" className="font-medium">{item.name?.replace('Receipt #', '')}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                        <FileText aria-hidden="true" className="h-4 w-4" />
                        {item.po_number}
                      </div>
                    </TableCell>
                    <TableCell>{item.vendor}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap flex-col">
                        <span className="font-medium">{item.quantity_received || 0} received</span>
                        <span className="text-xs text-muted-foreground">of {item.quantity_ordered || 0} ordered</span>
                        {item.has_discrepancy && (
                          <Badge variant="destructive" className="w-fit mt-1">
                            <AlertCircle aria-hidden="true" className="h-3 w-3" />
                            Discrepancy
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getInspectionStatusBadge(item.inspection_status, t)}</TableCell>
                    <TableCell>{getStatusBadge(item.status, t)}</TableCell>
                    <TableCell>{getPriorityBadge(item.priority, t)}</TableCell>
                    <TableCell aria-hidden="true" className="text-sm text-muted-foreground">{item.assignee_name}</TableCell>
                    <TableCell>
                      {item.attachments_count > 0 ? (
                        <div className="flex flex-wrap flex-col md:flex-row items-center gap-1 text-sm">
                          <Camera aria-hidden="true" className="h-4 w-4" />
                          <span>{item.attachments_count}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell aria-hidden="true" className="text-right">
                      <Button variant="ghost" size="sm">View</Button>
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
