"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, CheckCircle2, Settings, Plus } from "lucide-react"
import { useState } from "react"

export function IntegrationsTab() {
  const [integrations] = useState([
    {
      id: "1",
      name: "Slack",
      description: "Team communication and notifications",
      icon: "💬",
      connected: true,
      configuredAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Google Workspace",
      description: "Calendar, Drive, and Gmail integration",
      icon: "🔗",
      connected: true,
      configuredAt: "2024-01-10",
    },
    {
      id: "3",
      name: "Stripe",
      description: "Payment processing and billing",
      icon: "💳",
      connected: false,
    },
    {
      id: "4",
      name: "QuickBooks",
      description: "Accounting and financial management",
      icon: "📊",
      connected: false,
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Browse Integrations
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Integrations</CardDescription>
            <CardTitle className="text-3xl">{integrations.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Connected</CardDescription>
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
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{integration.description}</CardDescription>
                    {integration.configuredAt && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Connected on {integration.configuredAt}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {integration.connected ? (
                    <>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button variant="destructive" size="sm">
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Connect
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
