import { NewsTab } from "@/components/community/news-tab"
import { ShowcaseTab } from "@/components/community/showcase-tab"
import { ActivityTab } from "@/components/community/activity-tab"
import { ConnectionsTab } from "@/components/community/connections-tab"
import { StudiosTab } from "@/components/community/studios-tab"
import { EventsTab } from "@/components/community/events-tab"
import { DiscussionsTab } from "@/components/community/discussions-tab"
import { CompetitionsTab } from "@/components/community/competitions-tab"

interface CommunityTabProps {
  data?: any[]
  loading?: boolean
}

export function getCommunityTabComponent(tabSlug: string): React.ComponentType<CommunityTabProps> | undefined {
  const components: Record<string, React.ComponentType<CommunityTabProps>> = {
    'news': NewsTab,
    'showcase': ShowcaseTab,
    'activity': ActivityTab,
    'connections': ConnectionsTab,
    'studios': StudiosTab,
    'events': EventsTab,
    'discussions': DiscussionsTab,
    'competitions': CompetitionsTab,
  }

  return components[tabSlug]
}
