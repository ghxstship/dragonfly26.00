import { AppearanceTab } from "@/components/settings/appearance-tab"
import { IntegrationsTab } from "@/components/settings/integrations-tab"
import { AutomationsTab } from "@/components/settings/automations-tab"
import { AccountTab } from "@/components/settings/account-tab"
import { TeamTab } from "@/components/settings/team-tab"
import { BillingTab } from "@/components/settings/billing-tab"

export const SETTINGS_TAB_COMPONENTS: Record<string, React.ComponentType> = {
  "appearance": AppearanceTab,
  "integrations": IntegrationsTab,
  "automations": AutomationsTab,
  "account": AccountTab,
  "team": TeamTab,
  "billing": BillingTab,
}

export function getSettingsTabComponent(tabSlug: string) {
  return SETTINGS_TAB_COMPONENTS[tabSlug]
}
