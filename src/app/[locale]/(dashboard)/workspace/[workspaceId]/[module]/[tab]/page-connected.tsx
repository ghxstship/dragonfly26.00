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
import { useModuleData, useCreateItem, useUpdateItem, useDeleteItem } from "@/hooks/use-module-data"
import type { ViewType, DataItem } from "@/types"

export default function ModuleTabPage() {
  const params = useParams()
  const moduleSlug = params.module as string
  const tabSlug = params.tab as string
  const locale = params.locale as string
  
  const currentModule = getModuleBySlug(moduleSlug)
  const currentTab = getTabBySlug(moduleSlug, tabSlug)
  const { setRightSidebarOpen, focusMode, currentWorkspace } = useUIStore()
  
  // Use resolved workspace ID from store (handles "personal" -> UUID conversion)
  const workspaceId = currentWorkspace?.id || ''

  const [currentView, setCurrentView] = useState<ViewType>(currentTab?.default_view || "list")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // ✅ REAL DATA from Supabase with real-time updates
  const { data: realData, loading, error } = useModuleData(moduleSlug, tabSlug, workspaceId)
  
  // Get the table name for CRUD operations
  const getTableName = () => {
    // Map tab slugs to table names
    const tableMap: Record<string, string> = {
      'productions': 'productions',
      'tasks': 'project_tasks',
      'milestones': 'project_milestones',
      'all-events': 'events',
      'personnel': 'personnel',
      'inventory': 'assets',
      'budgets': 'budgets',
      // Add more mappings as needed
    }
    return tableMap[tabSlug] || 'productions'
  }

  const { createItem } = useCreateItem(getTableName())
  const { updateItem } = useUpdateItem(getTableName())
  const { deleteItem } = useDeleteItem(getTableName())

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
      const newItem = await createItem({
        ...item,
        workspace_id: workspaceId,
      })
      console.log("Item created successfully:", newItem)
      setCreateDialogOpen(false)
    } catch (err) {
      console.error("Failed to create item:", err)
      alert("Failed to create item")
    }
  }

  const renderView = () => {
    // Show loading state
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading {currentTab?.name}...</p>
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

    // Render appropriate view with REAL data
    switch (currentView) {
      case "list":
        return <ListView data={filteredData} onItemClick={handleItemClick} />
      case "board":
        return <BoardView data={filteredData} onItemClick={handleItemClick} />
      case "table":
        return <TableView data={filteredData} onItemClick={handleItemClick} />
      case "calendar":
        return <CalendarView data={filteredData} onItemClick={handleItemClick} />
      case "timeline":
        return <TimelineView data={filteredData} onItemClick={handleItemClick} />
      case "dashboard":
        return <DashboardView data={filteredData} />
      case "workload":
        return <WorkloadView data={filteredData} onItemClick={handleItemClick} />
      case "map":
        return <MapView data={filteredData} onItemClick={handleItemClick} />
      case "mind-map":
        return <MindMapView data={filteredData} onItemClick={handleItemClick} />
      case "form":
        return <FormView data={filteredData} />
      case "activity":
        return <ActivityView data={filteredData} />
      case "box":
        return <BoxView data={filteredData} onItemClick={handleItemClick} />
      case "embed":
        return <EmbedView data={filteredData} />
      case "chat":
        return <ChatView data={filteredData} />
      case "doc":
        return <DocView data={filteredData} onItemClick={handleItemClick} />
      case "financial":
        return <FinancialView data={filteredData} />
      case "portfolio":
        return <PortfolioView data={filteredData} onItemClick={handleItemClick} />
      case "pivot":
        return <PivotView data={filteredData} />
      default:
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            {currentView} view coming soon
          </div>
        )
    }
  }

  if (!currentModule || !currentTab) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Page not found</h2>
          <p className="text-muted-foreground">
            The {moduleSlug}/{tabSlug} page does not exist.
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
                <h1 className="text-2xl font-bold" style={{ color: currentTab.color || currentModule.color }}>
                  {currentTab.name}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentTab.description}
                </p>
                {/* Real-time indicator */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-muted-foreground">
                    Live • {realData.length} items
                  </span>
                </div>
              </div>
              <Button onClick={() => setCreateDialogOpen(true)}>
                + {getCreateButtonLabel(moduleSlug, tabSlug) || `New ${getNewItemLabel(moduleSlug, currentModule.name)}`}
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
              onClick={() => setRightSidebarOpen(true, 'filter')}
              title="Filter"
            >
              <Filter className="h-4 w-4" />
            </Button>

            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setRightSidebarOpen(true, 'sort')}
              title="Sort"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>

            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setRightSidebarOpen(true, 'fields')}
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
                <DropdownMenuItem onClick={() => setRightSidebarOpen(true, 'import')}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRightSidebarOpen(true, 'export')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRightSidebarOpen(true, 'share')}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Module Tabs */}
      <ModuleTabs moduleSlug={moduleSlug} />

      {/* View Content - NOW WITH REAL DATA! */}
      <div className="flex-1 overflow-auto p-4">
        {renderView()}
      </div>

      {/* Item Detail Drawer */}
      <ItemDetailDrawer
        item={selectedItem}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onUpdate={handleUpdateItem}
        onDelete={handleDeleteItem}
      />

      {/* Create Item Dialog */}
      <CreateItemDialogEnhanced
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        moduleId={moduleSlug}
        tabSlug={tabSlug}
        onSuccess={handleCreateItem}
      />
    </div>
  )
}
