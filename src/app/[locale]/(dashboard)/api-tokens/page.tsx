import { APITokensPageContent } from "@/components/api-tokens/api-tokens-page-content"

// force-dynamic required: Client component with dynamic token management
export const dynamic = 'force-dynamic'

export default function APITokensPage() {
  return <APITokensPageContent />
}
