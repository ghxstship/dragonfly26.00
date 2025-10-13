'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// Hook for Productions list
export function useProductions(workspaceId: string) {
  const [productions, setProductions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchProductions() {
      if (!workspaceId) return
      
      const { data, error } = await supabase
        .from('productions')
        .select(`
          *,
          workspaces!workspace_id(name),
          project_manager:profiles!project_manager_id(first_name, last_name),
          tasks:project_tasks(count),
          milestones:project_milestones(count)
        `)
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setProductions(data)
      }
      setLoading(false)
    }

    fetchProductions()

    // Real-time subscription
    const channel = supabase
      .channel(`productions:${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'productions',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => fetchProductions()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId])

  return { productions, loading }
}

// Hook for Tasks
export function useTasks(workspaceId: string, productionId?: string) {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchTasks() {
      if (!workspaceId) return
      
      let query = supabase
        .from('project_tasks')
        .select(`
          *,
          production:production_id(name),
          assignee:profiles!assignee_id(first_name, last_name),
          milestone:milestone_id(name)
        `)
        .eq('workspace_id', workspaceId)

      if (productionId) {
        query = query.eq('production_id', productionId)
      }

      const { data, error} = await query.order('due_date', { ascending: true })

      if (!error && data) {
        setTasks(data)
      }
      setLoading(false)
    }

    fetchTasks()

    // Real-time subscription
    const channel = supabase
      .channel(`tasks:${workspaceId}:${productionId || 'all'}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_tasks',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => fetchTasks()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, productionId])

  return { tasks, loading }
}

// Hook for Milestones
export function useMilestones(workspaceId: string, productionId?: string) {
  const [milestones, setMilestones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchMilestones() {
      if (!workspaceId) return
      
      let query = supabase
        .from('project_milestones')
        .select(`
          *,
          production:production_id(name),
          tasks:project_tasks(count)
        `)
        .eq('workspace_id', workspaceId)

      if (productionId) {
        query = query.eq('production_id', productionId)
      }

      const { data, error } = await query.order('due_date', { ascending: true })

      if (!error && data) {
        setMilestones(data)
      }
      setLoading(false)
    }

    fetchMilestones()

    // Real-time subscription
    const channel = supabase
      .channel(`milestones:${workspaceId}:${productionId || 'all'}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_milestones',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => fetchMilestones()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, productionId])

  return { milestones, loading }
}

// Hook for Compliance
export function useCompliance(workspaceId: string, productionId?: string) {
  const [compliance, setCompliance] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchCompliance() {
      if (!workspaceId) return
      
      let query = supabase
        .from('compliance_requirements')
        .select(`
          *,
          production:production_id(name)
        `)
        .eq('workspace_id', workspaceId)

      if (productionId) {
        query = query.eq('production_id', productionId)
      }

      const { data, error } = await query.order('expires_at', { ascending: true })

      if (!error && data) {
        setCompliance(data)
      }
      setLoading(false)
    }

    fetchCompliance()

    // Real-time subscription
    const channel = supabase
      .channel(`compliance:${workspaceId}:${productionId || 'all'}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'compliance_requirements',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => fetchCompliance()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, productionId])

  return { compliance, loading }
}

// Hook for Safety
export function useSafety(workspaceId: string, productionId?: string) {
  const [safety, setSafety] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchSafety() {
      if (!workspaceId) return
      
      let query = supabase
        .from('safety_guidelines')
        .select(`
          *,
          production:production_id(name)
        `)
        .eq('workspace_id', workspaceId)

      if (productionId) {
        query = query.eq('production_id', productionId)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (!error && data) {
        setSafety(data)
      }
      setLoading(false)
    }

    fetchSafety()

    // Real-time subscription
    const channel = supabase
      .channel(`safety:${workspaceId}:${productionId || 'all'}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'safety_guidelines',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => fetchSafety()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, productionId])

  return { safety, loading }
}

// Hook for Production Summary (uses RPC function)
export function useProductionSummary(productionId: string) {
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchSummary() {
      const { data, error } = await supabase
        .rpc('get_production_summary', {
          p_production_id: productionId
        })

      if (!error && data) {
        setSummary(data)
      }
      setLoading(false)
    }

    if (productionId) {
      fetchSummary()
    }
  }, [productionId])

  return { summary, loading }
}
