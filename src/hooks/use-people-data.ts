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
      if (!workspaceId) return
      
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
      if (!workspaceId) return
      
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          lead:personnel!leader_id(first_name, last_name),
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
      if (!workspaceId) return
      
      let query = supabase
        .from('time_entries')
        .select(`
          *,
          personnel:personnel!personnel_id(first_name, last_name),
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
    async function fetchTrainingRecords() {
      if (!workspaceId) return
      
      const { data, error } = await supabase
        .from('training_records')
        .select(`
          *,
          personnel:personnel!personnel_id(first_name, last_name)
        `)
        .eq('workspace_id', workspaceId)
        .order('completion_date', { ascending: false })

      if (!error && data) {
        setTraining(data)
      }
      setLoading(false)
    }

    fetchTrainingRecords()

    const channel = supabase
      .channel(`training:${workspaceId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'training_records', filter: `workspace_id=eq.${workspaceId}` },
        () => fetchTrainingRecords()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId])

  return { training, loading }
}

// Hook for Personnel Assignments
export function useAssignments(workspaceId: string, personnelId?: string) {
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchAssignments() {
      if (!workspaceId) return
      
      let query = supabase
        .from('personnel_assignments')
        .select(`
          *,
          personnel:personnel!personnel_id(first_name, last_name),
          production:productions!production_id(name)
        `)
        .eq('workspace_id', workspaceId)

      if (personnelId) {
        query = query.eq('personnel_id', personnelId)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (!error && data) {
        setAssignments(data)
      }
      setLoading(false)
    }

    fetchAssignments()

    const channel = supabase
      .channel(`assignments:${workspaceId}:${personnelId || 'all'}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'personnel_assignments', filter: `workspace_id=eq.${workspaceId}` },
        () => fetchAssignments()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, personnelId])

  return { assignments, loading }
}

// Hook for Job Openings
export function useJobOpenings(workspaceId: string) {
  const [openings, setOpenings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchJobOpenings() {
      if (!workspaceId) return
      
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

    fetchJobOpenings()

    const channel = supabase
      .channel(`openings:${workspaceId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'job_openings', filter: `workspace_id=eq.${workspaceId}` },
        () => fetchJobOpenings()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId])

  return { openings, loading }
}

// Hook for Job Applicants
export function useJobApplicants(workspaceId: string, jobOpeningId?: string) {
  const [applicants, setApplicants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchApplicants() {
      if (!workspaceId) return
      
      let query = supabase
        .from('job_applicants')
        .select(`
          *,
          job_opening:job_openings!job_opening_id(title)
        `)
        .eq('workspace_id', workspaceId)

      if (jobOpeningId) {
        query = query.eq('job_opening_id', jobOpeningId)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (!error && data) {
        setApplicants(data)
      }
      setLoading(false)
    }

    fetchApplicants()

    const channel = supabase
      .channel(`applicants:${workspaceId}:${jobOpeningId || 'all'}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'job_applicants', filter: `workspace_id=eq.${workspaceId}` },
        () => fetchApplicants()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, jobOpeningId])

  return { applicants, loading }
}
