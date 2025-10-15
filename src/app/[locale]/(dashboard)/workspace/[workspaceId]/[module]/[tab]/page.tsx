import { TabPageContent } from "@/components/workspace/tab-page-content"

// force-dynamic required: Client component with tab-specific workspace data
export const dynamic = 'force-dynamic'

export default function TabPage() {
  return <TabPageContent />
}
