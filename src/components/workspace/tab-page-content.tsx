"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
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
import { getTabBySlug } from "@/lib/modules/tabs-registry"
import { ModuleTabs } from "@/components/layout/module-tabs"
import { CreateItemDialogEnhanced } from "@/components/shared/create-item-dialog-enhanced"
import { getNewItemLabel } from "@/lib/modules/item-type-mapper"
import { getCreateButtonLabel } from "@/lib/modules/form-fields-registry"
import { getAdminTabComponent } from "@/lib/admin-tab-components"
import { getSettingsTabComponent } from "@/lib/settings-tab-components"
import { getProfileTabComponent } from "@/lib/profile-tab-components"
import { getDashboardTabComponent } from "@/lib/dashboard-tab-components"
import { getProjectsTabComponent } from "@/lib/projects-tab-components"
import { getEventsTabComponent } from "@/lib/events-tab-components"
import { getLocationsTabComponent } from "@/lib/locations-tab-components"
import { getCommunityTabComponent } from "@/lib/community-tab-components"
import { getMarketplaceTabComponent } from "@/lib/marketplace-tab-components"
import { getReportsTabComponent } from "@/lib/reports-tab-components"
import { getAnalyticsTabComponent } from "@/lib/analytics-tab-components"
import { getInsightsTabComponent } from "@/lib/insights-tab-components"
import { useModuleData, useCreateItem, useUpdateItem, useDeleteItem } from "@/hooks/use-module-data"
import type { ViewType, DataItem } from "@/types"

// Table mapping for CRUD operations
const getTableNameForTab = (moduleSlug: string, tabSlug: string): string => {
  const tableMap: Record<string, string> = {
    'productions': 'productions',
    'activations': 'productions',
    'tasks': 'project_tasks',
    'milestones': 'project_milestones',
    'compliance': 'compliance_requirements',
    'safety': 'safety_guidelines',
    'all-events': 'events',
    'activities': 'events',
    'run-of-show': 'run_of_show',
    'bookings': 'bookings',
    'incidents': 'incidents',
    'tours': 'tours',
    'itineraries': 'travel_itineraries',
    'reservations': 'hospitality_reservations',
    'shipping-receiving': 'shipments',
    'personnel': 'personnel',
    'teams': 'teams',
    'timekeeping': 'time_entries',
    'training': 'training_sessions',
    'openings': 'job_openings',
    'tracking': 'asset_transactions',
    'inventory': 'assets',
    'maintenance': 'asset_maintenance',
    'advances': 'production_advances',
    'directory': 'locations',
    'site-maps': 'site_maps',
    'all-documents': 'files',
    'contracts': 'files',
    'organizations': 'companies',
    'contacts': 'company_contacts',
    'scopes-of-work': 'scopes_of_work',
    'bids': 'bids',
    'budgets': 'budgets',
    'transactions': 'financial_transactions',
    'invoices': 'invoices',
    'expenses': 'financial_transactions',
    'payroll': 'payroll',
    'gl-codes': 'gl_codes',
    'orders': 'purchase_orders',
    'agreements': 'agreements',
    'requisitions': 'purchase_requisitions',
    'activity': 'community_posts',
    'connections': 'connections',
    'shop': 'marketplace_products',
    'products': 'marketplace_products',
    'purchases': 'marketplace_orders',
    'library': 'resources',
    'courses': 'courses',
    'grants': 'grants',
    'active': 'job_contracts',
    'rfps': 'rfps',
    'templates': 'report_templates',
    'data-sources': 'data_sources',
    'custom-views': 'analytics_views',
    'benchmarks': 'benchmarks',
    'objectives': 'objectives',
    'key-results': 'key_results',
    'priorities': 'strategic_priorities',
    'recommendations': 'ai_recommendations',
  }
  return tableMap[tabSlug] || 'productions'
}

export function TabPageContent() {
  const params = useParams()
  const moduleSlug = params.module as string
  const tabSlug = params.tab as string
  const currentModule = getModuleBySlug(moduleSlug)
  const currentTab = getTabBySlug(moduleSlug, tabSlug)
  const { setRightSidebarOpen, focusMode, currentWorkspace } = useUIStore()
  
  // Use resolved workspace ID from store (handles "personal" -> UUID conversion)
  const workspaceId = currentWorkspace?.id || ''
  
  // Check if this is an admin, settings, profile, dashboard, projects, events, locations, community, reports, analytics, or insights tab with custom component
  const isAdminCustomTab = moduleSlug === "admin" && getAdminTabComponent(tabSlug) !== undefined
  const isSettingsCustomTab = moduleSlug === "settings" && getSettingsTabComponent(tabSlug) !== undefined
  const isProfileCustomTab = moduleSlug === "profile" && getProfileTabComponent(tabSlug) !== undefined
  const isDashboardCustomTab = moduleSlug === "dashboard" && getDashboardTabComponent(tabSlug) !== undefined
  const isProjectsCustomTab = moduleSlug === "projects" && getProjectsTabComponent(tabSlug) !== undefined
  const isEventsCustomTab = moduleSlug === "events" && getEventsTabComponent(tabSlug) !== undefined
  const isLocationsCustomTab = moduleSlug === "locations" && getLocationsTabComponent(tabSlug) !== undefined
  const isCommunityCustomTab = moduleSlug === "community" && getCommunityTabComponent(tabSlug) !== undefined
  const isMarketplaceCustomTab = moduleSlug === "marketplace" && getMarketplaceTabComponent(tabSlug) !== undefined
  const isReportsCustomTab = moduleSlug === "reports" && getReportsTabComponent(tabSlug) !== undefined
  const isAnalyticsCustomTab = moduleSlug === "analytics" && getAnalyticsTabComponent(tabSlug) !== undefined
  const isInsightsCustomTab = moduleSlug === "insights" && getInsightsTabComponent(tabSlug) !== undefined

  const [currentView, setCurrentView] = useState<ViewType>(currentTab?.default_view || "list")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // ✅ REAL DATA from Supabase with real-time updates!
  const { data: realData, loading, error } = useModuleData(moduleSlug, tabSlug, workspaceId)
  
  // Get table name for CRUD operations
  const tableName = getTableNameForTab(moduleSlug, tabSlug)
  const { createItem } = useCreateItem(tableName)
  const { updateItem } = useUpdateItem(tableName)
  const { deleteItem } = useDeleteItem(tableName)

  const handleItemClick = (item: DataItem) => {
    setSelectedItem(item)
    setDrawerOpen(true)
  }

  const handleUpdateItem = async (updates: any) => {
    if (!selectedItem) return
    try {
      await updateItem(selectedItem.id, updates)
      console.log("Item updated successfully")
    } catch (err) {
      console.error("Failed to update item:", err)
      alert("Failed to update item")
    }
  }

  const handleDeleteItem = async () => {
    if (!selectedItem) return
    try {
      await deleteItem(selectedItem.id)
      setDrawerOpen(false)
      console.log("Item deleted successfully")
    } catch (err) {
      console.error("Failed to delete item:", err)
      alert("Failed to delete item")
    }
  }

  const handleCreateItem = async (item: any) => {
    try {
      await createItem({
        ...item,
        workspace_id: workspaceId,
      })
      console.log("Item created successfully")
      setCreateDialogOpen(false)
    } catch (err) {
      console.error("Failed to create item:", err)
      alert("Failed to create item")
    }
  }

  // Get the contextual create button label for empty states
  const createLabel = getCreateButtonLabel(moduleSlug, tabSlug)
  const handleCreateClick = () => setCreateDialogOpen(true)

  const renderView = () => {
    // For admin module, check if there's a custom tab component
    if (moduleSlug === "admin") {
      const AdminComponent = getAdminTabComponent(tabSlug)
      if (AdminComponent) {
        return <AdminComponent />
      }
    }

    // For settings module, check if there's a custom tab component
    if (moduleSlug === "settings") {
      const SettingsComponent = getSettingsTabComponent(tabSlug)
      if (SettingsComponent) {
        return <SettingsComponent />
      }
    }

    // For profile module, check if there's a custom tab component
    if (moduleSlug === "profile") {
      const ProfileComponent = getProfileTabComponent(tabSlug)
      if (ProfileComponent) {
        return <ProfileComponent />
      }
    }

    // For dashboard module, check if there's a custom tab component
    if (moduleSlug === "dashboard") {
      const DashboardComponent = getDashboardTabComponent(tabSlug)
      if (DashboardComponent) {
        return <DashboardComponent />
      }
    }

    // For projects module, check if there's a custom tab component
    if (moduleSlug === "projects") {
      const ProjectsComponent = getProjectsTabComponent(tabSlug)
      if (ProjectsComponent) {
        return <ProjectsComponent />
      }
    }

    // For events module, check if there's a custom tab component
    if (moduleSlug === "events") {
      const EventsComponent = getEventsTabComponent(tabSlug)
      if (EventsComponent) {
        return <EventsComponent />
      }
    }

    // For locations module, check if there's a custom tab component
    if (moduleSlug === "locations") {
      const LocationsComponent = getLocationsTabComponent(tabSlug)
      if (LocationsComponent) {
        return <LocationsComponent />
      }
    }

    // For community module, check if there's a custom tab component
    if (moduleSlug === "community") {
      const CommunityComponent = getCommunityTabComponent(tabSlug)
      if (CommunityComponent) {
        return <CommunityComponent />
      }
    }

    // For marketplace module, check if there's a custom tab component
    if (moduleSlug === "marketplace") {
      const MarketplaceComponent = getMarketplaceTabComponent(tabSlug)
      if (MarketplaceComponent) {
        return <MarketplaceComponent />
      }
    }

    // For reports module, check if there's a custom tab component
    if (moduleSlug === "reports") {
      const ReportsComponent = getReportsTabComponent(tabSlug)
      if (ReportsComponent) {
        return <ReportsComponent />
      }
    }

    // For analytics module, check if there's a custom tab component
    if (moduleSlug === "analytics") {
      const AnalyticsComponent = getAnalyticsTabComponent(tabSlug)
      if (AnalyticsComponent) {
        return <AnalyticsComponent />
      }
    }

    // For insights module, check if there's a custom tab component
    if (moduleSlug === "insights") {
      const InsightsComponent = getInsightsTabComponent(tabSlug)
      if (InsightsComponent) {
        return <InsightsComponent />
      }
    }

    // Show loading state
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading {currentTab?.name || 'data'}...</p>
          </div>
        </div>
      )
    }

    // Show error state
    if (error) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error loading data</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
            <p className="text-xs text-muted-foreground mt-2">Table: {tableName}</p>
          </div>
        </div>
      )
    }

    // Filter data by search query
    const filteredData = searchQuery
      ? realData.filter(item => 
          JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())
        )
      : realData

    // Otherwise, render based on view type with REAL DATA
    switch (currentView) {
      case "list":
        return <ListView data={filteredData} onItemClick={handleItemClick} createActionLabel={createLabel} onCreateAction={handleCreateClick} />
      case "board":
        return <BoardView data={filteredData} onItemClick={handleItemClick} createActionLabel={createLabel} onCreateAction={handleCreateClick} />
      case "table":
        return <TableView data={filteredData} onItemClick={handleItemClick} createActionLabel={createLabel} onCreateAction={handleCreateClick} />
      case "calendar":
        return <CalendarView data={filteredData} onItemClick={handleItemClick} />
      case "timeline":
        return <TimelineView data={filteredData} onItemClick={handleItemClick} />
      case "dashboard":
        return <DashboardView data={filteredData} />
      case "workload":
        return <WorkloadView data={filteredData} onItemClick={handleItemClick} createActionLabel={createLabel} onCreateAction={handleCreateClick} />
      case "map":
        return <MapView data={filteredData} onItemClick={handleItemClick} createActionLabel={createLabel} onCreateAction={handleCreateClick} />
      case "mind-map":
        return <MindMapView data={filteredData} onItemClick={handleItemClick} />
      case "form":
        return <FormView data={filteredData} />
      case "activity":
        return <ActivityView data={filteredData} />
      case "box":
        return <BoxView data={filteredData} onItemClick={handleItemClick} createActionLabel={createLabel} onCreateAction={handleCreateClick} />
      case "embed":
        return <EmbedView data={filteredData} />
      case "chat":
        return <ChatView data={filteredData} />
      case "doc":
        return <DocView data={filteredData} onItemClick={handleItemClick} />
      case "financial":
        return <FinancialView data={filteredData} onItemClick={handleItemClick} createActionLabel={createLabel} onCreateAction={handleCreateClick} />
      case "portfolio":
        return <PortfolioView data={filteredData} onItemClick={handleItemClick} createActionLabel={createLabel} onCreateAction={handleCreateClick} />
      case "pivot":
        return <PivotView data={filteredData} createActionLabel={createLabel} onCreateAction={handleCreateClick} />
      default:
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            {currentView} view coming soon
          </div>
        )
    }
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

  if (!currentTab) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Tab not found</h2>
          <p className="text-muted-foreground">
            The tab &quot;{tabSlug}&quot; does not exist for {currentModule.name}.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Module Header */}
      <div className="border-b bg-background">
        <div className="p-4">
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
                {/* Real-time indicator */}
                {!isAdminCustomTab && !isSettingsCustomTab && !isProfileCustomTab && !isDashboardCustomTab && !isProjectsCustomTab && !isEventsCustomTab && !isLocationsCustomTab && !isCommunityCustomTab && !isReportsCustomTab && !isAnalyticsCustomTab && !isInsightsCustomTab && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-muted-foreground">
                      Live • {loading ? '...' : `${realData.length} items`}
                    </span>
                  </div>
                )}
              </div>
              {!isAdminCustomTab && !isSettingsCustomTab && !isProfileCustomTab && !isDashboardCustomTab && !isProjectsCustomTab && !isEventsCustomTab && !isLocationsCustomTab && !isCommunityCustomTab && !isReportsCustomTab && !isAnalyticsCustomTab && !isInsightsCustomTab && (
                <Button onClick={() => setCreateDialogOpen(true)}>
                  + {getCreateButtonLabel(moduleSlug, tabSlug) || `New ${getNewItemLabel(moduleSlug, currentModule.name)}`}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Module Tabs */}
      <ModuleTabs moduleSlug={moduleSlug} />

      {/* View Controls - Hidden for admin, settings, profile, dashboard, projects, events, locations, community, reports, analytics, and insights custom tabs */}
      {!isAdminCustomTab && !isSettingsCustomTab && !isProfileCustomTab && !isDashboardCustomTab && !isProjectsCustomTab && !isEventsCustomTab && !isLocationsCustomTab && !isCommunityCustomTab && !isReportsCustomTab && !isAnalyticsCustomTab && !isInsightsCustomTab && (
        <div className="border-b bg-background p-4">
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
      )}

      {/* Tab Content */}
      <div className="border-b bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-2">
          <div 
            className="h-2 w-2 rounded-full" 
            style={{ backgroundColor: currentTab.color }}
          />
          <h2 className="font-semibold">{currentTab.name}</h2>
          {currentTab.description && (
            <>
              <span className="text-muted-foreground">•</span>
              <p className="text-sm text-muted-foreground">{currentTab.description}</p>
            </>
          )}
        </div>
      </div>

      {/* View Content */}
      <div className="flex-1 overflow-auto p-4">
        {renderView()}
      </div>

      {/* Item Detail Drawer - Only for standard views */}
      {!isAdminCustomTab && !isSettingsCustomTab && !isProfileCustomTab && !isDashboardCustomTab && !isProjectsCustomTab && !isEventsCustomTab && !isLocationsCustomTab && !isCommunityCustomTab && !isReportsCustomTab && !isAnalyticsCustomTab && !isInsightsCustomTab && (
        <ItemDetailDrawer
          item={selectedItem}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          onUpdate={handleUpdateItem}
          onDelete={handleDeleteItem}
        />
      )}

      {/* Create Item Dialog - Only for standard views */}
      {!isAdminCustomTab && !isSettingsCustomTab && !isProfileCustomTab && !isDashboardCustomTab && !isProjectsCustomTab && !isEventsCustomTab && !isLocationsCustomTab && !isCommunityCustomTab && !isReportsCustomTab && !isAnalyticsCustomTab && !isInsightsCustomTab && (
        <CreateItemDialogEnhanced
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          moduleId={moduleSlug}
          tabSlug={tabSlug}
          onSuccess={handleCreateItem}
        />
      )}
    </div>
  )
}
