"use client"

import { useState } from "react"
import { Plus, Target, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GoalsList } from "@/components/goals/goals-list"
import { GoalDetail } from "@/components/goals/goal-detail"
import { CreateGoalDialog } from "@/components/goals/create-goal-dialog"
import { GoalsHierarchy } from "@/components/goals/goals-hierarchy"
import type { Goal } from "@/types"

// Mock data
const mockGoals: Goal[] = [
  {
    id: "1",
    organization_id: "org-1",
    name: "Grow Monthly Recurring Revenue",
    description: "Increase MRR to $100k by end of Q2",
    type: "currency",
    target_value: 100000,
    current_value: 75000,
    unit: "USD",
    start_date: "2025-01-01",
    end_date: "2025-06-30",
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
    name: "Increase User Signups",
    description: "Reach 10,000 active users",
    type: "number",
    target_value: 10000,
    current_value: 6500,
    unit: "users",
    start_date: "2025-01-01",
    end_date: "2025-12-31",
    status: "at_risk",
    progress_calc_method: "manual",
    is_public: true,
    linked_items: [],
    created_by: "user-1",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
]

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "hierarchy">("list")

  const handleCreateGoal = (newGoal: Partial<Goal>) => {
    const goal: Goal = {
      id: `goal-${Date.now()}`,
      organization_id: "org-1",
      ...newGoal,
      current_value: 0,
      status: "not_started",
      progress_calc_method: "manual",
      is_public: true,
      linked_items: [],
      created_by: "user-1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Goal

    setGoals([...goals, goal])
    setIsCreating(false)
  }

  const stats = {
    total: goals.length,
    on_track: goals.filter(g => g.status === "on_track").length,
    at_risk: goals.filter(g => g.status === "at_risk").length,
    completed: goals.filter(g => g.status === "completed").length,
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-background p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Goals & OKRs</h1>
            <p className="text-muted-foreground mt-2">
              Track objectives and key results across your organization
            </p>
          </div>
          <Button onClick={() => setIsCreating(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Goal
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Goals</p>
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
            <GoalsList
              goals={goals}
              onGoalClick={setSelectedGoal}
              onGoalUpdate={(updated) => {
                setGoals(goals.map(g => g.id === updated.id ? updated : g))
              }}
            />
          </TabsContent>

          <TabsContent value="hierarchy" className="mt-6">
            <GoalsHierarchy goals={goals} onGoalClick={setSelectedGoal} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Dialog */}
      <CreateGoalDialog
        open={isCreating}
        onOpenChange={setIsCreating}
        onCreateGoal={handleCreateGoal}
      />

      {/* Detail Panel */}
      {selectedGoal && (
        <GoalDetail
          goal={selectedGoal}
          open={!!selectedGoal}
          onOpenChange={(open) => !open && setSelectedGoal(null)}
          onUpdate={(updated) => {
            setGoals(goals.map(g => g.id === updated.id ? updated : g))
            setSelectedGoal(updated)
          }}
        />
      )}
    </div>
  )
}
