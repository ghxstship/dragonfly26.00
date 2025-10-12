'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// Hook for Budgets
export function useBudgets(workspaceId: string, productionId?: string) {
  const [budgets, setBudgets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchBudgets() {
      let query = supabase
        .from('budgets')
        .select(`
          *,
          production:production_id(name),
          line_items:budget_line_items(count)
        `)
        .eq('workspace_id', workspaceId)

      if (productionId) {
        query = query.eq('production_id', productionId)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (!error && data) {
        setBudgets(data)
      }
      setLoading(false)
    }

    fetchBudgets()

    const channel = supabase
      .channel(`budgets:${workspaceId}:${productionId || 'all'}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'budgets', filter: `workspace_id=eq.${workspaceId}` },
        () => fetchBudgets()
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [workspaceId, productionId])

  return { budgets, loading }
}

// Hook for Transactions
export function useTransactions(workspaceId: string, budgetId?: string) {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchTransactions() {
      let query = supabase
        .from('financial_transactions')
        .select(`
          *,
          budget:budget_id(name),
          production:production_id(name)
        `)
        .eq('workspace_id', workspaceId)

      if (budgetId) {
        query = query.eq('budget_id', budgetId)
      }

      const { data, error } = await query.order('transaction_date', { ascending: false })

      if (!error && data) {
        setTransactions(data)
      }
      setLoading(false)
    }

    fetchTransactions()

    const channel = supabase
      .channel(`transactions:${workspaceId}:${budgetId || 'all'}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'financial_transactions', filter: `workspace_id=eq.${workspaceId}` },
        () => fetchTransactions()
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [workspaceId, budgetId])

  return { transactions, loading }
}

// Hook for Invoices
export function useInvoices(workspaceId: string) {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchInvoices() {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          production:production_id(name),
          company:company_id(name),
          items:invoice_items(count)
        `)
        .eq('workspace_id', workspaceId)
        .order('invoice_date', { ascending: false })

      if (!error && data) {
        setInvoices(data)
      }
      setLoading(false)
    }

    fetchInvoices()

    const channel = supabase
      .channel(`invoices:${workspaceId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'invoices', filter: `workspace_id=eq.${workspaceId}` },
        () => fetchInvoices()
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [workspaceId])

  return { invoices, loading }
}

// Hook for Payroll
export function usePayroll(workspaceId: string) {
  const [payroll, setPayroll] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchPayroll() {
      const { data, error } = await supabase
        .from('payroll')
        .select(`
          *,
          production:production_id(name),
          items:payroll_items(count)
        `)
        .eq('workspace_id', workspaceId)
        .order('pay_date', { ascending: false })

      if (!error && data) {
        setPayroll(data)
      }
      setLoading(false)
    }

    fetchPayroll()

    const channel = supabase
      .channel(`payroll:${workspaceId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payroll', filter: `workspace_id=eq.${workspaceId}` },
        () => fetchPayroll()
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [workspaceId])

  return { payroll, loading }
}

// Hook for Budget Variance (uses RPC function)
export function useBudgetVariance(budgetId: string) {
  const [variance, setVariance] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchVariance() {
      const { data, error } = await supabase
        .rpc('get_budget_variance', {
          p_budget_id: budgetId
        })

      if (!error && data) {
        setVariance(data)
      }
      setLoading(false)
    }

    if (budgetId) {
      fetchVariance()
    }
  }, [budgetId])

  return { variance, loading }
}

// Hook for GL Codes
export function useGLCodes(workspaceId: string) {
  const [glCodes, setGLCodes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchGLCodes() {
      const { data, error } = await supabase
        .from('gl_codes')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('is_active', true)
        .order('code', { ascending: true })

      if (!error && data) {
        setGLCodes(data)
      }
      setLoading(false)
    }

    fetchGLCodes()

    const channel = supabase
      .channel(`gl_codes:${workspaceId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gl_codes', filter: `workspace_id=eq.${workspaceId}` },
        () => fetchGLCodes()
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [workspaceId])

  return { glCodes, loading }
}
