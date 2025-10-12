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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/ui-store"
import { useWorkspaceStore } from "@/store/workspace-store"

export function WorkspaceSwitcher() {
  const t = useTranslations()
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#7c3aed",
    icon: ""
  })
  const { currentWorkspace, setCurrentWorkspace } = useUIStore()
  const { workspaces, currentOrganization, addWorkspace } = useWorkspaceStore()

  const filteredWorkspaces = workspaces.filter((ws) =>
    ws.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      return
    }

    setIsCreating(true)
    
    try {
      // Create new workspace object
      const newWorkspace = {
        id: `ws-${Date.now()}`, // In production, this would come from the backend
        organization_id: currentOrganization?.id || "",
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color,
        icon: formData.icon || undefined,
        is_default: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Add to store
      addWorkspace(newWorkspace)
      
      // Set as current workspace
      setCurrentWorkspace(newWorkspace)

      // Reset form and close dialog
      setFormData({
        name: "",
        description: "",
        color: "#7c3aed",
        icon: ""
      })
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error("Error creating workspace:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const colors = [
    "#7c3aed", // purple
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#ec4899", // pink
    "#8b5cf6", // violet
    "#06b6d4", // cyan
  ]

  const commonEmojis = [
    "🚀", "💼", "🎯", "⚡", "🌟", "💡", "🔥", "🎨",
    "📊", "🏢", "🎭", "🎬", "🎪", "🎤", "🎸", "🎹"
  ]

  return (
    <>
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
      <DropdownMenuContent align="start" className="w-80 p-0">
        <div className="p-2 border-b sticky top-0 bg-background z-10">
          <DropdownMenuLabel className="px-2 py-1.5">
            {currentOrganization?.name || t('workspace.organization')}
          </DropdownMenuLabel>
          
          {/* Search */}
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('workspace.searchWorkspaces')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9"
            />
          </div>
        </div>

        {/* Workspace List */}
        <div className="max-h-[320px] overflow-y-auto p-1">
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
          
          {filteredWorkspaces.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No workspaces found
            </div>
          )}
        </div>

        <div className="p-1 border-t">
          <DropdownMenuItem 
            className="gap-2"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>{t('workspace.createWorkspace')}</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>

    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleCreateWorkspace}>
          <DialogHeader>
            <DialogTitle>{t('quickActions.createWorkspace')}</DialogTitle>
            <DialogDescription>
              {t('quickActions.createNewWorkspace')}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Name Field */}
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-medium">
                {t('common.name')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Marketing Team, Design Studio"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full"
              />
            </div>

            {/* Description Field */}
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm font-medium">
                {t('common.description')}
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the purpose of this workspace..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full resize-none"
              />
            </div>

            {/* Icon Picker */}
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Icon (Optional)</Label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: "" })}
                  className={cn(
                    "h-10 w-10 rounded border-2 flex items-center justify-center text-sm transition-all hover:scale-105",
                    !formData.icon ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  )}
                >
                  —
                </button>
                {commonEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: emoji })}
                    className={cn(
                      "h-10 w-10 rounded border-2 flex items-center justify-center text-lg transition-all hover:scale-105",
                      formData.icon === emoji ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Picker */}
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Color</Label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={cn(
                      "h-10 w-10 rounded-full border-2 transition-all hover:scale-110",
                      formData.color === color ? "border-foreground ring-2 ring-offset-2 ring-foreground/20" : "border-border"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="grid gap-2 pt-2">
              <Label className="text-sm font-medium">Preview</Label>
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
                {formData.icon ? (
                  <span className="text-2xl">{formData.icon}</span>
                ) : (
                  <div
                    className="h-10 w-10 rounded flex items-center justify-center text-sm font-semibold text-white"
                    style={{ backgroundColor: formData.color }}
                  >
                    {formData.name ? formData.name[0].toUpperCase() : "W"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {formData.name || "Workspace Name"}
                  </div>
                  {formData.description && (
                    <div className="text-xs text-muted-foreground truncate">
                      {formData.description}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              disabled={isCreating}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={!formData.name.trim() || isCreating}>
              {isCreating ? t('common.loading') : t('common.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </>
  )
}
