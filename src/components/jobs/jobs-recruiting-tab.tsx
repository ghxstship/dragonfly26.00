"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search } from "lucide-react"
import { useModuleData } from "@/hooks/use-module-data"
import { useParams } from "next/navigation"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"

interface RecruitingTabProps {
  data?: Record<string, unknown>[]
  loading?: boolean
}

export function RecruitingTab({ data, loading }: RecruitingTabProps) {
  const t = useTranslations('business.jobs')
  const tCommon = useTranslations('business.common')
  const locale = useLocale()
  const params = useParams()
  const workspaceId = params?.workspaceId as string
  
  // Fetch data if not provided
  const { data: hookData, loading: hookLoading } = useModuleData(workspaceId, 'jobs', 'recruiting')
  const fetchedData = data || hookData
  const fetchLoading = loading !== undefined ? loading : hookLoading
  
  const items = fetchedData || []
  const isLoading = loading || fetchLoading

  if (isLoading) {
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
            {tCommon('loading', { resource: t('tabs.recruiting') })}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
        <Card>
          <CardContent className="pt-6" aria-hidden="true">
            <div className="text-center">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{items.length}</p>
              <p className="text-xs text-muted-foreground mt-1">{tCommon('summaryCards.totalItems')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6" aria-hidden="true">
            <div className="text-center">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-green-600">0</p>
              <p className="text-xs text-muted-foreground mt-1">{tCommon('summaryCards.active')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6" aria-hidden="true">
            <div className="text-center">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-yellow-600">0</p>
              <p className="text-xs text-muted-foreground mt-1">{tCommon('summaryCards.pending')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6" aria-hidden="true">
            <div className="text-center">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground mt-1">{tCommon('summaryCards.completed')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base" aria-hidden="true">{t('tabs.recruiting')}</CardTitle>
          <CardDescription>{t('descriptions.recruiting')}</CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-6 md:py-4 md:py-6 lg:py-8 lg:py-12">
              <div className="text-muted-foreground">
                <p className="text-lg font-semibold mb-2">
                  {tCommon('emptyState.title', { resource: t('tabs.recruiting') })}
                </p>
                <p className="text-sm mb-4">{tCommon('emptyState.description')}</p>
                <Button aria-label={tCommon('aria.createButton', { type: t('tabs.recruiting') })}>
                  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                  {tCommon('emptyState.button', { resource: t('tabs.recruiting') })}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item: any) => (
                <div
                  key={item.id}
                  className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                >
                  <div className="flex flex-wrap flex-col md:flex-row items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{item.name || item.title || 'Untitled'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description || 'No description'}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {item.status || 'active'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default RecruitingTab
