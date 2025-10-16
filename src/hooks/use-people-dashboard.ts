'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// Dashboard overview data
export function usePeopleDashboard(workspaceId: string) {
  const [data, setData] = useState({
    headcount: {
      active: 0,
      fullTime: 0,
      partTime: 0,
      contractors: 0,
      onLeave: 0
    },
    schedule: {
      onDuty: 0,
      comingSoon: 0,
      openShifts: 0
    },
    approvals: {
      total: 0,
      pto: 0,
      timesheets: 0,
      shifts: 0,
      documents: 0
    },
    alerts: [] as any[],
    stats: {
      onboarding: 0,
      reviewsDue: 0,
      ptoRequests: 0
    }
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchDashboardData() {
      if (!workspaceId) return

      try {
        // Headcount
        const { data: personnel } = await supabase
          .from('personnel')
          .select('employment_status, employment_type')
          .eq('workspace_id', workspaceId)

        const headcount = {
          active: personnel?.filter(p => p.employment_status === 'active').length || 0,
          fullTime: personnel?.filter(p => p.employment_type === 'full_time' && p.employment_status === 'active').length || 0,
          partTime: personnel?.filter(p => p.employment_type === 'part_time' && p.employment_status === 'active').length || 0,
          contractors: personnel?.filter(p => p.employment_type === 'contractor' && p.employment_status === 'active').length || 0,
          onLeave: personnel?.filter(p => p.employment_status === 'on_leave').length || 0
        }

        // Today's schedule
        const today = new Date().toISOString().split('T')[0]
        const { data: shifts } = await supabase
          .from('scheduled_shifts')
          .select('status, personnel_id, start_time')
          .eq('workspace_id', workspaceId)
          .eq('shift_date', today)

        const now = new Date()
        const schedule = {
          onDuty: shifts?.filter(s => {
            const start = new Date(s.start_time)
            return s.status === 'in_progress' || (s.status === 'confirmed' && start <= now)
          }).length || 0,
          comingSoon: shifts?.filter(s => {
            const start = new Date(s.start_time)
            return s.status === 'confirmed' && start > now
          }).length || 0,
          openShifts: shifts?.filter(s => s.personnel_id === null && s.status === 'scheduled').length || 0
        }

        // Pending approvals
        const { data: ptoRequests } = await supabase
          .from('pto_requests')
          .select('id')
          .eq('workspace_id', workspaceId)
          .eq('status', 'pending')

        const { data: timesheets } = await supabase
          .from('time_entries')
          .select('id')
          .eq('workspace_id', workspaceId)
          .eq('approval_status', 'pending')

        const { data: shiftSwaps } = await supabase
          .from('shift_swap_requests')
          .select('id')
          .eq('workspace_id', workspaceId)
          .eq('status', 'pending')

        const approvals = {
          pto: ptoRequests?.length || 0,
          timesheets: timesheets?.length || 0,
          shifts: shiftSwaps?.length || 0,
          documents: 0,
          total: (ptoRequests?.length || 0) + (timesheets?.length || 0) + (shiftSwaps?.length || 0)
        }

        // Compliance alerts
        const { data: violations } = await supabase
          .from('compliance_violations')
          .select('*')
          .eq('workspace_id', workspaceId)
          .eq('status', 'open')
          .order('severity', { ascending: false })
          .limit(5)

        // Quick stats
        const { data: onboarding } = await supabase
          .from('personnel')
          .select('id')
          .eq('workspace_id', workspaceId)
          .eq('onboarding_status', 'in_progress')

        const { data: reviews } = await supabase
          .from('performance_reviews')
          .select('id')
          .eq('workspace_id', workspaceId)
          .eq('status', 'pending')

        setData({
          headcount,
          schedule,
          approvals,
          alerts: violations || [],
          stats: {
            onboarding: onboarding?.length || 0,
            reviewsDue: reviews?.length || 0,
            ptoRequests: ptoRequests?.length || 0
          }
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()

    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)

    return () => clearInterval(interval)
  }, [workspaceId])

  return { data, loading }
}

// Today's schedule details
export function useTodaysSchedule(workspaceId: string) {
  const [schedule, setSchedule] = useState<{
    onDuty: any[]
    comingSoon: any[]
    openShifts: any[]
    outToday: any[]
  }>({
    onDuty: [],
    comingSoon: [],
    openShifts: [],
    outToday: []
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchSchedule() {
      if (!workspaceId) return

      const today = new Date().toISOString().split('T')[0]
      const now = new Date()

      try {
        // Get today's shifts
        const { data: shifts } = await supabase
          .from('scheduled_shifts')
          .select(`
            *,
            personnel:personnel(id, first_name, last_name, avatar_url)
          `)
          .eq('workspace_id', workspaceId)
          .eq('shift_date', today)
          .order('start_time')

        const onDuty = shifts?.filter(s => {
          const start = new Date(s.start_time)
          const end = new Date(s.end_time)
          return s.personnel_id && (s.status === 'in_progress' || (s.status === 'confirmed' && start <= now && end >= now))
        }).map(s => ({
          id: s.id,
          personnelId: s.personnel_id,
          name: `${s.personnel.first_name} ${s.personnel.last_name}`,
          avatar: s.personnel.avatar_url,
          startTime: new Date(s.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          endTime: new Date(s.end_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          location: s.location
        })) || []

        const comingSoon = shifts?.filter(s => {
          const start = new Date(s.start_time)
          return s.personnel_id && s.status === 'confirmed' && start > now
        }).map(s => ({
          id: s.id,
          personnelId: s.personnel_id,
          name: `${s.personnel.first_name} ${s.personnel.last_name}`,
          avatar: s.personnel.avatar_url,
          startTime: new Date(s.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          endTime: new Date(s.end_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          location: s.location
        })) || []

        const openShifts = shifts?.filter(s => !s.personnel_id && s.status === 'scheduled')
          .reduce((acc: any, s: any) => {
            const time = new Date(s.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            const existing = acc.find((item: { time: string; count: number; location?: string }) => item.time === time)
            if (existing) {
              existing.count++
            } else {
              acc.push({ time, count: 1, location: s.location })
            }
            return acc
          }, [] as { time: string; count: number; location?: string }[]) || []

        // Get PTO for today
        const { data: ptoToday } = await supabase
          .from('pto_requests')
          .select(`
            *,
            personnel:personnel(first_name, last_name, avatar_url)
          `)
          .eq('workspace_id', workspaceId)
          .eq('status', 'approved')
          .lte('start_date', today)
          .gte('end_date', today)

        const outToday = ptoToday?.map(pto => ({
          name: `${pto.personnel.first_name} ${pto.personnel.last_name}`,
          reason: 'pto' as const,
          avatar: pto.personnel.avatar_url
        })) || []

        setSchedule({ onDuty, comingSoon, openShifts, outToday })
      } catch (error) {
        console.error('Error fetching schedule:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSchedule()

    // Refresh every minute
    const interval = setInterval(fetchSchedule, 60000)

    return () => clearInterval(interval)
  }, [workspaceId])

  return { schedule, loading }
}

// PTO requests
export function usePTORequests(workspaceId: string, status?: string) {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchPTORequests() {
      if (!workspaceId) return

      let query = supabase
        .from('pto_requests')
        .select(`
          *,
          personnel:personnel(first_name, last_name, avatar_url),
          policy:pto_policies(name, type)
        `)
        .eq('workspace_id', workspaceId)

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query.order('requested_at', { ascending: false })

      if (!error && data) {
        setRequests(data)
      }
      setLoading(false)
    }

    fetchPTORequests()

    const channel = supabase
      .channel(`pto_requests:${workspaceId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pto_requests', filter: `workspace_id=eq.${workspaceId}` },
        () => fetchPTORequests()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, status])

  return { requests, loading }
}

// Compliance violations
export function useComplianceViolations(workspaceId: string) {
  const [violations, setViolations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchViolations() {
      if (!workspaceId) return

      const { data, error } = await supabase
        .from('compliance_violations')
        .select(`
          *,
          personnel:personnel(first_name, last_name),
          rule:labor_compliance_rules(name, rule_type)
        `)
        .eq('workspace_id', workspaceId)
        .eq('status', 'open')
        .order('severity', { ascending: false })
        .order('violation_date', { ascending: false })

      if (!error && data) {
        setViolations(data)
      }
      setLoading(false)
    }

    fetchViolations()

    const channel = supabase
      .channel(`violations:${workspaceId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'compliance_violations', filter: `workspace_id=eq.${workspaceId}` },
        () => fetchViolations()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId])

  return { violations, loading }
}

// Pending approvals by type
export function usePendingApprovals(workspaceId: string) {
  const [approvals, setApprovals] = useState<any>({
    pto: [],
    timesheets: [],
    shifts: [],
    all: []
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchApprovals() {
      if (!workspaceId) return

      try {
        // PTO requests
        const { data: pto } = await supabase
          .from('pto_requests')
          .select(`
            *,
            personnel:personnel(first_name, last_name, avatar_url)
          `)
          .eq('workspace_id', workspaceId)
          .eq('status', 'pending')

        // Timesheets
        const { data: timesheets } = await supabase
          .from('time_entries')
          .select(`
            *,
            personnel:personnel(first_name, last_name, avatar_url)
          `)
          .eq('workspace_id', workspaceId)
          .eq('approval_status', 'pending')

        // Shift swaps
        const { data: shifts } = await supabase
          .from('shift_swap_requests')
          .select(`
            *,
            requesting_personnel:personnel!requesting_personnel_id(first_name, last_name, avatar_url),
            target_personnel:personnel!target_personnel_id(first_name, last_name, avatar_url)
          `)
          .eq('workspace_id', workspaceId)
          .eq('status', 'pending')

        const all = [
          ...(pto?.map(item => ({ ...item, type: 'pto' })) || []),
          ...(timesheets?.map(item => ({ ...item, type: 'timesheet' })) || []),
          ...(shifts?.map(item => ({ ...item, type: 'shift_swap' })) || [])
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

        setApprovals({
          pto: pto || [],
          timesheets: timesheets || [],
          shifts: shifts || [],
          all
        })
      } catch (error) {
        console.error('Error fetching approvals:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchApprovals()

    // Refresh every 30 seconds
    const interval = setInterval(fetchApprovals, 30000)

    return () => clearInterval(interval)
  }, [workspaceId])

  return { approvals, loading }
}
