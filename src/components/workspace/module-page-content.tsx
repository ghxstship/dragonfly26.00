"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useRouter } from "@/i18n/navigation"
import { Filter, Search, Columns3, MessageSquare, Activity as ActivityIcon, Clock, ArrowUpDown, Upload, Download, Share2, MoreHorizontal, Camera, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUIStore } from "@/store/ui-store"
import { ItemDetailDrawer } from "@/components/shared/item-detail-drawer"
import { ViewSwitcher } from "@/components/molecules"
import { ListViewOrganism, BoardViewOrganism, DataTableOrganism, CalendarOrganism, TimelineOrganism, MapOrganism, MindMapOrganism, FormBuilderOrganism, EmbedContainerOrganism, ChatOrganism, DocumentEditorOrganism, FinancialDashboardOrganism, PivotTableOrganism, WorkloadViewOrganism, ActivityViewOrganism, BoxViewOrganism, PortfolioViewOrganism } from "@/components/organisms"
import { DashboardTemplate } from "@/components/templates"
import { getModuleBySlug } from "@/lib/modules/registry"
import { getModuleTabs } from "@/lib/modules/tabs-registry"
import { ModuleTabs } from "@/components/layout/module-tabs"
import { CreateItemDialogEnhanced } from "@/components/shared/create-item-dialog-enhanced"
import { getNewItemLabel } from "@/lib/modules/item-type-mapper"
import { getCreateButtonLabel } from "@/lib/modules/form-fields-registry"
import { getSchemaForTab } from "@/lib/data-schemas"
import type { ViewType, DataItem } from "@/types"

// Mock data generator
const generateMockData = (count: number): DataItem[] => {
  const statuses = ["todo", "in_progress", "review", "done"]
  const priorities = ["urgent", "high", "normal", "low"]
  const names = [
    "Design new landing page",
    "Fix authentication bug",
    "Update documentation",
    "Implement search feature",
    "Review pull requests",
    "Optimize database queries",
    "Create marketing materials",
    "Setup CI/CD pipeline",
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    name: names[i % names.length],
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    assignee: i % 3 === 0 ? "John Doe" : i % 3 === 1 ? "Jane Smith" : "Bob Wilson",
    assignee_name: i % 3 === 0 ? "John Doe" : i % 3 === 1 ? "Jane Smith" : "Bob Wilson",
    due_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    start_date: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    tags: i % 2 === 0 ? ["urgent", "frontend"] : ["backend"],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 5),
  }))
}

export function ModulePageContent() {
  const params = useParams()
  const router = useRouter()
  const moduleSlug = params.module as string
  const workspaceId = params.workspaceId as string
  const currentModule = getModuleBySlug(moduleSlug)
  const moduleTabs = getModuleTabs(moduleSlug)
  const { setRightSidebarOpen, toggleRightSidebar, focusMode } = useUIStore()

  const [currentView, setCurrentView] = useState<ViewType>("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // Fetch live data from Supabase using universal hook
  const { data: supabaseData, loading: dataLoading } = useModuleData(
    moduleSlug,
    moduleTabs[0]?.slug || 'overview',
    workspaceId
  )

  // Redirect to first tab if tabs exist
  useEffect(() => {
    if (moduleTabs.length > 0) {
      router.replace(`/workspace/${workspaceId}/${moduleSlug}/${moduleTabs[0].slug}`)
    }
  }, [moduleTabs, moduleSlug, workspaceId, router])

  // Use Supabase data or fallback to empty array
  const mockData = supabaseData || []

  const handleItemClick = (item: DataItem) => {
    setSelectedItem(item)
    setDrawerOpen(true)
  }

  const renderView = () => {
    // Get schema for current tab to enable schema-driven table views
    const schema = getSchemaForTab(moduleSlug, moduleTabs[0]?.slug || 'overview')

    switch (currentView) {
      case "list":
        return <ListViewOrganism data={mockData} schema={schema?.fields} onItemClick={handleItemClick} />
      case "board":
        return <BoardViewOrganism data={mockData} schema={schema?.fields} onItemClick={handleItemClick} />
      case "table":
        // Use schema-driven EnhancedTableView (schema auto-generated from form configs)
        // DataTableOrganism excluded from build - fallback to list view
        return <ListViewOrganism data={mockData} schema={schema?.fields} onItemClick={handleItemClick} />
      case "calendar":
        return <CalendarOrganism data={mockData} schema={schema?.fields} onItemClick={handleItemClick} />
      case "timeline":
        return <TimelineOrganism data={mockData} schema={schema?.fields} onItemClick={handleItemClick} />
      case "dashboard":
        return <FinancialDashboardOrganism data={mockData} schema={schema?.fields} />
      case "workload":
        return <WorkloadViewOrganism data={mockData} schema={schema?.fields} onItemClick={handleItemClick} />
      case "map":
        return <MapOrganism locations={mockData as any} />
      case "mind-map":
        return <MindMapOrganism nodes={mockData as any} onChange={() => {}} />
      case "form":
        return <FormBuilderOrganism fields={schema?.fields as any || []} onChange={() => {}} />
      case "activity":
        return <ActivityViewOrganism data={mockData} schema={schema?.fields} onItemClick={handleItemClick} />
      case "box":
        return <BoxViewOrganism data={mockData} schema={schema?.fields} onItemClick={handleItemClick} />
      case "embed":
        return <EmbedContainerOrganism url="" title="Embed View" />
      case "chat":
        return <ChatOrganism messages={[]} currentUserId="" onSendMessage={() => {}} />
      case "doc":
        return <DocumentEditorOrganism content="" onChange={() => {}} />
      case "financial":
        return <FinancialDashboardOrganism data={mockData} schema={schema?.fields} />
      case "portfolio":
        return <PortfolioViewOrganism data={mockData} schema={schema?.fields} onItemClick={handleItemClick} />
      case "pivot":
        return <PivotTableOrganism data={mockData} schema={schema?.fields} />
      default:
        return (
          <div className="flex flex-wrap items-center justify-center h-full text-muted-foreground">
            {currentView} view coming soon
          </div>
        )
    }
  }

  // Show loading while redirecting to first tab
  if (moduleTabs.length > 0) {
    return (
      <div className="flex flex-wrap items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!currentModule) {
    return (
      <div className="flex flex-wrap items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold mb-2">Module not found</h2>
          <p className="text-muted-foreground">
            The module &quot;{moduleSlug}&quot; does not exist.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap flex-col h-full">
      {/* Module Header */}
      <div className="border-b bg-background">
        <div className="p-4 space-y-4">
          {/* Title and Actions */}
          {!focusMode && (
            <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
              <div>
                <h1 className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold" style={{ color: currentModule.color }}>
                  {currentModule.name}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentModule.description}
                </p>
              </div>
              <Button onClick={() => setCreateDialogOpen(true)}>
                + {getCreateButtonLabel(moduleSlug, moduleTabs[0]?.slug || 'overview') || `New ${getNewItemLabel(moduleSlug, currentModule.name)}`}
              </Button>
            </div>
          )}

          {/* View Controls */}
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <ViewSwitcher
              value={currentView as any}
              onChange={setCurrentView as any}
              modes={['list', 'board', 'table', 'calendar'] as any}
            />

            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search aria-hidden="true" className="absolute sm:relative sm:inset-auto left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground sm:relative sm:inset-auto" />
                <Input
                  placeholder="Search..."
                  value={searchQuery as any}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Button 
              variant="outline" 
              size="icon"
              onClick={() => {
                setRightSidebarOpen(true, 'filter')
              }}
              title="Filter"
            >
              <Filter aria-hidden="true" className="h-4 w-4" />
            </Button>

            <Button 
              variant="outline" 
              size="icon"
              onClick={() => {
                setRightSidebarOpen(true, 'sort')
              }}
              title="Sort"
            >
              <ArrowUpDown aria-hidden="true" className="h-4 w-4" />
            </Button>

            <Button 
              variant="outline" 
              size="icon"
              onClick={() => {
                setRightSidebarOpen(true, 'fields')
              }}
              title="Field Configuration"
            >
              <Columns3 className="h-4 w-4" />
            </Button>

            {/* More Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" title="More Actions">
                  <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => {
                    setRightSidebarOpen(true, 'import')
                  }}
                >
                  <Upload aria-hidden="true" className="h-4 w-4 mr-2" />
                  Import Data
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setRightSidebarOpen(true, 'export')
                  }}
                >
                  <Download aria-hidden="true" className="h-4 w-4 mr-2" />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setRightSidebarOpen(true, 'share')
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Camera aria-hidden="true" className="h-4 w-4 mr-2" />
                  Photo <span className="ml-auto text-xs text-muted-foreground">Coming Soon</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <QrCode aria-hidden="true" className="h-4 w-4 mr-2" />
                  Scan <span className="ml-auto text-xs text-muted-foreground">Coming Soon</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Module Tabs */}
      <ModuleTabs moduleSlug={moduleSlug} />

      {/* View Content */}
      <div className="flex-1 overflow-auto p-4">
        {renderView()}
      </div>

      {/* Item Detail Drawer */}
      <ItemDetailDrawer
        item={selectedItem}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onUpdate={(updates) => {
          console.log("Item updated:", updates)
          // In real app, update in Supabase
        }}
        onDelete={() => {
          console.log("Item deleted")
          setDrawerOpen(false)
          // In real app, delete from Supabase
        }}
      />

      {/* Create Item Dialog */}
      <CreateItemDialogEnhanced
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        moduleId={moduleSlug}
        tabSlug={moduleTabs[0]?.slug || 'overview'}
        onSuccess={(item) => {
          console.log("Created item:", item)
          // TODO: Add to data store and refresh list
        }}
      />
    </div>
  )
}
