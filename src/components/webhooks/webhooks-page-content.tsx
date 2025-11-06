"use client"

import { useState } from "react"
import { Plus, Webhook as WebhookIcon, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { WebhooksList } from "@/components/webhooks/webhooks-list"
import { CreateWebhookDialog } from "@/components/webhooks/create-webhook-dialog"
import { WebhookDetail } from "@/components/webhooks/webhook-detail"
import type { Webhook } from "@/types"

const mockWebhooks: Webhook[] = [
  {
    id: "1",
    organization_id: "org-1",
    name: "Slack Notifications",
    description: "Send task updates to #dev-team channel",
    url: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    events: ["item.created", "item.updated", "item.status_changed"],
    filters: { item_type: "task" },
    retry_enabled: true,
    max_retries: 3,
    retry_delay_seconds: 60,
    is_active: true,
    last_triggered_at: "2025-01-15T10:30:00Z",
    last_success_at: "2025-01-15T10:30:00Z",
    failure_count: 0,
    created_by: "user-1",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "2",
    organization_id: "org-1",
    name: "GitHub Issue Sync",
    description: "Create GitHub issues from tasks",
    url: "https://api.github.com/repos/owner/repo/issues",
    method: "POST",
    headers: { "Authorization": "token ghp_xxxx", "Content-Type": "application/json" },
    events: ["item.created"],
    filters: { item_type: "task", labels: ["bug"] },
    retry_enabled: true,
    max_retries: 5,
    retry_delay_seconds: 120,
    is_active: false,
    last_triggered_at: "2025-01-10T14:20:00Z",
    last_failure_at: "2025-01-10T14:20:00Z",
    failure_count: 3,
    created_by: "user-1",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-10T00:00:00Z",
  },
]

export function WebhooksPageContent() {
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const activeWebhooks = mockWebhooks.filter((w: any) => w.is_active).length
  const totalDeliveries = 1234
  const successRate = 98.5

  return (
    <div className="flex flex-wrap flex-col h-full">
      {/* Header */}
      <div className="border-b bg-background p-4 sm:p-6">
        <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between mb-6">
          <div>
            <h1 className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl font-bold">Webhooks</h1>
            <p className="text-muted-foreground mt-2">
              Send real-time notifications to external services
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus aria-hidden="true" className="h-4 w-4 mr-2" />
            Create Webhook
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:grid-cols-3 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
          <Card>
            <CardContent aria-hidden="true" className="p-4">
              <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Webhooks</p>
                  <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{mockWebhooks.length}</p>
                </div>
                <WebhookIcon aria-hidden="true" className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent aria-hidden="true" className="p-4">
              <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-green-600">{activeWebhooks}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent aria-hidden="true" className="p-4">
              <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Deliveries</p>
                  <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{totalDeliveries.toLocaleString()}</p>
                </div>
                <Clock aria-hidden="true" className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent aria-hidden="true" className="p-4">
              <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-green-600">{successRate}%</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <WebhooksList
          webhooks={mockWebhooks}
          onSelect={setSelectedWebhook}
        />
      </div>

      {/* Dialogs */}
      <CreateWebhookDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />

      {selectedWebhook && (
        <WebhookDetail
          webhook={selectedWebhook}
          open={!!selectedWebhook}
          onOpenChange={(open) => !open && setSelectedWebhook(null)}
        />
      )}
    </div>
  )
}
