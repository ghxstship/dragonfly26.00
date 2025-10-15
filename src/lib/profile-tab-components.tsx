import { BasicInfoTab } from "@/components/profile/basic-info-tab"
import { ProfessionalTab } from "@/components/profile/professional-tab"
import { SocialMediaTab } from "@/components/profile/social-media-tab"
import { CertificationsTab } from "@/components/profile/certifications-tab"
import { TravelProfileTab } from "@/components/profile/travel-profile-tab"
import { HealthTab } from "@/components/profile/health-tab"
import { EmergencyContactTab } from "@/components/profile/emergency-contact-tab"
import { PerformanceTab } from "@/components/profile/performance-tab"
import { EndorsementsTab } from "@/components/profile/endorsements-tab"
import { TagsTab } from "@/components/profile/tags-tab"
import { HistoryTab } from "@/components/profile/history-tab"
import { AccessTab } from "@/components/profile/access-tab"

export const PROFILE_TAB_COMPONENTS: Record<string, React.ComponentType> = {
  "basic-info": BasicInfoTab,
  "professional": ProfessionalTab,
  "social": SocialMediaTab,
  "certifications": CertificationsTab,
  "travel": TravelProfileTab,
  "health": HealthTab,
  "emergency": EmergencyContactTab,
  "performance": PerformanceTab,
  "endorsements": EndorsementsTab,
  "tags": TagsTab,
  "history": HistoryTab,
  "access": AccessTab,
}

export function getProfileTabComponent(tabSlug: string) {
  return PROFILE_TAB_COMPONENTS[tabSlug]
}
