"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Goal, GoalType } from "@/types"

interface CreateGoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateGoal: (goal: Partial<Goal>) => void
}

export function CreateGoalDialog({ open, onOpenChange, onCreateGoal }: CreateGoalDialogProps) {
  const t = useTranslations()
  const [formData, setFormData] = useState<Partial<Goal>>({
    name: "",
    description: "",
    type: "number",
    target_value: 0,
    unit: "",
    start_date: new Date().toISOString().split('T')[0],
    end_date: "",
  })

  const handleSubmit = () => {
    onCreateGoal(formData)
    setFormData({
      name: "",
      description: "",
      type: "number",
      target_value: 0,
      unit: "",
      start_date: new Date().toISOString().split('T')[0],
      end_date: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Goal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Goal Name *</Label>
            <Input
              placeholder="e.g., Increase Monthly Revenue"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder={t('placeholders.describeGoal')}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Goal Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: GoalType) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="currency">Currency</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="boolean">Yes/No</SelectItem>
                  <SelectItem value="task_completion">Task Completion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Target Value *</Label>
              <Input
                type="number"
                placeholder="0"
                value={formData.target_value}
                onChange={(e) => setFormData({ ...formData, target_value: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          {formData.type !== "boolean" && (
            <div className="space-y-2">
              <Label>Unit</Label>
              <Input
                placeholder="e.g., users, USD, deals, etc."
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>End Date *</Label>
              <Input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1" disabled={!formData.name || !formData.end_date}>
              Create Goal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
