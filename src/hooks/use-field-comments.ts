"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/lib/hooks/use-toast'
import { useTranslations } from 'next-intl'

interface FieldComment {
  id: string
  table_name: string
  record_id: string
  field_name: string
  content: string
  user_id: string
  created_at: string
  updated_at: string
  organization_id: string
  user?: {
    id: string
    email: string
    full_name?: string
  }
}

interface CreateFieldCommentParams {
  table_name: string
  record_id: string
  field_name: string
  content: string
  organization_id: string
}

interface UpdateFieldCommentParams {
  id: string
  content: string
}

export const useFieldComments = (
  tableName: string,
  recordId: string,
  fieldName: string
) => {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const t = useTranslations('fieldComments')

  // Query to fetch field comments
  const {
    data: comments = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['field-comments', tableName, recordId, fieldName],
    queryFn: async (): Promise<FieldComment[]> => {
      const { data, error } = await supabase
        .from('field_comments')
        .select(`
          *,
          user:user_id (
            id,
            email,
            full_name
          )
        `)
        .eq('table_name', tableName)
        .eq('record_id', recordId)
        .eq('field_name', fieldName)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as FieldComment[]
    },
    enabled: !!tableName && !!recordId && !!fieldName
  })

  // Mutation to create a field comment
  const createComment = useMutation({
    mutationFn: async (params: CreateFieldCommentParams) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('field_comments')
        .insert({
          ...params,
          user_id: user.id
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['field-comments', tableName, recordId, fieldName]
      })
      queryClient.invalidateQueries({
        queryKey: ['field-comments-count', tableName, recordId]
      })
      toast({
        title: t('commentAdded'),
        description: t('commentAddedSuccess')
      })
    },
    onError: (error: Error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive'
      })
    }
  })

  // Mutation to update a field comment
  const updateComment = useMutation({
    mutationFn: async ({ id, content }: UpdateFieldCommentParams) => {
      const { data, error } = await supabase
        .from('field_comments')
        .update({ content })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['field-comments', tableName, recordId, fieldName]
      })
      toast({
        title: t('commentUpdated'),
        description: t('commentUpdatedSuccess')
      })
    },
    onError: (error: Error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive'
      })
    }
  })

  // Mutation to delete a field comment (soft delete)
  const deleteComment = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('field_comments')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['field-comments', tableName, recordId, fieldName]
      })
      queryClient.invalidateQueries({
        queryKey: ['field-comments-count', tableName, recordId]
      })
      toast({
        title: t('commentDeleted'),
        description: t('commentDeletedSuccess')
      })
    },
    onError: (error: Error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive'
      })
    }
  })

  return {
    comments,
    isLoading,
    error,
    createComment: createComment.mutate,
    updateComment: updateComment.mutate,
    deleteComment: deleteComment.mutate,
    isCreating: createComment.isPending,
    isUpdating: updateComment.isPending,
    isDeleting: deleteComment.isPending
  }
}

// Hook to get comment counts for all fields in a record
export const useRecordFieldComments = (tableName: string, recordId: string) => {
  const supabase = createClient()

  const { data: fieldComments = [], isLoading } = useQuery({
    queryKey: ['field-comments-count', tableName, recordId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_record_field_comments', {
          p_table_name: tableName,
          p_record_id: recordId
        })

      if (error) throw error
      return data
    },
    enabled: !!tableName && !!recordId
  })

  return {
    fieldComments,
    isLoading
  }
}
