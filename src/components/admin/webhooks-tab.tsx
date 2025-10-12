"use client"

import { useState } from "react"
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
  const { toast } = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookConfig | null>(null)

  const availableEvents = [
    { id: "project.created", label: "Project Created", description: "Triggered when a new project is created" },
    { id: "project.updated", label: "Project Updated", description: "Triggered when a project is updated" },
    { id: "project.deleted", label: "Project Deleted", description: "Triggered when a project is deleted" },
    { id: "member.added", label: "Member Added", description: "Triggered when a member joins" },
    { id: "member.removed", label: "Member Removed", description: "Triggered when a member leaves" },
    { id: "event.created", label: "Event Created", description: "Triggered when an event is scheduled" },
    { id: "task.completed", label: "Task Completed", description: "Triggered when a task is completed" },
    { id: "invoice.paid", label: "Invoice Paid", description: "Triggered when an invoice is paid" },
  ]

  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: "1",
      name: "Slack Notifications",
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
      name: "Project Management System",
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
      name: "Analytics Tracker",
      url: "https://analytics.example.com/webhook",
      events: ["task.completed", "invoice.paid"],
      active: false,
      secret: "whsec_def456ghi789jkl012",
      lastTriggered: "3 days ago",
      successRate: 95.2,
      totalCalls: 423,
    },
  ])

  const handleCreateWebhook = () => {
    setSelectedWebhook(null)
    setDialogOpen(true)
  }

  const handleEditWebhook = (webhook: WebhookConfig) => {
    setSelectedWebhook(webhook)
    setDialogOpen(true)
  }

  const handleDeleteWebhook = (webhookId: string) => {
    setWebhooks(webhooks.filter(w => w.id !== webhookId))
    toast({
      title: "Webhook deleted",
      description: "The webhook has been removed successfully.",
      variant: "destructive",
    })
  }

  const handleToggleWebhook = (webhookId: string) => {
    setWebhooks(webhooks.map(w => 
      w.id === webhookId ? { ...w, active: !w.active } : w
    ))
    const webhook = webhooks.find(w => w.id === webhookId)
    toast({
      title: webhook?.active ? "Webhook disabled" : "Webhook enabled",
      description: `${webhook?.name} has been ${webhook?.active ? "disabled" : "enabled"}.`,
    })
  }

  const handleCopySecret = (secret: string) => {
    navigator.clipboard.writeText(secret)
    toast({
      title: "Secret copied",
      description: "Webhook secret has been copied to clipboard.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleCreateWebhook}>
          <Plus className="h-4 w-4 mr-2" />
          Create Webhook
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Webhooks</CardDescription>
            <CardTitle className="text-3xl">{webhooks.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Webhooks</CardDescription>
            <CardTitle className="text-3xl">
              {webhooks.filter(w => w.active).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Calls (30 days)</CardDescription>
            <CardTitle className="text-3xl">
              {webhooks.reduce((sum, w) => sum + w.totalCalls, 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Webhooks List */}
      <div className="space-y-3">
        {webhooks.map((webhook) => (
          <Card key={webhook.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-base">{webhook.name}</CardTitle>
                    <Badge variant={webhook.active ? "default" : "secondary"}>
                      {webhook.active ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
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
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ExternalLink className="h-3 w-3" />
                      <span className="font-mono text-xs">{webhook.url}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        {webhook.totalCalls} calls
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {webhook.successRate}% success rate
                      </div>
                      {webhook.lastTriggered && (
                        <span>Last triggered: {webhook.lastTriggered}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={webhook.active}
                    onCheckedChange={() => handleToggleWebhook(webhook.id)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Events ({webhook.events.length})</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {webhook.events.map((eventId) => {
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
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 px-3 py-2 bg-muted rounded text-xs font-mono">
                      {webhook.secret}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopySecret(webhook.secret)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditWebhook(webhook)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    View Logs
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteWebhook(webhook.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedWebhook ? "Edit Webhook" : "Create New Webhook"}
            </DialogTitle>
            <DialogDescription>
              Configure webhook endpoint and event subscriptions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Webhook Name</Label>
              <Input
                placeholder="e.g., Slack Notifications"
                defaultValue={selectedWebhook?.name}
              />
            </div>

            <div className="space-y-2">
              <Label>Endpoint URL</Label>
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
              <Label>Events to Subscribe</Label>
              <div className="max-h-[300px] overflow-y-auto space-y-2 p-3 border rounded-lg">
                {availableEvents.map((event) => (
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
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: "Webhook saved",
                  description: "The webhook has been configured successfully.",
                })
                setDialogOpen(false)
              }}
            >
              {selectedWebhook ? "Save Changes" : "Create Webhook"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
