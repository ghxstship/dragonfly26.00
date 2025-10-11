"use client"

import { useTranslations } from "next-intl"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/ui-store"
import { useWorkspaceStore } from "@/store/workspace-store"

export function BreadcrumbNav() {
  const t = useTranslations()
  const pathname = usePathname()
  const { currentWorkspace } = useUIStore()
  const { currentOrganization } = useWorkspaceStore()

  // Parse path segments
  const segments = pathname.split("/").filter(Boolean)
  
  // Build breadcrumb items
  const breadcrumbs = []
  
  if (currentWorkspace) {
    breadcrumbs.push({
      label: currentWorkspace.name,
      href: `/workspace/${currentWorkspace.id}`,
      icon: currentWorkspace.icon,
    })
  }

  // Add module/section breadcrumbs
  if (segments.length > 2) {
    const moduleName = segments[2]
    breadcrumbs.push({
      label: moduleName.charAt(0).toUpperCase() + moduleName.slice(1).replace(/-/g, " "),
      href: `/${segments.slice(0, 3).join("/")}`,
    })
  }

  if (breadcrumbs.length === 0) return null

  return (
    <nav className="hidden lg:flex items-center gap-1 text-sm">
      <Link
        href="/"
        className="p-1.5 rounded-md hover:bg-accent transition-colors"
        title={t('breadcrumb.home')}
      >
        <Home className="h-4 w-4 text-muted-foreground" />
      </Link>
      
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link
            href={crumb.href}
            className={cn(
              "px-2 py-1.5 rounded-md hover:bg-accent transition-colors max-w-[150px] truncate",
              index === breadcrumbs.length - 1
                ? "text-foreground font-medium"
                : "text-muted-foreground"
            )}
            title={crumb.label}
          >
            {crumb.icon && <span className="mr-1.5">{crumb.icon}</span>}
            {crumb.label}
          </Link>
        </div>
      ))}
    </nav>
  )
}
