import { ModulePageContent } from "@/components/workspace/module-page-content"

// force-dynamic required: Client component with workspace-specific data
export const dynamic = 'force-dynamic'

export default function ModulePage() {
  return <ModulePageContent />
}
