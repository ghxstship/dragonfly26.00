"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AdminOverviewTab() {
  const t = useTranslations()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Overview</CardTitle>
        <CardDescription>
          Organization dashboard and overview metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Admin overview dashboard coming soon. View organization-wide metrics and activity.
        </p>
      </CardContent>
    </Card>
  )
}
