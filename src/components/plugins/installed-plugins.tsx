"use client"

import { useTranslations } from "next-intl"
import { Settings, Trash2, Pause, Play } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { PluginInstallation } from "@/types"

interface InstalledPluginsProps {
  installations: PluginInstallation[]
}

export function InstalledPlugins({ installations }: InstalledPluginsProps) {
  const t = useTranslations()
  return (
    <div className="space-y-4">
      {installations.map((installation: any) => (
        <Card key={installation.id}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">{installation.plugin?.name}</h3>
                      <Badge variant={installation.status === "active" ? "default" : "secondary"} className="capitalize">
                        {installation.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{installation.plugin?.description}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        {installation.status === "active" ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Uninstall
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span>Installed {new Date(installation.installed_at).toLocaleDateString()}</span>
                  <span>{installation.usage_count} uses</span>
                  {installation.last_used_at && (
                    <span>Last used {new Date(installation.last_used_at).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {installations.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No plugins installed yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
