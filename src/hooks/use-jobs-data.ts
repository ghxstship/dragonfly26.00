'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Job {
  id: string
  organization_id: string
  name: string
  job_number: string
  client_id: string
  status: 'draft' | 'active' | 'on_hold' | 'completed' | 'cancelled'
  type: string
  start_date: string
  end_date: string | null
  budget: number
  actual_cost: number
  currency: string
  location: string | null
  description: string | null
  tags: string[]
  created_at: string
  updated_at: string
}

export interface JobPipeline {
  id: string
  job_id: string
  stage: string
  status: string
  progress: number
  start_date: string
  end_date: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface JobOffer {
  id: string
  job_id: string
  offer_number: string
  client_id: string
  amount: number
  currency: string
  valid_until: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  terms: string | null
  created_at: string
  updated_at: string
}

export interface JobInvoice {
  id: string
  job_id: string
  invoice_number: string
  amount: number
  currency: string
  due_date: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  payment_date: string | null
  created_at: string
  updated_at: string
}

export interface JobTeamMember {
  id: string
  job_id: string
  user_id: string
  role: string
  allocation: number
  start_date: string
  end_date: string | null
  created_at: string
}

export function useJobsData() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [pipeline, setPipeline] = useState<JobPipeline[]>([])
  const [offers, setOffers] = useState<JobOffer[]>([])
  const [invoices, setInvoices] = useState<JobInvoice[]>([])
  const [teamMembers, setTeamMembers] = useState<JobTeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchAllData()
    const channel = supabase
      .channel('jobs-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, fetchJobs)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'job_pipeline' }, fetchPipeline)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  async function fetchAllData() {
    setLoading(true)
    try {
      await Promise.all([fetchJobs(), fetchPipeline(), fetchOffers(), fetchInvoices(), fetchTeamMembers()])
      setError(null)
    } catch (err: any) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchJobs() {
    const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false })
    if (error) throw error
    setJobs(data || [])
  }

  async function fetchPipeline() {
    const { data, error } = await supabase.from('job_pipeline').select('*').order('start_date')
    if (error) throw error
    setPipeline(data || [])
  }

  async function fetchOffers() {
    const { data, error } = await supabase.from('job_offers').select('*').order('created_at', { ascending: false })
    if (!error && data) setOffers(data)
  }

  async function fetchInvoices() {
    const { data, error } = await supabase.from('job_invoices').select('*').order('created_at', { ascending: false })
    if (!error && data) setInvoices(data)
  }

  async function fetchTeamMembers() {
    const { data, error } = await supabase.from('job_team_members').select('*, profiles(full_name, avatar_url)').order('start_date')
    if (!error && data) setTeamMembers(data)
  }

  async function createJob(jobData: Omit<Job, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase.from('jobs').insert(jobData).select().single()
    if (error) throw error
    await fetchJobs()
    return data
  }

  async function updateJob(id: string, updates: Partial<Job>) {
    const { id: _, created_at, ...validUpdates } = updates as any
    const { data, error } = await supabase.from('jobs').update({ ...validUpdates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    await fetchJobs()
    return data
  }

  async function deleteJob(id: string) {
    const { error } = await supabase.from('jobs').delete().eq('id', id)
    if (error) throw error
    await fetchJobs()
  }

  async function updatePipelineStage(id: string, stage: string, progress: number) {
    const { data, error } = await supabase.from('job_pipeline').update({ stage, progress, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    await fetchPipeline()
    return data
  }

  async function createOffer(offerData: Omit<JobOffer, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase.from('job_offers').insert(offerData).select().single()
    if (error) throw error
    await fetchOffers()
    return data
  }

  async function createInvoice(invoiceData: Omit<JobInvoice, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase.from('job_invoices').insert(invoiceData).select().single()
    if (error) throw error
    await fetchInvoices()
    return data
  }

  async function assignTeamMember(memberData: Omit<JobTeamMember, 'id' | 'created_at'>) {
    const { data, error } = await supabase.from('job_team_members').insert(memberData).select().single()
    if (error) throw error
    await fetchTeamMembers()
    return data
  }

  return {
    jobs, pipeline, offers, invoices, teamMembers, loading, error,
    createJob, updateJob, deleteJob, updatePipelineStage,
    createOffer, createInvoice, assignTeamMember,
    refresh: fetchAllData,
  }
}
