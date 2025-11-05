"use client"

import { useTranslations } from 'next-intl'
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, ArrowRight, ArrowLeft, Clock, User, Plus, Filter, Calendar} from "lucide-react"
import { useModuleData } from "@/hooks/use-module-data"
import type { TabComponentProps } from "@/types"

export function AssetsTransactionsTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const t = useTranslations('production.assets.transactions')
  const tCommon = useTranslations('common')
  const { data: transactions, loading, error } = useModuleData(workspaceId, 'assets', 'transactions')
  const [filterType, setFilterType] = useState<string>('all')

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

  const mockTransactions = [
    {
      id: 1,
      asset_name: 'LED Panel 500W',
      asset_id: 'LED-001',
      transaction_type: 'checkout',
      quantity: 12,
      checked_out_by: 'John Smith',
      checked_out_to: 'Main Stage Setup',
      timestamp: '2025-11-05T08:30:00',
      status: 'active',
      expected_return: '2025-11-06T20:00:00'
    },
    {
      id: 2,
      asset_name: 'Sound Mixer X32',
      asset_id: 'MIX-003',
      transaction_type: 'checkin',
      quantity: 1,
      checked_in_by: 'Sarah Johnson',
      returned_from: 'Sound Check',
      timestamp: '2025-11-05T15:45:00',
      status: 'completed',
      condition: 'good'
    },
    {
      id: 3,
      asset_name: 'Wireless Mic System',
      asset_id: 'MIC-012',
      transaction_type: 'checkout',
      quantity: 8,
      checked_out_by: 'Mike Davis',
      checked_out_to: 'Artist Rehearsal',
      timestamp: '2025-11-05T14:00:00',
      status: 'active',
      expected_return: '2025-11-05T18:00:00'
    }
  ]

  const transactionData = transactions?.length > 0 ? transactions : mockTransactions

  const getTransactionTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'checkout': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400',
      'checkin': 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
      'transfer': 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400',
      'maintenance': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
    }
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400'
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400',
      'completed': 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
      'overdue': 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400',
      'cancelled': 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400',
    }
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400'
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full" role="alert" aria-live="assertive">
        <div className="text-center">
          <Calendar className="h-8 w-8 text-destructive mx-auto mb-4" aria-hidden="true" />
          <p className="text-muted-foreground">Failed to load data</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </div>
      </div>
    )
  }


  return (
    <main role="main" aria-label={t('title')}>
      <div className="space-y-3 md:space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">{t('title')}</h2>
            <p className="text-muted-foreground">{t('description')}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" aria-hidden="true" />
              {tCommon('filter')}
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              {t('newTransaction')}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('stats.totalTransactions')}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactionData.length}</div>
              <p className="text-xs text-muted-foreground">{t('stats.totalTransactionsDesc')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('stats.checkedOut')}</CardTitle>
              <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transactionData.filter((t: any) => t.transaction_type === 'checkout' && t.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">{t('stats.checkedOutDesc')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('stats.checkedIn')}</CardTitle>
              <ArrowLeft className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transactionData.filter((t: any) => t.transaction_type === 'checkin').length}
              </div>
              <p className="text-xs text-muted-foreground">{t('stats.checkedInDesc')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('stats.overdue')}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transactionData.filter((t: any) => t.status === 'overdue').length}
              </div>
              <p className="text-xs text-muted-foreground">{t('stats.overdueDesc')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {transactionData.map((transaction: any) => (
            <Card key={transaction.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{transaction.asset_name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {transaction.asset_id}
                      </Badge>
                    </div>
                    <CardDescription>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className={getTransactionTypeColor(transaction.transaction_type)}>
                          {transaction.transaction_type === 'checkout' && <ArrowRight className="mr-1 h-3 w-3" aria-hidden="true" />}
                          {transaction.transaction_type === 'checkin' && <ArrowLeft className="mr-1 h-3 w-3" aria-hidden="true" />}
                          {t(`type.${transaction.transaction_type}`)}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(transaction.status)}>
                          {t(`status.${transaction.status}`)}
                        </Badge>
                      </div>
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    {tCommon('view')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <div className="text-sm">
                      <div className="font-medium">{t('quantity')}</div>
                      <div className="text-muted-foreground">{transaction.quantity} {t('units')}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <div className="text-sm">
                      <div className="font-medium">
                        {transaction.transaction_type === 'checkout' ? t('checkedOutBy') : t('checkedInBy')}
                      </div>
                      <div className="text-muted-foreground">
                        {transaction.checked_out_by || transaction.checked_in_by}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <div className="text-sm">
                      <div className="font-medium">{t('timestamp')}</div>
                      <div className="text-muted-foreground">
                        {new Date(transaction.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <div className="text-sm">
                      <div className="font-medium">
                        {transaction.transaction_type === 'checkout' ? t('destination') : t('source')}
                      </div>
                      <div className="text-muted-foreground">
                        {transaction.checked_out_to || transaction.returned_from}
                      </div>
                    </div>
                  </div>
                </div>
                {transaction.expected_return && transaction.status === 'active' && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <span className="font-medium">{t('expectedReturn')}:</span>
                      <span className="text-muted-foreground">
                        {new Date(transaction.expected_return).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
