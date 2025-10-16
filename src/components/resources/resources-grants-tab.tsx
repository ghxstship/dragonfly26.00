"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  CircleDollarSign,
  Calendar,
  Building2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  Filter,
  TrendingUp,
  FileText
} from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { useState } from "react"
import { useTranslations } from 'next-intl'
import { useModuleData } from "@/hooks/use-module-data"
import type { TabComponentProps } from "@/types"

export function ResourcesGrantsTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const t = useTranslations('resources.grants')
  const tCommon = useTranslations('common')
  const { data: grants, loading } = useModuleData(workspaceId, 'resources', 'grants')
  const [searchQuery, setSearchQuery] = useState('')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
          {t('description')}
        </p>
        </div>
      </div>
    )
  }

  const filteredGrants = grants.filter((grant: any) =>
    grant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    grant.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    grant.provider?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'open': 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
      'closing_soon': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
      'closed': 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400',
      'applied': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400',
      'awarded': 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400',
    }
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getDaysRemaining = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Grants</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{grants.length}</div>
            <p className="text-xs text-muted-foreground">{t('available')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {grants.filter((g: any) => g.status === 'open').length}
            </div>
            <p className="text-xs text-muted-foreground">Accepting applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applied</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {grants.filter((g: any) => g.status === 'applied').length}
            </div>
            <p className="text-xs text-muted-foreground">Your applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(grants.reduce((total: number, g: any) => total + (g.amount || 0), 0))}
            </div>
            <p className="text-xs text-muted-foreground">Potential funding</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <Input
          placeholder={t('searchGrants')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Grants List */}
      <div className="space-y-4">
        {filteredGrants.map((grant: any) => {
          const daysRemaining = grant.deadline ? getDaysRemaining(grant.deadline) : null

          return (
            <Card key={grant.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
                      <CircleDollarSign className="h-5 w-5 text-green-600" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg">{grant.name}</CardTitle>
                      {grant.provider && (
                        <CardDescription className="mt-1 flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {grant.provider}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getStatusColor(grant.status)}>
                      {grant.status.replace('_', ' ')}
                    </Badge>
                    {grant.amount && (
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(grant.amount)}
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {grant.description && (
                  <p className="text-sm text-muted-foreground">
                    {grant.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 text-sm">
                  {grant.deadline && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                      <span className="text-muted-foreground">
                        Deadline: {new Date(grant.deadline).toLocaleDateString()}
                      </span>
                      {daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 30 && (
                        <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                          {daysRemaining} days left
                        </Badge>
                      )}
                    </div>
                  )}
                  {grant.eligibility && (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                      <span className="text-muted-foreground">
                        {grant.eligibility}
                      </span>
                    </div>
                  )}
                </div>

                {grant.requirements && grant.requirements.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Requirements:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {grant.requirements.slice(0, 3).map((req: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-600 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {grant.tags && grant.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {grant.tags.map((tag: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t">
                  <Button className="flex-1" size="sm">
                    {grant.status === 'applied' ? 'View Application' : 'Apply Now'}
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredGrants.length === 0 && (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              variant="inline"
              icon={CircleDollarSign}
              mainMessage={searchQuery ? t('searchNoResults') : t('nothingToSeeYet')}
              description={searchQuery ? t('tryAdjustingSearch') : t('addGrants')}
              actionLabel={!searchQuery ? t('addGrant') : undefined}
              onAction={!searchQuery ? () => {} : undefined}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
