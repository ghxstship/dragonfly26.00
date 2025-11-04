"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Webhook, 
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Activity,
  AlertCircle,
  Copy,
  ExternalLink
} from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"

interface WebhookConfig {
  id: string
  name: string
  url: string
  events: string[]
  active: boolean
  secret: string
  lastTriggered?: string
  successRate: number
  totalCalls: number
}

export function WebhooksTab() {
  const t = useTranslations()
  const { toast } = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookConfig | null>(null)

  const availableEvents = [
    { id: "project.created", label: t('admin.mockData.webhook1Label'), description: t('admin.mockData.webhook1Desc') },
    { id: "project.updated", label: t('admin.mockData.webhook2Label'), description: t('admin.mockData.webhook2Desc') },
    { id: "project.deleted", label: t('admin.mockData.webhook3Label'), description: t('admin.mockData.webhook3Desc') },
    { id: "member.added", label: t('admin.mockData.webhook4Label'), description: t('admin.mockData.webhook4Desc') },
    { id: "member.removed", label: t('admin.mockData.webhook5Label'), description: t('admin.mockData.webhook5Desc') },
    { id: "event.created", label: t('admin.mockData.webhook6Label'), description: t('admin.mockData.webhook6Desc') },
    { id: "task.completed", label: t('admin.mockData.webhook7Label'), description: t('admin.mockData.webhook7Desc') },
    { id: "invoice.paid", label: t('admin.mockData.webhook8Label'), description: t('admin.mockData.webhook8Desc') },
  ]

  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: "1",
      name: t('admin.mockData.webhookConfig1Name'),
      url: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXX",
      events: ["project.created", "member.added", "task.completed"],
      active: true,
      secret: "whsec_abc123def456ghi789",
      lastTriggered: "5 minutes ago",
      successRate: 98.5,
      totalCalls: 1247,
    },
    {
      id: "2",
      name: t('admin.mockData.webhookConfig2Name'),
      url: "https://api.example.com/webhooks/dragonfly",
      events: ["project.created", "project.updated", "event.created"],
      active: true,
      secret: "whsec_xyz789abc123def456",
      lastTriggered: "2 hours ago",
      successRate: 100,
      totalCalls: 834,
    },
    {
      id: "3",
      name: t('admin.mockData.webhookConfig3Name'),
      url: "https://analytics.example.com/webhook",
      events: ["task.completed", "invoice.paid"],
      active: false,
      secret: "whsec_def456ghi789jkl012",
      lastTriggered: "3 days ago",
      successRate: 95.2,
      totalCalls: 423,
    },
  ])

  const handleCreateWebhook = async () => {
    setSelectedWebhook(null)
    setDialogOpen(true)
  }

  const handleEditWebhook = (webhook: WebhookConfig) => {
    setSelectedWebhook(webhook)
    setDialogOpen(true)
  }

  const handleDeleteWebhook = (webhookId: string) => {
    setWebhooks(webhooks.filter(w => (w as any).id !== webhookId))
    toast({
      title: t('admin.toast.webhookDeleted'),
      description: t('admin.toast.webhookDeletedDesc'),
      variant: "destructive",
    })
  }

  const handleToggleWebhook = (webhookId: string) => {
    setWebhooks(webhooks.map(w => 
      w.id === webhookId ? { ...w, active: !w.active } : w
    ))
    const webhook = webhooks.find(w => w.id === webhookId)
    toast({
      title: webhook?.active ? t('admin.toast.webhookDisabled') : t('admin.toast.webhookEnabled'),
      description: webhook?.active ? t('admin.toast.webhookDisabledDesc', { name: webhook?.name || '' }) : t('admin.toast.webhookEnabledDesc', { name: webhook?.name || '' }),
    })
  }

  const handleCopySecret = (secret: string) => {
    navigator.clipboard.writeText(secret)
    toast({
      title: t('admin.toast.secretCopied'),
      description: t('admin.toast.secretCopiedDesc'),
    })
  }

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('admin.webhooksTab.totalWebhooks')}</CardDescription>
            <CardTitle className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">{webhooks.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('admin.webhooksTab.activeWebhooks')}</CardDescription>
            <CardTitle className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">
              {webhooks.filter(w => w.active).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('admin.webhooksTab.totalCalls')}</CardDescription>
            <CardTitle className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">
              {webhooks.reduce((sum: number, w) => sum + w.totalCalls, 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Webhooks List */}
      <div className="space-y-3">
        {webhooks.map((webhook: any) => (
          <Card key={webhook?.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-3 mb-2">
                    <CardTitle className="text-base">{webhook?.name}</CardTitle>
                    <Badge variant={webhook?.active ? "default" : "secondary"}>
                      {webhook?.active ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1 flex-shrink-0" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-sm text-muted-foreground">
                      <ExternalLink className="h-3 w-3" />
                      <span className="font-mono text-xs">{webhook?.url}</span>
                    </div>
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4 text-xs text-muted-foreground">
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                        <Activity className="h-3 w-3" />
                        {webhook?.totalCalls} calls
                      </div>
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
                        {webhook?.successRate}% success rate
                      </div>
                      {webhook?.lastTriggered && (
                        <span>Last triggered: {webhook?.lastTriggered}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                  <Switch
                    checked={webhook?.active}
                    onCheckedChange={() => handleToggleWebhook(webhook?.id)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Events ({webhook?.events.length})</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {webhook?.events.map((eventId: any) => {
                      const event = availableEvents.find(e => e.id === eventId)
                      return (
                        <Badge key={eventId} variant="outline">
                          {event?.label || eventId}
                        </Badge>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Signing Secret</Label>
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 mt-1">
                    <code className="flex-1 px-3 py-2 bg-muted rounded text-xs font-mono">
                      {webhook?.secret}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopySecret(webhook?.secret)}
                      aria-label={t('admin.webhooksTab.copySecret')}
                    >
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditWebhook(webhook)}
                  >
                    <Edit className="h-4 w-4 mr-2" aria-hidden="true" />
                    {t('common.edit')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <Activity className="h-4 w-4 mr-2" aria-hidden="true" />
                    {t('admin.webhooksTab.viewLogs')}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteWebhook(webhook?.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
                    {t('common.delete')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Webhook Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Webhooks allow you to receive real-time notifications when events occur in your organization.
            </p>
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 dark:text-blue-100">
                <p className="font-medium mb-1">Security Best Practices</p>
                <p>Always verify webhook signatures using the signing secret to ensure requests are authentic.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl px-4 sm:px-6 lg:px-8 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedWebhook ? t('admin.webhooksTab.editWebhook') : t('admin.webhooksTab.createWebhook')}
            </DialogTitle>
            <DialogDescription>
              {t('admin.webhooksTab.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t('admin.webhooksTab.webhookName')}</Label>
              <Input
                placeholder="e.g., Slack Notifications"
                defaultValue={selectedWebhook?.name}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('admin.webhooksTab.endpointUrl')}</Label>
              <Input
                type="url"
                placeholder="https://example.com/webhook"
                defaultValue={selectedWebhook?.url}
              />
              <p className="text-xs text-muted-foreground">
                This URL will receive POST requests when events occur
              </p>
            </div>

            <div className="space-y-2">
              <Label>{t('admin.webhooksTab.eventsToSubscribe')}</Label>
              <div className="max-h-[300px] overflow-y-auto space-y-2 p-3 border rounded-lg">
                {availableEvents.map((event: any) => (
                  <div key={event.id} className="flex items-start gap-3 p-2 hover:bg-accent rounded">
                    <input
                      type="checkbox"
                      id={event.id}
                      className="mt-1"
                      defaultChecked={selectedWebhook?.events.includes(event.id)}
                    />
                    <label htmlFor={event.id} className="flex-1 cursor-pointer">
                      <p className="text-sm font-medium">{event.label}</p>
                      <p className="text-xs text-muted-foreground">{event.description}</p>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: t('admin.toast.webhookSaved'),
                  description: t('admin.toast.webhookSavedDesc'),
                })
                setDialogOpen(false)
              }}
            >
              {selectedWebhook ? t('common.save') : t('admin.webhooksTab.createWebhook')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
