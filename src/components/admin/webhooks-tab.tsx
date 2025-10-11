"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function WebhooksTab() {
  const t = useTranslations()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhooks</CardTitle>
        <CardDescription>
          External webhook integrations for third-party services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Webhook management coming soon. Configure webhooks to integrate with external services.
        </p>
      </CardContent>
    </Card>
  )
}
