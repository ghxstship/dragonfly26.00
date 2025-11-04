'use client'

/**
 * Waitlist Management Dashboard
 * LEGEND ONLY - Platform Super Admin Access Required
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Loader2, CheckCircle, XCircle, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'
import { WAITLIST_STATUS_LABELS, WAITLIST_STATUS_COLORS } from '@/types/waitlist'
import type { Waitlist, WaitlistStatus, WaitlistListResponse } from '@/types/waitlist'

export default function WaitlistManagementPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [isLegend, setIsLegend] = useState(false)
  const [entries, setEntries] = useState<Waitlist[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<WaitlistStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Approve dialog
  const [approveDialog, setApproveDialog] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<Waitlist | null>(null)
  const [approveLoading, setApproveLoading] = useState(false)
  const [approveData, setApproveData] = useState({
    organization_id: '',
    workspace_id: '',
    role_slug: 'raider',
    message: '',
  })
  
  // Reject dialog
  const [rejectDialog, setRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectLoading, setRejectLoading] = useState(false)

  // Check Legend permissions
  useEffect(() => {
    checkPermissions()
  }, [])

  // Load waitlist data
  useEffect(() => {
    if (isLegend) {
      loadWaitlist()
    }
  }, [isLegend, page, statusFilter, searchQuery])

  const checkPermissions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      // Check for Legend role (level 1)
      const { data: roles } = await supabase
        .from('user_role_assignments')
        .select('role:roles(level, name)')
        .eq('user_id', user.id)

      const hasLegendRole = roles?.some((r: any) => r.role?.level === 1)
      
      if (!hasLegendRole) {
        toast({
          title: 'Access Denied',
          description: 'This page requires Legend (Platform Super Admin) access',
          variant: 'destructive',
        })
        router.push('/dashboard')
        return
      }

      setIsLegend(true)
    } catch (error) {
      console.error('Permission check error:', error)
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const loadWaitlist = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchQuery && { search: searchQuery }),
      })

      const res = await fetch(`/api/admin/waitlist/list?${params}`)
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to load waitlist')
      }

      const data: WaitlistListResponse = await res.json()

      setEntries(data.entries)
      setTotal(data.total)
      setPages(data.pages)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const handleApprove = async () => {
    if (!selectedEntry) return

    setApproveLoading(true)
    try {
      const res = await fetch('/api/admin/waitlist/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          waitlist_id: selectedEntry.id,
          ...approveData,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to approve')
      }

      toast({
        title: 'Success',
        description: 'Waitlist entry approved and invitation sent',
      })

      setApproveDialog(false)
      setSelectedEntry(null)
      setApproveData({
        organization_id: '',
        workspace_id: '',
        role_slug: 'raider',
        message: '',
      })
      loadWaitlist()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setApproveLoading(false)
    }
  }

  const handleReject = async () => {
    if (!selectedEntry) return

    setRejectLoading(true)
    try {
      const res = await fetch('/api/admin/waitlist/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          waitlist_id: selectedEntry.id,
          reason: rejectReason,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reject')
      }

      toast({
        title: 'Success',
        description: 'Waitlist entry rejected',
      })

      setRejectDialog(false)
      setSelectedEntry(null)
      setRejectReason('')
      loadWaitlist()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setRejectLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isLegend) {
    return null
  }

  return (
    <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-title uppercase">Waitlist Management</h1>
        <p className="text-muted-foreground mt-1">
          Legend Only - Manage platform access requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Entries</CardDescription>
            <CardTitle className="text-3xl">{total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">
              {entries.filter(e => e.status === 'pending').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Invited</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {entries.filter(e => e.status === 'invited').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rejected</CardDescription>
            <CardTitle className="text-3xl text-red-600">
              {entries.filter(e => e.status === 'rejected').length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="invited">Invited</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email, name, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Waitlist Entries</CardTitle>
          <CardDescription>
            Showing {entries.length} of {total} entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No entries found
                    </TableCell>
                  </TableRow>
                ) : (
                  entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.email}</TableCell>
                      <TableCell>{entry.full_name}</TableCell>
                      <TableCell>{entry.company || '-'}</TableCell>
                      <TableCell>
                        <Badge className={WAITLIST_STATUS_COLORS[entry.status]}>
                          {WAITLIST_STATUS_LABELS[entry.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(entry.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {entry.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedEntry(entry)
                                  setApproveDialog(true)
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedEntry(entry)
                                  setRejectDialog(true)
                                }}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Page {page} of {pages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(pages, p + 1))}
                  disabled={page === pages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={approveDialog} onOpenChange={setApproveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Waitlist Entry</DialogTitle>
            <DialogDescription>
              Send invitation to {selectedEntry?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Organization ID *</Label>
              <Input
                placeholder="Enter organization ID"
                value={approveData.organization_id}
                onChange={(e) => setApproveData({ ...approveData, organization_id: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Workspace ID *</Label>
              <Input
                placeholder="Enter workspace ID"
                value={approveData.workspace_id}
                onChange={(e) => setApproveData({ ...approveData, workspace_id: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={approveData.role_slug} onValueChange={(value) => setApproveData({ ...approveData, role_slug: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="raider">Raider</SelectItem>
                  <SelectItem value="deviator">Deviator</SelectItem>
                  <SelectItem value="navigator">Navigator</SelectItem>
                  <SelectItem value="gladiator">Gladiator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Personal Message (Optional)</Label>
              <Textarea
                placeholder="Add a personal welcome message"
                value={approveData.message}
                onChange={(e) => setApproveData({ ...approveData, message: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={approveLoading || !approveData.organization_id || !approveData.workspace_id}>
              {approveLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Approve & Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog} onOpenChange={setRejectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Waitlist Entry</DialogTitle>
            <DialogDescription>
              Reject application from {selectedEntry?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Reason (Optional)</Label>
              <Textarea
                placeholder="Provide a reason for rejection"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={rejectLoading}>
              {rejectLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
