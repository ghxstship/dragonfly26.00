"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Bot, 
  Plus, 
  Trash2, 
  Settings, 
  Play,
  Pause,
  Zap,
  Mail,
  MessageSquare,
  Calendar,
  Clock,
  AlertTriangle
} from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"

interface Automation {
  id: string
  name: string
  description: string
  trigger: string
  action: string
  enabled: boolean
  lastRun?: string
  runsCount: number
}

export function AutomationsTab() {
  const { toast } = useToast()
  const [automations, setAutomations] = useState<Automation[]>([
    {
      id: "1",
      name: "Daily Task Summary",
      description: "Send an email summary of tasks due today",
      trigger: "Every day at 9:00 AM",
      action: "Send email notification",
      enabled: true,
      lastRun: "2024-01-20 09:00",
      runsCount: 45,
    },
    {
      id: "2",
      name: "New Project Notifications",
      description: "Notify team when a new project is created",
      trigger: "When project is created",
      action: "Send Slack message",
      enabled: true,
      lastRun: "2024-01-19 14:23",
      runsCount: 12,
    },
    {
      id: "3",
      name: "Overdue Task Reminders",
      description: "Send reminders for overdue tasks",
      trigger: "Every 3 hours",
      action: "Send push notification",
      enabled: false,
      runsCount: 0,
    },
  ])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null)

  const handleToggle = (id: string) => {
    setAutomations(automations.map(a => 
      a.id === id ? { ...a, enabled: !a.enabled } : a
    ))
    const automation = automations.find(a => a.id === id)
    toast({
      title: automation?.enabled ? "Automation disabled" : "Automation enabled",
      description: `${automation?.name} has been ${automation?.enabled ? "disabled" : "enabled"}.`,
    })
  }

  const handleDelete = (id: string) => {
    setAutomations(automations.filter(a => a.id !== id))
    toast({
      title: "Automation deleted",
      description: "The automation has been removed.",
      variant: "destructive",
    })
  }

  const handleCreateNew = () => {
    setSelectedAutomation(null)
    setDialogOpen(true)
  }

  const handleEdit = (automation: Automation) => {
    setSelectedAutomation(automation)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Automations
              </CardTitle>
              <CardDescription className="mt-2">
                Automate repetitive tasks and workflows to save time and increase productivity
              </CardDescription>
            </div>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              New Automation
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Automations</CardDescription>
            <CardTitle className="text-3xl">
              {automations.filter(a => a.enabled).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Runs (This Month)</CardDescription>
            <CardTitle className="text-3xl">
              {automations.reduce((sum, a) => sum + a.runsCount, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Time Saved (Estimated)</CardDescription>
            <CardTitle className="text-3xl">12h</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Automations List */}
      <div className="space-y-3">
        {automations.map((automation) => (
          <Card key={automation.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-base">{automation.name}</CardTitle>
                    <Badge variant={automation.enabled ? "default" : "secondary"}>
                      {automation.enabled ? (
                        <>
                          <Play className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <Pause className="h-3 w-3 mr-1" />
                          Paused
                        </>
                      )}
                    </Badge>
                  </div>
                  <CardDescription>{automation.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={automation.enabled}
                    onCheckedChange={() => handleToggle(automation.id)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Trigger:</span>
                    <span className="font-medium">{automation.trigger}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Action:</span>
                    <span className="font-medium">{automation.action}</span>
                  </div>
                </div>

                {automation.lastRun && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Last run: {automation.lastRun} • {automation.runsCount} total runs
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(automation)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(automation.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {automations.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bot className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No automations yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first automation to start saving time
            </p>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Create Automation
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {selectedAutomation ? "Edit Automation" : "Create New Automation"}
            </DialogTitle>
            <DialogDescription>
              Set up triggers and actions to automate your workflow
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Automation Name</Label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., Daily Task Summary"
                defaultValue={selectedAutomation?.name}
              />
            </div>

            <div className="space-y-2">
              <Label>Trigger</Label>
              <Select defaultValue={selectedAutomation?.trigger || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="schedule">On a schedule</SelectItem>
                  <SelectItem value="project_created">When project is created</SelectItem>
                  <SelectItem value="task_completed">When task is completed</SelectItem>
                  <SelectItem value="task_overdue">When task becomes overdue</SelectItem>
                  <SelectItem value="member_added">When member is added</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Action</Label>
              <Select defaultValue={selectedAutomation?.action || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Send email notification</SelectItem>
                  <SelectItem value="slack">Send Slack message</SelectItem>
                  <SelectItem value="push">Send push notification</SelectItem>
                  <SelectItem value="webhook">Trigger webhook</SelectItem>
                  <SelectItem value="create_task">Create a task</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-amber-50 dark:bg-amber-950 p-3 flex gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Automations will run automatically based on your trigger settings. Make sure to test
                before enabling.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "Automation saved",
                description: "Your automation has been configured successfully.",
              })
              setDialogOpen(false)
            }}>
              {selectedAutomation ? "Save Changes" : "Create Automation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
