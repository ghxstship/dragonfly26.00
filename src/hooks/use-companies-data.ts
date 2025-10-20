'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Company {
  id: string
  organization_id: string
  name: string
  legal_name: string | null
  tax_id: string | null
  industry: string | null
  size: string | null
  website: string | null
  logo_url: string | null
  description: string | null
  address: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  country: string | null
  phone: string | null
  email: string | null
  status: 'active' | 'inactive' | 'prospect'
  relationship_type: 'client' | 'vendor' | 'partner' | 'competitor'
  tags: string[]
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface CompanyContact {
  id: string
  company_id: string
  first_name: string
  last_name: string
  title: string | null
  email: string | null
  phone: string | null
  mobile: string | null
  is_primary: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface CompanyContract {
  id: string
  company_id: string
  name: string
  type: string
  value: number
  currency: string
  start_date: string
  end_date: string | null
  status: 'draft' | 'active' | 'expired' | 'terminated'
  terms: string | null
  file_url: string | null
  created_at: string
  updated_at: string
}

export interface CompanyDocument {
  id: string
  company_id: string
  name: string
  type: string
  file_url: string
  file_size: number
  uploaded_by: string
  created_at: string
}

export interface CompanyNote {
  id: string
  company_id: string
  content: string
  created_by: string
  created_at: string
  updated_at: string
}

export function useCompaniesData() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [contacts, setContacts] = useState<CompanyContact[]>([])
  const [contracts, setContracts] = useState<CompanyContract[]>([])
  const [documents, setDocuments] = useState<CompanyDocument[]>([])
  const [notes, setNotes] = useState<CompanyNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchAllData()
    
    const channel = supabase
      .channel('companies-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'companies' }, fetchCompanies)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'company_contacts' }, fetchContacts)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function fetchAllData() {
    setLoading(true)
    try {
      await Promise.all([fetchCompanies(), fetchContacts(), fetchContracts(), fetchDocuments(), fetchNotes()])
      setError(null)
    } catch (err: any) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchCompanies() {
    const { data, error } = await supabase.from('companies').select('*').order('name')
    if (error) throw error
    setCompanies(data || [])
  }

  async function fetchContacts() {
    const { data, error } = await supabase.from('company_contacts').select('*').order('last_name')
    if (error) throw error
    setContacts(data || [])
  }

  async function fetchContracts() {
    const { data, error } = await supabase.from('company_contracts').select('*').order('start_date', { ascending: false })
    if (!error && data) setContracts(data)
  }

  async function fetchDocuments() {
    const { data, error } = await supabase.from('company_documents').select('*').order('created_at', { ascending: false })
    if (!error && data) setDocuments(data)
  }

  async function fetchNotes() {
    const { data, error } = await supabase.from('company_notes').select('*').order('created_at', { ascending: false })
    if (!error && data) setNotes(data)
  }

  async function createCompany(companyData: Omit<Company, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase.from('companies').insert(companyData).select().single()
    if (error) throw error
    await fetchCompanies()
    return data
  }

  async function updateCompany(id: string, updates: Partial<Company>) {
    const { id: _, created_at, ...validUpdates } = updates as any
    const { data, error } = await supabase.from('companies').update({ ...validUpdates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    await fetchCompanies()
    return data
  }

  async function deleteCompany(id: string) {
    const { error } = await supabase.from('companies').delete().eq('id', id)
    if (error) throw error
    await fetchCompanies()
  }

  async function addContact(contactData: Omit<CompanyContact, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase.from('company_contacts').insert(contactData).select().single()
    if (error) throw error
    await fetchContacts()
    return data
  }

  async function updateContact(id: string, updates: Partial<CompanyContact>) {
    const { id: _, created_at, ...validUpdates } = updates as any
    const { data, error } = await supabase.from('company_contacts').update({ ...validUpdates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    await fetchContacts()
    return data
  }

  async function deleteContact(id: string) {
    const { error } = await supabase.from('company_contacts').delete().eq('id', id)
    if (error) throw error
    await fetchContacts()
  }

  return {
    companies, contacts, contracts, documents, notes, loading, error,
    createCompany, updateCompany, deleteCompany,
    addContact, updateContact, deleteContact,
    refresh: fetchAllData,
  }
}
