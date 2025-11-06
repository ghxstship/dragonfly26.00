"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface CreateWebhookDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const availableEvents = [
  { value: "item.created", label: "Item Created" },
  { value: "item.updated", label: "Item Updated" },
  { value: "item.deleted", label: "Item Deleted" },
  { value: "item.status_changed", label: "Status Changed" },
  { value: "item.assigned", label: "Item Assigned" },
  { value: "comment.created", label: "Comment Added" },
]

export function CreateWebhookDialog({ open, onOpenChange }: CreateWebhookDialogProps) {
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-hidden="true" className="max-w-2xl px-4 sm:px-6 lg:px-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Webhook</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Slack Notifications" />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Send updates to Slack..." rows={2} />
          </div>

          <div>
            <Label htmlFor="url">Webhook URL</Label>
            <Input id="url" type="url" placeholder="https://hooks.example.com/webhook" />
          </div>

          <div>
            <Label htmlFor="method">HTTP Method</Label>
            <Select defaultValue="POST">
              <SelectTrigger id="method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Events to Subscribe</Label>
            <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {availableEvents.map((event: any) => (
                <div key={event.value} className="flex flex-wrap md:flex-nowrap items-center space-x-2">
                  <Checkbox
                    id={event.value}
                    checked={selectedEvents.includes(event.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedEvents([...selectedEvents, event.value])
                      } else {
                        setSelectedEvents(selectedEvents.filter((e: any) => e !== event.value))
                      }
                    }}
                  />
                  <label
                    htmlFor={event.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {event.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="secret">Secret (optional)</Label>
            <Input id="secret" type="password" placeholder="For signature verification" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Create Webhook</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
