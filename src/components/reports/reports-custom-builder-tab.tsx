"use client"

import { Plus, Trash2, GripVertical, BarChart, Table, PieChart, LineChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const dataSourceOptions = [
  { value: "tasks", label: "Tasks" },
  { value: "projects", label: "Projects" },
  { value: "events", label: "Events" },
  { value: "people", label: "People" },
  { value: "finance", label: "Financial Data" },
  { value: "resources", label: "Resources" },
]

const chartTypes = [
  { value: "bar", label: "Bar Chart", icon: BarChart },
  { value: "line", label: "Line Chart", icon: LineChart },
  { value: "pie", label: "Pie Chart", icon: PieChart },
  { value: "table", label: "Table", icon: Table },
]

const sampleFields = [
  { id: "1", name: "Status", type: "category" },
  { id: "2", name: "Priority", type: "category" },
  { id: "3", name: "Assignee", type: "person" },
  { id: "4", name: "Due Date", type: "date" },
  { id: "5", name: "Created At", type: "date" },
  { id: "6", name: "Budget", type: "number" },
]

export function ReportsCustomBuilderTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="flex gap-2">
          <Button variant="outline">Save as Template</Button>
          <Button>Generate Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Report Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Report Name</Label>
                <Input placeholder="Enter report name" />
              </div>

              <div className="space-y-2">
                <Label>Data Source</Label>
                <Select defaultValue="tasks">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dataSourceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Visualization Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {chartTypes.map((chart) => {
                    const Icon = chart.icon
                    return (
                      <Button key={chart.value} variant="outline" className="h-20 flex flex-col gap-2">
                        <Icon className="h-6 w-6" />
                        <span className="text-xs">{chart.label}</span>
                      </Button>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Available Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sampleFields.map((field) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-2 p-2 border rounded hover:bg-accent cursor-move"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{field.name}</p>
                      <Badge variant="outline" className="text-xs">{field.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Report Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center min-h-[500px] flex items-center justify-center">
                <div className="text-muted-foreground">
                  <BarChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Drag fields to build your report</p>
                  <p className="text-sm">Select a data source and visualization type to get started</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Filters</h4>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Filter
                  </Button>
                  <Badge variant="secondary">No filters applied</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
