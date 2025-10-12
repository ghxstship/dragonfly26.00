"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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
import { ViewSwitcher } from "@/components/views/view-switcher"
import { ListView } from "@/components/views/list-view"
import { BoardView } from "@/components/views/board-view"
import { TableView } from "@/components/views/table-view"
import { CalendarView } from "@/components/views/calendar-view"
import { TimelineView } from "@/components/views/timeline-view"
import { DashboardView } from "@/components/views/dashboard-view"
import { WorkloadView } from "@/components/views/workload-view"
import { MapView } from "@/components/views/map-view"
import { MindMapView } from "@/components/views/mind-map-view"
import { FormView } from "@/components/views/form-view"
import { ActivityView } from "@/components/views/activity-view"
import { BoxView } from "@/components/views/box-view"
import { EmbedView } from "@/components/views/embed-view"
import { ChatView } from "@/components/views/chat-view"
import { DocView } from "@/components/views/doc-view"
import { FinancialView } from "@/components/views/financial-view"
import { PortfolioView } from "@/components/views/portfolio-view"
import { PivotView } from "@/components/views/pivot-view"
import { getModuleBySlug } from "@/lib/modules/registry"
import { getModuleTabs } from "@/lib/modules/tabs-registry"
import { ModuleTabs } from "@/components/layout/module-tabs"
import { CreateItemDialog } from "@/components/shared/create-item-dialog"
import { getItemTypeForModule, getNewItemLabel } from "@/lib/modules/item-type-mapper"
import { generateProjectsMockData } from "@/lib/modules/projects-mock-data"
import { generateEventsMockData } from "@/lib/modules/events-mock-data"
import { generatePeopleMockData } from "@/lib/modules/people-mock-data"
import { generateLocationsMockData } from "@/lib/modules/locations-mock-data"
import { generateFilesMockData } from "@/lib/modules/files-mock-data"
import { generateFinanceMockData } from "@/lib/modules/finance-mock-data"
import { generateResourcesMockData } from "@/lib/modules/resources-mock-data"
import { generateCompaniesMockData } from "@/lib/modules/companies-mock-data"
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

export default function ModulePage() {
  const params = useParams()
  const router = useRouter()
  const moduleSlug = params.module as string
  const workspaceId = params.workspaceId as string
  const locale = params.locale as string
  const currentModule = getModuleBySlug(moduleSlug)
  const moduleTabs = getModuleTabs(moduleSlug)
  const { setRightSidebarOpen, toggleRightSidebar, focusMode } = useUIStore()

  const [currentView, setCurrentView] = useState<ViewType>("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // Redirect to first tab if tabs exist
  useEffect(() => {
    if (moduleTabs.length > 0) {
      router.replace(`/${locale}/workspace/${workspaceId}/${moduleSlug}/${moduleTabs[0].slug}`)
    }
  }, [moduleTabs, moduleSlug, workspaceId, locale, router])

  // Mock data - in real app, fetch from Supabase
  // Use contextual mock data for Projects, Events, People, Locations, Files, Finance, Resources, and Companies modules
  const mockData = moduleSlug === 'projects' 
    ? generateProjectsMockData(moduleTabs[0]?.slug || '', 20)
    : moduleSlug === 'events'
    ? generateEventsMockData(moduleTabs[0]?.slug || '', 20)
    : moduleSlug === 'people'
    ? generatePeopleMockData(moduleTabs[0]?.slug || '', 20)
    : moduleSlug === 'locations'
    ? generateLocationsMockData(moduleTabs[0]?.slug || '', 20)
    : moduleSlug === 'files'
    ? generateFilesMockData(moduleTabs[0]?.slug || '', 20)
    : moduleSlug === 'finance'
    ? generateFinanceMockData(moduleTabs[0]?.slug || '', 20)
    : moduleSlug === 'resources'
    ? generateResourcesMockData(moduleTabs[0]?.slug || '', 20)
    : moduleSlug === 'companies'
    ? generateCompaniesMockData(moduleTabs[0]?.slug || '', 20)
    : generateMockData(20)

  const handleItemClick = (item: DataItem) => {
    setSelectedItem(item)
    setDrawerOpen(true)
  }

  const renderView = () => {
    switch (currentView) {
      case "list":
        return <ListView data={mockData} onItemClick={handleItemClick} />
      case "board":
        return <BoardView data={mockData} onItemClick={handleItemClick} />
      case "table":
        return <TableView data={mockData} onItemClick={handleItemClick} />
      case "calendar":
        return <CalendarView data={mockData} onItemClick={handleItemClick} />
      case "timeline":
        return <TimelineView data={mockData} onItemClick={handleItemClick} />
      case "dashboard":
        return <DashboardView data={mockData} />
      case "workload":
        return <WorkloadView data={mockData} onItemClick={handleItemClick} />
      case "map":
        return <MapView data={mockData} onItemClick={handleItemClick} />
      case "mind-map":
        return <MindMapView data={mockData} onItemClick={handleItemClick} />
      case "form":
        return <FormView data={mockData} />
      case "activity":
        return <ActivityView data={mockData} />
      case "box":
        return <BoxView data={mockData} onItemClick={handleItemClick} />
      case "embed":
        return <EmbedView data={mockData} />
      case "chat":
        return <ChatView data={mockData} />
      case "doc":
        return <DocView data={mockData} onItemClick={handleItemClick} />
      case "financial":
        return <FinancialView data={mockData} />
      case "portfolio":
        return <PortfolioView data={mockData} onItemClick={handleItemClick} />
      case "pivot":
        return <PivotView data={mockData} />
      default:
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            {currentView} view coming soon
          </div>
        )
    }
  }

  // Show loading while redirecting to first tab
  if (moduleTabs.length > 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!currentModule) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Module not found</h2>
          <p className="text-muted-foreground">
            The module &quot;{moduleSlug}&quot; does not exist.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Module Header */}
      <div className="border-b bg-background">
        <div className="p-4 space-y-4">
          {/* Title and Actions */}
          {!focusMode && (
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold" style={{ color: currentModule.color }}>
                  {currentModule.name}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentModule.description}
                </p>
              </div>
              <Button onClick={() => setCreateDialogOpen(true)}>
                + New {getNewItemLabel(moduleSlug, currentModule.name)}
              </Button>
            </div>
          )}

          {/* View Controls */}
          <div className="flex items-center gap-2">
            <ViewSwitcher
              currentView={currentView}
              onViewChange={setCurrentView}
              moduleSlug={moduleSlug}
            />

            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
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
              <Filter className="h-4 w-4" />
            </Button>

            <Button 
              variant="outline" 
              size="icon"
              onClick={() => {
                setRightSidebarOpen(true, 'sort')
              }}
              title="Sort"
            >
              <ArrowUpDown className="h-4 w-4" />
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
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => {
                    setRightSidebarOpen(true, 'import')
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setRightSidebarOpen(true, 'export')
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
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
                  <Camera className="h-4 w-4 mr-2" />
                  Photo <span className="ml-auto text-xs text-muted-foreground">Coming Soon</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <QrCode className="h-4 w-4 mr-2" />
                  Scan <span className="ml-auto text-xs text-muted-foreground">Coming Soon</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-1 ml-2 border-l pl-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setRightSidebarOpen(true, 'activity')
                }}
                title="Activity"
              >
                <ActivityIcon className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setRightSidebarOpen(true, 'comments')
                }}
                title="Comments"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setRightSidebarOpen(true, 'time')
                }}
                title="Time Tracking"
              >
                <Clock className="h-4 w-4" />
              </Button>
            </div>
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
      <CreateItemDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        type={getItemTypeForModule(moduleSlug)}
        onSuccess={(item) => {
          console.log("Created item:", item)
          // TODO: Add to data store and refresh list
        }}
      />
    </div>
  )
}
