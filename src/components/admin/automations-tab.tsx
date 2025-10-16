"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Bot, Plus, Play, Pause, Settings } from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"

export function AutomationsTab() {
  const t = useTranslations()
  const { toast } = useToast()
  const [automations, setAutomations] = useState([
    {
      id: "1",
      name: t('admin.mockData.automation1Name'),
      description: t('admin.mockData.automation1Desc'),
      trigger: "Member Added",
      enabled: true,
      runsCount: 42,
    },
    {
      id: "2",
      name: t('admin.mockData.automation2Name'),
      description: t('admin.mockData.automation2Desc'),
      trigger: "Milestone Completed",
      enabled: true,
      runsCount: 156,
    },
    {
      id: "3",
      name: t('admin.mockData.automation3Name'),
      description: t('admin.mockData.automation3Desc'),
      trigger: "Budget Threshold",
      enabled: false,
      runsCount: 8,
    },
  ])

  const handleToggle = (id: string) => {
    setAutomations(automations.map(a => 
      a.id === id ? { ...a, enabled: !a.enabled } : a
    ))
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {t('admin.automationsTab.description')}
        </p>
        <div className="flex gap-2">
          <Button aria-label={t('admin.automationsTab.newAutomation')}>
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            {t('admin.automationsTab.newAutomation')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('admin.automationsTab.totalAutomations')}</CardDescription>
            <CardTitle className="text-3xl">{automations.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('admin.automationsTab.active')}</CardDescription>
            <CardTitle className="text-3xl">
              {automations.filter(a => a.enabled).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('admin.automationsTab.totalRuns')}</CardDescription>
            <CardTitle className="text-3xl">
              {automations.reduce((sum, a) => sum + a.runsCount, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="space-y-3">
        {automations.map((automation) => (
          <Card key={automation.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-base">{automation.name}</CardTitle>
                    <Badge variant={automation.enabled ? "default" : "secondary"}>
                      {automation.enabled ? (
                        <><Play className="h-3 w-3 mr-1" aria-hidden="true" />{t('admin.automationsTab.active')}</>
                      ) : (
                        <><Pause className="h-3 w-3 mr-1" aria-hidden="true" />{t('admin.automationsTab.paused')}</>
                      )}
                    </Badge>
                  </div>
                  <CardDescription>{automation.description}</CardDescription>
                  <p className="text-xs text-muted-foreground mt-2">
                    {t('admin.automationsTab.trigger')}: {automation.trigger} • {automation.runsCount} {t('admin.automationsTab.totalRunsCount')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={automation.enabled}
                    onCheckedChange={() => handleToggle(automation.id)}
                  />
                  <Button variant="ghost" size="icon" aria-label={t('common.settings')}>
                    <Settings className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
