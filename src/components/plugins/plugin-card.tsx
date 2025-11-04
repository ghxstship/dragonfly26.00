"use client"

import { useTranslations } from "next-intl"
import { Star, Download, Check } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Plugin } from "@/types"

interface PluginCardProps {
  plugin: Plugin
  layout?: "grid" | "list"
  isInstalled?: boolean
  onInstall?: (plugin: Plugin) => void
}

export function PluginCard({ plugin, layout = "grid", isInstalled = false, onInstall }: PluginCardProps) {
  const t = useTranslations()
  if (layout === "list") {
    return (
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-2 md:gap-3 lg:gap-4">
            <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold">{plugin.name}</h3>
                    {plugin.is_featured && <Badge variant="secondary">Featured</Badge>}
                    {isInstalled && <Badge variant="default"><Check className="h-3 w-3 mr-1 flex-shrink-0" />Installed</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{plugin.description}</p>
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4 text-sm">
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{plugin.rating?.toFixed(1) || "N/A"}</span>
                      <span className="text-muted-foreground">({plugin.review_count})</span>
                    </div>
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>{plugin.install_count.toLocaleString()} installs</span>
                    </div>
                    <Badge variant="outline" className="capitalize">{plugin.category}</Badge>
                  </div>
                </div>
                <Button onClick={() => onInstall?.(plugin)} disabled={isInstalled}>
                  {isInstalled ? "Installed" : "Install"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="h-32 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 mb-4" />
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{plugin.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{plugin.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4 text-sm mb-4">
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{plugin.rating?.toFixed(1) || "N/A"}</span>
          </div>
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
            <Download className="h-4 w-4" />
            <span>{plugin.install_count.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
          <Badge variant="outline" className="capitalize">{plugin.category}</Badge>
          {plugin.is_featured && <Badge variant="secondary">Featured</Badge>}
          {isInstalled && <Badge variant="default"><Check className="h-3 w-3 flex-shrink-0" /></Badge>}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full max-w-full" onClick={() => onInstall?.(plugin)} disabled={isInstalled}>
          {isInstalled ? "Installed" : "Install Plugin"}
        </Button>
      </CardFooter>
    </Card>
  )
}
