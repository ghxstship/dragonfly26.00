"use client"

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search } from "lucide-react"
import { useModuleData } from "@/hooks/use-module-data"
import { useParams } from "next/navigation"
import { useState } from "react"

interface CoordinationTabProps {
  data?: Record<string, unknown>[]
  loading?: boolean
}

export function CoordinationTab({ data, loading }: CoordinationTabProps) {
  const t = useTranslations('production.locations.coordination')
  const tCommon = useTranslations('common')
  const params = useParams()
  const workspaceId = params?.workspaceId as string
  
  // Fetch data if not provided
  const { data: hookData, loading: hookLoading } = useModuleData(workspaceId, 'locations', 'coordination')
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

  return (
    <main role="main" aria-label={t('title')}>
      <div className="space-y-6">
      {/* 1648 Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{items.length}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('totalItems')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">0</p>
              <p className="text-xs text-muted-foreground mt-1">{t('active')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">0</p>
              <p className="text-xs text-muted-foreground mt-1">{t('pending')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground mt-1">{t('completed')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Coordination</CardTitle>
          <CardDescription>View and manage coordination</CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <p className="text-lg font-semibold mb-2">No coordination found</p>
                <p className="text-sm mb-4">{t('emptyStateMessage')}</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                  Create Coordination
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
    </main>
  )
}

export default CoordinationTab
