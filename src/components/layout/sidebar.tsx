"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  Menu,
  ChevronDown,
  ChevronUp,
  Star,
  Settings,
  User,
  Shield,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/ui-store"
import { MODULES, MODULE_CATEGORIES } from "@/lib/modules/registry"
import { iconMap } from "@/lib/modules/icon-map"
import { getModuleTabs } from "@/lib/modules/tabs-registry"

export function Sidebar() {
  const t = useTranslations()
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar, currentWorkspace, focusMode } = useUIStore()
  const [favorites, setFavorites] = useState<string[]>([])
  const [collapsedHubs, setCollapsedHubs] = useState<Record<string, boolean>>({})
  
  // Extract locale from pathname
  const locale = pathname.split('/')[1] || 'en'

  const toggleFavorite = (moduleId: string) => {
    setFavorites((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
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
    modules: MODULES.filter((m) => m.category === category && m.enabled),
  }))

  return (
    <aside
      className={cn(
        "sticky top-14 flex h-[calc(100vh-3.5rem)] flex-col border-r bg-background transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-60",
        focusMode && "hidden"
      )}
    >
      {/* Hamburger Menu Toggle at Top */}
      <div className="border-b p-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={toggleSidebar}
          title={sidebarCollapsed ? t('sidebar.expand') : t('sidebar.collapse')}
        >
          <Menu className="h-4 w-4" />
        </Button>
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
                  {favorites.map((favId) => {
                    const favModule = MODULES.find((m) => m.id === favId)
                    if (!favModule) return null
                    const Icon = iconMap[favModule.icon]
                    const moduleTabs = getModuleTabs(favModule.slug)
                    const firstTabSlug = moduleTabs.length > 0 ? moduleTabs[0].slug : 'overview'

                    return (
                      <Link
                        key={favModule.id}
                        href={`/${locale}/workspace/${currentWorkspace?.id}/${favModule.slug}/${firstTabSlug}`}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors",
                          pathname.includes(favModule.slug) && "bg-accent"
                        )}
                      >
                        {Icon && <Icon className="h-4 w-4 flex-shrink-0" style={{ color: favModule.color }} />}
                        <span>{favModule.name}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Module Categories - Collapsible Hubs */}
          {groupedModules.map((group) => (
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
                  {group.modules.map((moduleItem) => {
                    const Icon = iconMap[moduleItem.icon]
                    const isActive = pathname.includes(moduleItem.slug)
                    const isFavorited = favorites.includes(moduleItem.id)
                    const moduleTabs = getModuleTabs(moduleItem.slug)
                    const firstTabSlug = moduleTabs.length > 0 ? moduleTabs[0].slug : 'overview'

                    return (
                      <div
                        key={moduleItem.id}
                        className="group relative flex items-center"
                      >
                        <Link
                          href={`/${locale}/workspace/${currentWorkspace?.id}/${moduleItem.slug}/${firstTabSlug}`}
                          className={cn(
                            "flex flex-1 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors",
                            isActive && "bg-accent",
                            sidebarCollapsed && "justify-center px-2"
                          )}
                          title={sidebarCollapsed ? moduleItem.name : undefined}
                        >
                          {Icon && (
                            <Icon
                              className="h-4 w-4 flex-shrink-0"
                              style={{ color: moduleItem.color }}
                            />
                          )}
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

      {/* User & Settings - Anchored to Bottom */}
      <div className="border-t p-2 space-y-1 bg-background">
        <Link
          href={`/${locale}/workspace/${currentWorkspace?.id}/profile/basic-info`}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors",
            sidebarCollapsed && "justify-center px-2",
            pathname.includes('/profile') && "bg-accent"
          )}
          title={sidebarCollapsed ? t('sidebar.profile') : undefined}
        >
          <User className="h-4 w-4 flex-shrink-0" style={{ color: "#3b82f6" }} />
          {!sidebarCollapsed && <span>{t('sidebar.profile')}</span>}
        </Link>
        <Link
          href={`/${locale}/workspace/${currentWorkspace?.id}/settings/appearance`}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors",
            sidebarCollapsed && "justify-center px-2",
            pathname.includes('/settings') && "bg-accent"
          )}
          title={sidebarCollapsed ? t('sidebar.settings') : undefined}
        >
          <Settings className="h-4 w-4 flex-shrink-0" style={{ color: "#6366f1" }} />
          {!sidebarCollapsed && <span>{t('sidebar.settings')}</span>}
        </Link>
        <Link
          href={`/${locale}/workspace/${currentWorkspace?.id}/admin/overview`}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors",
            sidebarCollapsed && "justify-center px-2",
            pathname.includes('/admin') && "bg-accent"
          )}
          title={sidebarCollapsed ? t('sidebar.admin') : undefined}
        >
          <Shield className="h-4 w-4 flex-shrink-0" style={{ color: "#64748b" }} />
          {!sidebarCollapsed && <span>{t('sidebar.admin')}</span>}
        </Link>
        <Link
          href={`/${locale}/workspace/${currentWorkspace?.id}/admin/members`}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors",
            sidebarCollapsed && "justify-center px-2",
            pathname.includes('/admin/members') && "bg-accent"
          )}
          title={sidebarCollapsed ? t('sidebar.members') : undefined}
        >
          <UserPlus className="h-4 w-4 flex-shrink-0" style={{ color: "#10b981" }} />
          {!sidebarCollapsed && <span>{t('sidebar.members')}</span>}
        </Link>
      </div>
    </aside>
  )
}
