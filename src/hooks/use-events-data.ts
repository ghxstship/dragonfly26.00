'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// Hook for All Events
export function useEvents(workspaceId: string, productionId?: string) {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchEvents = async () => {
    if (!workspaceId) return
    
    let query = supabase
      .from('events')
      .select(`
        *,
        location:location_id(name, address, city),
        production:production_id(name),
        bookings:bookings(count)
      `)
      .eq('workspace_id', workspaceId)

    if (productionId) {
      query = query.eq('production_id', productionId)
    }

    const { data, error } = await query.order('start_time', { ascending: true })

    if (!error && data) {
      setEvents(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchEvents()

    // Real-time subscription
    const channel = supabase
      .channel(`events:${workspaceId}:${productionId || 'all'}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => fetchEvents()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, productionId])

  return { events, loading, refresh: fetchEvents }
}

// Hook for Run of Show
export function useRunOfShow(workspaceId: string, eventId?: string) {
  const [runOfShow, setRunOfShow] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchRunOfShow = async () => {
    if (!workspaceId) return
    
    let query = supabase
      .from('run_of_show')
      .select(`
        *,
        event:event_id(name, start_time)
      `)
      .eq('workspace_id', workspaceId)

    if (eventId) {
      query = query.eq('event_id', eventId)
    }

    const { data, error } = await query.order('sequence_number', { ascending: true })

    if (!error && data) {
      setRunOfShow(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRunOfShow()

    // Real-time subscription
    const channel = supabase
      .channel(`run_of_show:${workspaceId}:${eventId || 'all'}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'run_of_show',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => fetchRunOfShow()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, eventId])

  const refresh = async () => {
    await fetchRunOfShow()
  }

  return { runOfShow, loading, refresh }
}

// Hook for Bookings
export function useBookings(workspaceId: string) {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchBookings = async () => {
    if (!workspaceId) return
    
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        event:event_id(name, start_time),
        location:location_id(name, city)
      `)
      .eq('workspace_id', workspaceId)
      .order('check_in', { ascending: true })

    if (!error && data) {
      setBookings(data)
    }
    setLoading(false)
  }

  useEffect(() => {

    fetchBookings()

    // Real-time subscription
    const channel = supabase
      .channel(`bookings:${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => fetchBookings()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId])

  const refresh = async () => {
    await fetchBookings()
  }

  return { bookings, loading, refresh }
}

// Hook for Incidents
export function useIncidents(workspaceId: string, eventId?: string) {
  const [incidents, setIncidents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchIncidents = async () => {
    if (!workspaceId) return
    
    let query = supabase
      .from('incidents')
      .select(`
        *,
        event:event_id(name),
        reported_by_user:profiles!reported_by(first_name, last_name)
      `)
      .eq('workspace_id', workspaceId)

    if (eventId) {
      query = query.eq('event_id', eventId)
    }

    const { data, error } = await query.order('occurred_at', { ascending: false })

    if (!error && data) {
      setIncidents(data)
    }
    setLoading(false)
  }

  useEffect(() => {

    fetchIncidents()

    // Real-time subscription
    const channel = supabase
      .channel(`incidents:${workspaceId}:${eventId || 'all'}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'incidents',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => fetchIncidents()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, eventId])

  const refresh = async () => {
    await fetchIncidents()
  }

  return { incidents, loading, refresh }
}

// Hook for Tours
export function useTours(workspaceId: string) {
  const [tours, setTours] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchTours = async () => {
    if (!workspaceId) return
    
    const { data, error } = await supabase
      .from('tours')
      .select(`
        *,
        production:production_id(name),
        tour_manager:profiles!tour_manager_id(first_name, last_name),
        tour_dates:tour_dates(count)
      `)
      .eq('workspace_id', workspaceId)
      .order('start_date', { ascending: false })

    if (!error && data) {
      setTours(data)
    }
    setLoading(false)
  }

  useEffect(() => {

    fetchTours()

    // Real-time subscription
    const channel = supabase
      .channel(`tours:${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tours',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => fetchTours()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId])

  const refresh = async () => {
    await fetchTours()
  }

  return { tours, loading, refresh }
}

// Hook for Shipments
export function useShipments(workspaceId: string) {
  const [shipments, setShipments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchShipments = async () => {
    if (!workspaceId) return
    
    const { data, error } = await supabase
      .from('shipments')
      .select(`
        *,
        production:production_id(name),
        event:event_id(name),
        origin:origin_location_id(name),
        destination:destination_location_id(name)
      `)
      .eq('workspace_id', workspaceId)
      .order('ship_date', { ascending: false })

    if (!error && data) {
      setShipments(data)
    }
    setLoading(false)
  }

  useEffect(() => {

    fetchShipments()

    // Real-time subscription
    const channel = supabase
      .channel(`shipments:${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shipments',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => fetchShipments()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId])

  const refresh = async () => {
    await fetchShipments()
  }

  return { shipments, loading, refresh }
}
