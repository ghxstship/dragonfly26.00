"use client"

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Shield } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"

interface ComplianceTabProps {
  data?: Record<string, unknown>[]
  loading?: boolean
}

export function ComplianceTab({ data, loading }: ComplianceTabProps) {
  const t = useTranslations('production.projects.compliance')
  const tCommon = useTranslations('common')
  const params = useParams()
  const workspaceId = params?.workspaceId as string
  
  // Fetch data if not provided
  const { data: hookData, loading: hookLoading, error } = useModuleData(workspaceId, 'projects', 'compliance')
  const fetchedData = data || hookData
  const fetchLoading = loading !== undefined ? loading : hookLoading
  
  const items = fetchedData || []
  const isLoading = loading || fetchLoading

  if (isLoading) {
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-full" role="alert" aria-live="assertive">
        <div className="text-center">
          <Shield aria-hidden="true" className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">Failed to load compliance</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <main role="main" aria-label={t('title')}>
      <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
        <Card>
          <CardContent aria-hidden="true" className="pt-6">
            <div className="text-center">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{items.length}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('totalItems')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent aria-hidden="true" className="pt-6">
            <div className="text-center">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-green-600">0</p>
              <p className="text-xs text-muted-foreground mt-1">{t(t('defaultStatus'))}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent aria-hidden="true" className="pt-6">
            <div className="text-center">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-yellow-600">0</p>
              <p className="text-xs text-muted-foreground mt-1">{t('pending')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent aria-hidden="true" className="pt-6">
            <div className="text-center">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground mt-1">{t('completed')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <CardTitle aria-hidden="true" className="text-base">{t('title')}</CardTitle>
          <CardDescription>{t('cardDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-6 md:py-4 md:py-6 lg:py-8 lg:py-12">
              <div className="text-muted-foreground">
                <p className="text-lg font-semibold mb-2">{t('noItemsFound')}</p>
                <p className="text-sm mb-4">{t('emptyStateMessage')}</p>
                <Button>
                  <Plus aria-hidden="true" className="h-4 w-4 mr-2" />
                  {t('create')}
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
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{item.name || item.title || t('untitled')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description || t('noDescription')}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {item.status || t('defaultStatus')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </main>
  )
}

export default ComplianceTab
