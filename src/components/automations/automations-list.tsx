"use client"

import { useTranslations } from "next-intl"
import { Zap, MoreHorizontal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Automation } from "@/types"

interface AutomationsListProps {
  automations: Automation[]
  onUpdate: (automation: Automation) => void
}

export function AutomationsList({ automations, onUpdate }: AutomationsListProps) {
  const t = useTranslations()
  return (
    <div className="space-y-4">
      {automations.map((automation: any) => (
        <Card key={automation.id}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-3 mb-2">
                  <Zap className={`h-5 w-5 ${automation.is_active ? "text-purple-600" : "text-muted-foreground"}`} />
                  <h3 className="text-lg font-semibold">{automation.name}</h3>
                </div>
                {automation.description && (
                  <p className="text-sm text-muted-foreground mb-4">{automation.description}</p>
                )}
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-3 md:gap-2 md:gap-3 lg:gap-4 lg:gap-6 text-sm">
                  <div>
                    <span className="text-muted-foreground">Trigger: </span>
                    <span className="font-medium capitalize">{automation.trigger_type.replace(/_/g, " ")}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Actions: </span>
                    <span className="font-medium">{automation.actions.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Executions: </span>
                    <span className="font-medium">{automation.execution_count}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                <Switch
                  checked={automation.is_active}
                  onCheckedChange={() => onUpdate({ ...automation, is_active: !automation.is_active })}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>View logs</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
