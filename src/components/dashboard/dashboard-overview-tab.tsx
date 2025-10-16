"use client"

import { useState } from "react"
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Briefcase,
  Package,
  TrendingUp,
  Plane,
  Receipt,
  FileBarChart,
  FolderOpen,
  Plus,
  MoreHorizontal
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMyTasks, useMyAgenda, useMyJobs, useMyExpenses } from "@/hooks/use-dashboard-data"
import { useDashboardWidgets } from "@/hooks/use-dashboard-widgets"
import { useRouter } from "@/i18n/navigation"
import type { DashboardTabProps } from "@/lib/dashboard-tab-components"
import { LogExpenseDialog, BookTravelDialog, CreateTaskDialog, UploadFileDialog } from "./quick-actions"
import { WidgetCustomizationDialog } from "./widget-customization-dialog"

export function DashboardOverviewTab({ workspaceId = '', userId = '' }: DashboardTabProps) {
  const router = useRouter()
  const t = useTranslations('dashboard.overview')
  const tCommon = useTranslations('common')
  
  // Quick action dialog states
  const [logExpenseOpen, setLogExpenseOpen] = useState(false)
  const [bookTravelOpen, setBookTravelOpen] = useState(false)
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [uploadFileOpen, setUploadFileOpen] = useState(false)
  const [widgetCustomizationOpen, setWidgetCustomizationOpen] = useState(false)
  
  // Fetch data from multiple hooks
  const { tasks, loading: tasksLoading } = useMyTasks(workspaceId, userId)
  const { events, loading: eventsLoading } = useMyAgenda(workspaceId, userId)
  const { jobs, loading: jobsLoading } = useMyJobs(workspaceId, userId)
  const { expenses, loading: expensesLoading } = useMyExpenses(workspaceId, userId)
  const { widgets, toggleWidget, availableWidgets, resetToDefaults } = useDashboardWidgets(workspaceId, userId)
  
  const loading = tasksLoading || eventsLoading || jobsLoading || expensesLoading
  
  // Force refresh by incrementing a key
  const [refreshKey, setRefreshKey] = useState(0)
  const handleRefresh = () => setRefreshKey(prev => prev + 1)
  
  // Calculate real stats
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const tasksDueToday = tasks.filter(t => {
    if (!t.due_date) return false
    const dueDate = new Date(t.due_date)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate.getTime() === today.getTime()
  }).length
  
  const upcomingEvents = events.filter(e => {
    const eventDate = new Date(e.start_time)
    return eventDate >= today
  }).length
  
  const activeJobs = jobs.filter(j => j.status === 'active').length
  
  const pendingExpenses = expenses.filter(e => e.status === 'pending' || e.status === 'submitted').length
  
  // Loading state
  if (loading) {
    return (
      <div 
        className="flex items-center justify-center h-full"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" aria-hidden="true"></div>
          <p className="text-muted-foreground">{t('loadingMessage')}</p>
        </div>
      </div>
    )
  }
  
  // Use real stats from Supabase data
  const stats = [
    {
      label: t('tasksDueToday'),
      value: tasksDueToday.toString(),
      change: "+2",
      trend: "up",
      icon: CheckSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-950",
    },
    {
      label: t('upcomingEvents'),
      value: upcomingEvents.toString(),
      change: "+1",
      trend: "up",
      icon: Calendar,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-950",
    },
    {
      label: t('activeJobs'),
      value: activeJobs.toString(),
      change: "0",
      trend: "neutral",
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950",
    },
    {
      label: t('pendingExpenses'),
      value: pendingExpenses.toString(),
      change: "-1",
      trend: "down",
      icon: Receipt,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
    },
  ]

  // Widget suggestions for customizable dashboard
  const widgetTypes = [
    { id: 1, nameKey: "my_tasks", icon: CheckSquare, color: "bg-purple-500", route: `/workspace/${workspaceId}/dashboard/my-tasks` },
    { id: 2, nameKey: "my_agenda", icon: Calendar, color: "bg-red-500", route: `/workspace/${workspaceId}/dashboard/my-agenda` },
    { id: 3, nameKey: "my_jobs", icon: Briefcase, color: "bg-blue-500", route: `/workspace/${workspaceId}/dashboard/my-jobs` },
    { id: 4, nameKey: "my_assets", icon: Package, color: "bg-orange-500", route: `/workspace/${workspaceId}/dashboard/my-assets` },
    { id: 5, nameKey: "my_expenses", icon: Receipt, color: "bg-green-500", route: `/workspace/${workspaceId}/dashboard/my-expenses` },
    { id: 6, nameKey: "my_reports", icon: FileBarChart, color: "bg-cyan-500", route: `/workspace/${workspaceId}/dashboard/my-reports` },
  ]

  const quickActions = [
    { label: t('logExpense'), icon: Receipt, color: "text-green-600", action: () => setLogExpenseOpen(true) },
    { label: t('bookTravel'), icon: Plane, color: "text-blue-600", action: () => setBookTravelOpen(true) },
    { label: t('createTask'), icon: CheckSquare, color: "text-purple-600", action: () => setCreateTaskOpen(true) },
    { label: t('uploadFile'), icon: FolderOpen, color: "text-orange-600", action: () => setUploadFileOpen(true) },
  ]

  return (
    <main role="main" aria-label={t('title')}>
      {/* Quick Action Dialogs */}
      <LogExpenseDialog
        open={logExpenseOpen}
        onOpenChange={setLogExpenseOpen}
        workspaceId={workspaceId}
        userId={userId}
        onSuccess={handleRefresh}
      />
      <BookTravelDialog
        open={bookTravelOpen}
        onOpenChange={setBookTravelOpen}
        workspaceId={workspaceId}
        userId={userId}
        onSuccess={handleRefresh}
      />
      <CreateTaskDialog
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
        workspaceId={workspaceId}
        userId={userId}
        onSuccess={handleRefresh}
      />
      <UploadFileDialog
        open={uploadFileOpen}
        onOpenChange={setUploadFileOpen}
        workspaceId={workspaceId}
        userId={userId}
        onSuccess={handleRefresh}
      />
      <WidgetCustomizationDialog
        open={widgetCustomizationOpen}
        onOpenChange={setWidgetCustomizationOpen}
        widgets={widgets}
        onToggle={toggleWidget}
        onReset={resetToDefaults}
      />

      <div className="space-y-6">
        {/* Action Buttons - Standard Positioning */}
        <section role="region" aria-labelledby="dashboard-actions">
          <h2 id="dashboard-actions" className="sr-only">{t('description')}</h2>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {t('description')}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setWidgetCustomizationOpen(true)}
              aria-label={t('customizeLabel')}
            >
              <MoreHorizontal className="h-4 w-4 mr-2" aria-hidden="true" />
              {t('customize')}
            </Button>
          </div>
        </section>

        {/* Stats Grid */}
      <section role="region" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Dashboard Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={t(stat.labelKey)}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-xs">{t(stat.labelKey)}</CardDescription>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`} aria-hidden="true">
                    <Icon className={`h-4 w-4 ${stat.color}`} aria-hidden="true" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <CardTitle className="text-3xl">{stat.value}</CardTitle>
                  <div className="text-xs text-muted-foreground">
                    {stat.change}
                  </div>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <section role="region" aria-labelledby="quick-actions-heading">
          <Card>
            <CardHeader>
              <CardTitle id="quick-actions-heading" className="text-base">{t('quickActions')}</CardTitle>
              <CardDescription>{t('quickActionsDesc')}</CardDescription>
            </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Button
                    key={t(action.labelKey)}
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={action.action}
                    aria-label={t(action.labelKey)}
                  >
                    <Icon className={`h-5 w-5 ${action.color}`} aria-hidden="true" />
                    <span className="text-sm">{t(action.labelKey)}</span>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>
        </section>

        {/* Customize Dashboard */}
        <section role="region" aria-labelledby="customize-heading">
          <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle id="customize-heading" className="text-base">{t('customize')}</CardTitle>
                <CardDescription>{t('addWidgets')}</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setWidgetCustomizationOpen(true)}
                aria-label={t('customizeLabel')}
              >
                <MoreHorizontal className="h-4 w-4 mr-2" aria-hidden="true" />
                {t('manageAll')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {availableWidgets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <p>{t('allWidgetsEnabled')}</p>
                  <p className="text-xs mt-1">{t('checkDashboardTabs')}</p>
                </div>
              ) : (
                availableWidgets.slice(0, 3).map((widget) => {
                  const widgetType = widgetTypes.find(w => w.name === widget.name)
                  if (!widgetType) return null
                  const Icon = widgetType.icon
                  return (
                    <div
                      key={widget.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded ${widgetType.color}`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium">{t(widget.nameKey)}</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => toggleWidget(widget.id)}
                        aria-label={`Add ${t(widget.nameKey)} widget`}
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  )
                })
              )}
              {availableWidgets.length > 3 && (
                <Button 
                  variant="ghost" 
                  className="w-full text-xs"
                  onClick={() => setWidgetCustomizationOpen(true)}
                  aria-label={`View ${availableWidgets.length - 3} more widgets`}
                >
                  {tCommon('showMore')} ({availableWidgets.length - 3})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        </section>
      </div>

      {/* Activity Summary */}
      <section role="region" aria-labelledby="summary-heading">
        <Card>
          <CardHeader>
            <CardTitle id="summary-heading" className="text-base">{t('thisWeekSummary')}</CardTitle>
          </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold" aria-label="24 tasks completed">24</p>
              <p className="text-xs text-muted-foreground mt-1">{t('tasksCompleted')}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold" aria-label="12 events attended">12</p>
              <p className="text-xs text-muted-foreground mt-1">{t('eventsAttended')}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold" aria-label="$3,200 expenses submitted">$3.2k</p>
              <p className="text-xs text-muted-foreground mt-1">{t('expensesSubmitted')}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold" aria-label="18 files uploaded">18</p>
              <p className="text-xs text-muted-foreground mt-1">{t('filesUploaded')}</p>
            </div>
          </div>
        </CardContent>
        </Card>
      </section>
      </div>
    </main>
  )
}
