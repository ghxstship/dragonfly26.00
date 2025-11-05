'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'

export interface Transaction {
  id: string
  workspace_id: string
  transaction_number: string | null
  type: 'income' | 'expense' | 'transfer'
  category: string | null
  amount: number
  description: string | null
  date: string
  account_id: string | null
  gl_code_id: string | null
  budget_id: string | null
  status: 'pending' | 'cleared' | 'reconciled' | 'void'
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
}

export function useTransactions(workspaceId: string, filters?: {
  type?: string
  category?: string
  startDate?: string
  endDate?: string
}) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['transactions', workspaceId, filters],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('workspace_id', workspaceId)
        .is('deleted_at', null)

      if (filters?.type) {
        query = query.eq('type', filters.type)
      }
      if (filters?.category) {
        query = query.eq('category', filters.category)
      }
      if (filters?.startDate) {
        query = query.gte('date', filters.startDate)
      }
      if (filters?.endDate) {
        query = query.lte('date', filters.endDate)
      }

      const { data, error } = await query.order('date', { ascending: false })

      if (error) throw error
      return data as Transaction[]
    },
    enabled: !!workspaceId
  })

  // Real-time subscription
  useEffect(() => {
    if (!workspaceId) return

    const channel = supabase
      .channel(`transactions:${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['transactions', workspaceId] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, queryClient, supabase])

  const createTransaction = useMutation({
    mutationFn: async (transaction: Partial<Transaction>) => {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{ ...transaction, workspace_id: workspaceId }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', workspaceId] })
    }
  })

  const updateTransaction = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Transaction> & { id: string }) => {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', workspaceId] })
    }
  })

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transactions')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', workspaceId] })
    }
  })

  return {
    transactions: transactions || [],
    loading: isLoading,
    error,
    createTransaction: createTransaction.mutateAsync,
    updateTransaction: updateTransaction.mutateAsync,
    deleteTransaction: deleteTransaction.mutateAsync,
    isCreating: createTransaction.isPending,
    isUpdating: updateTransaction.isPending,
    isDeleting: deleteTransaction.isPending
  }
}
