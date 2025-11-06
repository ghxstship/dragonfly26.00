"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HelpCircle, CheckCircle2, AlertCircle, Search, Plus, Filter, ThumbsUp, Calendar} from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { useState } from "react"
import { useTranslations } from 'next-intl'
import type { TabComponentProps } from "@/types"

export function ResourcesTroubleshootingTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const t = useTranslations('resources.troubleshooting')

  const tCommon = useTranslations('common')
  const { data: issues, loading, error } = useModuleData(workspaceId, 'resources', 'troubleshooting')
  const [searchQuery, setSearchQuery] = useState('')

  if (loading) {
    return (
      <div className="flex flex-wrap items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
          {t('description')}
        </p>
        </div>
      </div>
    )
  }

  const filteredIssues = issues.filter((issue: any) =>
    issue.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      'critical': 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400',
      'high': 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-400',
      'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
      'low': 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
    }
    return colors[severity] || 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400'
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full" role="alert" aria-live="assertive">
        <div className="text-center">
          <Calendar aria-hidden="true" className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">Failed to load data</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </div>
      </div>
    )
  }


  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Stats */}
      <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-4">
        <Card>
          <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">Total Issues</CardTitle>
            <HelpCircle aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{issues.length}</div>
            <p className="text-xs text-muted-foreground">{t('documented')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">{t('critical')}</CardTitle>
            <AlertCircle aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-red-600">
              {issues.filter((i: any) => i.severity === 'critical').length}
            </div>
            <p className="text-xs text-muted-foreground">High priority</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">{t('common')}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-green-600">
              {issues.filter((i: any) => i.is_common).length}
            </div>
            <p className="text-xs text-muted-foreground">Frequently seen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">{t('helpful')}</CardTitle>
            <ThumbsUp aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-blue-600">
              {issues.filter((i: any) => i.helpful_count > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">Verified solutions</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search aria-hidden="true" className="absolute sm:relative sm:inset-auto left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground sm:relative sm:inset-auto" />
        <Input
          placeholder={t('searchIssues')}
          value={searchQuery as any}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.map((issue: any) => (
          <Card key={issue.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-2 md:gap-3 lg:gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <HelpCircle aria-hidden="true" className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle aria-hidden="true" className="text-lg">{issue.name}</CardTitle>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {issue.severity && (
                    <Badge aria-hidden="true" className={getSeverityColor(issue.severity)}>
                      {issue.severity}
                    </Badge>
                  )}
                  {issue.is_common && (
                    <Badge variant="secondary">{t('common')}</Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent aria-hidden="true" className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Problem:</p>
                <p className="text-sm text-muted-foreground">{issue.description}</p>
              </div>

              {issue.solution && (
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <p className="text-sm font-medium mb-2 text-green-900 dark:text-green-100">Solution:</p>
                  <p className="text-sm text-green-800 dark:text-green-200">{issue.solution}</p>
                </div>
              )}

              {issue.steps && issue.steps.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Steps:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    {issue.steps.map((step: string, i: number) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {issue.tags && issue.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {issue.tags.map((tag: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <Button variant="outline" size="sm">
                  <ThumbsUp aria-hidden="true" className="h-4 w-4 mr-2" />
                  Helpful ({issue.helpful_count || 0})
                </Button>
                <Button variant="outline" size="sm">{t('viewDetails')}</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIssues.length === 0 && (
        <Card>
          <CardContent aria-hidden="true" className="p-0">
            <EmptyState
              variant="inline"
              icon={HelpCircle}
              mainMessage={searchQuery ? t('searchNoResults') : t('nothingToSeeYet')}
              description={searchQuery ? t('tryAdjustingSearch') : t('addIssues')}
              actionLabel={!searchQuery ? t('addIssue') : undefined}
              onAction={!searchQuery ? () => {} : undefined}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
