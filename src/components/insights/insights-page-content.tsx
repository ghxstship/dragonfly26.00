"use client"

import { useState } from "react"
import { Plus, Lightbulb, TrendingUp, AlertCircle, CheckCircle2, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ObjectivesList } from "@/components/insights/objectives-list"
import { ObjectiveDetail } from "@/components/insights/objective-detail"
import { CreateObjectiveDialog } from "@/components/insights/create-objective-dialog"
import { ObjectivesHierarchy } from "@/components/insights/objectives-hierarchy"
import type { Goal } from "@/types"

const mockObjectives: Goal[] = [
  {
    id: "1",
    organization_id: "org-1",
    name: "Increase Customer Satisfaction Score",
    description: t('insights.mockData.goal1Desc'),
    type: "percentage",
    target_value: 90,
    current_value: 78,
    unit: "%",
    start_date: "2025-01-01",
    end_date: "2025-12-31",
    status: "on_track",
    progress_calc_method: "manual",
    is_public: true,
    linked_items: [],
    created_by: "user-1",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "2",
    organization_id: "org-1",
    name: "Reduce Operational Costs",
    description: t('insights.mockData.goal2Desc'),
    type: "percentage",
    target_value: 15,
    current_value: 8,
    unit: "% reduction",
    start_date: "2025-01-01",
    end_date: "2025-06-30",
    status: "at_risk",
    progress_calc_method: "manual",
    is_public: true,
    linked_items: [],
    created_by: "user-1",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "3",
    organization_id: "org-1",
    name: "Expand Market Presence",
    description: t('insights.mockData.goal3Desc'),
    type: "number",
    target_value: 3,
    current_value: 1,
    unit: "markets",
    start_date: "2025-01-01",
    end_date: "2025-12-31",
    status: "on_track",
    progress_calc_method: "manual",
    is_public: true,
    linked_items: [],
    created_by: "user-1",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
]

export function InsightsPageContent() {
  const [objectives, setObjectives] = useState<Goal[]>(mockObjectives)
  const [selectedObjective, setSelectedObjective] = useState<Goal | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "hierarchy">("list")

  const handleCreateObjective = (newObjective: Partial<Goal>) => {
    const objective: Goal = {
      id: `objective-${Date.now()}`,
      organization_id: "org-1",
      ...newObjective,
      current_value: 0,
      status: "not_started",
      progress_calc_method: "manual",
      is_public: true,
      linked_items: [],
      created_by: "user-1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Goal

    setObjectives([...objectives, objective])
    setIsCreating(false)
  }

  const stats = {
    total: objectives.length,
    on_track: objectives.filter(g => g.status === "on_track").length,
    at_risk: objectives.filter(g => g.status === "at_risk").length,
    completed: objectives.filter(g => g.status === "completed").length,
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-background p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Lightbulb className="h-8 w-8 text-green-600" />
              Strategic Insights
            </h1>
            <p className="text-muted-foreground mt-2">
              Strategic intelligence and actionable recommendations to drive success
            </p>
          </div>
          <Button onClick={() => setIsCreating(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Objective
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Objectives</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">On Track</p>
                  <p className="text-2xl font-bold text-green-600">{stats.on_track}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">At Risk</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.at_risk}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs value={viewMode} onValueChange={(v: any) => setViewMode(v)}>
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="hierarchy">Hierarchy View</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <ObjectivesList
              goals={objectives}
              onGoalClick={setSelectedObjective}
              onGoalUpdate={(updated: Goal) => {
                setObjectives(objectives.map(g => g.id === updated.id ? updated : g))
              }}
            />
          </TabsContent>

          <TabsContent value="hierarchy" className="mt-6">
            <ObjectivesHierarchy goals={objectives} onGoalClick={setSelectedObjective} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Dialog */}
      <CreateObjectiveDialog
        open={isCreating}
        onOpenChange={setIsCreating}
        onCreateGoal={handleCreateObjective}
      />

      {/* Detail Panel */}
      {selectedObjective && (
        <ObjectiveDetail
          goal={selectedObjective}
          open={!!selectedObjective}
          onOpenChange={(open: boolean) => !open && setSelectedObjective(null)}
          onUpdate={(updated: Goal) => {
            setObjectives(objectives.map(g => g.id === updated.id ? updated : g))
            setSelectedObjective(updated)
          }}
        />
      )}
    </div>
  )
}
