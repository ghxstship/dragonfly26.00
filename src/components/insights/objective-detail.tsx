"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { X, TrendingUp, Plus } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { Goal, GoalProgress } from "@/types"

interface GoalDetailProps {
  goal: Goal
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (goal: Goal) => void
}

export function ObjectiveDetail({ goal, open, onOpenChange, onUpdate }: GoalDetailProps) {
  const t = useTranslations()
  const [newProgress, setNewProgress] = useState("")
  const [progressHistory, setProgressHistory] = useState<GoalProgress[]>([
    {
      id: "1",
      goal_id: goal.id,
      value: 50000,
      recorded_at: "2025-01-05T00:00:00Z",
    },
    {
      id: "2",
      goal_id: goal.id,
      value: 65000,
      recorded_at: "2025-01-12T00:00:00Z",
    },
    {
      id: "3",
      goal_id: goal.id,
      value: 75000,
      recorded_at: "2025-01-15T00:00:00Z",
    },
  ])

  const progress = goal.target_value ? Math.round((goal.current_value / goal.target_value) * 100) : 0

  const handleUpdateProgress = async () => {
    const value = parseFloat(newProgress)
    if (!isNaN(value)) {
      onUpdate({ ...goal, current_value: value })
      setProgressHistory([
        ...progressHistory,
        {
          id: `${Date.now()}`,
          goal_id: goal.id,
          value,
          recorded_at: new Date().toISOString(),
        },
      ])
      setNewProgress("")
    }
  }

  const chartData = progressHistory.map((p: any) => ({
    date: new Date(p.recorded_at).toLocaleDateString(),
    value: p.value,
  }))

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{goal.name}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-3 md:space-y-4 lg:space-y-6">
          {/* Current Progress */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between mb-4">
                <div>
                  <p className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl font-bold">
                    {goal.type === "currency"
                      ? new Intl.NumberFormat("en-US", { style: "currency", currency: goal.unit || "USD" }).format(goal.current_value)
                      : `${goal.current_value}${goal.unit ? ` ${goal.unit}` : ""}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    of{" "}
                    {goal.type === "currency"
                      ? new Intl.NumberFormat("en-US", { style: "currency", currency: goal.unit || "USD" }).format(goal.target_value || 0)
                      : `${goal.target_value}${goal.unit ? ` ${goal.unit}` : ""}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl font-bold text-primary">{progress}%</p>
                  <p className="text-sm text-muted-foreground">Complete</p>
                </div>
              </div>
              <Progress value={progress as any} className="h-3" />
            </CardContent>
          </Card>

          <Tabs defaultValue="progress">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-full">
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="linked">Linked Items</TabsTrigger>
            </TabsList>

            <TabsContent value="progress" className="space-y-4">
              {/* Update Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Update Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Input
                      type="number"
                      placeholder={t('goals.enterNewValue')}
                      value={newProgress as any}
                      onChange={(e) => setNewProgress(e.target.value)}
                    />
                    <Button onClick={handleUpdateProgress}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Progress Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Progress History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {progressHistory.map((p: any) => (
                      <div key={p.id} className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between py-2 border-b last:border-0">
                        <span className="text-sm">
                          {new Date(p.recorded_at).toLocaleDateString()} {new Date(p.recorded_at).toLocaleTimeString()}
                        </span>
                        <span className="font-medium">
                          {goal.type === "currency"
                            ? new Intl.NumberFormat("en-US", { style: "currency", currency: goal.unit || "USD" }).format(p.value)
                            : `${p.value}${goal.unit ? ` ${goal.unit}` : ""}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label>Description</Label>
                    <p className="text-sm mt-1">{goal.description || t('goals.noDescription')}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <p className="text-sm mt-1">{new Date(goal.start_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <p className="text-sm mt-1">{new Date(goal.end_date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div>
                    <Label>Status</Label>
                    <p className="text-sm mt-1 capitalize">{goal.status.replace(/_/g, " ")}</p>
                  </div>

                  <div>
                    <Label>Progress Calculation</Label>
                    <p className="text-sm mt-1 capitalize">{goal.progress_calc_method.replace(/_/g, " ")}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="linked" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground text-center py-4 md:py-6 lg:py-8">
                    No linked items yet. Link tasks and projects to track progress automatically.
                  </p>
                  <Button variant="outline" className="w-full max-w-full">
                    Link Items
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
