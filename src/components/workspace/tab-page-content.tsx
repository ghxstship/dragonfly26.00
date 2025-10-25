"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Filter, Search, Columns3, MessageSquare, Activity as ActivityIcon, Clock, ArrowUpDown, Upload, Download, Share2, MoreHorizontal, Camera, QrCode } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
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
import { getAssetsTabComponent } from "@/lib/assets-tab-components"
import { getLocationsTabComponent } from "@/lib/locations-tab-components"
import { getCommunityTabComponent } from "@/lib/community-tab-components"
import { getMarketplaceTabComponent } from "@/lib/marketplace-tab-components"
import { getFinanceTabComponent } from "@/lib/finance-tab-components"
import { getProcurementTabComponent } from "@/lib/procurement-tab-components"
import { getReportsTabComponent } from "@/lib/reports-tab-components"
import { getAnalyticsTabComponent } from "@/lib/analytics-tab-components"
import { getInsightsTabComponent } from "@/lib/insights-tab-components"
import { useModuleData, useCreateItem, useUpdateItem, useDeleteItem } from "@/hooks/use-module-data"
import { getSchemaForTab } from "@/lib/data-schemas"
import type { ViewType, DataItem } from "@/types"

// Table mapping for CRUD operations
const getTableNameForTab = (moduleSlug: string, tabSlug: string): string => {
  const tableMap: Record<string, string> = {
    'productions': 'productions',
    'activations': 'productions',
    'tasks': 'project_tasks',
    'milestones': 'project_milestones',
    'compliance': 'project_compliance',
    'safety': 'project_safety',
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
    'training': 'training_records',
    'assignments': 'personnel_assignments',
    'scheduling': 'events',
    'onboarding': 'personnel',
    'applicants': 'job_applicants',
    'openings': 'job_openings',
    'tracking': 'asset_transactions',
    'inventory': 'inventory_items',
    'counts': 'inventory_counts',
    'maintenance': 'asset_maintenance',
    'advances': 'production_advances',
    'directory': 'locations',
    'site-maps': 'site_maps',
    'bim-models': 'location_bim_models',
    'coordination': 'location_bim_clashes',
    'spatial-features': 'location_features',
    'all-documents': 'files',
    'contracts': 'files',
    'organizations': 'companies',
    'contacts': 'company_contacts',
    'deliverables': 'scopes_of_work',
    'scopes-of-work': 'scopes_of_work',
    'bids': 'bids',
    'budgets': 'budgets',
    'transactions': 'financial_transactions',
    'invoices': 'invoices',
    'expenses': 'financial_transactions',
    'payroll': 'payroll',
    'gl-codes': 'gl_codes',
    'fulfillment': 'purchase_orders',
    'orders': 'purchase_orders',
    'agreements': 'procurement_agreements',
    'requisitions': 'purchase_requisitions',
    'line-items': 'po_line_items',
    'audits': 'purchase_orders',
    'receiving': 'goods_receipts',
    'matching': 'three_way_matches',
    'activity': 'community_posts',
    'connections': 'connections',
    'shop': 'marketplace_products',
    'products': 'marketplace_products',
    'purchases': 'marketplace_orders',
    'library': 'resources',
    'guides': 'resources',
    'courses': 'courses',
    'grants': 'grants',
    'publications': 'resources',
    'glossary': 'resources',
    'troubleshooting': 'resources',
    'active': 'job_contracts',
    'pipeline': 'job_contracts',
    'offers': 'job_contracts',
    'shortlists': 'job_contracts',
    'rfps': 'rfps',
    'completed': 'job_contracts',
    'archived': 'job_contracts',
    'work-orders': 'work_orders',
    'dispatch': 'work_orders',
    'estimates': 'estimates',
    'checklists': 'checklists',
    'costs': 'project_costs',
    'recruiting': 'hiring_applications',
    'applications': 'hiring_application_responses',
    'templates': 'report_templates',
    'custom-builder': 'report_templates',
    'scheduled': 'report_templates',
    'exports': 'report_templates',
    'executive': 'report_templates',
    'operational': 'report_templates',
    'data-sources': 'data_sources',
    'custom-views': 'analytics_views',
    'pivot-tables': 'analytics_views',
    'metrics-library': 'analytics_views',
    'benchmarks': 'benchmarks',
    'objectives': 'objectives',
    'key-results': 'key_results',
    'priorities': 'strategic_priorities',
    'recommendations': 'ai_recommendations',
    'intelligence-feed': 'intelligence_feed',
    'reviews': 'strategic_reviews',
  }
  
  // Check for module-specific mapping first (for conflicting tab slugs)
  const moduleSpecificKey = `${moduleSlug}-${tabSlug}`
  const moduleSpecificMap: Record<string, string> = {
    'reports-overview': 'report_templates',
    'reports-compliance': 'report_templates',
    'reports-archived': 'report_templates',
    'projects-work-orders': 'work_orders',
    'projects-checklists': 'checklists',
    'companies-compliance': 'subcontractor_compliance_docs',
    'companies-work-orders': 'work_orders',
    'companies-invoices': 'subcontractor_invoices',
    'companies-reviews': 'subcontractor_reviews',
    'subcontractor-profile': 'subcontractor_profiles',
    'jobs-invoices': 'subcontractor_invoices',
    'jobs-compliance': 'subcontractor_compliance_docs',
  }
  
  return moduleSpecificMap[moduleSpecificKey] || tableMap[tabSlug] || 'productions'
}

export function TabPageContent() {
  const params = useParams()
  const moduleSlug = params.module as string
  const tabSlug = params.tab as string
  const currentModule = getModuleBySlug(moduleSlug)
  const currentTab = getTabBySlug(moduleSlug, tabSlug)
  const { setRightSidebarOpen, focusMode, currentWorkspace } = useUIStore()
  const supabase = createClient()
  
  // Use resolved workspace ID from store (handles "personal" -> UUID conversion)
  const workspaceId = currentWorkspace?.id || ''
  
  // Get current user ID
  const [userId, setUserId] = useState<string>('')
  
  useEffect(() => {
    async function getCurrentUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    getCurrentUser()
  }, [])
  
  // Check if this is an admin, settings, profile, dashboard, projects, events, assets, locations, community, finance, reports, analytics, or insights tab with custom component
  const isAdminCustomTab = moduleSlug === "admin" && getAdminTabComponent(tabSlug) !== undefined
  const isSettingsCustomTab = moduleSlug === "settings" && getSettingsTabComponent(tabSlug) !== undefined
  const isProfileCustomTab = moduleSlug === "profile" && getProfileTabComponent(tabSlug) !== undefined
  const isDashboardCustomTab = moduleSlug === "dashboard" && getDashboardTabComponent(tabSlug) !== undefined
  const isProjectsCustomTab = moduleSlug === "projects" && getProjectsTabComponent(tabSlug) !== undefined
  const isEventsCustomTab = moduleSlug === "events" && getEventsTabComponent(tabSlug) !== undefined
  const isAssetsCustomTab = moduleSlug === "assets" && getAssetsTabComponent(tabSlug) !== undefined
  const isLocationsCustomTab = moduleSlug === "locations" && getLocationsTabComponent(tabSlug) !== undefined
  const isCommunityCustomTab = moduleSlug === "community" && getCommunityTabComponent(tabSlug) !== undefined
  const isMarketplaceCustomTab = moduleSlug === "marketplace" && getMarketplaceTabComponent(tabSlug) !== undefined
  const isFinanceCustomTab = moduleSlug === "finance" && getFinanceTabComponent(tabSlug) !== undefined
  const isProcurementCustomTab = moduleSlug === "procurement" && getProcurementTabComponent(tabSlug) !== undefined
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
    } catch (err: any) {
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
    } catch (err: any) {
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
    } catch (err: any) {
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
        return <DashboardComponent 
          data={realData} 
          loading={loading}
          workspaceId={workspaceId}
          userId={userId}
        />
      }
    }

    // For projects module, check if there's a custom tab component
    if (moduleSlug === "projects") {
      const ProjectsComponent = getProjectsTabComponent(tabSlug)
      if (ProjectsComponent) {
        return <ProjectsComponent 
          data={realData} 
          loading={loading}
          workspaceId={workspaceId}
          moduleId={moduleSlug}
          tabSlug={tabSlug}
        />
      }
    }

    // For events module, check if there's a custom tab component
    if (moduleSlug === "events") {
      const EventsComponent = getEventsTabComponent(tabSlug)
      if (EventsComponent) {
        return <EventsComponent 
          data={realData} 
          loading={loading}
          workspaceId={workspaceId}
          moduleId={moduleSlug}
          tabSlug={tabSlug}
        />
      }
    }

    // For assets module, check if there's a custom tab component
    if (moduleSlug === "assets") {
      const AssetsComponent = getAssetsTabComponent(tabSlug)
      if (AssetsComponent) {
        return <AssetsComponent data={realData} loading={loading} workspaceId={workspaceId} />
      }
    }

    // For locations module, check if there's a custom tab component
    if (moduleSlug === "locations") {
      const LocationsComponent = getLocationsTabComponent(tabSlug)
      if (LocationsComponent) {
        const Component = LocationsComponent as React.ComponentType<any>
        return <Component data={realData} loading={loading} />
      }
    }

    // For community module, check if there's a custom tab component
    if (moduleSlug === "community") {
      const CommunityComponent = getCommunityTabComponent(tabSlug)
      if (CommunityComponent) {
        const Component = CommunityComponent as React.ComponentType<any>
        return <Component data={realData} loading={loading} />
      }
    }

    // For marketplace module, check if there's a custom tab component
    if (moduleSlug === "marketplace") {
      const MarketplaceComponent = getMarketplaceTabComponent(tabSlug)
      if (MarketplaceComponent) {
        const Component = MarketplaceComponent as React.ComponentType<any>
        return <Component data={realData} loading={loading} />
      }
    }

    // For finance module, check if there's a custom tab component
    if (moduleSlug === "finance") {
      const FinanceComponent = getFinanceTabComponent(tabSlug)
      if (FinanceComponent) {
        return <FinanceComponent workspaceId={workspaceId} moduleId={moduleSlug} tabSlug={tabSlug} />
      }
    }

    // For procurement module, check if there's a custom tab component
    if (moduleSlug === "procurement") {
      const ProcurementComponent = getProcurementTabComponent(tabSlug)
      if (ProcurementComponent) {
        return <ProcurementComponent workspaceId={workspaceId} moduleId={moduleSlug} tabSlug={tabSlug} />
      }
    }

    // For reports module, check if there's a custom tab component
    if (moduleSlug === "reports") {
      const ReportsComponent = getReportsTabComponent(tabSlug)
      if (ReportsComponent) {
        const Component = ReportsComponent as React.ComponentType<{ data?: any[]; loading?: boolean }>
        return <Component data={realData} loading={loading} />
      }
    }

    // For analytics module, check if there's a custom tab component
    if (moduleSlug === "analytics") {
      const AnalyticsComponent = getAnalyticsTabComponent(tabSlug)
      if (AnalyticsComponent) {
        const Component = AnalyticsComponent as React.ComponentType<{ data?: any[]; loading?: boolean }>
        return <Component data={realData} loading={loading} />
      }
    }

    // For insights module, check if there's a custom tab component
    if (moduleSlug === "insights") {
      const InsightsComponent = getInsightsTabComponent(tabSlug)
      if (InsightsComponent) {
        const Component = InsightsComponent as React.ComponentType<{ data?: any[]; loading?: boolean }>
        return <Component data={realData} loading={loading} />
      }
    }

    // Show loading state
    if (loading) {
      return (
        <div className="flex flex-wrap items-center justify-center h-full">
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
        <div className="flex flex-wrap items-center justify-center h-full">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error loading data</p>
            <p className="text-sm text-muted-foreground">{(error as any).message}</p>
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

    // Get schema for current tab to enable schema-driven table views
    const schema = getSchemaForTab(moduleSlug, tabSlug)

    // Otherwise, render based on view type with REAL DATA
    switch (currentView) {
      case "list":
        return <ListViewOrganism data={filteredData} schema={schema?.fields} onItemClick={handleItemClick} createActionLabel={createLabel} onCreateAction={handleCreateClick} />
      case "board":
        return <BoardViewOrganism data={filteredData} schema={schema?.fields} onItemClick={handleItemClick} createActionLabel={createLabel} onCreateAction={handleCreateClick} />
      case "table":
        // Use schema-driven EnhancedTableView (schema auto-generated from form configs if not manually defined)
        return (
          <DataTableOrganism
            data={filteredData}
            columns={(schema?.fields as any) || []}
            loading={loading}
            onRowClick={handleItemClick}
          />
        )
      case "calendar":
        return <CalendarOrganism data={filteredData} schema={schema?.fields} onItemClick={handleItemClick} />
      case "timeline":
        return <TimelineOrganism data={filteredData} schema={schema?.fields} onItemClick={handleItemClick} />
      case "workload":
        return <WorkloadViewOrganism data={filteredData} schema={schema?.fields} onItemClick={handleItemClick} />
      case "map":
        return <MapOrganism locations={filteredData as any} />
      case "mind-map":
        return <MindMapOrganism nodes={filteredData as any} onChange={() => {}} />
      case "form":
        return <FormBuilderOrganism fields={(schema?.fields as any) || []} onChange={() => {}} />
      case "activity":
        return <ActivityViewOrganism data={filteredData} schema={schema?.fields} onItemClick={handleItemClick} />
      case "box":
        return <BoxViewOrganism data={filteredData} schema={schema?.fields} onItemClick={handleItemClick} />
      case "embed":
        return <EmbedContainerOrganism url="" />
      case "chat":
        return <ChatOrganism messages={[]} currentUserId="" onSendMessage={() => {}} />
      case "doc":
        return <DocumentEditorOrganism content="" onChange={() => {}} />
      case "financial":
        return <FinancialDashboardOrganism data={filteredData} schema={schema?.fields} />
      case "portfolio":
        return <PortfolioViewOrganism data={filteredData} schema={schema?.fields} onItemClick={handleItemClick} />
      case "pivot":
        return <PivotTableOrganism data={filteredData} schema={schema?.fields} />
      default:
        return (
          <div className="flex flex-wrap items-center justify-center h-full text-muted-foreground">
            {currentView} view coming soon
          </div>
        )
    }
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

  if (!currentTab) {
    return (
      <div className="flex flex-wrap items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold mb-2">Tab not found</h2>
          <p className="text-muted-foreground">
            The tab &quot;{tabSlug}&quot; does not exist for {currentModule.name}.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap flex-col h-full">
      {/* Module Header */}
      <div className="border-b bg-background">
        <div className="p-4">
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
                {/* Real-time indicator */}
                {!isAdminCustomTab && !isSettingsCustomTab && !isProfileCustomTab && !isDashboardCustomTab && !isProjectsCustomTab && !isEventsCustomTab && !isAssetsCustomTab && !isLocationsCustomTab && !isCommunityCustomTab && !isMarketplaceCustomTab && !isFinanceCustomTab && !isProcurementCustomTab && !isReportsCustomTab && !isAnalyticsCustomTab && !isInsightsCustomTab && (
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 mt-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-muted-foreground">
                      Live • {loading ? '...' : `${realData.length} items`}
                    </span>
                  </div>
                )}
              </div>
              {!isAdminCustomTab && !isSettingsCustomTab && !isProfileCustomTab && !isDashboardCustomTab && !isProjectsCustomTab && !isEventsCustomTab && !isAssetsCustomTab && !isLocationsCustomTab && !isCommunityCustomTab && !isMarketplaceCustomTab && !isFinanceCustomTab && !isProcurementCustomTab && !isReportsCustomTab && !isAnalyticsCustomTab && !isInsightsCustomTab && (
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

      {/* View Controls - Hidden for admin, settings, profile, dashboard, projects, events, assets, locations, community, marketplace, finance, procurement, reports, analytics, and insights custom tabs */}
      {!isAdminCustomTab && !isSettingsCustomTab && !isProfileCustomTab && !isDashboardCustomTab && !isProjectsCustomTab && !isEventsCustomTab && !isAssetsCustomTab && !isLocationsCustomTab && !isCommunityCustomTab && !isMarketplaceCustomTab && !isFinanceCustomTab && !isProcurementCustomTab && !isReportsCustomTab && !isAnalyticsCustomTab && !isInsightsCustomTab && (
        <div className="border-b bg-background p-4">
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <ViewSwitcher
              value={currentView as any}
              onChange={setCurrentView as any}
              modes={['list', 'board', 'table', 'calendar'] as any}
            />

            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute sm:relative sm:inset-auto left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground sm:relative sm:inset-auto" />
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
                <DropdownMenuItem
                  onClick={() => {
                    setRightSidebarOpen(true, 'photo-upload')
                  }}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Photo Upload
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setRightSidebarOpen(true, 'barcode-scanner')
                  }}
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Scan Barcode/QR
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex flex-wrap flex-col md:flex-row items-center gap-1 ml-2 border-l pl-2">
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
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
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
      {!isAdminCustomTab && !isSettingsCustomTab && !isProfileCustomTab && !isDashboardCustomTab && !isProjectsCustomTab && !isEventsCustomTab && !isAssetsCustomTab && !isLocationsCustomTab && !isCommunityCustomTab && !isMarketplaceCustomTab && !isFinanceCustomTab && !isProcurementCustomTab && !isReportsCustomTab && !isAnalyticsCustomTab && !isInsightsCustomTab && (
        <ItemDetailDrawer
          item={selectedItem}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          onUpdate={handleUpdateItem}
          onDelete={handleDeleteItem}
        />
      )}

      {/* Create Item Dialog - Only for standard views */}
      {!isAdminCustomTab && !isSettingsCustomTab && !isProfileCustomTab && !isDashboardCustomTab && !isProjectsCustomTab && !isEventsCustomTab && !isAssetsCustomTab && !isLocationsCustomTab && !isCommunityCustomTab && !isMarketplaceCustomTab && !isFinanceCustomTab && !isProcurementCustomTab && !isReportsCustomTab && !isAnalyticsCustomTab && !isInsightsCustomTab && (
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
