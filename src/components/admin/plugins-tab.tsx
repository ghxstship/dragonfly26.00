"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function PluginsTab() {
  const t = useTranslations()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plugins</CardTitle>
        <CardDescription>
          Plugin marketplace and third-party integrations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Plugin marketplace coming soon. Browse and install plugins to extend functionality.
        </p>
      </CardContent>
    </Card>
  )
}
