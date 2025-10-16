'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useModuleData } from '@/hooks/use-module-data'
import { Button } from '@/components/ui/button'
import { Plus, Package, Calendar, MapPin } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export default function AssetsAdvancesTab() {
  const t = useTranslations('production.assets.advances')
  const tCommon = useTranslations('common')
  const params = useParams()
  const workspaceId = params?.workspaceId as string

  const { data: advances, loading, error } = useModuleData('assets', 'advances', workspaceId)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading production advances...</div>
          </div>
   )
}

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">Error loading advances: {error.message}</div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
      pending: { variant: 'secondary', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      approved: { variant: 'default', color: 'bg-green-100 text-green-800 border-green-300' },
      fulfilled: { variant: 'default', color: 'bg-blue-100 text-blue-800 border-blue-300' },
      active: { variant: 'default', color: 'bg-purple-100 text-purple-800 border-purple-300' },
      returned: { variant: 'outline', color: 'bg-gray-100 text-gray-800 border-gray-300' },
      partially_returned: { variant: 'outline', color: 'bg-orange-100 text-orange-800 border-orange-300' },
      overdue: { variant: 'destructive', color: 'bg-red-100 text-red-800 border-red-300' },
      cancelled: { variant: 'outline', color: 'bg-gray-100 text-gray-800 border-gray-300' },
      denied: { variant: 'destructive', color: 'bg-red-100 text-red-800 border-red-300' },
    }
    const config = variants[status] || { variant: 'default', color: '' }
    return (
      <Badge variant={config.variant} className={config.color}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </Badge>
    )
  }

  const getCategoryBadge = (category: string) => {
    return (
      <Badge variant="outline">
        {category.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
      </Badge>
    )
  }

  return (
    <main role="main" aria-label={t('title')}>
      <div className="space-y-6">
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('assetItem')}</TableHead>
              <TableHead>{t('category')}</TableHead>
              <TableHead>{t('production')}</TableHead>
              <TableHead>{t('requestor')}</TableHead>
              <TableHead>{t('period')}</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {advances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No production advances found
                </TableCell>
              </TableRow>
            ) : (
              advances.map((advance: any) => (
                <TableRow key={advance.id}>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <Package className="h-4 w-4 mt-1 text-muted-foreground" aria-hidden="true" />
                      <div>
                        <div className="font-medium">{advance.asset_item}</div>
                        {advance.operational_purpose && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {advance.operational_purpose}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryBadge(advance.asset_category)}</TableCell>
                  <TableCell>
                    {advance.production ? (
                      <div>
                        <div className="font-medium">{advance.production.name}</div>
                        <Badge variant="outline" className="text-xs">
                          {advance.production.status}
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No production</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {advance.requestor ? (
                      <div className="text-sm">
                        {advance.requestor.first_name} {advance.requestor.last_name}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Unknown</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <div>
                        {format(new Date(advance.start_date), 'MMM d')}
                        {advance.end_date && ` - ${format(new Date(advance.end_date), 'MMM d')}`}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{advance.quantity}x</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(advance.status)}</TableCell>
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
