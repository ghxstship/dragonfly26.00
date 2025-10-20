'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Resource {
  id: string
  organization_id: string
  title: string
  description: string | null
  type: 'document' | 'video' | 'link' | 'course' | 'guide'
  category: string
  url: string | null
  file_url: string | null
  tags: string[]
  views_count: number
  downloads_count: number
  is_featured: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export interface ResourceCategory {
  id: string
  name: string
  description: string | null
  icon: string | null
  resources_count: number
  created_at: string
}

export interface Course {
  id: string
  title: string
  description: string | null
  instructor: string
  duration_hours: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  enrollment_count: number
  rating: number
  is_published: boolean
  created_at: string
}

export interface Grant {
  id: string
  title: string
  description: string | null
  amount: number
  currency: string
  deadline: string
  eligibility: string | null
  status: 'open' | 'closed' | 'awarded'
  created_at: string
}

export interface Publication {
  id: string
  title: string
  authors: string[]
  abstract: string | null
  publication_date: string
  journal: string | null
  doi: string | null
  pdf_url: string | null
  citations_count: number
  created_at: string
}

export function useResourcesData() {
  const [resources, setResources] = useState<Resource[]>([])
  const [categories, setCategories] = useState<ResourceCategory[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [grants, setGrants] = useState<Grant[]>([])
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchAllData()
    const channel = supabase
      .channel('resources-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'resources' }, fetchResources)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'resource_courses' }, fetchCourses)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  async function fetchAllData() {
    setLoading(true)
    try {
      await Promise.all([fetchResources(), fetchCategories(), fetchCourses(), fetchGrants(), fetchPublications()])
      setError(null)
    } catch (err: any) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchResources() {
    const { data, error } = await supabase.from('resources').select('*').order('created_at', { ascending: false })
    if (error) throw error
    setResources(data || [])
  }

  async function fetchCategories() {
    const { data, error } = await supabase.from('resource_categories').select('*').order('name')
    if (error) throw error
    setCategories(data || [])
  }

  async function fetchCourses() {
    const { data, error } = await supabase.from('resource_courses').select('*').eq('is_published', true).order('created_at', { ascending: false })
    if (error) throw error
    setCourses(data || [])
  }

  async function fetchGrants() {
    const { data, error } = await supabase.from('grants').select('*').eq('status', 'open').order('deadline')
    if (!error && data) setGrants(data)
  }

  async function fetchPublications() {
    const { data, error } = await supabase.from('publications').select('*').order('publication_date', { ascending: false })
    if (!error && data) setPublications(data)
  }

  async function createResource(resourceData: Omit<Resource, 'id' | 'created_by' | 'views_count' | 'downloads_count' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    const { data, error } = await supabase.from('resources').insert({ ...resourceData, created_by: user.id, views_count: 0, downloads_count: 0 }).select().single()
    if (error) throw error
    await fetchResources()
    return data
  }

  async function updateResource(id: string, updates: Partial<Resource>) {
    const { id: _, created_by, views_count, downloads_count, created_at, ...validUpdates } = updates as any
    const { data, error } = await supabase.from('resources').update({ ...validUpdates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    await fetchResources()
    return data
  }

  async function incrementViews(id: string) {
    const resource = resources.find(r => r.id === id)
    if (!resource) throw new Error('Resource not found')
    const { data, error } = await supabase.from('resources').update({ views_count: resource.views_count + 1 }).eq('id', id).select().single()
    if (error) throw error
    await fetchResources()
    return data
  }

  async function incrementDownloads(id: string) {
    const resource = resources.find(r => r.id === id)
    if (!resource) throw new Error('Resource not found')
    const { data, error } = await supabase.from('resources').update({ downloads_count: resource.downloads_count + 1 }).eq('id', id).select().single()
    if (error) throw error
    await fetchResources()
    return data
  }

  async function enrollInCourse(courseId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    
    const course = courses.find(c => c.id === courseId)
    if (!course) throw new Error('Course not found')
    
    const { data, error } = await supabase.from('resource_courses').update({ enrollment_count: course.enrollment_count + 1 }).eq('id', courseId).select().single()
    if (error) throw error
    await fetchCourses()
    return data
  }

  async function applyForGrant(grantId: string, applicationData: Record<string, unknown>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    
    const { data, error } = await supabase.from('grant_applications').insert({
      grant_id: grantId,
      applicant_id: user.id,
      application_data: applicationData,
      status: 'submitted',
    }).select().single()
    
    if (error) throw error
    return data
  }

  return {
    resources, categories, courses, grants, publications, loading, error,
    createResource, updateResource, incrementViews, incrementDownloads,
    enrollInCourse, applyForGrant,
    refresh: fetchAllData,
  }
}
