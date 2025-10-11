"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { usePWA } from "@/hooks/use-pwa"

export function InstallPrompt() {
  const t = useTranslations()
  const { isInstallable, promptInstall } = usePWA()
  const [isDismissed, setIsDismissed] = useState(false)

  if (!isInstallable || isDismissed) {
    return null
  }

  const handleInstall = async () => {
    const installed = await promptInstall()
    if (installed) {
      setIsDismissed(true)
    }
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:w-96">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Download className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Install App</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Install Dragonfly for faster access and offline support
              </p>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleInstall}>
                  Install
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsDismissed(true)}
                >
                  Not now
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 -mt-1"
              onClick={() => setIsDismissed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
