"use client"

import { MoreHorizontal, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Webhook } from "@/types"

interface WebhooksListProps {
  webhooks: Webhook[]
  onSelect: (webhook: Webhook) => void
}

export function WebhooksList({ webhooks, onSelect }: WebhooksListProps) {
  return (
    <div className="space-y-4">
      {webhooks.map((webhook: any) => (
        <Card
          key={webhook.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSelect(webhook)}
        >
          <CardContent aria-hidden="true" className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{webhook.name}</h3>
                  {webhook.is_active ? (
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle2 className="h-3 w-3 mr-1 flex-shrink-0" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <XCircle aria-hidden="true" className="h-3 w-3 mr-1" />
                      Inactive
                    </Badge>
                  )}
                  {webhook.failure_count > 0 && (
                    <Badge variant="destructive">
                      <AlertCircle aria-hidden="true" className="h-3 w-3 mr-1" />
                      {webhook.failure_count} failures
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{webhook.description}</p>
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-3 md:gap-2 md:gap-3 lg:gap-4 lg:gap-6 text-sm text-muted-foreground">
                  <span className="font-mono text-xs">{webhook.method}</span>
                  <span className="truncate max-w-md">{webhook.url}</span>
                  <span>{webhook.events.length} events</span>
                  {webhook.last_triggered_at && (
                    <span>Last: {new Date(webhook.last_triggered_at).toLocaleString()}</span>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Test Webhook</DropdownMenuItem>
                  <DropdownMenuItem>View Logs</DropdownMenuItem>
                  <DropdownMenuItem>{webhook.is_active ? "Disable" : "Enable"}</DropdownMenuItem>
                  <DropdownMenuItem aria-hidden="true" className="text-destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
