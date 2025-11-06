"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Plus, GripVertical, MoreHorizontal, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { CustomStatus } from "@/types"

export function CustomStatusesTab() {
  const t = useTranslations()
  
  const STATUS_COLORS = [
    { name: t('admin.mockData.colorSlate'), value: "#94a3b8" },
    { name: t('admin.mockData.colorRed'), value: "#ef4444" },
    { name: t('admin.mockData.colorOrange'), value: "#f97316" },
    { name: t('admin.mockData.colorYellow'), value: "#eab308" },
    { name: t('admin.mockData.colorGreen'), value: "#22c55e" },
    { name: t('admin.mockData.colorBlue'), value: "#3b82f6" },
    { name: t('admin.mockData.colorPurple'), value: "#a855f7" },
    { name: t('admin.mockData.colorPink'), value: "#ec4899" },
  ]
  const [statuses, setStatuses] = useState<CustomStatus[]>([
    {
      id: "1",
      organization_id: "org-1",
      name: t('admin.mockData.statusTodo'),
      color: "#94a3b8",
      type: "open",
      order: 0,
      is_default: true,
      created_at: "",
      updated_at: "",
    },
    {
      id: "2",
      organization_id: "org-1",
      name: t('statuses.inProgress'),
      color: "#3b82f6",
      type: "in_progress",
      order: 1,
      is_default: false,
      created_at: "",
      updated_at: "",
    },
    {
      id: "3",
      organization_id: "org-1",
      name: t('admin.mockData.statusDone'),
      color: "#22c55e",
      type: "closed",
      order: 2,
      is_default: false,
      created_at: "",
      updated_at: "",
    },
  ])

  const [isCreating, setIsCreating] = useState(false)
  const [newStatus, setNewStatus] = useState<Partial<CustomStatus>>({
    name: "",
    color: "#94a3b8",
    type: "custom",
  })

  const handleCreateStatus = async () => {
    const status: CustomStatus = {
      id: `status-${Date.now()}`,
      organization_id: "org-1",
      name: newStatus.name || "{t('admin.customStatuses.newStatus')}",
      color: newStatus.color || "#94a3b8",
      type: newStatus.type as any || "custom",
      order: statuses.length,
      is_default: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    setStatuses([...statuses, status])
    setNewStatus({ name: "", color: "#94a3b8", type: "custom" })
    setIsCreating(false)
  }

  const deleteStatus = (id: string) => {
    setStatuses(statuses.filter((s: any) => (s as any).id !== id))
  }

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
            <div>
              <CardTitle>Custom Statuses</CardTitle>
              <CardDescription>
                Create organization-wide statuses for all modules
              </CardDescription>
            </div>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button aria-hidden="true" className="gap-2" aria-label="Add new custom status">
                  <Plus aria-hidden="true" className="h-4 w-4" />
                  Add Status
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Custom Status</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Status Name</Label>
                    <Input
                      placeholder="e.g., In Review, Blocked"
                      value={newStatus.name}
                      onChange={(e) => setNewStatus({ ...newStatus, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:grid-cols-3 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2">
                      {STATUS_COLORS.map((color: any) => (
                        <button
                          key={color.value}
                          className={`h-10 rounded-md border-2 ${
                            newStatus.color === color.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-transparent"
                          }`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => setNewStatus({ ...newStatus, color: color.value })}
                          aria-label={`Select ${color.name} color`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Status Type</Label>
                    <Select
                      value={newStatus.type}
                      onValueChange={(value: any) => setNewStatus({ ...newStatus, type: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open (Not started)</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="closed">Closed (Complete)</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => setIsCreating(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleCreateStatus} className="flex-1">
                      Create Status
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {statuses.map((status: any) => (
              <div
                key={status.id}
                className="flex flex-col md:flex-row items-center gap-3 p-3 border rounded-lg hover:bg-accent/50"
              >
                <GripVertical aria-hidden="true" className="h-4 w-4 text-muted-foreground cursor-grab" />
                
                <div
                  className="h-3 w-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: status.color }}
                />
                
                <div className="flex-1">
                  <div className="font-medium">{status.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {status.type.replace(/_/g, " ")}
                    {status.is_default && " • Default"}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Status actions">
                      <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    {!status.is_default && (
                      <DropdownMenuItem aria-hidden="true" className="text-destructive"
                        onClick={() => deleteStatus(status.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status Usage</CardTitle>
          <CardDescription>
            See where these statuses are being used
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Custom statuses are available across all modules in your organization.
            Changes apply organization-wide.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
