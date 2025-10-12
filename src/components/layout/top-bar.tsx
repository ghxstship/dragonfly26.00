"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  Search,
  Plus,
  Bell,
  ChevronDown,
  Sparkles,
  Wifi,
  WifiOff,
  Activity,
  Maximize2,
  Plane,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { WorkspaceSwitcher } from "./workspace-switcher"
import { CommandPalette } from "./command-palette"
import { NotificationsPanel } from "./notifications-panel"
import { BreadcrumbNav } from "./breadcrumb-nav"
import { QuickActions } from "./quick-actions"
import { ThemeToggle } from "./theme-toggle"
import { LanguageSwitcher } from "./language-switcher"
import { CreateMenu } from "./create-menu"
import { CreateItemDialogEnhanced } from "@/components/shared/create-item-dialog-enhanced"
import { CreateObjectiveDialog } from "@/components/insights/create-objective-dialog"
import { CreateWebhookDialog } from "@/components/webhooks/create-webhook-dialog"
import { CreateTokenDialog } from "@/components/api-tokens/create-token-dialog"
import { getInitials, cn } from "@/lib/utils"
import { useUIStore } from "@/store/ui-store"
import { useWorkspaceStore } from "@/store/workspace-store"
import { ItemType, getModuleTabForItemType } from "@/lib/modules/item-type-to-module-mapper"

export function TopBar() {
  const t = useTranslations()
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [createDialogType, setCreateDialogType] = useState<ItemType>("task")
  const [createObjectiveOpen, setCreateObjectiveOpen] = useState(false)
  const [createWebhookOpen, setCreateWebhookOpen] = useState(false)
  const [createTokenOpen, setCreateTokenOpen] = useState(false)
  const { currentWorkspace, focusMode, toggleFocusMode, airplaneMode, toggleAirplaneMode } = useUIStore()
  const { currentOrganization } = useWorkspaceStore()
  const router = useRouter()
  
  // Extract locale from pathname
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'

  // Simulate unread notifications count
  const unreadCount = 3

  // Monitor online/offline status and sync with airplane mode
  useEffect(() => {
    const handleOnline = () => {
      if (!airplaneMode) {
        setIsOnline(true)
      }
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Set initial online status based on airplane mode
    setIsOnline(navigator.onLine && !airplaneMode)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [airplaneMode])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus mode: F key
      if (e.key === 'f' && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        const target = e.target as HTMLElement
        // Don't trigger if user is typing in an input
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault()
          toggleFocusMode()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toggleFocusMode])

  const handleCreateItem = (type: ItemType) => {
    setCreateDialogType(type)
    setCreateDialogOpen(true)
  }

  const handleCreateObjective = () => {
    setCreateObjectiveOpen(true)
  }

  const handleCreateWebhook = () => {
    setCreateWebhookOpen(true)
  }

  const handleCreateToken = () => {
    setCreateTokenOpen(true)
  }

  return (
    <TooltipProvider delayDuration={300}>
      <header className="sticky top-0 z-50 flex h-14 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
        {/* Left Section: Logo + Workspace + Breadcrumbs */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* App Logo/Icon */}
          <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary text-primary-foreground font-bold text-sm flex-shrink-0">
            DF
          </div>

          {/* Workspace Switcher */}
          <WorkspaceSwitcher />

          {/* Breadcrumb Navigation */}
          <div className="hidden lg:block h-6 w-px bg-border mx-1" />
          <BreadcrumbNav />
        </div>

        {/* Center Section: Search */}
        <div className="flex items-center justify-center flex-1 max-w-2xl mx-4">
          <Button
            variant="outline"
            className="w-full max-w-md h-9 justify-start text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowCommandPalette(true)}
          >
            <Search className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline">{t('common.searchAnything')}</span>
            <span className="sm:hidden">{t('common.search')}</span>
            <div className="ml-auto flex items-center gap-1">
              <kbd className="hidden md:inline-flex pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </Button>
        </div>

        {/* Right Section: Actions + Status + User */}
        <div className="flex items-center gap-1 flex-1 justify-end">
          {/* Status Indicators */}
          <div className="hidden xl:flex items-center gap-2 mr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs">
                  {isOnline ? (
                    <>
                      <Wifi className="h-3.5 w-3.5 text-green-500" />
                      <span className="text-muted-foreground">{t('common.synced')}</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3.5 w-3.5 text-destructive" />
                      <span className="text-muted-foreground">{t('common.offline')}</span>
                    </>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isOnline ? t('status.allChangesSynced') : t('status.workingOffline')}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Airplane Mode Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={airplaneMode ? "secondary" : "ghost"}
                size="icon"
                className="h-9 w-9 hidden lg:flex"
                onClick={() => {
                  toggleAirplaneMode()
                  setIsOnline(!airplaneMode && navigator.onLine)
                }}
              >
                <Plane className={cn(
                  "h-4 w-4",
                  airplaneMode && "text-orange-500"
                )} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{airplaneMode ? t('status.airplaneModeOn') : t('status.airplaneModeOff')}</p>
            </TooltipContent>
          </Tooltip>

          {/* Quick Actions Toolbar */}
          <QuickActions />

          {/* Divider */}
          <div className="hidden md:block h-6 w-px bg-border mx-1" />

          {/* Create Menu */}
          <CreateMenu
            onCreateItem={handleCreateItem}
            onCreateObjective={handleCreateObjective}
            onCreateWebhook={handleCreateWebhook}
            onCreateToken={handleCreateToken}
          />

          {/* Upgrade Button (for non-enterprise) */}
          {currentOrganization?.subscription_tier !== "enterprise" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 h-9 hidden md:flex"
                  onClick={() => router.push(`/${locale}/workspace/${currentWorkspace?.id}/admin/billing`)}
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden lg:inline">{t('nav.upgrade')}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('nav.upgradeToPro')}</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Notifications */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9"
                onClick={() => setShowNotifications(true)}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <>
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-[10px]"
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('nav.notifications')}</p>
              {unreadCount > 0 && (
                <span className="ml-2 text-xs">({unreadCount} new)</span>
              )}
            </TooltipContent>
          </Tooltip>

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Focus Mode Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={focusMode ? "secondary" : "ghost"}
                size="icon"
                className="h-9 w-9 hidden lg:flex"
                onClick={toggleFocusMode}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{focusMode ? t('status.focusModeOn') : t('status.focusModeOff')}</p>
              <kbd className="ml-2 inline-flex items-center gap-0.5 font-mono text-[11px] opacity-70">F</kbd>
            </TooltipContent>
          </Tooltip>

          {/* User Menu */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-2 h-9">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback className="text-xs">
                        {getInitials("Current User")}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('nav.account')}</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">Current User</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    user@example.com
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => router.push(`/${locale}/workspace/${currentWorkspace?.id}/profile/basic-info`)}>
                  {t('nav.profile')}
                  <kbd className="ml-auto inline-flex items-center gap-0.5 font-mono text-[11px] text-muted-foreground opacity-70">⌘P</kbd>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/${locale}/workspace/${currentWorkspace?.id}/settings/appearance`)}>
                  {t('nav.settings')}
                  <kbd className="ml-auto inline-flex items-center gap-0.5 font-mono text-[11px] text-muted-foreground opacity-70">⌘,</kbd>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowCommandPalette(true)}>
                  {t('nav.keyboardShortcuts')}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => router.push(`/${locale}/workspace/${currentWorkspace?.id}/admin/billing`)}>
                  {t('nav.billing')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/${locale}/workspace/${currentWorkspace?.id}/admin/members`)}>
                  {t('nav.team')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/${locale}/workspace/${currentWorkspace?.id}/admin/members`)}>
                  {t('nav.inviteUsers')}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => {
                  // TODO: Implement logout logic
                  console.log("Logging out...")
                  router.push('/login')
                }}
              >
                {t('nav.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Command Palette */}
      <CommandPalette
        open={showCommandPalette}
        onOpenChange={setShowCommandPalette}
        onCreateItem={handleCreateItem}
      />

      {/* Notifications Panel */}
      <NotificationsPanel
        open={showNotifications}
        onOpenChange={setShowNotifications}
      />

      {/* Create Item Dialog */}
      <CreateItemDialogEnhanced
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        moduleId={getModuleTabForItemType(createDialogType).moduleId}
        tabSlug={getModuleTabForItemType(createDialogType).tabSlug}
        onSuccess={(item) => {
          console.log("Created item:", item)
          // TODO: Add to data store and redirect if needed
        }}
      />

      {/* Create Objective Dialog */}
      <CreateObjectiveDialog
        open={createObjectiveOpen}
        onOpenChange={setCreateObjectiveOpen}
        onCreateGoal={(objective) => {
          console.log("Created objective:", objective)
          setCreateObjectiveOpen(false)
        }}
      />

      {/* Create Webhook Dialog */}
      <CreateWebhookDialog
        open={createWebhookOpen}
        onOpenChange={setCreateWebhookOpen}
      />

      {/* Create API Token Dialog */}
      <CreateTokenDialog
        open={createTokenOpen}
        onOpenChange={setCreateTokenOpen}
      />
    </TooltipProvider>
  )
}
