"use client"

import { useState, useEffect } from "react"
import { X, MessageSquare, Activity, Clock, Upload, Download, Share2, Filter, Columns3, ArrowUpDown, Bell, Camera, ScanLine } from "lucide-react"
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
import { useParams } from "next/navigation"

type TabGroup = 'collaboration' | 'data' | 'transfer' | 'capture'

const tabGroups = {
  collaboration: {
    label: 'Collaborate',
    tabs: ['notifications', 'comments', 'time', 'activity']
  },
  data: {
    label: 'Data',
    tabs: ['filter', 'sort', 'fields']
  },
  transfer: {
    label: 'Transfer',
    tabs: ['import', 'export', 'share']
  },
  capture: {
    label: 'Capture',
    tabs: ['scan', 'photo']
  }
}

export function RightSidebar() {
  const params = useParams()
  const moduleSlug = params.module as string | undefined
  const { rightSidebarOpen, setRightSidebarOpen, rightSidebarTab, setRightSidebarTab } = useUIStore()
  const [activeGroup, setActiveGroup] = useState<TabGroup>('collaboration')

  // Determine which group the current tab belongs to
  const getCurrentGroup = (): TabGroup => {
    for (const [group, config] of Object.entries(tabGroups)) {
      if (config.tabs.includes(rightSidebarTab)) {
        return group as TabGroup
      }
    }
    return 'collaboration'
  }

  // Determine the title based on the active tab
  const getTitle = () => {
    switch (rightSidebarTab) {
      case "notifications":
        return "Notifications"
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
      case "scan":
        return "Scan Document"
      case "photo":
        return "Take Photo"
      default:
        return "Details"
    }
  }

  // Handle group change
  const handleGroupChange = (group: string) => {
    if (group) {
      const newGroup = group as TabGroup
      setActiveGroup(newGroup)
      // Switch to first tab of the new group
      const firstTab = tabGroups[newGroup].tabs[0]
      setRightSidebarTab(firstTab)
    }
  }

  // Sync activeGroup when tab changes from outside
  useEffect(() => {
    const group = getCurrentGroup()
    if (group !== activeGroup) {
      setActiveGroup(group)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rightSidebarTab])

  if (!rightSidebarOpen) return null

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

      {/* Group Switcher */}
      <div className="flex items-center gap-1 border-b px-4 py-2 bg-muted/30">
        {Object.entries(tabGroups).map(([key, config]) => (
          <Button
            key={key}
            variant={activeGroup === key ? "secondary" : "ghost"}
            size="sm"
            className="text-xs h-8"
            onClick={() => handleGroupChange(key)}
          >
            {config.label}
          </Button>
        ))}
      </div>

      <Tabs value={rightSidebarTab} onValueChange={setRightSidebarTab} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b px-4 overflow-x-auto flex-nowrap">
          {/* Collaboration Tabs */}
          {activeGroup === 'collaboration' && (
            <>
              <TabsTrigger value="notifications" className="gap-1.5 text-xs px-3">
                <Bell className="h-3.5 w-3.5" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="comments" className="gap-1.5 text-xs px-3">
                <MessageSquare className="h-3.5 w-3.5" />
                Comments
              </TabsTrigger>
              <TabsTrigger value="time" className="gap-1.5 text-xs px-3">
                <Clock className="h-3.5 w-3.5" />
                Time
              </TabsTrigger>
              <TabsTrigger value="activity" className="gap-1.5 text-xs px-3">
                <Activity className="h-3.5 w-3.5" />
                Activity
              </TabsTrigger>
            </>
          )}

          {/* Data Control Tabs */}
          {activeGroup === 'data' && (
            <>
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
            </>
          )}

          {/* Transfer Tabs */}
          {activeGroup === 'transfer' && (
            <>
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
            </>
          )}

          {/* Capture Tabs */}
          {activeGroup === 'capture' && (
            <>
              <TabsTrigger value="scan" className="gap-1.5 text-xs px-3">
                <ScanLine className="h-3.5 w-3.5" />
                Scan
              </TabsTrigger>
              <TabsTrigger value="photo" className="gap-1.5 text-xs px-3">
                <Camera className="h-3.5 w-3.5" />
                Photo
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <ScrollArea className="flex-1">
          {/* Collaboration Tabs Content */}
          <TabsContent value="notifications" className="p-6 m-0">
            <div className="text-sm text-muted-foreground">
              Notifications are displayed in the top bar bell icon. This panel could show notification settings or preferences.
            </div>
          </TabsContent>

          <TabsContent value="comments" className="p-6 m-0">
            <CommentsSection entityType="task" entityId="example-id" />
          </TabsContent>

          <TabsContent value="time" className="p-6 m-0">
            <TimeTracker />
          </TabsContent>

          <TabsContent value="activity" className="p-6 m-0">
            <ActivityFeed />
          </TabsContent>

          {/* Data Control Tabs Content */}
          <TabsContent value="filter" className="p-6 m-0">
            <FilterPanel />
          </TabsContent>

          <TabsContent value="sort" className="p-6 m-0">
            <SortPanel />
          </TabsContent>

          <TabsContent value="fields" className="p-6 m-0">
            <FieldConfigPanel />
          </TabsContent>

          {/* Transfer Tabs Content */}
          <TabsContent value="import" className="p-6 m-0">
            <ImportPanel />
          </TabsContent>

          <TabsContent value="export" className="p-6 m-0">
            <ExportPanel />
          </TabsContent>

          <TabsContent value="share" className="p-6 m-0">
            <SharePanel />
          </TabsContent>

          {/* Capture Tabs Content */}
          <TabsContent value="scan" className="p-6 m-0">
            <div className="space-y-4 [&>*:first-child]:mt-0">
              <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <ScanLine className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Scan Document</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use your device camera to scan documents
                  </p>
                </div>
              </div>
              <Button className="w-full">
                <ScanLine className="h-4 w-4 mr-2" />
                Start Scanning
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="photo" className="p-6 m-0">
            <div className="space-y-4 [&>*:first-child]:mt-0">
              <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Take Photo</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Capture photos for your workspace
                  </p>
                </div>
              </div>
              <Button className="w-full">
                <Camera className="h-4 w-4 mr-2" />
                Open Camera
              </Button>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </aside>
  )
}
