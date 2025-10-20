"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, Clock } from "lucide-react"
import type { Webhook } from "@/types"

interface WebhookDetailProps {
  webhook: Webhook
  open: boolean
  onOpenChange: (open: boolean) => void
}

const mockDeliveries = [
  {
    id: "1",
    event_type: "item.created",
    status: "success" as const,
    response_status: 200,
    duration_ms: 145,
    created_at: "2025-01-15T10:30:00Z",
  },
  {
    id: "2",
    event_type: "item.updated",
    status: "success" as const,
    response_status: 200,
    duration_ms: 132,
    created_at: "2025-01-15T09:15:00Z",
  },
  {
    id: "3",
    event_type: "item.status_changed",
    status: "failed" as const,
    response_status: 500,
    duration_ms: 5200,
    created_at: "2025-01-14T16:45:00Z",
  },
]

export function WebhookDetail({ webhook, open, onOpenChange }: WebhookDetailProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{webhook.name}</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="logs">Delivery Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Status</CardTitle>
              </CardHeader>
              <CardContent>
                {webhook.is_active ? (
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <XCircle className="h-3 w-3 mr-1" />
                    Inactive
                  </Badge>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{webhook.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Triggered</span>
                  <span>
                    {webhook.last_triggered_at
                      ? new Date(webhook.last_triggered_at).toLocaleString()
                      : "Never"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Success</span>
                  <span>
                    {webhook.last_success_at
                      ? new Date(webhook.last_success_at).toLocaleString()
                      : "Never"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Failure Count</span>
                  <span className={webhook.failure_count > 0 ? "text-destructive" : ""}>
                    {webhook.failure_count}
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Endpoint</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Method</span>
                  <span className="font-mono">{webhook.method}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">URL</span>
                  <span className="font-mono text-xs break-all">{webhook.url}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {webhook.events.map((event: any) => (
                    <Badge key={event} variant="outline">
                      {event}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Retry Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Retry Enabled</span>
                  <span>{webhook.retry_enabled ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Max Retries</span>
                  <span>{webhook.max_retries}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Retry Delay</span>
                  <span>{webhook.retry_delay_seconds}s</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            {mockDeliveries.map((delivery: any) => (
              <Card key={delivery.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{delivery.event_type}</Badge>
                      {(delivery as any).status === "success" ? (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Success
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          Failed
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(delivery.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Status: {delivery.response_status}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {delivery.duration_ms}ms
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
