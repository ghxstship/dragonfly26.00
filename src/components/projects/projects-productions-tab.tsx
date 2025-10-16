"use client"

import { useTranslations } from 'next-intl'
import { useState } from "react"
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
import { EmptyState } from "@/components/shared/empty-state"
import { useModuleData } from "@/hooks/use-module-data"
import type { TabComponentProps } from "@/types"

export function ProjectsProductionsTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const t = useTranslations('production.projects.productions')
  const tCommon = useTranslations('common')
  const { data: productions, loading } = useModuleData(workspaceId, 'projects', 'productions')

  if (loading) {
    return (
      <div 
        className="flex items-center justify-center h-full"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" aria-hidden="true"></div>
          <p className="text-muted-foreground">{t('loadingMessage')}</p>
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
    <main role="main" aria-label={t('title')}>
      <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('activeProductions')}</CardTitle>
            <Clapperboard className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productions.filter((p: any) => p.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {productions.filter((p: any) => p.health === 'healthy').length} {t('healthy')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalBudget')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(productions.reduce((sum: number, p: any) => sum + (p.budget || 0), 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('acrossAllProductions')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('inPlanning')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productions.filter((p: any) => p.status === 'planning').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('upcomingProjects')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('atRisk')}</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {productions.filter((p: any) => p.health === 'at_risk' || p.health === 'critical').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('needAttention')}
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
                    {production.health === 'healthy' && <CheckCircle2 className="h-4 w-4 mr-1" aria-hidden="true" />}
                    {production.health === 'at_risk' && <AlertCircle className="h-4 w-4 mr-1" aria-hidden="true" />}
                    {production.health === 'critical' && <AlertCircle className="h-4 w-4 mr-1" aria-hidden="true" />}
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
                    <span className="text-muted-foreground">{t('progress')}</span>
                    <span className="font-medium">{production.progress}%</span>
                  </div>
                  <Progress value={production.progress} className="h-2" />
                </div>

                {/* Budget */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t('budget')}</span>
                    <span className="font-medium">{budgetPercentage.toFixed(0)}{t('spentPercent')}</span>
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
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    <span>{formatDate(production.start_date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" aria-hidden="true" />
                    <span>{production.project_manager_id}</span>
                  </div>
                </div>

                <Button className="w-full" variant="outline" size="sm">
                  {t('viewDetails')}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {productions.length === 0 && (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              icon={Clapperboard}
              mainMessage={t('emptyMainMessage')}
              description={t('emptyDescription')}
            />
          </CardContent>
        </Card>
      )}

    </div>
    </main>
  )
}
