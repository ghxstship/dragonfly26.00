"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, CheckCircle2, Settings, Plus } from "lucide-react"

export function IntegrationsTab() {
  const t = useTranslations()
  const [integrations] = useState([
    {
      id: "1",
      name: t('admin.mockData.integration1Name'),
      description: t('admin.mockData.integration1Desc'),
      icon: "💬",
      connected: true,
      configuredAt: "2024-01-15",
    },
    {
      id: "2",
      name: t('admin.mockData.integration2Name'),
      description: t('admin.mockData.integration2Desc'),
      icon: "🔗",
      connected: true,
      configuredAt: "2024-01-10",
    },
    {
      id: "3",
      name: t('admin.mockData.integration3Name'),
      description: t('admin.mockData.integration3Desc'),
      icon: "💳",
      connected: false,
    },
    {
      id: "4",
      name: t('admin.mockData.integration4Name'),
      description: t('admin.mockData.integration4Desc'),
      icon: "📊",
      connected: false,
    },
  ])

  return (
    <div className="space-y-6">
      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {t('admin.integrationsTab.description')}
        </p>
        <Button aria-label={t('admin.integrationsTab.browseIntegrations')}>
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          {t('admin.integrationsTab.browseIntegrations')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('admin.integrationsTab.totalIntegrations')}</CardDescription>
            <CardTitle className="text-3xl">{integrations.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('admin.integrationsTab.connected')}</CardDescription>
            <CardTitle className="text-3xl">
              {integrations.filter(i => i.connected).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="space-y-3">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex gap-3 flex-1">
                  <div className="text-3xl">{integration.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <CardTitle className="text-base">{integration.name}</CardTitle>
                      {integration.connected && (
                        <Badge variant="default">
                          <CheckCircle2 className="h-3 w-3 mr-1" aria-hidden="true" />
                          {t('admin.integrationsTab.connected')}
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{integration.description}</CardDescription>
                    {integration.configuredAt && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {t('admin.integrationsTab.connectedOn', { date: integration.configuredAt })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {integration.connected ? (
                    <>
                      <Button variant="outline" size="sm" aria-label={t('admin.integrationsTab.configure')}>
                        <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
                        {t('admin.integrationsTab.configure')}
                      </Button>
                      <Button variant="destructive" size="sm" aria-label={t('admin.integrationsTab.disconnect')}>
                        {t('admin.integrationsTab.disconnect')}
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" aria-label={t('admin.integrationsTab.connect')}>
                      <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                      {t('admin.integrationsTab.connect')}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
