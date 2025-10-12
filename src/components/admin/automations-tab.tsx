"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Bot, Plus, Play, Pause, Settings } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/lib/hooks/use-toast"

export function AutomationsTab() {
  const { toast } = useToast()
  const [automations, setAutomations] = useState([
    {
      id: "1",
      name: "New Member Welcome",
      description: "Send welcome email when member joins",
      trigger: "Member Added",
      enabled: true,
      runsCount: 42,
    },
    {
      id: "2",
      name: "Project Milestone Alerts",
      description: "Notify team when milestones are completed",
      trigger: "Milestone Completed",
      enabled: true,
      runsCount: 156,
    },
    {
      id: "3",
      name: "Budget Threshold Warning",
      description: "Alert when project budget exceeds 80%",
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
      <div className="flex justify-end">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Automation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Automations</CardDescription>
            <CardTitle className="text-3xl">{automations.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl">
              {automations.filter(a => a.enabled).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Runs</CardDescription>
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
                        <><Play className="h-3 w-3 mr-1" />Active</>
                      ) : (
                        <><Pause className="h-3 w-3 mr-1" />Paused</>
                      )}
                    </Badge>
                  </div>
                  <CardDescription>{automation.description}</CardDescription>
                  <p className="text-xs text-muted-foreground mt-2">
                    Trigger: {automation.trigger} • {automation.runsCount} total runs
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={automation.enabled}
                    onCheckedChange={() => handleToggle(automation.id)}
                  />
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
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
