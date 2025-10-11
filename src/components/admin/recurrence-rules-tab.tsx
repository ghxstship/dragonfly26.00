"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function RecurrenceRulesTab() {
  const t = useTranslations()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recurrence Rules</CardTitle>
        <CardDescription>
          Create reusable recurrence patterns for your organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Recurrence rule management coming soon. Users can currently set custom recurrence on individual items.
        </p>
      </CardContent>
    </Card>
  )
}
