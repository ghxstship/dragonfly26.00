"use client"

import { useState } from "react"
import { Sliders, Plus, Edit, Trash2, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreateItemDialogEnhanced } from "@/components/shared/create-item-dialog-enhanced"

const customViews = [
  {
    id: "1",
    name: "Executive Dashboard",
    description: "High-level KPIs for leadership",
    widgets: ["Revenue Chart", "Customer Growth", "Market Share", "Profit Margin"],
    isDefault: true,
    lastModified: "2025-10-08"
  },
  {
    id: "2",
    name: "Sales Performance",
    description: "Detailed sales metrics and pipeline",
    widgets: ["Conversion Rate", "Deal Pipeline", "Sales by Region", "Top Performers"],
    isDefault: false,
    lastModified: "2025-10-05"
  },
  {
    id: "3",
    name: "Operations Overview",
    description: "Operational efficiency metrics",
    widgets: ["Task Completion", "Resource Utilization", "Project Status", "Team Velocity"],
    isDefault: false,
    lastModified: "2025-09-28"
  },
  {
    id: "4",
    name: "Customer Analytics",
    description: "Customer behavior and satisfaction",
    widgets: ["Satisfaction Score", "Churn Rate", "LTV Analysis", "Support Tickets"],
    isDefault: false,
    lastModified: "2025-10-02"
  },
]

interface AnalyticsCustomViewsTabProps {
  data?: any[]
  loading?: boolean
}

export function AnalyticsCustomViewsTab({ data = [], loading = false }: AnalyticsCustomViewsTabProps) {
  const displayViews = data || []
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Custom View
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {customViews.map((view) => (
          <Card key={view.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{view.name}</CardTitle>
                    {view.isDefault && (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{view.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Widgets ({view.widgets.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {view.widgets.map((widget, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {widget}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Modified {view.lastModified}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create New View Card */}
      <Card className="border-2 border-dashed">
        <CardContent className="p-12 text-center">
          <Sliders className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="font-semibold mb-2">Create Custom View</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Build a personalized analytics dashboard with the metrics that matter most to you
          </p>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Get Started
          </Button>
        </CardContent>
      </Card>

      {/* Create Custom View Dialog */}
      <CreateItemDialogEnhanced
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        moduleId="analytics"
        tabSlug="custom-views"
        onSuccess={(item) => {
          console.log("Created custom view:", item)
        }}
      />
    </div>
  )
}
