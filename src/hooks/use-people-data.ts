'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// Hook for Personnel
export function usePersonnel(workspaceId: string) {
  const [personnel, setPersonnel] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchPersonnel() {
      const { data, error } = await supabase
        .from('personnel')
        .select(`
          *,
          teams:team_members(team:team_id(name))
        `)
        .eq('workspace_id', workspaceId)
        .order('last_name', { ascending: true })

      if (!error && data) {
        setPersonnel(data)
      }
      setLoading(false)
    }

    fetchPersonnel()

    const channel = supabase
      .channel(`personnel:${workspaceId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'personnel', filter: `workspace_id=eq.${workspaceId}` },
        () => fetchPersonnel()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId])

  return { personnel, loading }
}

// Hook for Teams
export function useTeams(workspaceId: string) {
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchTeams() {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          lead:team_lead_id(first_name, last_name),
          members:team_members(count)
        `)
        .eq('workspace_id', workspaceId)
        .order('name', { ascending: true })

      if (!error && data) {
        setTeams(data)
      }
      setLoading(false)
    }

    fetchTeams()

    const channel = supabase
      .channel(`teams:${workspaceId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'teams', filter: `workspace_id=eq.${workspaceId}` },
        () => fetchTeams()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId])

  return { teams, loading }
}

// Hook for Time Entries
export function useTimeEntries(workspaceId: string, personnelId?: string) {
  const [timeEntries, setTimeEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchTimeEntries() {
      let query = supabase
        .from('time_entries')
        .select(`
          *,
          personnel:personnel_id(first_name, last_name),
          production:production_id(name)
        `)
        .eq('workspace_id', workspaceId)

      if (personnelId) {
        query = query.eq('personnel_id', personnelId)
      }

      const { data, error } = await query.order('start_time', { ascending: false })

      if (!error && data) {
        setTimeEntries(data)
      }
      setLoading(false)
    }

    fetchTimeEntries()

    const channel = supabase
      .channel(`time_entries:${workspaceId}:${personnelId || 'all'}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'time_entries', filter: `workspace_id=eq.${workspaceId}` },
        () => fetchTimeEntries()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, personnelId])

  return { timeEntries, loading }
}

// Hook for Training
export function useTraining(workspaceId: string) {
  const [training, setTraining] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchTraining() {
      const { data, error } = await supabase
        .from('training_sessions')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('session_date', { ascending: false })

      if (!error && data) {
        setTraining(data)
      }
      setLoading(false)
    }

    fetchTraining()

    const channel = supabase
      .channel(`training:${workspaceId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'training_sessions', filter: `workspace_id=eq.${workspaceId}` },
        () => fetchTraining()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId])

  return { training, loading }
}

// Hook for Job Openings
export function useJobOpenings(workspaceId: string) {
  const [openings, setOpenings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchOpenings() {
      const { data, error } = await supabase
        .from('job_openings')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setOpenings(data)
      }
      setLoading(false)
    }

    fetchOpenings()

    const channel = supabase
      .channel(`openings:${workspaceId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'job_openings', filter: `workspace_id=eq.${workspaceId}` },
        () => fetchOpenings()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId])

  return { openings, loading }
}
