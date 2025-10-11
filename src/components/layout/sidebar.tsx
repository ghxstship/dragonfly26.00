"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  ChevronLeft,
  ChevronRight,
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

export function Sidebar() {
  const t = useTranslations()
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar, currentWorkspace, focusMode } = useUIStore()
  const [favorites, setFavorites] = useState<string[]>([])

  const toggleFavorite = (moduleId: string) => {
    setFavorites((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    )
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
      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* Favorites Section */}
          {!sidebarCollapsed && favorites.length > 0 && (
            <div className="mb-4">
              <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t('sidebar.favorites')}
              </div>
              {favorites.map((favId) => {
                const favModule = MODULES.find((m) => m.id === favId)
                if (!favModule) return null
                const Icon = iconMap[favModule.icon]

                return (
                  <Link
                    key={favModule.id}
                    href={`/workspace/${currentWorkspace?.id}/${favModule.slug}`}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent transition-colors",
                      pathname.includes(favModule.slug) && "bg-accent"
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4" style={{ color: favModule.color }} />}
                    <span>{favModule.name}</span>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Module Categories */}
          {groupedModules.map((group) => (
            <div key={group.category} className="mb-4">
              {!sidebarCollapsed && (
                <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.label}
                </div>
              )}
              <div className="space-y-1">
                {group.modules.map((moduleItem) => {
                  const Icon = iconMap[moduleItem.icon]
                  const isActive = pathname.includes(moduleItem.slug)
                  const isFavorited = favorites.includes(moduleItem.id)

                  return (
                    <div
                      key={moduleItem.id}
                      className="group relative flex items-center"
                    >
                      <Link
                        href={`/workspace/${currentWorkspace?.id}/${moduleItem.slug}`}
                        className={cn(
                          "flex flex-1 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent transition-colors",
                          isActive && "bg-accent",
                          sidebarCollapsed && "justify-center"
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
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => toggleFavorite(moduleItem.id)}
                        >
                          <Star
                            className={cn(
                              "h-3 w-3",
                              isFavorited && "fill-yellow-400 text-yellow-400"
                            )}
                          />
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* User & Settings */}
          <div className="mt-4 pt-4 border-t space-y-1">
            <Link
              href="/profile"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent transition-colors",
                sidebarCollapsed && "justify-center"
              )}
              title={sidebarCollapsed ? t('sidebar.profile') : undefined}
            >
              <User className="h-4 w-4" style={{ color: "#3b82f6" }} />
              {!sidebarCollapsed && <span>{t('sidebar.profile')}</span>}
            </Link>
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent transition-colors",
                sidebarCollapsed && "justify-center"
              )}
              title={sidebarCollapsed ? t('sidebar.settings') : undefined}
            >
              <Settings className="h-4 w-4" style={{ color: "#6366f1" }} />
              {!sidebarCollapsed && <span>{t('sidebar.settings')}</span>}
            </Link>
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent transition-colors",
                sidebarCollapsed && "justify-center"
              )}
              title={sidebarCollapsed ? t('sidebar.admin') : undefined}
            >
              <Shield className="h-4 w-4" style={{ color: "#64748b" }} />
              {!sidebarCollapsed && <span>{t('sidebar.admin')}</span>}
            </Link>
            <Link
              href="/invite"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent transition-colors",
                sidebarCollapsed && "justify-center"
              )}
              title={sidebarCollapsed ? t('sidebar.invite') : undefined}
            >
              <UserPlus className="h-4 w-4" style={{ color: "#10b981" }} />
              {!sidebarCollapsed && <span>{t('sidebar.invite')}</span>}
            </Link>
          </div>
        </div>
      </ScrollArea>

      {/* Collapse Toggle */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn("w-full", sidebarCollapsed && "px-0")}
          onClick={toggleSidebar}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>{t('sidebar.collapse')}</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
