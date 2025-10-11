"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AutomationsTab() {
  const t = useTranslations()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Automations</CardTitle>
        <CardDescription>
          Workflow automation engine for automated actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Automation workflows coming soon. Create automated actions based on triggers and conditions.
        </p>
      </CardContent>
    </Card>
  )
}
