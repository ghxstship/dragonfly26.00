"use client"

import { useTranslations } from "next-intl"
import { FileText, ListChecks, Layout, Workflow } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function TemplatesTab() {
  const t = useTranslations()

  const templateCategories = [
    {
      id: "checklist",
      name: "Checklist Templates",
      description: "Reusable checklists for standard workflows and procedures",
      icon: ListChecks,
      count: 12,
    },
    {
      id: "document",
      name: "Document Templates",
      description: "Pre-formatted documents for contracts, reports, and forms",
      icon: FileText,
      count: 8,
    },
    {
      id: "project",
      name: "Project Templates",
      description: "Complete project structures with tasks and workflows",
      icon: Layout,
      count: 5,
    },
    {
      id: "workflow",
      name: "Workflow Templates",
      description: "Automated workflow patterns for common processes",
      icon: Workflow,
      count: 6,
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
          <CardDescription>
            Manage organization-wide templates for projects, documents, workflows, and more
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {templateCategories.map((category) => {
              const Icon = category.icon
              return (
                <div
                  key={category.id}
                  className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ListChecks className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-sm">New Project Checklist</div>
                    <div className="text-xs text-muted-foreground">Updated 2 days ago</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">Checklist</div>
              </div>
            </div>
            <div className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-sm">Vendor Contract Template</div>
                    <div className="text-xs text-muted-foreground">Updated 5 days ago</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">Document</div>
              </div>
            </div>
            <div className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Layout className="h-4 w-4 text-muted-foreground" />
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
