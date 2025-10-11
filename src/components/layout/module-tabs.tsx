"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { getModuleTabs } from "@/lib/modules/tabs-registry"
import { cn } from "@/lib/utils"
import { iconMap } from "@/lib/modules/icon-map"
import { useUIStore } from "@/store/ui-store"

interface ModuleTabsProps {
  moduleSlug: string
}

export function ModuleTabs({ moduleSlug }: ModuleTabsProps) {
  const params = useParams()
  const pathname = usePathname()
  const workspaceId = params.workspaceId as string
  const locale = params.locale as string
  const { getTabConfig } = useUIStore()
  
  // Get tabs from registry
  const registryTabs = getModuleTabs(moduleSlug)
  
  // Get saved configuration from store
  const savedConfig = getTabConfig(moduleSlug)
  
  // Use saved configuration if available, otherwise use registry tabs
  // Filter out disabled tabs and sort by order
  const tabs = (savedConfig || registryTabs)
    .filter(tab => tab.enabled)
    .sort((a, b) => a.order - b.order)

  if (tabs.length === 0) return null

  return (
    <div className="border-b bg-background overflow-x-auto">
      <div className="flex items-center gap-1 px-4 min-w-max">
        {tabs.map((tab) => {
          const Icon = iconMap[tab.icon]
          const href = `/${locale}/workspace/${workspaceId}/${moduleSlug}/${tab.slug}`
          const isActive = pathname === href || pathname?.endsWith(`/${tab.slug}`)

          return (
            <Link
              key={tab.id}
              href={href}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
              )}
              style={isActive ? { borderColor: tab.color } : undefined}
            >
              {Icon && <Icon className="h-4 w-4" style={{ color: tab.color }} />}
              {tab.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
