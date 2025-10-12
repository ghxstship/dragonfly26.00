"use client"

import { useState } from "react"
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
  Cloud
} from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"

interface Integration {
  id: string
  name: string
  description: string
  icon: any
  category: string
  connected: boolean
  scope: "organization" | "personal"
  configuredAt?: string
}

export function IntegrationsTab() {
  const { toast } = useToast()
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "slack",
      name: "Slack",
      description: "Team communication and notifications",
      icon: MessageSquare,
      category: "communication",
      connected: false,
      scope: "organization",
    },
    {
      id: "google-calendar",
      name: "Google Calendar",
      description: "Sync events and schedules",
      icon: Calendar,
      category: "productivity",
      connected: true,
      scope: "personal",
      configuredAt: "2024-01-15",
    },
    {
      id: "gmail",
      name: "Gmail",
      description: "Email integration and notifications",
      icon: Mail,
      category: "communication",
      connected: false,
      scope: "personal",
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "Automate workflows with 5000+ apps",
      icon: Zap,
      category: "automation",
      connected: true,
      scope: "organization",
      configuredAt: "2024-01-10",
    },
    {
      id: "airtable",
      name: "Airtable",
      description: "Database and spreadsheet integration",
      icon: Database,
      category: "data",
      connected: false,
      scope: "personal",
    },
    {
      id: "dropbox",
      name: "Dropbox",
      description: "Cloud storage and file sharing",
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
      title: "Integration connected",
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
      title: "Integration disconnected",
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
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base">{integration.name}</CardTitle>
                <CardDescription className="text-sm mt-1">
                  {integration.description}
                </CardDescription>
              </div>
            </div>
            <Badge variant={integration.connected ? "default" : "outline"}>
              {integration.connected ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Connected
                </>
              ) : (
                "Not connected"
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {integration.scope === "organization" ? (
                <>
                  <Building2 className="h-4 w-4" />
                  Organization-level
                </>
              ) : (
                <>
                  <User className="h-4 w-4" />
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
            <div className="flex gap-2">
              {integration.connected ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openConfigDialog(integration)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
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
                  <Plus className="h-4 w-4 mr-2" />
                  Connect
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>
            Connect your favorite tools and services. Organization-level integrations are shared with your team,
            while personal integrations are for your individual use.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Integrations</TabsTrigger>
          <TabsTrigger value="organization">
            <Building2 className="h-4 w-4 mr-2" />
            Organization ({organizationIntegrations.length})
          </TabsTrigger>
          <TabsTrigger value="personal">
            <User className="h-4 w-4 mr-2" />
            Personal ({personalIntegrations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Organization Integrations
              </h3>
              <div className="space-y-3">
                {organizationIntegrations.map(renderIntegrationCard)}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
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
                placeholder="Enter your API key"
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
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
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
