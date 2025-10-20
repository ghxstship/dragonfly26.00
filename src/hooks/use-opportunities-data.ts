import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * Opportunities Data Hook
 * 
 * Manages data for the new Opportunities module
 * Includes: Jobs, Careers, Sponsorship, Grants
 * 
 * Features:
 * - Real-time Supabase integration
 * - Global grant scraping support
 * - Type-safe data handling
 */

export interface OpportunityJob {
  id: string
  title: string
  company: string
  type: 'contractor' | 'subcontractor' | 'freelance'
  location: string
  rate: string
  duration: string
  posted: string
  status: 'open' | 'filled' | 'closed'
  created_at: string
  updated_at: string
}

export interface OpportunityCareer {
  id: string
  position: string
  company: string
  department: string
  level: 'entry' | 'mid' | 'senior' | 'executive'
  salary: string
  benefits: string[]
  posted: string
  applicants: number
  created_at: string
  updated_at: string
}

export interface OpportunitySponsor {
  id: string
  title: string
  brand: string
  category: string
  value: string
  duration: string
  benefits: string[]
  requirements: string[]
  status: 'active' | 'pending' | 'closed'
  created_at: string
  updated_at: string
}

export interface OpportunityGrant {
  id: string
  title: string
  organization: string
  amount: string
  region: string
  category: string
  deadline: string
  eligibility: string[]
  status: 'open' | 'closing-soon' | 'closed'
  source_url?: string
  created_at: string
  updated_at: string
}

export function useOpportunitiesData(workspaceId: string) {
  const [jobs, setJobs] = useState<OpportunityJob[]>([])
  const [careers, setCareers] = useState<OpportunityCareer[]>([])
  const [sponsorships, setSponsorships] = useState<OpportunitySponsor[]>([])
  const [grants, setGrants] = useState<OpportunityGrant[]>([])
  const [featuredOpportunities, setFeaturedOpportunities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect((): void | (() => void) => {
    if (!workspaceId) {
      setLoading(false)
      return
    }

    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        // Fetch jobs
        const { data: jobsData, error: jobsError } = await supabase
          .from('opportunity_jobs')
          .select('*')
          .eq('workspace_id', workspaceId)
          .order('created_at', { ascending: false })

        if (jobsError) throw jobsError
        setJobs(jobsData || [])

        // Fetch careers
        const { data: careersData, error: careersError } = await supabase
          .from('opportunity_careers')
          .select('*')
          .eq('workspace_id', workspaceId)
          .order('created_at', { ascending: false })

        if (careersError) throw careersError
        setCareers(careersData || [])

        // Fetch sponsorships
        const { data: sponsorshipsData, error: sponsorshipsError } = await supabase
          .from('opportunity_sponsorships')
          .select('*')
          .eq('workspace_id', workspaceId)
          .order('created_at', { ascending: false })

        if (sponsorshipsError) throw sponsorshipsError
        setSponsorships(sponsorshipsData || [])

        // Fetch grants
        const { data: grantsData, error: grantsError } = await supabase
          .from('opportunity_grants')
          .select('*')
          .eq('workspace_id', workspaceId)
          .order('deadline', { ascending: true })

        if (grantsError) throw grantsError
        setGrants(grantsData || [])

        // Fetch featured opportunities
        const { data: featuredData, error: featuredError } = await supabase
          .from('opportunity_featured')
          .select('*')
          .eq('workspace_id', workspaceId)
          .eq('active', true)
          .order('priority', { ascending: false })
          .limit(10)

        if (featuredError) throw featuredError
        setFeaturedOpportunities(featuredData || [])

      } catch (err: unknown) {
        console.error('Error fetching opportunities data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Set up real-time subscriptions
    const jobsSubscription = supabase
      .channel('opportunity_jobs_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'opportunity_jobs', filter: `workspace_id=eq.${workspaceId}` },
        () => fetchData()
      )
      .subscribe()

    const careersSubscription = supabase
      .channel('opportunity_careers_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'opportunity_careers', filter: `workspace_id=eq.${workspaceId}` },
        () => fetchData()
      )
      .subscribe()

    const sponsorshipsSubscription = supabase
      .channel('opportunity_sponsorships_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'opportunity_sponsorships', filter: `workspace_id=eq.${workspaceId}` },
        () => fetchData()
      )
      .subscribe()

    const grantsSubscription = supabase
      .channel('opportunity_grants_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'opportunity_grants', filter: `workspace_id=eq.${workspaceId}` },
        () => fetchData()
      )
      .subscribe()

    return () => {
      jobsSubscription.unsubscribe()
      careersSubscription.unsubscribe()
      sponsorshipsSubscription.unsubscribe()
      grantsSubscription.unsubscribe()
    }
  }, [workspaceId])

  // Refresh grants (trigger web scraping)
  const refreshGrants = async (): Promise<void> => {
    try {
      // Call edge function to scrape global grants
      const { data, error } = await supabase.functions.invoke('scrape-grants', {
        body: { workspaceId }
      })

      if (error) throw error
      
      // Refresh grants data
      const { data: grantsData } = await supabase
        .from('opportunity_grants')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('deadline', { ascending: true })

      setGrants(grantsData || [])
    } catch (err: unknown) {
      console.error('Error refreshing grants:', err)
    }
  }

  return {
    jobs,
    careers,
    sponsorships,
    grants,
    featuredOpportunities,
    loading,
    error,
    refreshGrants,
  }
}
