"use client"

import { useState } from "react"
import { usePathname } from "@/i18n/navigation"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/ui-store"
import { MODULES, MODULE_CATEGORIES } from "@/lib/modules/registry"
import { iconMap } from "@/lib/modules/icon-map"
import { getModuleTabs } from "@/lib/modules/tabs-registry"
import { InviteDialog } from "@/components/members/invite-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function Sidebar() {
  const t = useTranslations()
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar, currentWorkspace, focusMode } = useUIStore()
  const [favorites, setFavorites] = useState<string[]>([])
  const [collapsedHubs, setCollapsedHubs] = useState<Record<string, boolean>>({})
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)

  const toggleFavorite = (moduleId: string) => {
    setFavorites((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id: any) => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const toggleHub = (category: string) => {
    setCollapsedHubs((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const groupedModules = Object.entries(MODULE_CATEGORIES).map(([category, info]) => ({
    category,
    ...info,
    modules: MODULES.filter((m: any) => m.category === category && m.enabled && m.id !== 'profile'),
  }))

  // Get profile module separately (to anchor at bottom)
  const profileModule = MODULES.find((m: any) => m.id === 'profile')

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "sticky top-14 flex h-[calc(100vh-3.5rem)] flex-col border-r bg-background transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-60",
          focusMode && "hidden"
        )}
      >
        {/* Toggle Button at Top */}
        <div className="border-b p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={toggleSidebar}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="z-[100]">
              <p>{sidebarCollapsed ? t('sidebar.expand') : t('sidebar.collapse')}</p>
            </TooltipContent>
          </Tooltip>
        </div>

      {/* Scrollable Content - Hubs */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* Favorites Section */}
          {!sidebarCollapsed && favorites.length > 0 && (
            <div className="mb-4">
              <button
                onClick={() => toggleHub('favorites')}
                className="flex items-center justify-between w-full mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
              >
                <span>{t('sidebar.favorites')}</span>
                {collapsedHubs['favorites'] ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronUp className="h-3 w-3" />
                )}
              </button>
              {!collapsedHubs['favorites'] && (
                <div className="space-y-1">
                  {favorites.map((favId: any) => {
                    const favModule = MODULES.find((m: any) => m.id === favId)
                    if (!favModule) return null
                    const IconComponent = iconMap[favModule.icon] as React.ComponentType<{ className?: string; style?: React.CSSProperties }> | undefined
                    const moduleTabs = getModuleTabs(favModule.slug)
                    const firstTabSlug = moduleTabs.length > 0 ? moduleTabs[0].slug : 'overview'

                    return (
                      <Link
                        key={favModule.id}
                        href={`/workspace/${currentWorkspace?.id}/${favModule.slug}/${firstTabSlug}`}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors",
                          pathname.includes(favModule.slug) && "bg-accent"
                        )}
                      >
                        {IconComponent ? <IconComponent className="h-4 w-4 flex-shrink-0" style={{ color: favModule.color }} /> : null}
                        <span>{favModule.name}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Module Categories - Collapsible Hubs */}
          {groupedModules.map((group: any) => (
            <div key={group.category} className="mb-4">
              {!sidebarCollapsed ? (
                <button
                  onClick={() => toggleHub(group.category)}
                  className="flex items-center justify-between w-full mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  <span>{group.label}</span>
                  {collapsedHubs[group.category] ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronUp className="h-3 w-3" />
                  )}
                </button>
              ) : null}
              {(!collapsedHubs[group.category] || sidebarCollapsed) && (
                <div className="space-y-1">
                  {group.modules.map((moduleItem: any) => {
                    const Icon = iconMap[moduleItem.icon] as React.ComponentType<{ className?: string; style?: React.CSSProperties }> | undefined
                    const isActive = pathname.includes(moduleItem.slug)
                    const isFavorited = favorites.includes(moduleItem.id)
                    const moduleTabs = getModuleTabs(moduleItem.slug)
                    const firstTabSlug = moduleTabs.length > 0 ? moduleTabs[0].slug : 'overview'

                    // Special handling for invite module - opens dialog instead of navigating
                    if (moduleItem.id === 'invite') {
                      return (
                        <div
                          key={moduleItem.id}
                          className="group relative flex items-center"
                        >
                          <button
                            onClick={() => setInviteDialogOpen(true)}
                            className={cn(
                              "flex flex-1 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors",
                              sidebarCollapsed && "justify-center px-2"
                            )}
                            title={sidebarCollapsed ? moduleItem.name : undefined}
                          >
                            {Icon ? (
                              <Icon
                                className="h-4 w-4 flex-shrink-0"
                                style={{ color: moduleItem.color }}
                              />
                            ) : null}
                            {!sidebarCollapsed && <span>{moduleItem.name}</span>}
                          </button>
                        </div>
                      )
                    }

                    return (
                      <div
                        key={moduleItem.id}
                        className="group relative flex items-center"
                      >
                        <Link
                          href={`/workspace/${currentWorkspace?.id}/${moduleItem.slug}/${firstTabSlug}`}
                          className={cn(
                            "flex flex-1 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors",
                            isActive && "bg-accent",
                            sidebarCollapsed && "justify-center px-2"
                          )}
                          title={sidebarCollapsed ? moduleItem.name : undefined}
                        >
                          {Icon ? (
                            <Icon
                              className="h-4 w-4 flex-shrink-0"
                              style={{ color: moduleItem.color }}
                            />
                          ) : null}
                          {!sidebarCollapsed && <span>{moduleItem.name}</span>}
                        </Link>

                        {!sidebarCollapsed && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                            onClick={() => toggleFavorite(moduleItem.id)}
                          >
                            <Star
                              className={cn(
                                "h-3.5 w-3.5",
                                isFavorited && "fill-yellow-400 text-yellow-400"
                              )}
                            />
                          </Button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Profile - Anchored to Bottom */}
      {profileModule && (
        <div className="border-t p-2 bg-background">
          {(() => {
            const Icon = iconMap[profileModule.icon] as React.ComponentType<{ className?: string; style?: React.CSSProperties }> | undefined
            const moduleTabs = getModuleTabs(profileModule.slug)
            const firstTabSlug = moduleTabs.length > 0 ? moduleTabs[0].slug : 'overview'
            const isActive = pathname.includes(profileModule.slug)

            return (
              <Link
                href={`/workspace/${currentWorkspace?.id}/${profileModule.slug}/${firstTabSlug}`}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors",
                  sidebarCollapsed && "justify-center px-2",
                  isActive && "bg-accent"
                )}
                title={sidebarCollapsed ? profileModule.name : undefined}
              >
                {Icon ? (
                  <Icon
                    className="h-4 w-4 flex-shrink-0"
                    style={{ color: profileModule.color }}
                  />
                ) : null}
                {!sidebarCollapsed && <span>{profileModule.name}</span>}
              </Link>
            )
          })()}
        </div>
      )}
      
        {/* Invite Dialog */}
        <InviteDialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen} />
      </aside>
    </TooltipProvider>
  )
}
