"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Plus, Star, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  CREATE_ACTIONS,
  DEFAULT_FAVORITE_ACTIONS,
  type CreateAction,
} from "@/lib/create-actions-registry"
import {
  FolderKanban,
  Briefcase,
  CheckSquare,
  Package,
  MapPin,
  FileText,
  BarChart3,
  Target,
  Key,
  Webhook,
  Bot,
  ListChecks,
  Palette,
  LayoutList,
  UserPlus,
  Building2,
  Calendar,
  Globe,
} from "lucide-react"
import type { ItemType } from "@/lib/modules/item-type-to-module-mapper"

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FolderKanban,
  Briefcase,
  CheckSquare,
  Package,
  MapPin,
  FileText,
  BarChart3,
  Target,
  Key,
  Webhook,
  Bot,
  ListChecks,
  Palette,
  LayoutList,
  UserPlus,
  Building2,
  Calendar,
  Globe,
}

interface CreateMenuProps {
  onCreateItem: (type: ItemType) => void
  onCreateObjective?: () => void
  onCreateWebhook?: () => void
  onCreateToken?: () => void
  onCreateAutomation?: () => void
  onCreateTemplate?: () => void
  onCreateStatus?: () => void
}

export function CreateMenu({
  onCreateItem,
  onCreateObjective,
  onCreateWebhook,
  onCreateToken,
  onCreateAutomation,
  onCreateTemplate,
  onCreateStatus,
}: CreateMenuProps) {
  const t = useTranslations()
  const [favoriteActions, setFavoriteActions] = useState<string[]>(DEFAULT_FAVORITE_ACTIONS)
  const [searchQuery, setSearchQuery] = useState("")
  const [open, setOpen] = useState(false)

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('create-favorites')
    if (saved) {
      try {
        setFavoriteActions(JSON.parse(saved))
      } catch (e: any) {
        console.error('Failed to load favorites', e)
      }
    }
  }, [])

  // Save favorites to localStorage
  const toggleFavorite = (actionId: string) => {
    const newFavorites = favoriteActions.includes(actionId)
      ? favoriteActions.filter((id: any) => id !== actionId)
      : [...favoriteActions, actionId]
    
    setFavoriteActions(newFavorites)
    localStorage.setItem('create-favorites', JSON.stringify(newFavorites))
  }

  // Filter actions based on search query
  const filteredActions = CREATE_ACTIONS.filter((action: any) => action.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    action.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const groupedActions = {
    core: filteredActions.filter((a: any) => a.category === 'core'),
    advanced: filteredActions.filter((a: any) => a.category === 'advanced'),
    admin: filteredActions.filter((a: any) => a.category === 'admin'),
  }

  const filteredFavoriteActions = favoriteActions
    .map((id: any) => CREATE_ACTIONS.find((a: any) => a.id === id))
    .filter((action): action is CreateAction => {
      if (!action) return false
      return (
        action.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })

  const handleActionClick = (action: CreateAction) => {
    setOpen(false)
    setSearchQuery("")

    switch (action.dialogType) {
      case 'item':
        if (action.itemType) {
          onCreateItem(action.itemType as ItemType)
        }
        break
      case 'objective':
        onCreateObjective?.()
        break
      case 'webhook':
        onCreateWebhook?.()
        break
      case 'token':
        onCreateToken?.()
        break
      case 'automation':
        onCreateAutomation?.()
        break
      case 'template':
        onCreateTemplate?.()
        break
      case 'status':
        onCreateStatus?.()
        break
    }
  }

  const renderActionItem = (action: CreateAction, showFavorite = false) => {
    const Icon = iconMap[action.icon] || Plus
    const isFavorite = favoriteActions.includes(action.id)

    return (
      <DropdownMenuItem
        key={action.id}
        onClick={() => handleActionClick(action)}
        className="gap-2 cursor-pointer"
      >
        <Icon className="h-4 w-4" />
        <span className="flex-1">{action.name}</span>
        {action.keyboard_shortcut && (
          <kbd className="inline-flex items-center gap-0.5 font-mono text-[11px] text-muted-foreground opacity-70">{action.keyboard_shortcut}</kbd>
        )}
        {showFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(action.id)
            }}
            className="ml-1"
          >
            <Star
              className={`h-3.5 w-3.5 ${
                isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
              }`}
            />
          </button>
        )}
      </DropdownMenuItem>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-2 h-9">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t('common.new')}</span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create new</p>
          <kbd className="ml-2 inline-flex items-center gap-0.5 font-mono text-[11px] opacity-70">⌘N</kbd>
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="end" className="w-80 p-0">
        {/* Search Header */}
        <div className="p-2 border-b sticky top-0 bg-background z-10">
          <DropdownMenuLabel className="px-2 py-1.5">
            {t('create.createNew')}
          </DropdownMenuLabel>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search.searchActions')}
              value={searchQuery as any}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        <div className="max-h-[480px] overflow-y-auto">
          <div className="p-2">
            {/* Favorites */}
            {filteredFavoriteActions.length > 0 && (
              <>
                <DropdownMenuLabel className="text-xs text-muted-foreground px-2">
                  {t('common.favorites')}
                </DropdownMenuLabel>
                {filteredFavoriteActions.map((action: any) => renderActionItem(action, true))}
                <DropdownMenuSeparator />
              </>
            )}

            {/* Core Actions */}
            {groupedActions.core.length > 0 && (
              <>
                <DropdownMenuLabel className="text-xs text-muted-foreground px-2">
                  {t('create.coreItems')}
                </DropdownMenuLabel>
                {groupedActions.core.map((action: any) => renderActionItem(action, true))}
              </>
            )}

            {/* Advanced Actions */}
            {groupedActions.advanced.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground px-2">
                  {t('create.advancedItems')}
                </DropdownMenuLabel>
                {groupedActions.advanced.map((action: any) => renderActionItem(action, true))}
              </>
            )}

            {/* Admin Actions */}
            {groupedActions.admin.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground px-2">
                  {t('create.adminConfig')}
                </DropdownMenuLabel>
                {groupedActions.admin.map((action: any) => renderActionItem(action, true))}
              </>
            )}

            {/* No results message */}
            {filteredActions.length === 0 && (
              <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                {t('search.noResultsFound')}
              </div>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
