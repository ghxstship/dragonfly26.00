"use client"

import { useTranslations } from "next-intl"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/ui-store"
import { useWorkspaceStore } from "@/store/workspace-store"
import { getModuleTabs } from "@/lib/modules/tabs-registry"

export function BreadcrumbNav() {
  const t = useTranslations()
  const pathname = usePathname()
  const { currentWorkspace } = useUIStore()
  const { currentOrganization } = useWorkspaceStore()

  // Parse path segments
  const segments = pathname.split("/").filter(Boolean)
  const locale = segments[0] || 'en'
  const workspaceId = segments[2]
  const moduleName = segments[3]
  const tabSlug = segments[4]
  
  // Build breadcrumb items
  const breadcrumbs = []

  // Add module breadcrumb
  if (moduleName && workspaceId) {
    const moduleTabs = getModuleTabs(moduleName)
    const firstTabSlug = moduleTabs.length > 0 ? moduleTabs[0].slug : 'overview'
    
    breadcrumbs.push({
      label: moduleName.charAt(0).toUpperCase() + moduleName.slice(1).replace(/-/g, " "),
      href: `/${locale}/workspace/${workspaceId}/${moduleName}/${firstTabSlug}`,
      icon: undefined,
    })
  }

  // Add tab breadcrumb (if present)
  if (tabSlug && moduleName && workspaceId) {
    const moduleTabs = getModuleTabs(moduleName)
    const currentTab = moduleTabs.find(tab => tab.slug === tabSlug)
    
    if (currentTab) {
      breadcrumbs.push({
        label: currentTab.name,
        href: `/${locale}/workspace/${workspaceId}/${moduleName}/${tabSlug}`,
        icon: undefined,
      })
    }
  }

  if (breadcrumbs.length === 0) return null

  return (
    <nav className="flex items-center gap-1 text-sm min-w-0">
      <Link
        href={`/${locale}`}
        className="p-1.5 rounded-md hover:bg-accent transition-colors flex-shrink-0"
        title={t('breadcrumb.home')}
      >
        <Home className="h-4 w-4 text-muted-foreground" />
      </Link>
      
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center gap-1 min-w-0">
          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Link
            href={crumb.href}
            className={cn(
              "px-2 py-1.5 rounded-md hover:bg-accent transition-colors truncate",
              index === breadcrumbs.length - 1
                ? "text-foreground font-medium max-w-[200px]"
                : "text-muted-foreground max-w-[120px]"
            )}
            title={crumb.label}
          >
            {crumb.icon && <span className="mr-1.5 flex-shrink-0">{crumb.icon}</span>}
            <span className="truncate">{crumb.label}</span>
          </Link>
        </div>
      ))}
    </nav>
  )
}
