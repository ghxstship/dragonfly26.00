'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface CommunityPost {
  id: string
  author_id: string
  content: string
  type: 'post' | 'question' | 'announcement'
  likes_count: number
  comments_count: number
  tags: string[]
  is_pinned: boolean
  created_at: string
  updated_at: string
}

export interface CommunityConnection {
  id: string
  user_id: string
  connected_user_id: string
  status: 'pending' | 'accepted' | 'blocked'
  created_at: string
}

export interface CommunityEvent {
  id: string
  name: string
  description: string | null
  event_date: string
  location: string | null
  max_participants: number | null
  participants_count: number
  created_by: string
  created_at: string
}

export interface Competition {
  id: string
  name: string
  description: string | null
  start_date: string
  end_date: string
  status: 'upcoming' | 'active' | 'completed'
  prize: string | null
  participants_count: number
  created_at: string
}

export interface Showcase {
  id: string
  user_id: string
  title: string
  description: string | null
  media_url: string | null
  likes_count: number
  views_count: number
  featured: boolean
  created_at: string
}

export function useCommunityData() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [connections, setConnections] = useState<CommunityConnection[]>([])
  const [events, setEvents] = useState<CommunityEvent[]>([])
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [showcases, setShowcases] = useState<Showcase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchAllData()
    const channel = supabase
      .channel('community-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, fetchPosts)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_events' }, fetchEvents)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  async function fetchAllData() {
    setLoading(true)
    try {
      await Promise.all([fetchPosts(), fetchConnections(), fetchEvents(), fetchCompetitions(), fetchShowcases()])
      setError(null)
    } catch (err: any) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchPosts() {
    const { data, error } = await supabase.from('community_posts').select('*, profiles(full_name, avatar_url)').order('created_at', { ascending: false })
    if (error) throw error
    setPosts(data || [])
  }

  async function fetchConnections() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data, error } = await supabase.from('community_connections').select('*, profiles(full_name, avatar_url)').or(`user_id.eq.${user.id},connected_user_id.eq.${user.id}`)
    if (error) throw error
    setConnections(data || [])
  }

  async function fetchEvents() {
    const { data, error } = await supabase.from('community_events').select('*').order('event_date')
    if (error) throw error
    setEvents(data || [])
  }

  async function fetchCompetitions() {
    const { data, error } = await supabase.from('competitions').select('*').order('start_date', { ascending: false })
    if (!error && data) setCompetitions(data)
  }

  async function fetchShowcases() {
    const { data, error } = await supabase.from('showcases').select('*, profiles(full_name, avatar_url)').order('created_at', { ascending: false })
    if (!error && data) setShowcases(data)
  }

  async function createPost(postData: Omit<CommunityPost, 'id' | 'author_id' | 'likes_count' | 'comments_count' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    const { data, error } = await supabase.from('community_posts').insert({ ...postData, author_id: user.id, likes_count: 0, comments_count: 0 }).select().single()
    if (error) throw error
    await fetchPosts()
    return data
  }

  async function likePost(postId: string) {
    const post = posts.find(p => p.id === postId)
    if (!post) throw new Error('Post not found')
    const { data, error } = await supabase.from('community_posts').update({ likes_count: post.likes_count + 1 }).eq('id', postId).select().single()
    if (error) throw error
    await fetchPosts()
    return data
  }

  async function sendConnectionRequest(userId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    const { data, error } = await supabase.from('community_connections').insert({ user_id: user.id, connected_user_id: userId, status: 'pending' }).select().single()
    if (error) throw error
    await fetchConnections()
    return data
  }

  async function acceptConnection(connectionId: string) {
    const { data, error } = await supabase.from('community_connections').update({ status: 'accepted' }).eq('id', connectionId).select().single()
    if (error) throw error
    await fetchConnections()
    return data
  }

  async function createEvent(eventData: Omit<CommunityEvent, 'id' | 'created_by' | 'participants_count' | 'created_at'>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    const { data, error } = await supabase.from('community_events').insert({ ...eventData, created_by: user.id, participants_count: 0 }).select().single()
    if (error) throw error
    await fetchEvents()
    return data
  }

  async function joinEvent(eventId: string) {
    const event = events.find(e => e.id === eventId)
    if (!event) throw new Error('Event not found')
    const { data, error } = await supabase.from('community_events').update({ participants_count: event.participants_count + 1 }).eq('id', eventId).select().single()
    if (error) throw error
    await fetchEvents()
    return data
  }

  return {
    posts, connections, events, competitions, showcases, loading, error,
    createPost, likePost, sendConnectionRequest, acceptConnection,
    createEvent, joinEvent,
    refresh: fetchAllData,
  }
}
