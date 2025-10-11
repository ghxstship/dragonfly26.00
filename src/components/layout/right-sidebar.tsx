"use client"

import { X, MessageSquare, Activity, Clock, Upload, Download, Share2, Filter, Columns3, ArrowUpDown, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/ui-store"
import { ActivityFeed } from "@/components/shared/activity-feed"
import { CommentsSection } from "@/components/shared/comments-section"
import { TimeTracker } from "@/components/shared/time-tracker"
import { ImportPanel } from "@/components/shared/import-panel"
import { ExportPanel } from "@/components/shared/export-panel"
import { SharePanel } from "@/components/shared/share-panel"
import { FilterPanel } from "@/components/shared/filter-panel"
import { SortPanel } from "@/components/shared/sort-panel"
import { FieldConfigPanel } from "@/components/shared/field-config-panel"
import { TabConfigPanel } from "@/components/shared/tab-config-panel"
import { useParams } from "next/navigation"
import { getModuleTabs } from "@/lib/modules/tabs-registry"

export function RightSidebar() {
  const params = useParams()
  const moduleSlug = params.module as string | undefined
  const { rightSidebarOpen, setRightSidebarOpen, rightSidebarTab, setRightSidebarTab, setTabConfig, getTabConfig } = useUIStore()

  if (!rightSidebarOpen) return null

  // Get current module tabs
  const moduleTabs = moduleSlug ? getModuleTabs(moduleSlug) : []
  const savedTabConfig = moduleSlug ? getTabConfig(moduleSlug) : undefined
  const currentTabs = savedTabConfig || moduleTabs

  const handleTabsChange = (tabs: any[]) => {
    if (moduleSlug) {
      setTabConfig(moduleSlug, tabs)
    }
  }

  // Determine the title based on the active tab
  const getTitle = () => {
    switch (rightSidebarTab) {
      case "activity":
        return "Activity"
      case "comments":
        return "Comments"
      case "time":
        return "Time Tracking"
      case "import":
        return "Import"
      case "export":
        return "Export"
      case "share":
        return "Share"
      case "filter":
        return "Filters"
      case "sort":
        return "Sort"
      case "fields":
        return "Fields"
      case "pages":
        return "Pages"
      default:
        return "Details"
    }
  }

  return (
    <aside
      className={cn(
        "sticky top-14 h-[calc(100vh-3.5rem)] w-full sm:w-96 lg:w-[440px] border-l bg-background flex flex-col"
      )}
    >
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h3 className="text-lg font-semibold">{getTitle()}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setRightSidebarOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={rightSidebarTab} onValueChange={setRightSidebarTab} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b px-4 overflow-x-auto flex-nowrap">
          <TabsTrigger value="activity" className="gap-1.5 text-xs px-3">
            <Activity className="h-3.5 w-3.5" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="comments" className="gap-1.5 text-xs px-3">
            <MessageSquare className="h-3.5 w-3.5" />
            Comments
          </TabsTrigger>
          <TabsTrigger value="time" className="gap-1.5 text-xs px-3">
            <Clock className="h-3.5 w-3.5" />
            Time
          </TabsTrigger>
          <TabsTrigger value="import" className="gap-1.5 text-xs px-3">
            <Upload className="h-3.5 w-3.5" />
            Import
          </TabsTrigger>
          <TabsTrigger value="export" className="gap-1.5 text-xs px-3">
            <Download className="h-3.5 w-3.5" />
            Export
          </TabsTrigger>
          <TabsTrigger value="share" className="gap-1.5 text-xs px-3">
            <Share2 className="h-3.5 w-3.5" />
            Share
          </TabsTrigger>
          <TabsTrigger value="filter" className="gap-1.5 text-xs px-3">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </TabsTrigger>
          <TabsTrigger value="sort" className="gap-1.5 text-xs px-3">
            <ArrowUpDown className="h-3.5 w-3.5" />
            Sort
          </TabsTrigger>
          <TabsTrigger value="fields" className="gap-1.5 text-xs px-3">
            <Columns3 className="h-3.5 w-3.5" />
            Fields
          </TabsTrigger>
          <TabsTrigger value="pages" className="gap-1.5 text-xs px-3">
            <Eye className="h-3.5 w-3.5" />
            Pages
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="activity" className="p-6 m-0">
            <ActivityFeed />
          </TabsContent>

          <TabsContent value="comments" className="p-6 m-0">
            <CommentsSection entityType="task" entityId="example-id" />
          </TabsContent>

          <TabsContent value="time" className="p-6 m-0">
            <TimeTracker />
          </TabsContent>

          <TabsContent value="import" className="p-6 m-0">
            <ImportPanel />
          </TabsContent>

          <TabsContent value="export" className="p-6 m-0">
            <ExportPanel />
          </TabsContent>

          <TabsContent value="share" className="p-6 m-0">
            <SharePanel />
          </TabsContent>

          <TabsContent value="filter" className="p-6 m-0">
            <FilterPanel />
          </TabsContent>

          <TabsContent value="sort" className="p-6 m-0">
            <SortPanel />
          </TabsContent>

          <TabsContent value="fields" className="p-6 m-0">
            <FieldConfigPanel />
          </TabsContent>

          <TabsContent value="pages" className="p-6 m-0">
            {moduleSlug && moduleTabs.length > 0 ? (
              <TabConfigPanel 
                moduleSlug={moduleSlug}
                tabs={currentTabs}
                onTabsChange={handleTabsChange}
              />
            ) : (
              <div className="text-sm text-muted-foreground text-center py-8">
                No module pages available
              </div>
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </aside>
  )
}
