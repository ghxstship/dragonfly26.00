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
      nameKey: "new_project_checklist",
      description: t('templates.standardChecklist'),
      items: [
        { content: t('templates.createProjectPlan'), completed: false, order: 0 },
        { content: t('templates.assignTeamMembers'), completed: false, order: 1 },
        { content: t('templates.setUpCommunication'), completed: false, order: 2 },
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

  const handleCreateTemplate = async () => {
    const template: ChecklistTemplate = {
      id: `template-${Date.now()}`,
      organization_id: "org-1",
      name: newTemplate.name,
      description: newTemplate.description,
      items: newTemplate.items
        .filter((item: any) => (item as string).trim())
        .map((item: any, index: number) => ({
          content: item as string,
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
    setTemplates(templates.filter((t: any) => (t as any).id !== id))
  }

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
            <div>
              <CardTitle>{t('admin.checklistTemplates.title')}</CardTitle>
              <CardDescription>{t('admin.checklistTemplates.description')}</CardDescription>
            </div>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button aria-hidden="true" className="gap-2" aria-label="Add new checklist template">
                  <Plus aria-hidden="true" className="h-4 w-4" />
                  Add Template
                </Button>
              </DialogTrigger>
              <DialogContent aria-hidden="true" className="max-w-2xl px-4 sm:px-6 lg:px-8 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Checklist Template</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Template Name</Label>
                    <Input
                      placeholder={t('admin.templates.namePlaceholder')}
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
                    {newTemplate.items.map((item: any, index: number) => (
                      <div key={index} className="flex flex-wrap gap-2">
                        <Input
                          placeholder={t('templates.addChecklistItem')}
                          value={item as string}
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
                            aria-label="Add another checklist item"
                          >
                            <Plus aria-hidden="true" className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
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
            {templates.map((template: any) => (
              <div
                key={template.id}
                className="p-4 border rounded-lg hover:bg-accent/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-wrap gap-3 flex-1">
                    <ListChecks aria-hidden="true" className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium">{template.nameKey ? t(template.nameKey) : template.name}</div>
                      {template.description && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {template.descriptionKey ? t(template.descriptionKey) : template.description}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-2">
                        {template.items.length} items
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Template actions">
                        <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem aria-hidden="true" className="text-destructive"
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
