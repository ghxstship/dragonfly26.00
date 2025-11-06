"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
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
import { EmptyState } from "@/components/shared/empty-state"
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
  const t = useTranslations()
  const { toast } = useToast()
  const [automations, setAutomations] = useState<Automation[]>([
    {
      id: "1",
      name: t('settings.automations.dailyTaskSummary'),
      description: t('settings.automations.dailyTaskSummaryDesc'),
      trigger: t('settings.automations.everyDayAt9am'),
      action: t('settings.automations.sendEmailNotification'),
      enabled: true,
      lastRun: "2024-01-20 09:00",
      runsCount: 45,
    },
    {
      id: "2",
      name: t('settings.automations.newProjectNotifications'),
      description: t('settings.automations.newProjectNotificationsDesc'),
      trigger: t('settings.automations.whenProjectCreated'),
      action: t('settings.automations.sendSlackMessage'),
      enabled: true,
      lastRun: "2024-01-19 14:23",
      runsCount: 12,
    },
    {
      id: "3",
      name: t('settings.automations.overdueTaskReminders'),
      description: t('settings.automations.overdueTaskRemindersDesc'),
      trigger: t('settings.automations.every3Hours'),
      action: t('settings.automations.sendPushNotification'),
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
    setAutomations(automations.filter(a => (a as any).id !== id))
    toast({
      title: t('settings.toast.automationDeleted'),
      description: t('settings.toast.automationDeletedDesc'),
      variant: "destructive",
    })
  }

  const handleCreateNew = async () => {
    setSelectedAutomation(null)
    setDialogOpen(true)
  }

  const handleEdit = (automation: Automation) => {
    setSelectedAutomation(automation)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Automations List */}
      <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
        <Card>
          <CardHeader aria-hidden="true" className="pb-3">
            <CardDescription>{t('settings.automationsTab.activeAutomations')}</CardDescription>
            <CardTitle aria-hidden="true" className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">
              {automations.filter(a => a.enabled).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader aria-hidden="true" className="pb-3">
            <CardDescription>{t('settings.automationsTab.totalRuns')}</CardDescription>
            <CardTitle aria-hidden="true" className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">
              {automations.reduce((sum: number, a) => sum + a.runsCount, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader aria-hidden="true" className="pb-3">
            <CardDescription>{t('settings.automationsTab.timeSaved')}</CardDescription>
            <CardTitle aria-hidden="true" className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">12h</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Automations List */}
      <div className="space-y-3">
        {automations.map((automation: any) => (
          <Card key={automation.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-3 mb-2">
                    <CardTitle aria-hidden="true" className="text-base">{automation.name}</CardTitle>
                    <Badge variant={automation.enabled ? "default" : "secondary"}>
                      {automation.enabled ? (
                        <>
                          <Play aria-hidden="true" className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <Pause aria-hidden="true" className="h-3 w-3 mr-1" />
                          Paused
                        </>
                      )}
                    </Badge>
                  </div>
                  <CardDescription>{automation.description}</CardDescription>
                </div>
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                  <Switch
                    checked={automation.enabled}
                    onCheckedChange={() => handleToggle(automation.id)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                    <Zap aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Trigger:</span>
                    <span className="font-medium">{automation.trigger}</span>
                  </div>
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                    <MessageSquare aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Action:</span>
                    <span className="font-medium">{automation.action}</span>
                  </div>
                </div>

                {automation.lastRun && (
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-sm text-muted-foreground">
                    <Clock aria-hidden="true" className="h-4 w-4" />
                    Last run: {automation.lastRun} • {automation.runsCount} total runs
                  </div>
                )}

                <div className="flex flex-wrap justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(automation)}
                  >
                    <Settings aria-hidden="true" className="h-4 w-4 mr-2" />
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
          <CardContent aria-hidden="true" className="p-0">
            <EmptyState
              variant="inline"
              icon={Bot}
              mainMessage="NOTHING TO SEE HERE... (YET)"
              description="Create automated workflows to save time and reduce manual work"
              actionLabel="Create Automation"
              onAction={() => {}}
            />
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent aria-hidden="true" className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
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
                className="w-full px-3 py-2 border rounded-md max-w-full"
                placeholder="e.g., Daily Task Summary"
                defaultValue={selectedAutomation?.name}
               aria-label="e.g., Daily Task Summary" />
            </div>

            <div className="space-y-2">
              <Label>Trigger</Label>
              <Select defaultValue={selectedAutomation?.trigger || ""}>
                <SelectTrigger>
                  <SelectValue placeholder={t('settings.automationsTab.selectTrigger')} />
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
                  <SelectValue placeholder={t('settings.automationsTab.selectAction')} />
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

            <div className="rounded-lg bg-amber-50 dark:bg-amber-950 p-3 flex flex-wrap gap-2">
              <AlertTriangle aria-hidden="true" className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
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
                title: t('settings.toast.automationSaved'),
                description: t('settings.toast.automationSavedDesc'),
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
