"use client"

import { useTranslations } from 'next-intl'
import { useState } from "react"
import { ClipboardCheck, Plus, Calendar, Users, AlertTriangle, CheckCircle2, Clock, Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { DataTableOrganism } from "@/components/organisms"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/lib/hooks/use-toast"

interface CountsTabProps {
  data: Record<string, unknown>[]
  loading: boolean
  workspaceId: string
}

interface StatusOption {
  value: string
  label: string
  labelKey?: string
  color: string
  count: number
}

export function CountsTab({ data, loading, workspaceId }: CountsTabProps) {
  const t = useTranslations('production.assets.counts')
  const tCommon = useTranslations('common')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = createClient()

  // Apply status filter
  const filteredData = statusFilter 
    ? data.filter(count => (count as any).status === statusFilter)
    : data

  // Calculate metrics
  const activeCounts = data.filter(c => (c as any).status === 'in_progress').length
  const plannedCounts = data.filter(c => (c as any).status === 'planned').length
  const completedCounts = data.filter(c => (c as any).status === 'completed').length
  const totalDiscrepancies = data.reduce((sum: number, c) => sum + ((c as any).discrepancies_found || 0), 0)

  // Filter options
  const filterOptions: StatusOption[] = [
    { value: 'planned', label: 'Planned', color: 'bg-blue-500', count: plannedCounts },
    { value: 'in_progress', label: 'In Progress', color: 'bg-orange-500', count: activeCounts },
    { value: 'completed', label: 'Completed', color: 'bg-green-500', count: completedCounts },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-500', count: data.filter(c => (c as any).status === 'cancelled').length },
  ]

  // Schema for table view - using 'any' to allow custom render functions
  const countsSchema: Record<string, unknown>[] = [
    { 
      id: 'count_name',
      name: 'count_name', 
      label: 'Count Name', 
      type: 'text',
      render: (value: string, item: any) => (
        <div>
          <div className="font-medium">{value as any}</div>
          <div className="text-xs text-muted-foreground capitalize">{item.count_type?.replace(/_/g, ' ')}</div>
        </div>
      )
    },
    { 
      id: 'status',
      name: 'status', 
      label: 'Status', 
      type: 'select',
      render: (value: string) => {
        const colors: Record<string, string> = {
          planned: 'bg-blue-500/10 text-blue-700 border-blue-200',
          in_progress: 'bg-orange-500/10 text-orange-700 border-orange-200',
          completed: 'bg-green-500/10 text-green-700 border-green-200',
          cancelled: 'bg-gray-500/10 text-gray-700 border-gray-200',
        }
        const icons: Record<string, React.ReactNode> = {
          planned: <Calendar className="h-4 w-4 mr-1" aria-hidden="true" />,
          in_progress: <Clock className="h-4 w-4 mr-1" aria-hidden="true" />,
          completed: <CheckCircle2 className="h-4 w-4 mr-1" aria-hidden="true" />,
        }
        return (
          <Badge variant="outline" className={`${colors[value] || ''} flex items-center w-fit`}>
            {icons[value]}
            {value?.replace(/_/g, ' ')}
          </Badge>
        )
      }
    },
    { 
      id: 'scheduled_date',
      name: 'scheduled_date', 
      label: 'Scheduled', 
      type: 'date',
      render: (value: string) => value ? new Date(value).toLocaleDateString() : '-'
    },
    { 
      id: 'assigned_to',
      name: 'assigned_to', 
      label: 'Assigned To', 
      type: 'text',
      render: (value: string[]) => {
        if (!value || value.length === 0) return <span className="text-muted-foreground">-</span>
        return (
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span className="text-sm">{value.length} team {value.length === 1 ? 'member' : 'members'}</span>
          </div>
        )
      }
    },
    { 
      id: 'progress',
      name: 'progress', 
      label: 'Progress', 
      type: 'text',
      render: (value: any, item: any) => {
        const counted = item.total_items_counted || 0
        const total = item.total_items || 0
        const percentage = total > 0 ? Math.round((counted / total) * 100) : 0
        
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground min-w-[3rem] text-right">
                {counted}/{total}
              </span>
            </div>
          </div>
        )
      }
    },
    { 
      id: 'discrepancies_found',
      name: 'discrepancies_found', 
      label: 'Variances', 
      type: 'number',
      render: (value: number) => {
        if (!value || value === 0) return <span className="text-muted-foreground">-</span>
        return (
          <div className="flex items-center gap-1 text-orange-600">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            <span className="font-medium">{value}</span>
          </div>
        )
      }
    },
    { 
      id: 'completed_at',
      name: 'completed_at', 
      label: 'Completed', 
      type: 'date',
      render: (value: string) => value ? new Date(value).toLocaleDateString() : '-'
    },
  ]

  const handleCreateCount = async (count: Record<string, unknown>) => {
    const { error } = await supabase
      .from('inventory_counts')
      .insert({
        ...count,
        workspace_id: workspaceId,
      })
    
    if (error) {
      console.error('Error creating count:', error)
      throw error
    }
  }

  const handleUpdateCount = async (id: string, updates: Record<string, unknown>) => {
    const { error} = await supabase
      .from('inventory_counts')
      .update(updates)
      .eq('id', id)
    
    if (error) {
      console.error('Error updating count:', error)
      throw error
    }
  }

  const handleDeleteCount = async (id: string) => {
    const { error } = await supabase
      .from('inventory_counts')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting count:', error)
      toast({
        titleKey: "error",
        description: t('assets.toast.deleteCountFailed'),
        variant: "destructive",
      })
      throw error
    }
    toast({
      titleKey: "success",
      description: t('assets.toast.countDeleted'),
    })
  }

  const handleExport = async () => {
    const csv = []
    csv.push(['Count Name', 'Type', 'Status', 'Scheduled Date', 'Progress', 'Variances', 'Completed'])
    filteredData.forEach((count: any) => {
      const progress = count.total_items ? `${count.total_items_counted || 0}/${count.total_items}` : '-'
      csv.push([
        count.count_name || '',
        count.count_type || '',
        count.status || '',
        count.scheduled_date ? new Date(count.scheduled_date).toLocaleDateString() : '',
        progress,
        count.discrepancies_found || 0,
        count.completed_at ? new Date(count.completed_at).toLocaleDateString() : ''
      ])
    })
    const csvContent = csv.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `inventory-counts-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast({
      titleKey: "export_complete",
      description: t('assets.toast.countExported'),
    })
  }

  return (
    <main role="main" aria-label={t('title')}>
      <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Counts</CardDescription>
            <CardTitle className="text-2xl text-orange-600">{activeCounts}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Planned</CardDescription>
            <CardTitle className="text-2xl text-blue-600">{plannedCounts}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('completed')}</CardDescription>
            <CardTitle className="text-2xl text-green-600">{completedCounts}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Variances</CardDescription>
            <CardTitle className="text-2xl">{totalDiscrepancies}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-muted-foreground">Filter:</span>
        {filterOptions.map(option => (
          <Badge
            key={option.value}
            variant={statusFilter === option.value ? "default" : "outline"}
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={() => setStatusFilter(statusFilter === option.value ? null : option.value)}
          >
            <div className={`w-2 h-2 rounded-full ${option.color} mr-1.5`} />
            {option.labelKey ? t(option.labelKey) : option.label}
            <span className="ml-1 text-xs opacity-70">({option.count})</span>
            {statusFilter === option.value && <X className="h-4 w-4 ml-1" aria-hidden="true" />}
          </Badge>
        ))}
        {statusFilter && (
          <Button variant="ghost" size="sm" onClick={() => setStatusFilter(null)}>
            Clear
          </Button>
        )}
      </div>

      {/* Counts Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading counts...</p>
          </div>
        </div>
      ) : (
        <DataTableOrganism
          data={filteredData}
          columns={countsSchema as any}
          loading={loading}
        />
      )}

    </div>
    </main>
  )
}
