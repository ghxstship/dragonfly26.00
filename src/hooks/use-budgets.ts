'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'

export interface Budget {
  id: string
  workspace_id: string
  name: string
  description: string | null
  category: string | null
  amount: number
  spent: number
  remaining: number
  period_start: string | null
  period_end: string | null
  status: 'draft' | 'active' | 'closed' | 'exceeded'
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
}

export function useBudgets(workspaceId: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { data: budgets, isLoading, error } = useQuery({
    queryKey: ['budgets', workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('workspace_id', workspaceId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Budget[]
    },
    enabled: !!workspaceId
  })

  // Real-time subscription
  useEffect(() => {
    if (!workspaceId) return

    const channel = supabase
      .channel(`budgets:${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'budgets',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['budgets', workspaceId] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, queryClient, supabase])

  const createBudget = useMutation({
    mutationFn: async (budget: Partial<Budget>) => {
      const { data, error } = await supabase
        .from('budgets')
        .insert([{ ...budget, workspace_id: workspaceId }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', workspaceId] })
    }
  })

  const updateBudget = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Budget> & { id: string }) => {
      const { data, error } = await supabase
        .from('budgets')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', workspaceId] })
    }
  })

  const deleteBudget = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('budgets')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets', workspaceId] })
    }
  })

  return {
    budgets: budgets || [],
    loading: isLoading,
    error,
    createBudget: createBudget.mutateAsync,
    updateBudget: updateBudget.mutateAsync,
    deleteBudget: deleteBudget.mutateAsync,
    isCreating: createBudget.isPending,
    isUpdating: updateBudget.isPending,
    isDeleting: deleteBudget.isPending
  }
}
