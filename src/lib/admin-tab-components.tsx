import { AdminOverviewTab } from "@/components/admin/admin-overview-tab"
import { OrganizationSettingsTab } from "@/components/admin/organization-settings-tab"
import { MembersManagementTab } from "@/components/admin/members-management-tab"
import { RolesPermissionsTab } from "@/components/admin/roles-permissions-tab"
import { BillingTab } from "@/components/admin/billing-tab"
import { SecurityTab } from "@/components/admin/security-tab"
import { TemplatesTab } from "@/components/admin/templates-tab"
import { AutomationsTab } from "@/components/admin/automations-tab"
import { IntegrationsTab } from "@/components/admin/integrations-tab"
import { WebhooksTab } from "@/components/admin/webhooks-tab"
import { ApiTokensTab } from "@/components/admin/api-tokens-tab"

export const ADMIN_TAB_COMPONENTS: Record<string, React.ComponentType> = {
  "overview": AdminOverviewTab,
  "organization": OrganizationSettingsTab,
  "invite": MembersManagementTab,
  "roles-permissions": RolesPermissionsTab,
  "billing": BillingTab,
  "security": SecurityTab,
  "templates": TemplatesTab,
  "automations": AutomationsTab,
  "integrations": IntegrationsTab,
  "webhooks": WebhooksTab,
  "api-tokens": ApiTokensTab,
}

export function getAdminTabComponent(tabSlug: string) {
  return ADMIN_TAB_COMPONENTS[tabSlug]
}
