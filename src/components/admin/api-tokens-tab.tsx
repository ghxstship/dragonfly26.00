"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ApiTokensTab() {
  const t = useTranslations()
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Tokens</CardTitle>
        <CardDescription>
          API access management and token generation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          API token management coming soon. Generate and manage API tokens for programmatic access.
        </p>
      </CardContent>
    </Card>
  )
}
