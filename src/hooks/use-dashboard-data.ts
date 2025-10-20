'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { shouldUseMockData } from '@/lib/demo-mode'
import { useWorkspaceRealtime } from '@/hooks/use-optimized-realtime'
import { useMultiTableRealtime } from '@/hooks/use-debounced-realtime'
import { queryCache, cacheKeys, invalidateCacheOnUpdate } from '@/lib/query-cache'
import type { 
  Report, 
  Task, 
  DashboardEvent, 
  DashboardExpense, 
  DashboardJob, 
  DashboardAsset, 
  DashboardOrder, 
  DashboardAdvance, 
  DashboardFile, 
  DashboardTravel 
} from '@/types'
import { 
  mockEvents, 
  mockTasks, 
  mockJobs, 
  mockAssets, 
  mockExpenses, 
  mockOrders, 
  mockAdvances, 
  mockFiles, 
  mockReports, 
  mockTravels,
  simulateDelay 
} from '@/lib/mock-data'

export function useDashboardData(workspaceId: string, userId: string) {
  const [data, setData] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)

        // Fetch dashboard stats using RPC function
        const { data: stats, error: statsError } = await supabase
          .rpc('get_workspace_dashboard', {
            p_workspace_id: workspaceId
          })

        if (statsError) throw statsError

        setData(stats)
      } catch (err: any) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    if (workspaceId) {
      fetchDashboardData()
    }
  }, [workspaceId])

  // Optimized realtime subscription with debouncing (1s debounce, 5s max wait)
  useMultiTableRealtime(
    supabase,
    `dashboard:${workspaceId}`,
    [
      { table: 'productions', filter: `workspace_id=eq.${workspaceId}` },
      { table: 'project_tasks', filter: `workspace_id=eq.${workspaceId}` },
      { table: 'events', filter: `workspace_id=eq.${workspaceId}` }
    ],
    async () => {
      const { data: stats, error: statsError } = await supabase
        .rpc('get_workspace_dashboard', {
          p_workspace_id: workspaceId
        })
      if (!statsError && stats) {
        setData(stats)
      }
    },
    { debounceMs: 1000, maxWaitMs: 5000 }
  )

  return { data, loading, error, refetch: () => {} }
}

// Hook for My Agenda (events for user)
export function useMyAgenda(workspaceId: string, userId: string) {
  const [events, setEvents] = useState<DashboardEvent[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchUpcomingEvents() {
      if (!workspaceId) return
      
      // Demo mode: use mock data
      if (shouldUseMockData()) {
        await simulateDelay(300)
        setEvents(mockEvents as any)
        setLoading(false)
        return
      }
      
      // Production mode: use Supabase
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('events')
        .select('*, location:location_id(name)')
        .eq('workspace_id', workspaceId)
        .or(`created_by.eq.${userId},attendees.cs.{${userId}}`)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(50)

      if (!error && data) {
        setEvents(data)
      }
      setLoading(false)
    }

    fetchUpcomingEvents()

    // Skip real-time subscription in demo mode
    if (shouldUseMockData()) {
      return
    }

    // Real-time subscription (production only)
    const channel = supabase
      .channel(`events:${workspaceId}:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => fetchUpcomingEvents()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, userId])

  return { events, loading }
}

// Hook for My Tasks
export function useMyTasks(workspaceId: string, userId: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchMyTasks() {
      if (!workspaceId) return
      
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('project_tasks')
        .select('*, production:production_id(name)')
        .eq('workspace_id', workspaceId)
        .or(`assignee_id.eq.${userId},created_by.eq.${userId}`)
        .neq('status', 'completed')
        .order('due_date', { ascending: true })
        .limit(100)

      if (!error && data) {
        setTasks(data)
      }
      setLoading(false)
    }

    fetchMyTasks()

    // Real-time subscription
    const channel = supabase
      .channel(`tasks:${workspaceId}:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_tasks',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => fetchMyTasks()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, userId])

  return { tasks, loading }
}

// Hook for My Expenses
export function useMyExpenses(workspaceId: string, userId: string) {
  const [expenses, setExpenses] = useState<DashboardExpense[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchMyExpenses() {
      if (!workspaceId) return
      
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('expense_reports')
        .select(`
          *,
          items:expense_items(*),
          production:production_id(name)
        `)
        .eq('workspace_id', workspaceId)
        .eq('submitted_by', userId)
        .order('submitted_date', { ascending: false })
        .limit(50)

      if (!error && data) {
        setExpenses(data)
      }
      setLoading(false)
    }

    fetchMyExpenses()

    // Real-time subscription
    const channel = supabase
      .channel(`expenses:${workspaceId}:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expense_reports',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => fetchMyExpenses()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, userId])

  return { expenses, loading }
}

// Hook for My Jobs (personnel assignments)
export function useMyJobs(workspaceId: string, userId: string) {
  const [jobs, setJobs] = useState<DashboardJob[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchMyJobs() {
      if (!workspaceId) return
      
      const { data, error } = await supabase
        .from('personnel_assignments')
        .select(`
          *,
          production:production_id(name),
          personnel:personnel_id(id, user_id)
        `)
        .eq('workspace_id', workspaceId)
        .eq('personnel.user_id', userId)
        .in('status', ['active', 'pending'])
        .order('start_date', { ascending: false })
        .limit(50)

      if (!error && data) {
        setJobs(data)
      }
      setLoading(false)
    }

    fetchMyJobs()

    const channel = supabase
      .channel(`jobs:${workspaceId}:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'personnel_assignments',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => fetchMyJobs()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, userId])

  return { jobs, loading }
}

// Hook for My Assets
export function useMyAssets(workspaceId: string, userId: string) {
  const [assets, setAssets] = useState<DashboardAsset[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchMyAssets() {
      if (!workspaceId) return
      
      const { data, error } = await supabase
        .from('assets')
        .select(`
          *,
          location:location_id(name),
          category:category_id(name)
        `)
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })
        .limit(100)

      if (!error && data) {
        setAssets(data)
      }
      setLoading(false)
    }

    fetchMyAssets()

    const channel = supabase
      .channel(`assets:${workspaceId}:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'assets',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => fetchMyAssets()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, userId])

  return { assets, loading }
}

// Hook for My Orders
export function useMyOrders(workspaceId: string, userId: string) {
  const [orders, setOrders] = useState<DashboardOrder[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchMyOrders() {
      if (!workspaceId) return
      
      const { data, error } = await supabase
        .from('marketplace_orders')
        .select(`
          *,
          items:order_items(*),
          production:production_id(name)
        `)
        .eq('workspace_id', workspaceId)
        .eq('buyer_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (!error && data) {
        setOrders(data)
      }
      setLoading(false)
    }

    fetchMyOrders()

    const channel = supabase
      .channel(`orders:${workspaceId}:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'marketplace_orders',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => fetchMyOrders()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, userId])

  return { orders, loading }
}

// Hook for My Advances
export function useMyAdvances(workspaceId: string, userId: string) {
  const [advances, setAdvances] = useState<DashboardAdvance[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchMyAdvances() {
      if (!workspaceId) return
      
      const { data, error } = await supabase
        .from('production_advances')
        .select(`
          *,
          production:production_id(id, name),
          company:company_id(id, name),
          asset:asset_id(id, name),
          requestor:requestor_id(id, name, email),
          approver:approver_id(id, name, email)
        `)
        .eq('workspace_id', workspaceId)
        .eq('requestor_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (!error && data) {
        setAdvances(data)
      }
      setLoading(false)
    }

    fetchMyAdvances()

    const channel = supabase
      .channel(`advances:${workspaceId}:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'production_advances',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => fetchMyAdvances()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, userId])

  return { advances, loading }
}

// Hook for My Reports
export function useMyReports(workspaceId: string, userId: string) {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchMyReports() {
      if (!workspaceId) return
      
      const { data, error } = await supabase
        .from('report_templates')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('created_by', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (!error && data) {
        setReports(data)
      }
      setLoading(false)
    }

    fetchMyReports()

    const channel = supabase
      .channel(`reports:${workspaceId}:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'report_templates',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => fetchMyReports()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, userId])

  return { reports, loading }
}

// Hook for My Files  
export function useMyFiles(workspaceId: string, userId: string) {
  const [files, setFiles] = useState<DashboardFile[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchMyFiles() {
      if (!workspaceId) return
      
      const { data, error } = await supabase
        .from('files')
        .select(`
          *,
          production:production_id(name)
        `)
        .eq('workspace_id', workspaceId)
        .eq('uploaded_by', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (!error && data) {
        setFiles(data)
      }
      setLoading(false)
    }

    fetchMyFiles()

    const channel = supabase
      .channel(`files:${workspaceId}:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'files',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => fetchMyFiles()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, userId])

  return { files, loading }
}

// Hook for My Travel
export function useMyTravel(workspaceId: string, userId: string) {
  const [travels, setTravels] = useState<DashboardTravel[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchMyTravel() {
      if (!workspaceId) return
      
      const { data, error } = await supabase
        .from('travel_arrangements')
        .select(`
          *,
          production:production_id(name)
        `)
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId)
        .gte('departure_date', new Date().toISOString())
        .order('departure_date', { ascending: true })
        .limit(50)

      if (!error && data) {
        setTravels(data)
      }
      setLoading(false)
    }

    fetchMyTravel()

    const channel = supabase
      .channel(`travel:${workspaceId}:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'travel_arrangements',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => fetchMyTravel()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, userId])

  return { travels, loading }
}
