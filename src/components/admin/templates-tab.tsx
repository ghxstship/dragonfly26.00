"use client"

import { useTranslations } from "next-intl"
import { FileText, ListChecks, Layout, Workflow, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function TemplatesTab() {
  const t = useTranslations()

  const templateCategories = [
    {
      id: "checklist",
      name: t('admin.templates.checklists'),
      description: t('admin.templates.checklistsDesc'),
      icon: ListChecks,
      count: 12,
    },
    {
      id: "document",
      name: t('admin.templates.documents'),
      description: t('admin.templates.documentsDesc'),
      icon: FileText,
      count: 8,
    },
    {
      id: "project",
      name: t('admin.templates.projects'),
      description: t('admin.templates.projectsDesc'),
      icon: Layout,
      count: 5,
    },
    {
      id: "workflow",
      name: t('admin.templates.workflows'),
      description: t('admin.templates.workflowsDesc'),
      icon: Workflow,
      count: 6,
    },
  ]

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
          <CardDescription>
            Manage organization-wide templates for projects, documents, workflows, and more
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-2">
            {templateCategories.map((category: any) => {
              const Icon = category.icon
              return (
                <div
                  key={category.id}
                  className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-primary/10">
                      <Icon aria-hidden="true" className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {category.description}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {category.count} templates available
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Templates</CardTitle>
          <CardDescription>
            Recently created or updated templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-3">
                  <ListChecks aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-sm">New Project Checklist</div>
                    <div className="text-xs text-muted-foreground">Updated 2 days ago</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">Checklist</div>
              </div>
            </div>
            <div className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-3">
                  <FileText aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-sm">Vendor Contract Template</div>
                    <div className="text-xs text-muted-foreground">Updated 5 days ago</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">Document</div>
              </div>
            </div>
            <div className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-3">
                  <Layout aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-sm">Live Event Production</div>
                    <div className="text-xs text-muted-foreground">Updated 1 week ago</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">Project</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
