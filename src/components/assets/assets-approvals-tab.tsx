'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useModuleData } from '@/hooks/use-module-data'
import { Button } from '@/components/ui/button'
import { Plus, CheckCircle, XCircle, Clock } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

export default function AssetsApprovalsTab() {
  const t = useTranslations('production.assets.approvals')
  const tCommon = useTranslations('common')
  const params = useParams()
  const workspaceId = params?.workspaceId as string

  const { data: approvals, loading, error } = useModuleData('assets', 'approvals', workspaceId)

  if (loading) {
    return (
      <div className="flex flex-wrap items-center justify-center h-48 md:h-56 lg:h-64">
        <div className="text-muted-foreground">Loading approvals...</div>
          </div>
   )
}

  if (error) {
    return (
      <div className="flex flex-wrap items-center justify-center h-48 md:h-56 lg:h-64">
        <div className="text-destructive">Error loading approvals: {(error as any).message}</div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle aria-hidden="true" className="h-4 w-4 text-green-600 flex-shrink-0" />
      case 'rejected':
        return <XCircle aria-hidden="true" className="h-4 w-4 text-red-600" />
      case 'pending':
        return <Clock aria-hidden="true" className="h-4 w-4 text-yellow-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive',
      skipped: 'outline',
      escalated: 'outline',
    }
    return (
      <Badge variant={variants[status] || 'default'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <main role="main" aria-label={t('title')}>
      <div className="space-y-3 md:space-y-4 lg:space-y-6">
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Chain</TableHead>
              <TableHead>Approver</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Response</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-4 md:py-6 lg:py-8">
                  No approval requests found
                </TableCell>
              </TableRow>
            ) : (
              (approvals as any[]).map((approval: any) => (
                <TableRow key={approval.id}>
                  <TableCell>
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                      {getStatusIcon(approval.status)}
                      {getStatusBadge(approval.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{approval.approval_chain?.name || 'N/A'}</div>
                    <div className="text-sm text-muted-foreground">
                      {approval.approval_chain?.triggers_on || ''}
                    </div>
                  </TableCell>
                  <TableCell>
                    {approval.approver ? (
                      <div>
                        <div className="font-medium">
                          {approval.approver.first_name} {approval.approver.last_name}
                        </div>
                      </div>
                    ) : (
                      'Unassigned'
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Level {approval.step_level}</Badge>
                  </TableCell>
                  <TableCell>
                    {approval.due_date ? (
                      <div className="text-sm">
                        {formatDistanceToNow(new Date(approval.due_date), { addSuffix: true })}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No due date</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {approval.responded_at ? (
                      <div className="text-sm">
                        {formatDistanceToNow(new Date(approval.responded_at), { addSuffix: true })}
                        {approval.response_notes && (
                          <div className="text-muted-foreground truncate max-w-xs">
                            {approval.response_notes}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">{t('pending')}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
    </main>
  )
}
