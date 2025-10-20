"use client"

import { useTranslations } from "next-intl"
import { ChevronRight, Home } from "lucide-react"
import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/ui-store"
import { useWorkspaceStore } from "@/store/workspace-store"
import { getModuleTabs } from "@/lib/modules/tabs-registry"
import { useMemo } from "react"

export function BreadcrumbNav() {
  const t = useTranslations()
  const pathname = usePathname()
  const { currentWorkspace } = useUIStore()
  const { currentOrganization } = useWorkspaceStore()

  // Parse path segments
  const segments = pathname.split("/").filter(Boolean)

  // Memoize breadcrumbs to ensure they're recalculated only when pathname changes
  const breadcrumbs = useMemo(() => {
    const workspaceId = segments[1]
    const moduleName = segments[2]
    const tabSlug = segments[3]
    
    // Build breadcrumb items - create fresh array each time
    const items: Array<{
      label: string
      href: string
      icon?: React.ReactNode
    }> = []

    // Add module breadcrumb only if we have both module and workspace
    if (moduleName && workspaceId) {
      const moduleTabs = getModuleTabs(moduleName)
      const firstTabSlug = moduleTabs.length > 0 ? moduleTabs[0].slug : 'overview'
      
      items.push({
        label: moduleName.charAt(0).toUpperCase() + moduleName.slice(1).replace(/-/g, " "),
        href: `/workspace/${workspaceId}/${moduleName}/${firstTabSlug}`,
        icon: undefined,
      })

      // Only add tab breadcrumb if we have a tab and it's different from the first tab
      if (tabSlug && moduleTabs.length > 0) {
        const currentTab = moduleTabs.find(tab => tab.slug === tabSlug)
        
        // Only show tab breadcrumb if it exists and is not the default first tab
        if (currentTab && tabSlug !== firstTabSlug) {
          items.push({
            label: currentTab.name,
            href: `/workspace/${workspaceId}/${moduleName}/${tabSlug}`,
            icon: undefined,
          })
        }
      }
    }

    return items
  }, [pathname, segments]) // Dependencies include all used variables

  if (breadcrumbs.length === 0) return null

  return (
    <nav className="flex items-center gap-1 text-sm min-w-0">
      <Link
        href="/"
        className="p-1.5 rounded-md hover:bg-accent transition-colors flex-shrink-0"
        title={t('breadcrumb.home')}
      >
        <Home className="h-4 w-4 text-muted-foreground" />
      </Link>
      
      {breadcrumbs.map((crumb, index: number) => (
        <div key={`${crumb.href}-${index}`} className="flex items-center gap-1 min-w-0">
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

BreadcrumbNav.displayName = 'BreadcrumbNav'
