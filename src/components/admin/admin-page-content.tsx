"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getModuleTabs } from "@/lib/modules/tabs-registry"
import { iconMap } from "@/lib/modules/icon-map"
import { AdminOverviewTab } from "@/components/admin/admin-overview-tab"
import { OrganizationSettingsTab } from "@/components/admin/organization-settings-tab"
import { MembersManagementTab } from "@/components/admin/members-management-tab"
import { RolesPermissionsTab } from "@/components/admin/roles-permissions-tab"
import { BillingTab } from "@/components/admin/billing-tab"
import { SecurityTab } from "@/components/admin/security-tab"
import { AutomationsTab } from "@/components/admin/automations-tab"
import { IntegrationsTab } from "@/components/admin/integrations-tab"
import { WebhooksTab } from "@/components/admin/webhooks-tab"
import { ApiTokensTab } from "@/components/admin/api-tokens-tab"

// Map tab slugs to components
const tabComponents: Record<string, React.ComponentType> = {
  "overview": AdminOverviewTab,
  "organization": OrganizationSettingsTab,
  "invite": MembersManagementTab,
  "roles-permissions": RolesPermissionsTab,
  "billing": BillingTab,
  "security": SecurityTab,
  "automations": AutomationsTab,
  "integrations": IntegrationsTab,
  "webhooks": WebhooksTab,
  "api-tokens": ApiTokensTab,
}

export function AdminPageContent() {
  const t = useTranslations()
  const adminTabs = getModuleTabs("admin").filter(tab => tab.enabled)
  const [activeTab, setActiveTab] = useState(adminTabs[0]?.slug || "overview")

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-background p-6">
        <h1 className="text-3xl font-bold">{t('admin.settings')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('admin.manageOrganizationSettings')}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="inline-flex h-auto flex-wrap justify-start gap-1 bg-muted p-1 rounded-lg">
            {adminTabs.map((tab) => {
              const Icon = iconMap[tab.icon]
              return (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.slug} 
                  className="gap-2 data-[state=active]:bg-background"
                  style={activeTab === tab.slug ? { color: tab.color } : undefined}
                >
                  {Icon && <Icon className="h-4 w-4" style={{ color: tab.color }} aria-hidden="true" />}
                  {t(`admin.${tab.slug}`)}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {adminTabs.map((tab) => {
            const TabComponent = tabComponents[tab.slug]
            if (!TabComponent) return null
            
            return (
              <TabsContent key={tab.id} value={tab.slug} className="space-y-4">
                <TabComponent />
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </div>
  )
}
