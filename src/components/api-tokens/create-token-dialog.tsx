"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface CreateTokenDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const availableScopes = [
  { value: "read:projects", label: "Read Projects" },
  { value: "write:projects", label: "Write Projects" },
  { value: "read:tasks", label: "Read Tasks" },
  { value: "write:tasks", label: "Write Tasks" },
  { value: "read:users", label: "Read Users" },
  { value: "read:comments", label: "Read Comments" },
  { value: "write:comments", label: "Write Comments" },
  { value: "admin", label: "Admin Access" },
]

export function CreateTokenDialog({ open, onOpenChange }: CreateTokenDialogProps) {
  const t = useTranslations()
  const [selectedScopes, setSelectedScopes] = useState<string[]>([])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create API Token</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Token Name</Label>
            <Input id="name" placeholder="Production API" />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="What will this token be used for?" rows={2} />
          </div>

          <div>
            <Label htmlFor="rateLimit">Rate Limit (requests per hour)</Label>
            <Input id="rateLimit" type="number" defaultValue={1000} />
          </div>

          <div>
            <Label htmlFor="expires">Expiration (optional)</Label>
            <Input id="expires" type="date" />
          </div>

          <div>
            <Label>Scopes & Permissions</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {availableScopes.map((scope) => (
                <div key={scope.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={scope.value}
                    checked={selectedScopes.includes(scope.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedScopes([...selectedScopes, scope.value])
                      } else {
                        setSelectedScopes(selectedScopes.filter((s) => s !== scope.value))
                      }
                    }}
                  />
                  <label
                    htmlFor={scope.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {scope.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Generate Token</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
