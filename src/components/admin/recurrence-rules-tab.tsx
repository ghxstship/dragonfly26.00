"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
  Repeat, 
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock
} from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"

interface RecurrenceRule {
  id: string
  name?: string
  nameKey?: string
  pattern: string
  description?: string
  descriptionKey?: string
  usageCount: number
  createdAt: string
}

export function RecurrenceRulesTab() {
  const t = useTranslations()
  const { toast } = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState<RecurrenceRule | null>(null)

  const [rules, setRules] = useState<RecurrenceRule[]>([
    {
      id: "1",
      nameKey: "weekly_team_meeting",
      pattern: "Every Monday at 10:00 AM",
      description: t('admin.mockData.rule1Desc'),
      usageCount: 24,
      createdAt: "2023-12-01",
    },
    {
      id: "2",
      nameKey: "monthly_allhands",
      pattern: "First Friday of every month at 2:00 PM",
      description: t('admin.mockData.rule2Desc'),
      usageCount: 12,
      createdAt: "2023-11-15",
    },
    {
      id: "3",
      nameKey: "quarterly_reviews",
      pattern: "Last day of quarter at 3:00 PM",
      description: t('admin.mockData.rule3Desc'),
      usageCount: 4,
      createdAt: "2023-10-01",
    },
    {
      id: "4",
      nameKey: "daily_standup",
      pattern: "Every weekday at 9:30 AM",
      description: t('admin.mockData.rule4Desc'),
      usageCount: 156,
      createdAt: "2024-01-02",
    },
  ])

  const handleCreateRule = async () => {
    setSelectedRule(null)
    setDialogOpen(true)
  }

  const handleEditRule = (rule: RecurrenceRule) => {
    setSelectedRule(rule)
    setDialogOpen(true)
  }

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter(r => (r as any).id !== ruleId))
    toast({
      title: t('admin.toast.ruleDeleted'),
      description: t('admin.toast.ruleDeletedDesc'),
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
        <Card>
          <CardHeader aria-hidden="true" className="pb-3">
            <CardDescription>Total Rules</CardDescription>
            <CardTitle aria-hidden="true" className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">{rules.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader aria-hidden="true" className="pb-3">
            <CardDescription>Total Usage</CardDescription>
            <CardTitle aria-hidden="true" className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">
              {rules.reduce((sum: number, r) => sum + r.usageCount, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader aria-hidden="true" className="pb-3">
            <CardDescription>Most Used</CardDescription>
            <CardTitle aria-hidden="true" className="text-lg">
              {rules.reduce((prev: RecurrenceRule, curr: RecurrenceRule) => 
                curr.usageCount > prev.usageCount ? curr : prev
              ).name}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Rules List */}
      <div className="space-y-3">
        {rules.map((rule: any) => (
          <Card key={rule.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-3 mb-2">
                    <CardTitle aria-hidden="true" className="text-base">{(rule.nameKey ? t(rule.nameKey) : rule.name)}</CardTitle>
                    <Badge variant="outline">
                      <Clock aria-hidden="true" className="h-3 w-3 mr-1" />
                      {rule.usageCount} uses
                    </Badge>
                  </div>
                  <CardDescription>{(rule.descriptionKey ? t(rule.descriptionKey) : rule.description || "")}</CardDescription>
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 mt-2 text-sm">
                    <Calendar aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{rule.pattern}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Created {new Date(rule.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditRule(rule)}
                  >
                    <Edit aria-hidden="true" className="h-4 w-4 mr-2" />
                    {t('common.edit')}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteRule(rule.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
                    {t('common.delete')}
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedRule ? "Edit Recurrence Rule" : "Create New Rule"}
            </DialogTitle>
            <DialogDescription>
              Define a reusable recurrence pattern
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Rule Name</Label>
              <Input
                placeholder="e.g., Weekly Team Meeting"
                defaultValue={selectedRule?.name}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder={t('admin.recurrenceRules.descriptionPlaceholder')}
                defaultValue={selectedRule?.description}
              />
            </div>

            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select defaultValue="weekly">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
              <div className="space-y-2">
                <Label>Day</Label>
                <Select defaultValue="monday">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="tuesday">Tuesday</SelectItem>
                    <SelectItem value="wednesday">Wednesday</SelectItem>
                    <SelectItem value="thursday">Thursday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                    <SelectItem value="saturday">Saturday</SelectItem>
                    <SelectItem value="sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Time</Label>
                <Input type="time" defaultValue="10:00" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: t('admin.toast.ruleSaved'),
                  description: t('admin.toast.ruleSavedDesc'),
                })
                setDialogOpen(false)
              }}
            >
              {selectedRule ? "Save Changes" : "Create Rule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
