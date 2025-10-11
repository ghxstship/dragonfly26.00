"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Plus, MoreHorizontal, ListChecks } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ChecklistTemplate } from "@/types"

export function ChecklistTemplatesTab() {
  const t = useTranslations()
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([
    {
      id: "1",
      organization_id: "org-1",
      name: "New Project Checklist",
      description: t('templates.standardChecklist'),
      items: [
        { content: t('templates.createProjectPlan'), completed: false, order: 0 },
        { content: t('templates.assignTeamMembers'), completed: false, order: 1 },
        { content: t('templates.setupCommunication'), completed: false, order: 2 },
      ],
      created_by: "user-1",
      created_at: "",
      updated_at: "",
    },
  ])

  const [isCreating, setIsCreating] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    items: [""],
  })

  const handleCreateTemplate = () => {
    const template: ChecklistTemplate = {
      id: `template-${Date.now()}`,
      organization_id: "org-1",
      name: newTemplate.name,
      description: newTemplate.description,
      items: newTemplate.items
        .filter((item) => item.trim())
        .map((item, index) => ({
          content: item,
          completed: false,
          order: index,
        })),
      created_by: "user-1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setTemplates([...templates, template])
    setNewTemplate({ name: "", description: "", items: [""] })
    setIsCreating(false)
  }

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Checklist Templates</CardTitle>
              <CardDescription>
                Create reusable checklist templates for your organization
              </CardDescription>
            </div>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Checklist Template</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Template Name</Label>
                    <Input
                      placeholder="e.g., New Project Checklist"
                      value={newTemplate.name}
                      onChange={(e) =>
                        setNewTemplate({ ...newTemplate, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder={t('templates.describeUsage')}
                      value={newTemplate.description}
                      onChange={(e) =>
                        setNewTemplate({ ...newTemplate, description: e.target.value })
                      }
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Checklist Items</Label>
                    {newTemplate.items.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={t('templates.addChecklistItem')}
                          value={item}
                          onChange={(e) => {
                            const newItems = [...newTemplate.items]
                            newItems[index] = e.target.value
                            setNewTemplate({ ...newTemplate, items: newItems })
                          }}
                        />
                        {index === newTemplate.items.length - 1 && (
                          <Button
                            variant="outline"
                            onClick={() =>
                              setNewTemplate({
                                ...newTemplate,
                                items: [...newTemplate.items, ""],
                              })
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreating(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTemplate} className="flex-1">
                      Create Template
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className="p-4 border rounded-lg hover:bg-accent/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3 flex-1">
                    <ListChecks className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium">{template.name}</div>
                      {template.description && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {template.description}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-2">
                        {template.items.length} items
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteTemplate(template.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
