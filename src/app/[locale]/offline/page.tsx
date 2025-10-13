/**
 * Offline Page
 * Shown when user is offline and page is not cached
 */

import { OfflineContent } from "@/components/offline-content"

export const dynamic = 'force-dynamic'

export default function OfflinePage() {
  return <OfflineContent />
}
