"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Check, ChevronsUpDown, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/ui-store"
import { useWorkspaceStore } from "@/store/workspace-store"

export function WorkspaceSwitcher() {
  const t = useTranslations()
  const [searchQuery, setSearchQuery] = useState("")
  const { currentWorkspace, setCurrentWorkspace } = useUIStore()
  const { workspaces, currentOrganization } = useWorkspaceStore()

  const filteredWorkspaces = workspaces.filter((ws) =>
    ws.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 px-3">
          {currentWorkspace ? (
            <>
              {currentWorkspace.icon && (
                <span className="text-lg">{currentWorkspace.icon}</span>
              )}
              <span className="font-semibold">{currentWorkspace.name}</span>
            </>
          ) : (
            <span className="text-muted-foreground">{t('workspace.selectWorkspace')}</span>
          )}
          <ChevronsUpDown className="ml-1 h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80">
        <DropdownMenuLabel>
          {currentOrganization?.name || t('workspace.organization')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Search */}
        <div className="p-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('workspace.searchWorkspaces')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Workspace List */}
        <div className="max-h-64 overflow-y-auto">
          {filteredWorkspaces.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              onClick={() => setCurrentWorkspace(workspace)}
              className="flex items-center gap-2"
            >
              {workspace.icon && (
                <span className="text-base">{workspace.icon}</span>
              )}
              {!workspace.icon && (
                <div
                  className="h-6 w-6 rounded flex items-center justify-center text-xs font-semibold"
                  style={{ backgroundColor: workspace.color || '#7c3aed' }}
                >
                  {workspace.name[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <div className="font-medium">{workspace.name}</div>
                {workspace.description && (
                  <div className="text-xs text-muted-foreground">
                    {workspace.description}
                  </div>
                )}
              </div>
              {currentWorkspace?.id === workspace.id && (
                <Check className="h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2">
          <Plus className="h-4 w-4" />
          <span>{t('workspace.createWorkspace')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
