"use client"

import { useAdminData } from "@/hooks/use-admin-data"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type LucideIcon } from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"
import type { OrganizationSettings } from "@/types"

export function OrganizationSettingsTab() {
  const t = useTranslations()
  const { toast } = useToast()
  const [settings, setSettings] = useState<OrganizationSettings>({
    id: "",
    organization_id: "",
    enable_multiple_assignees: true,
    enable_watchers: true,
    enable_custom_statuses: true,
    enable_dependencies: true,
    enable_recurring_tasks: true,
    enable_checklists: true,
    max_assignees_per_item: 10,
    max_watchers_per_item: 50,
    max_checklist_items: 100,
    default_assignee_behavior: "manual",
    created_at: "",
    updated_at: "",
  })

  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      // TODO: Save to Supabase
      toast({
        title: t('success.saved'),
        descriptionKey: "tadminorganizationsettingsdescription_have_been_updated_succ",
      })
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: t('admin.toast.settingsFailedDesc'),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.organizationSettings.featureControls')}</CardTitle>
          <CardDescription>
            Enable or disable features for your entire organization
          </CardDescription>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-4">
          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label>Multiple Assignees</Label>
              <p className="text-sm text-muted-foreground">
                Allow tasks to have multiple assignees
              </p>
            </div>
            <Switch
              checked={settings.enable_multiple_assignees}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, enable_multiple_assignees: checked })
              }
            />
          </div>

          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label>Watchers</Label>
              <p className="text-sm text-muted-foreground">
                Allow users to watch items for notifications
              </p>
            </div>
            <Switch
              checked={settings.enable_watchers}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, enable_watchers: checked })
              }
            />
          </div>

          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label>Custom Statuses</Label>
              <p className="text-sm text-muted-foreground">
                Create organization-wide custom statuses
              </p>
            </div>
            <Switch
              checked={settings.enable_custom_statuses}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, enable_custom_statuses: checked })
              }
            />
          </div>

          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label>Dependencies</Label>
              <p className="text-sm text-muted-foreground">
                Link tasks with dependencies and blockers
              </p>
            </div>
            <Switch
              checked={settings.enable_dependencies}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, enable_dependencies: checked })
              }
            />
          </div>

          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label>Recurring Tasks</Label>
              <p className="text-sm text-muted-foreground">
                Create tasks that repeat on a schedule
              </p>
            </div>
            <Switch
              checked={settings.enable_recurring_tasks}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, enable_recurring_tasks: checked })
              }
            />
          </div>

          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
            <div className="space-y-0.5">
              <Label>Checklists</Label>
              <p className="text-sm text-muted-foreground">
                Add checklists to tasks and projects
              </p>
            </div>
            <Switch
              checked={settings.enable_checklists}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, enable_checklists: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Limits</CardTitle>
          <CardDescription>
            Set maximum limits for various features
          </CardDescription>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-4">
          <div className="grid gap-2">
            <Label>Max Assignees per Item</Label>
            <Input
              type="number"
              value={settings.max_assignees_per_item}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  max_assignees_per_item: parseInt(e.target.value) || 0,
                })
              }
              disabled={!settings.enable_multiple_assignees}
            />
            <p className="text-sm text-muted-foreground">
              Maximum number of assignees allowed per task or project
            </p>
          </div>

          <div className="grid gap-2">
            <Label>Max Watchers per Item</Label>
            <Input
              type="number"
              value={settings.max_watchers_per_item}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  max_watchers_per_item: parseInt(e.target.value) || 0,
                })
              }
              disabled={!settings.enable_watchers}
            />
            <p className="text-sm text-muted-foreground">
              Maximum number of watchers allowed per item
            </p>
          </div>

          <div className="grid gap-2">
            <Label>Max Checklist Items</Label>
            <Input
              type="number"
              value={settings.max_checklist_items}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  max_checklist_items: parseInt(e.target.value) || 0,
                })
              }
              disabled={!settings.enable_checklists}
            />
            <p className="text-sm text-muted-foreground">
              Maximum number of items in a checklist
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Defaults */}
      <Card>
        <CardHeader>
          <CardTitle>Default Behaviors</CardTitle>
          <CardDescription>
            Configure default behaviors for your organization
          </CardDescription>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-4">
          <div className="grid gap-2">
            <Label>Default Assignee Behavior</Label>
            <Select
              value={settings.default_assignee_behavior}
              onValueChange={(value: any) =>
                setSettings({ ...settings, default_assignee_behavior: value as any })
              }
              disabled={!settings.enable_multiple_assignees}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual Assignment</SelectItem>
                <SelectItem value="round_robin">Round Robin</SelectItem>
                <SelectItem value="least_busy">Assign to Least Busy</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              How tasks are assigned by default when created
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex flex-wrap justify-end">
        <Button onClick={handleSave} disabled={loading} aria-label="Save organization settings">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
