"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Building2, 
  User, 
  Check, 
  Plus, 
  Settings, 
  ExternalLink,
  Trash2,
  Zap,
  Calendar,
  Mail,
  MessageSquare,
  Database,
  Cloud,
  type LucideIcon
} from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"

interface Integration {
  id: string
  name: string
  description: string
  icon: LucideIcon
  category: string
  connected: boolean
  scope: "organization" | "personal"
  configuredAt?: string
}

export function IntegrationsTab() {
  const t = useTranslations()
  const { toast } = useToast()
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "slack",
      name: t('settings.integrations.slack'),
      description: t('settings.integrations.slackDesc'),
      icon: MessageSquare,
      category: "communication",
      connected: false,
      scope: "organization",
    },
    {
      id: "google-calendar",
      name: t('settings.integrations.googleCalendar'),
      description: t('settings.integrations.googleCalendarDesc'),
      icon: Calendar,
      category: "productivity",
      connected: true,
      scope: "personal",
      configuredAt: "2024-01-15",
    },
    {
      id: "gmail",
      name: t('settings.integrations.gmail'),
      description: t('settings.integrations.gmailDesc'),
      icon: Mail,
      category: "communication",
      connected: false,
      scope: "personal",
    },
    {
      id: "zapier",
      name: t('settings.integrations.zapier'),
      description: t('settings.integrations.zapierDesc'),
      icon: Zap,
      category: "automation",
      connected: true,
      scope: "organization",
      configuredAt: "2024-01-10",
    },
    {
      id: "airtable",
      name: t('settings.integrations.airtable'),
      description: t('settings.integrations.airtableDesc'),
      icon: Database,
      category: "data",
      connected: false,
      scope: "personal",
    },
    {
      id: "dropbox",
      name: t('settings.integrations.dropbox'),
      description: t('settings.integrations.dropboxDesc'),
      icon: Cloud,
      category: "storage",
      connected: false,
      scope: "organization",
    },
  ])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)

  const handleConnect = (integration: Integration) => {
    setIntegrations(integrations.map(i => 
      i.id === integration.id 
        ? { ...i, connected: true, configuredAt: new Date().toISOString().split('T')[0] }
        : i
    ))
    toast({
      title: t('settings.toast.integrationConnected'),
      description: `${integration.name} has been successfully connected.`,
    })
    setDialogOpen(false)
  }

  const handleDisconnect = (integration: Integration) => {
    setIntegrations(integrations.map(i => 
      i.id === integration.id 
        ? { ...i, connected: false, configuredAt: undefined }
        : i
    ))
    toast({
      title: t('settings.toast.integrationDisconnected'),
      description: `${integration.name} has been disconnected.`,
      variant: "destructive",
    })
  }

  const openConfigDialog = (integration: Integration) => {
    setSelectedIntegration(integration)
    setDialogOpen(true)
  }

  const renderIntegrationCard = (integration: Integration) => {
    const Icon = integration.icon
    return (
      <Card key={integration.id}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon aria-hidden="true" className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle aria-hidden="true" className="text-base">{integration.name}</CardTitle>
                <CardDescription aria-hidden="true" className="text-sm mt-1">
                  {integration.description}
                </CardDescription>
              </div>
            </div>
            <Badge variant={integration.connected ? "default" : "outline"}>
              {integration.connected ? (
                <>
                  <Check aria-hidden="true" className="h-3 w-3 mr-1 flex-shrink-0" />
                  {t('settings.integrationsTab.connected')}
                </>
              ) : (
                t('settings.integrationsTab.notConnected')
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-sm text-muted-foreground">
              {integration.scope === "organization" ? (
                <>
                  <Building2 className="h-4 w-4" />
                  Organization-level
                </>
              ) : (
                <>
                  <User aria-hidden="true" className="h-4 w-4" />
                  Personal
                </>
              )}
              {integration.configuredAt && (
                <>
                  <span>•</span>
                  <span>Connected {integration.configuredAt}</span>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {integration.connected ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openConfigDialog(integration)}
                  >
                    <Settings aria-hidden="true" className="h-4 w-4 mr-2" />
                    {t('settings.integrationsTab.configureIntegration')}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDisconnect(integration)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={() => openConfigDialog(integration)}
                >
                  <Plus aria-hidden="true" className="h-4 w-4 mr-2" />
                  {t('settings.integrationsTab.connectIntegration')}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const organizationIntegrations = integrations.filter(i => i.scope === "organization")
  const personalIntegrations = integrations.filter(i => i.scope === "personal")

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Connected Integrations */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">{t('settings.integrationsTab.allIntegrations')}</TabsTrigger>
          <TabsTrigger value="organization">
            <Building2 className="h-4 w-4 mr-2" aria-hidden="true" />
            {t('settings.integrationsTab.organization')} ({organizationIntegrations.length})
          </TabsTrigger>
          <TabsTrigger value="personal">
            <User aria-hidden="true" className="h-4 w-4 mr-2" />
            {t('settings.integrationsTab.personal')} ({personalIntegrations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3 flex flex-wrap flex-col md:flex-row items-center gap-2">
                <Building2 className="h-4 w-4" />
                Organization Integrations
              </h3>
              <div className="space-y-3">
                {organizationIntegrations.map(renderIntegrationCard)}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold mb-3 flex flex-wrap flex-col md:flex-row items-center gap-2">
                <User aria-hidden="true" className="h-4 w-4" />
                Personal Integrations
              </h3>
              <div className="space-y-3">
                {personalIntegrations.map(renderIntegrationCard)}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="organization" className="space-y-3">
          {organizationIntegrations.map(renderIntegrationCard)}
        </TabsContent>

        <TabsContent value="personal" className="space-y-3">
          {personalIntegrations.map(renderIntegrationCard)}
        </TabsContent>
      </Tabs>

      {/* Configuration Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedIntegration?.connected ? "Configure" : "Connect"} {selectedIntegration?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedIntegration?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder={t('settings.integrationsTab.apiKeyPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL (Optional)</Label>
              <Input
                id="webhook-url"
                type="url"
                placeholder="https://..."
              />
            </div>
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 p-3 rounded-lg bg-muted">
              <ExternalLink aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
              <a
                href="#"
                className="text-sm text-primary hover:underline"
              >
                View {selectedIntegration?.name} documentation
              </a>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => selectedIntegration && handleConnect(selectedIntegration)}>
              {selectedIntegration?.connected ? "Save Changes" : "Connect"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
