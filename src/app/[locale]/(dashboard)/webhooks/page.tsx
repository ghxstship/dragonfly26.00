import { WebhooksPageContent } from "@/components/webhooks/webhooks-page-content"

// force-dynamic required: Client component with webhook management
export const dynamic = 'force-dynamic'

export default function WebhooksPage() {
  return <WebhooksPageContent />
}
