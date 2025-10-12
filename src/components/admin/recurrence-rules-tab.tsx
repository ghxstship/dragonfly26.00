"use client"

import { useState } from "react"
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
  name: string
  pattern: string
  description: string
  usageCount: number
  createdAt: string
}

export function RecurrenceRulesTab() {
  const { toast } = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState<RecurrenceRule | null>(null)

  const [rules, setRules] = useState<RecurrenceRule[]>([
    {
      id: "1",
      name: "Weekly Team Meeting",
      pattern: "Every Monday at 10:00 AM",
      description: "Standard weekly team sync",
      usageCount: 24,
      createdAt: "2023-12-01",
    },
    {
      id: "2",
      name: "Monthly All-Hands",
      pattern: "First Friday of every month at 2:00 PM",
      description: "Company-wide monthly meeting",
      usageCount: 12,
      createdAt: "2023-11-15",
    },
    {
      id: "3",
      name: "Quarterly Reviews",
      pattern: "Last day of quarter at 3:00 PM",
      description: "End of quarter performance reviews",
      usageCount: 4,
      createdAt: "2023-10-01",
    },
    {
      id: "4",
      name: "Daily Stand-up",
      pattern: "Every weekday at 9:30 AM",
      description: "Daily team check-in",
      usageCount: 156,
      createdAt: "2024-01-02",
    },
  ])

  const handleCreateRule = () => {
    setSelectedRule(null)
    setDialogOpen(true)
  }

  const handleEditRule = (rule: RecurrenceRule) => {
    setSelectedRule(rule)
    setDialogOpen(true)
  }

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter(r => r.id !== ruleId))
    toast({
      title: "Rule deleted",
      description: "The recurrence rule has been removed.",
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleCreateRule}>
          <Plus className="h-4 w-4 mr-2" />
          New Rule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Rules</CardDescription>
            <CardTitle className="text-3xl">{rules.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Usage</CardDescription>
            <CardTitle className="text-3xl">
              {rules.reduce((sum, r) => sum + r.usageCount, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Most Used</CardDescription>
            <CardTitle className="text-lg">
              {rules.reduce((prev, curr) => 
                curr.usageCount > prev.usageCount ? curr : prev
              ).name}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Rules List */}
      <div className="space-y-3">
        {rules.map((rule) => (
          <Card key={rule.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-base">{rule.name}</CardTitle>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {rule.usageCount} uses
                    </Badge>
                  </div>
                  <CardDescription>{rule.description}</CardDescription>
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{rule.pattern}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Created {new Date(rule.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditRule(rule)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteRule(rule.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
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
                placeholder="Brief description of this rule"
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

            <div className="grid grid-cols-2 gap-4">
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
                  title: "Rule saved",
                  description: "The recurrence rule has been saved successfully.",
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
