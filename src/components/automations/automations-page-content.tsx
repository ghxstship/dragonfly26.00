"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AutomationsList } from "@/components/automations/automations-list"
import { AutomationBuilder } from "@/components/automations/automation-builder"
import type { Automation } from "@/types"

const mockAutomations: Automation[] = [
  {
    id: "1",
    organization_id: "org-1",
    name: "Auto-assign new tasks",
    description: "Automatically assign tasks using round-robin",
    is_active: true,
    trigger_type: "item_created",
    trigger_config: {},
    conditions: [],
    actions: [{ type: "assign_user", config: {} }],
    run_once_per_item: true,
    delay_minutes: 0,
    execution_count: 142,
    created_by: "user-1",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-15T10:30:00Z",
  },
]

export function AutomationsPageContent() {
  const [automations, setAutomations] = useState<Automation[]>(mockAutomations)
  const [isBuilding, setIsBuilding] = useState(false)

  const stats = {
    total: automations.length,
    active: automations.filter((a) => a.is_active).length,
    executions: automations.reduce((sum, a) => sum + a.execution_count, 0),
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-background p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Automations</h1>
            <p className="text-muted-foreground mt-2">Automate repetitive tasks</p>
          </div>
          <Button onClick={() => setIsBuilding(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Automation
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Executions</p>
              <p className="text-2xl font-bold">{stats.executions}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <AutomationsList
          automations={automations}
          onUpdate={(updated) =>
            setAutomations(automations.map((a) => (a.id === updated.id ? updated : a)))
          }
        />
      </div>

      {isBuilding && (
        <AutomationBuilder
          open={isBuilding}
          onOpenChange={setIsBuilding}
          onSave={(automation) => {
            setAutomations([...automations, automation])
            setIsBuilding(false)
          }}
        />
      )}
    </div>
  )
}
