"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrganizationSettingsTab } from "@/components/admin/organization-settings-tab"
import { CustomStatusesTab } from "@/components/admin/custom-statuses-tab"
import { ChecklistTemplatesTab } from "@/components/admin/checklist-templates-tab"
import { RecurrenceRulesTab } from "@/components/admin/recurrence-rules-tab"
import { MembersManagementTab } from "@/components/admin/members-management-tab"
import { Settings, Users, ListChecks, Calendar, Palette } from "lucide-react"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("settings")

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-background p-6">
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage organization-wide settings and configurations
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="statuses" className="gap-2">
              <Palette className="h-4 w-4" />
              Statuses
            </TabsTrigger>
            <TabsTrigger value="checklists" className="gap-2">
              <ListChecks className="h-4 w-4" />
              Checklists
            </TabsTrigger>
            <TabsTrigger value="recurrence" className="gap-2">
              <Calendar className="h-4 w-4" />
              Recurrence
            </TabsTrigger>
            <TabsTrigger value="members" className="gap-2">
              <Users className="h-4 w-4" />
              Members
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-4">
            <OrganizationSettingsTab />
          </TabsContent>

          <TabsContent value="statuses" className="space-y-4">
            <CustomStatusesTab />
          </TabsContent>

          <TabsContent value="checklists" className="space-y-4">
            <ChecklistTemplatesTab />
          </TabsContent>

          <TabsContent value="recurrence" className="space-y-4">
            <RecurrenceRulesTab />
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <MembersManagementTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
