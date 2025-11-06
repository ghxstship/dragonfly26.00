"use client"

import { useTranslations } from "next-intl"
import { WifiOff, Wifi } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { usePWA } from "@/hooks/use-pwa"

export function OfflineIndicator() {
  const t = useTranslations()
  const { isOffline } = usePWA()

  if (!isOffline) {
    return null
  }

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50">
      <Badge variant="secondary" className="shadow-lg">
        <WifiOff aria-hidden="true" className="h-3 w-3 mr-2" />
        Offline Mode
      </Badge>
    </div>
  )
}

export function SyncStatus({ isSyncing }: { isSyncing: boolean }) {
  if (!isSyncing) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <Badge variant="default" className="shadow-lg">
        <Wifi aria-hidden="true" className="h-3 w-3 mr-2 animate-pulse" />
        Syncing...
      </Badge>
    </div>
  )
}
