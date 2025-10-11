"use client"

import { X, MessageSquare, Activity, Clock, Upload, Download, Share2, Filter, SlidersHorizontal, ArrowUpDown } from "lucide-react"
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

export function RightSidebar() {
  const { rightSidebarOpen, setRightSidebarOpen, rightSidebarTab, setRightSidebarTab } = useUIStore()

  if (!rightSidebarOpen) return null

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
      default:
        return "Details"
    }
  }

  return (
    <aside
      className={cn(
        "sticky top-14 h-[calc(100vh-3.5rem)] w-80 border-l bg-background flex flex-col"
      )}
    >
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="font-semibold">{getTitle()}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setRightSidebarOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={rightSidebarTab} onValueChange={setRightSidebarTab} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b px-2 overflow-x-auto">
          <TabsTrigger value="activity" className="gap-1 text-xs px-2">
            <Activity className="h-3 w-3" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="comments" className="gap-1 text-xs px-2">
            <MessageSquare className="h-3 w-3" />
            Comments
          </TabsTrigger>
          <TabsTrigger value="time" className="gap-1 text-xs px-2">
            <Clock className="h-3 w-3" />
            Time
          </TabsTrigger>
          <TabsTrigger value="import" className="gap-1 text-xs px-2">
            <Upload className="h-3 w-3" />
            Import
          </TabsTrigger>
          <TabsTrigger value="export" className="gap-1 text-xs px-2">
            <Download className="h-3 w-3" />
            Export
          </TabsTrigger>
          <TabsTrigger value="share" className="gap-1 text-xs px-2">
            <Share2 className="h-3 w-3" />
            Share
          </TabsTrigger>
          <TabsTrigger value="filter" className="gap-1 text-xs px-2">
            <Filter className="h-3 w-3" />
            Filter
          </TabsTrigger>
          <TabsTrigger value="sort" className="gap-1 text-xs px-2">
            <ArrowUpDown className="h-3 w-3" />
            Sort
          </TabsTrigger>
          <TabsTrigger value="fields" className="gap-1 text-xs px-2">
            <SlidersHorizontal className="h-3 w-3" />
            Fields
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="activity" className="p-4 m-0">
            <ActivityFeed />
          </TabsContent>

          <TabsContent value="comments" className="p-4 m-0">
            <CommentsSection entityType="task" entityId="example-id" />
          </TabsContent>

          <TabsContent value="time" className="p-4 m-0">
            <TimeTracker />
          </TabsContent>

          <TabsContent value="import" className="p-4 m-0">
            <ImportPanel />
          </TabsContent>

          <TabsContent value="export" className="p-4 m-0">
            <ExportPanel />
          </TabsContent>

          <TabsContent value="share" className="p-4 m-0">
            <SharePanel />
          </TabsContent>

          <TabsContent value="filter" className="p-4 m-0">
            <FilterPanel />
          </TabsContent>

          <TabsContent value="sort" className="p-4 m-0">
            <SortPanel />
          </TabsContent>

          <TabsContent value="fields" className="p-4 m-0">
            <FieldConfigPanel />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </aside>
  )
}
