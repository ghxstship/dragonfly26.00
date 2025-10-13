'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useDashboardData(workspaceId: string, userId: string) {
  const [data, setData] = useState<any>(null)
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
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    if (workspaceId) {
      fetchDashboardData()
    }

    // Subscribe to real-time updates for dashboard-related tables
    const channel = supabase
      .channel(`dashboard:${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'productions',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => fetchDashboardData()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_tasks',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => fetchDashboardData()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => fetchDashboardData()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId])

  return { data, loading, error, refetch: () => {} }
}

// Hook for My Agenda (events for user)
export function useMyAgenda(workspaceId: string, userId: string) {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchUpcomingEvents() {
      if (!workspaceId) return
      
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

    // Real-time subscription
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
  const [tasks, setTasks] = useState<any[]>([])
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
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchMyExpenses() {
      if (!workspaceId) return
      
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('created_by', userId)
        .eq('type', 'expense')
        .order('transaction_date', { ascending: false })
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
          table: 'financial_transactions',
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
