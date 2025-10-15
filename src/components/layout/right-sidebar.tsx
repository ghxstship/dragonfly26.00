"use client"

import { useState, useEffect } from "react"
import { useRouter } from "@/i18n/navigation"
import { useLocale } from "next-intl"
import { 
  X, MessageSquare, Activity, Clock, Upload, Download, Share2, Filter, Columns3, 
  ArrowUpDown, Bell, Camera, ScanLine, Calendar, ClipboardList, FileText, 
  ChevronLeft, ChevronRight, Plus, Edit2, Trash2, MoreHorizontal, Image as ImageIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/ui-store"
import { ActivityFeed } from "@/components/shared/activity-feed"
import { CommentsSection } from "@/components/shared/comments-section"
import { TimeTracker } from "@/components/shared/time-tracker"
import { NotificationsTabContent } from "@/components/shared/notifications-tab-content"
import { AgendaTabContent } from "@/components/shared/agenda-tab-content"
import { TasksTabContent } from "@/components/shared/tasks-tab-content"
import { FilesTabContent } from "@/components/shared/files-tab-content"
import { ImportPanel } from "@/components/shared/import-panel"
import { ExportPanel } from "@/components/shared/export-panel"
import { SharePanel } from "@/components/shared/share-panel"
import { FilterPanel } from "@/components/shared/filter-panel"
import { SortPanel } from "@/components/shared/sort-panel"
import { FieldConfigPanel } from "@/components/shared/field-config-panel"
import { ScanTabContent } from "@/components/shared/scan-tab-content"
import { PhotoTabContent } from "@/components/shared/photo-tab-content"
import { useParams } from "next/navigation"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type TabGroup = 'mywork' | 'collaboration' | 'data' | 'transfer' | 'capture'

const tabGroups = {
  mywork: {
    label: 'My Work',
    icon: ClipboardList,
    tabs: ['agenda', 'tasks', 'files']
  },
  collaboration: {
    label: 'Collaborate',
    icon: MessageSquare,
    tabs: ['notifications', 'comments', 'time', 'activity']
  },
  data: {
    label: 'Data',
    icon: Filter,
    tabs: ['filter', 'sort', 'fields']
  },
  transfer: {
    label: 'Transfer',
    icon: Upload,
    tabs: ['import', 'export', 'share']
  },
  capture: {
    label: 'Capture',
    icon: Camera,
    tabs: ['scan', 'photo']
  }
}

export function RightSidebar() {
  const params = useParams()
  const router = useRouter()
  const locale = useLocale()
  const moduleSlug = params.module as string | undefined
  const { rightSidebarOpen, setRightSidebarOpen, rightSidebarTab, setRightSidebarTab, currentWorkspace } = useUIStore()
  const [activeGroup, setActiveGroup] = useState<TabGroup>('mywork')
  const [isExpanded, setIsExpanded] = useState(false)

  // Determine the entity type and ID for comments/activity based on current context
  const getEntityContext = () => {
    // Default to workspace-level comments if no specific entity is selected
    return {
      entityType: 'workspace',
      entityId: currentWorkspace?.id || 'no-workspace',
    }
  }

  const { entityType, entityId } = getEntityContext()

  // Determine which group the current tab belongs to
  const getCurrentGroup = (): TabGroup => {
    for (const [group, config] of Object.entries(tabGroups)) {
      if (config.tabs.includes(rightSidebarTab)) {
        return group as TabGroup
      }
    }
    return 'mywork'
  }

  // Determine the title based on the active tab
  const getTitle = () => {
    switch (rightSidebarTab) {
      case "agenda":
        return "My Agenda"
      case "tasks":
        return "My Tasks"
      case "files":
        return "My Files"
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

  // Get icon for current tab
  const getTabIcon = () => {
    switch (rightSidebarTab) {
      case "agenda":
        return Calendar
      case "tasks":
        return ClipboardList
      case "files":
        return FileText
      case "notifications":
        return Bell
      case "activity":
        return Activity
      case "comments":
        return MessageSquare
      case "time":
        return Clock
      case "import":
        return Upload
      case "export":
        return Download
      case "share":
        return Share2
      case "filter":
        return Filter
      case "sort":
        return ArrowUpDown
      case "fields":
        return Columns3
      case "scan":
        return ScanLine
      case "photo":
        return Camera
      default:
        return ClipboardList
    }
  }

  // Handle group change
  const handleGroupChange = (group: TabGroup) => {
    setActiveGroup(group)
    // Switch to first tab of the new group
    const firstTab = tabGroups[group].tabs[0]
    setRightSidebarTab(firstTab)
    // Always expand when changing groups
    if (!isExpanded) {
      setIsExpanded(true)
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

  // Auto-expand sidebar when opened
  useEffect(() => {
    if (rightSidebarOpen && !isExpanded) {
      setIsExpanded(true)
    }
  }, [rightSidebarOpen])

  if (!rightSidebarOpen) return null

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "sticky top-14 h-[calc(100vh-3.5rem)] border-l bg-background flex transition-all duration-200",
          isExpanded ? "w-full sm:w-96 lg:w-[440px]" : "w-16"
        )}
      >
        {/* Collapsed State - Icon Navigation */}
        {!isExpanded && (
          <div className="flex flex-col w-full border-r">
            {/* Expand Button */}
            <div className="p-2 border-b">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-full h-10"
                    onClick={() => setIsExpanded(true)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="z-[100]">
                  <p>Expand sidebar</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Group Icons */}
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-1 p-2">
                {Object.entries(tabGroups).map(([key, config]) => {
                  const GroupIcon = config.icon
                  return (
                    <Tooltip key={key}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={activeGroup === key ? "secondary" : "ghost"}
                          size="icon"
                          className="w-full h-12"
                          onClick={() => handleGroupChange(key as TabGroup)}
                        >
                          <GroupIcon className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="z-[100]">
                        <p>{config.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            </ScrollArea>

            {/* Close Button */}
            <div className="p-2 border-t">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-full h-10"
                    onClick={() => setRightSidebarOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="z-[100]">
                  <p>Close sidebar</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}

        {/* Expanded State - Full Content */}
        {isExpanded && (
          <div className="flex flex-col w-full">
            {/* Header with Title and Actions */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {(() => {
                  const Icon = getTabIcon()
                  return <Icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                })()}
                <h3 className="text-sm font-semibold truncate">{getTitle()}</h3>
              </div>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setIsExpanded(false)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="z-[100]">
                    <p>Collapse sidebar</p>
                  </TooltipContent>
                </Tooltip>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setRightSidebarOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Group Switcher - Compact Pills */}
            <div className="flex items-center gap-1 border-b px-3 py-2 bg-muted/20 overflow-x-auto">
              {Object.entries(tabGroups).map(([key, config]) => {
                const GroupIcon = config.icon
                return (
                  <Button
                    key={key}
                    variant={activeGroup === key ? "secondary" : "ghost"}
                    size="sm"
                    className="text-xs h-7 gap-1.5 flex-shrink-0"
                    onClick={() => handleGroupChange(key as TabGroup)}
                  >
                    <GroupIcon className="h-3 w-3" />
                    <span className="hidden sm:inline">{config.label}</span>
                  </Button>
                )
              })}
            </div>

            {/* Tab Content */}
            <Tabs value={rightSidebarTab} onValueChange={setRightSidebarTab} className="flex-1 flex flex-col min-h-0">
              {/* Tabs Navigation - Horizontal Scroll */}
              <TabsList className="w-full justify-start rounded-none border-b px-3 py-0 h-auto bg-transparent overflow-x-auto flex-nowrap">
                {/* My Work Tabs */}
                {activeGroup === 'mywork' && (
                  <>
                    <TabsTrigger value="agenda" className="gap-1.5 text-xs px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <Calendar className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Agenda</span>
                    </TabsTrigger>
                    <TabsTrigger value="tasks" className="gap-1.5 text-xs px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <ClipboardList className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Tasks</span>
                    </TabsTrigger>
                    <TabsTrigger value="files" className="gap-1.5 text-xs px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <FileText className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Files</span>
                    </TabsTrigger>
                  </>
                )}

                {/* Collaboration Tabs */}
                {activeGroup === 'collaboration' && (
                  <>
                    <TabsTrigger value="notifications" className="gap-1.5 text-xs px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <Bell className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Notifications</span>
                    </TabsTrigger>
                    <TabsTrigger value="comments" className="gap-1.5 text-xs px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Comments</span>
                    </TabsTrigger>
                    <TabsTrigger value="time" className="gap-1.5 text-xs px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Time</span>
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="gap-1.5 text-xs px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <Activity className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Activity</span>
                    </TabsTrigger>
                  </>
                )}

                {/* Data Control Tabs */}
                {activeGroup === 'data' && (
                  <>
                    <TabsTrigger value="filter" className="gap-1.5 text-xs px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <Filter className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Filter</span>
                    </TabsTrigger>
                    <TabsTrigger value="sort" className="gap-1.5 text-xs px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <ArrowUpDown className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Sort</span>
                    </TabsTrigger>
                    <TabsTrigger value="fields" className="gap-1.5 text-xs px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <Columns3 className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Fields</span>
                    </TabsTrigger>
                  </>
                )}

                {/* Transfer Tabs */}
                {activeGroup === 'transfer' && (
                  <>
                    <TabsTrigger value="import" className="gap-1.5 text-xs px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <Upload className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Import</span>
                    </TabsTrigger>
                    <TabsTrigger value="export" className="gap-1.5 text-xs px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <Download className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Export</span>
                    </TabsTrigger>
                    <TabsTrigger value="share" className="gap-1.5 text-xs px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <Share2 className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Share</span>
                    </TabsTrigger>
                  </>
                )}

                {/* Capture Tabs */}
                {activeGroup === 'capture' && (
                  <>
                    <TabsTrigger value="scan" className="gap-1.5 text-xs px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <ScanLine className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Scan</span>
                    </TabsTrigger>
                    <TabsTrigger value="photo" className="gap-1.5 text-xs px-3 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <Camera className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Photo</span>
                    </TabsTrigger>
                  </>
                )}
              </TabsList>

              <ScrollArea className="flex-1">
                {/* My Work Content */}
                <TabsContent value="agenda" className="m-0 h-full flex flex-col">
                  <AgendaTabContent />
                </TabsContent>

                <TabsContent value="tasks" className="m-0 h-full flex flex-col">
                  <TasksTabContent />
                </TabsContent>

                <TabsContent value="files" className="m-0 h-full flex flex-col">
                  <FilesTabContent />
                </TabsContent>

                {/* Collaboration Tabs Content */}
                <TabsContent value="notifications" className="m-0 h-full flex flex-col">
                  <NotificationsTabContent />
                </TabsContent>

                <TabsContent value="comments" className="p-4 m-0">
                  <CommentsSection entityType={entityType} entityId={entityId} />
                </TabsContent>

                <TabsContent value="time" className="p-4 m-0">
                  <TimeTracker />
                </TabsContent>

                <TabsContent value="activity" className="p-4 m-0">
                  <ActivityFeed />
                </TabsContent>

                {/* Data Control Tabs Content */}
                <TabsContent value="filter" className="p-4 m-0">
                  <FilterPanel />
                </TabsContent>

                <TabsContent value="sort" className="p-4 m-0">
                  <SortPanel />
                </TabsContent>

                <TabsContent value="fields" className="p-4 m-0">
                  <FieldConfigPanel />
                </TabsContent>

                {/* Transfer Tabs Content */}
                <TabsContent value="import" className="p-4 m-0">
                  <ImportPanel />
                </TabsContent>

                <TabsContent value="export" className="p-4 m-0">
                  <ExportPanel />
                </TabsContent>

                <TabsContent value="share" className="p-4 m-0">
                  <SharePanel />
                </TabsContent>

                {/* Capture Tabs Content */}
                <TabsContent value="scan" className="p-4 m-0">
                  <ScanTabContent />
                </TabsContent>

                <TabsContent value="photo" className="p-4 m-0">
                  <PhotoTabContent />
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        )}
      </aside>
    </TooltipProvider>
  )
}
