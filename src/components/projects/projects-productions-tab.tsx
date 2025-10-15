"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Clapperboard,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  Filter,
  Search
} from "lucide-react"
import { useModuleData } from "@/hooks/use-module-data"
import type { TabComponentProps } from "@/types"

export function ProjectsProductionsTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const { data: productions, loading } = useModuleData(workspaceId, 'projects', 'productions')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading productions...</p>
        </div>
      </div>
    )
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600 bg-green-50 dark:bg-green-950'
      case 'at_risk': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950'
      case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-950'
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400'
      case 'planning': return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400'
      case 'on_hold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400'
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Productions</h2>
          <p className="text-muted-foreground">
            Manage all production projects including shows, tours, and events
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Production
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Productions</CardTitle>
            <Clapperboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productions.filter((p: any) => p.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {productions.filter((p: any) => p.health === 'healthy').length} healthy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(productions.reduce((sum: number, p: any) => sum + (p.budget || 0), 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all productions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Planning</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productions.filter((p: any) => p.status === 'planning').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Upcoming projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {productions.filter((p: any) => p.health === 'at_risk' || p.health === 'critical').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Productions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {productions.map((production: any) => {
          const budgetPercentage = production.budget ? (production.budget_spent / production.budget) * 100 : 0

          return (
            <Card key={production.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{production.name}</CardTitle>
                    <CardDescription className="mt-1">{production.code}</CardDescription>
                  </div>
                  <Badge variant="secondary" className={getHealthColor(production.health)}>
                    {production.health === 'healthy' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {production.health === 'at_risk' && <AlertCircle className="h-3 w-3 mr-1" />}
                    {production.health === 'critical' && <AlertCircle className="h-3 w-3 mr-1" />}
                    {production.health}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge className={getStatusColor(production.status)}>
                    {production.status}
                  </Badge>
                  <Badge variant="outline">{production.type}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{production.progress}%</span>
                  </div>
                  <Progress value={production.progress} className="h-2" />
                </div>

                {/* Budget */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-medium">{budgetPercentage.toFixed(0)}% spent</span>
                  </div>
                  <Progress 
                    value={budgetPercentage} 
                    className={`h-2 ${budgetPercentage > 90 ? 'bg-red-100' : ''}`}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatCurrency(production.budget_spent)}</span>
                    <span>{formatCurrency(production.budget)}</span>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(production.start_date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{production.project_manager_id}</span>
                  </div>
                </div>

                <Button className="w-full" variant="outline" size="sm">
                  View Details
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {productions.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clapperboard className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Productions Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by creating your first production project
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Production
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
