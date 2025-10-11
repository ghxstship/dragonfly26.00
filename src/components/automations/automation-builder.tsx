"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Automation, AutomationTriggerType } from "@/types"

interface AutomationBuilderProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (automation: Automation) => void
}

export function AutomationBuilder({ open, onOpenChange, onSave }: AutomationBuilderProps) {
  const t = useTranslations()
  const [name, setName] = useState("")
  const [triggerType, setTriggerType] = useState<AutomationTriggerType>("item_created")

  const handleSave = () => {
    const automation: Automation = {
      id: `auto-${Date.now()}`,
      organization_id: "org-1",
      name,
      is_active: true,
      trigger_type: triggerType,
      trigger_config: {},
      conditions: [],
      actions: [],
      run_once_per_item: false,
      delay_minutes: 0,
      execution_count: 0,
      created_by: "user-1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    onSave(automation)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Automation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Trigger</Label>
            <Select value={triggerType} onValueChange={(v: AutomationTriggerType) => setTriggerType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="item_created">Item Created</SelectItem>
                <SelectItem value="status_change">Status Changed</SelectItem>
                <SelectItem value="field_updated">Field Updated</SelectItem>
                <SelectItem value="assignee_changed">Assignee Changed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSave} className="w-full">Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
