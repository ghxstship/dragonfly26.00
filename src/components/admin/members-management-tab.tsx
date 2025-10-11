"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function MembersManagementTab() {
  const t = useTranslations()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Members & Roles</CardTitle>
        <CardDescription>
          Manage organization members and their permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Member management UI coming soon. Members can currently be managed through the organization settings.
        </p>
      </CardContent>
    </Card>
  )
}
