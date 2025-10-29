/**
 * Typography Settings Hook
 * 
 * Manages typography settings at both organization and user levels.
 * Provides queries and mutations for customizing fonts, weights, and sizes.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useHasPermission } from '@/hooks/use-rbac';
import type { TypographySettings } from '@/lib/google-fonts';
import { 
  getDefaultTypographySettings, 
  validateTypographySettings,
  mergeTypographySettings 
} from '@/lib/google-fonts';

// =====================================================================================
// TYPES
// =====================================================================================

interface OrganizationTypography {
  id: string;
  typography_settings: TypographySettings;
}

interface UserTypography {
  id: string;
  typography_override: TypographySettings | null;
}

// =====================================================================================
// ORGANIZATION TYPOGRAPHY HOOK
// =====================================================================================

/**
 * Hook for managing organization-level typography settings
 * Only Phantom and Aviator roles can update organization typography
 */
export function useOrganizationTypography() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { data: canUpdateSettings } = useHasPermission('organization', 'settings.update');

  // Query organization typography settings
  const {
    data: organizationTypography,
    isLoading,
    error
  } = useQuery({
    queryKey: ['organization-typography'],
    queryFn: async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get user's organization
      const { data: membership } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();

      if (!membership?.organization_id) {
        throw new Error('No organization ID found');
      }

      const { data, error } = await supabase
        .from('organizations')
        .select('id, typography_settings')
        .eq('id', membership.organization_id)
        .single();

      if (error) throw error;

      // Validate and return settings
      const settings = data.typography_settings as TypographySettings;
      if (!validateTypographySettings(settings)) {
        return {
          id: data.id,
          typography_settings: getDefaultTypographySettings()
        };
      }

      return data as OrganizationTypography;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation to update organization typography
  const updateOrganizationTypography = useMutation({
    mutationFn: async (settings: TypographySettings) => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get user's organization
      const { data: membership } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();

      if (!membership?.organization_id) {
        throw new Error('No organization ID found');
      }

      if (!canUpdateSettings) {
        throw new Error('Insufficient permissions to update organization typography');
      }

      if (!validateTypographySettings(settings)) {
        throw new Error('Invalid typography settings structure');
      }

      const { data, error } = await supabase
        .from('organizations')
        .update({ typography_settings: settings })
        .eq('id', membership.organization_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate organization typography query
      queryClient.invalidateQueries({ 
        queryKey: ['organization-typography'] 
      });
      
      // Also invalidate user typography to refresh effective settings
      queryClient.invalidateQueries({ 
        queryKey: ['user-typography'] 
      });
    }
  });

  // Real-time subscription for organization typography changes
  const subscribeToTypographyChanges = async (callback: (settings: TypographySettings) => void) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: membership } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .single();

    if (!membership?.organization_id) return;

    const channel = supabase
      .channel('organization-typography-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'organizations',
          filter: `id=eq.${membership.organization_id}`
        },
        (payload) => {
          const newSettings = payload.new.typography_settings as TypographySettings;
          if (validateTypographySettings(newSettings)) {
            callback(newSettings);
            queryClient.invalidateQueries({ 
              queryKey: ['organization-typography'] 
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return {
    organizationTypography: organizationTypography?.typography_settings || getDefaultTypographySettings(),
    isLoading,
    error,
    canUpdate: canUpdateSettings,
    updateOrganizationTypography: updateOrganizationTypography.mutate,
    isUpdating: updateOrganizationTypography.isPending,
    updateError: updateOrganizationTypography.error,
    subscribeToTypographyChanges
  };
}

// =====================================================================================
// USER TYPOGRAPHY HOOK
// =====================================================================================

/**
 * Hook for managing user-level typography overrides
 * All users can customize their own typography
 */
export function useUserTypography() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { organizationTypography } = useOrganizationTypography();

  // Query user typography override
  const {
    data: userTypography,
    isLoading,
    error
  } = useQuery({
    queryKey: ['user-typography'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error} = await supabase
        .from('profiles')
        .select('id, typography_override')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data as UserTypography;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get effective typography settings (user override or organization default)
  const effectiveTypography = mergeTypographySettings(
    organizationTypography,
    userTypography?.typography_override
  );

  // Check if user has custom typography
  const hasCustomTypography = !!userTypography?.typography_override;

  // Mutation to update user typography override
  const updateUserTypography = useMutation({
    mutationFn: async (settings: TypographySettings | null) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (settings && !validateTypographySettings(settings)) {
        throw new Error('Invalid typography settings structure');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({ typography_override: settings })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['user-typography'] 
      });
    }
  });

  // Reset to organization defaults
  const resetToOrganizationDefaults = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({ typography_override: null })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['user-typography'] 
      });
    }
  });

  // Real-time subscription for user typography changes
  const subscribeToUserTypographyChanges = async (callback: (settings: TypographySettings | null) => void) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const channel = supabase
      .channel('user-typography-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          const newSettings = payload.new.typography_override as TypographySettings | null;
          if (newSettings === null || validateTypographySettings(newSettings)) {
            callback(newSettings);
            queryClient.invalidateQueries({ 
              queryKey: ['user-typography'] 
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return {
    userTypography: userTypography?.typography_override,
    effectiveTypography,
    organizationTypography,
    hasCustomTypography,
    isLoading,
    error,
    updateUserTypography: updateUserTypography.mutate,
    isUpdating: updateUserTypography.isPending,
    updateError: updateUserTypography.error,
    resetToOrganizationDefaults: resetToOrganizationDefaults.mutate,
    isResetting: resetToOrganizationDefaults.isPending,
    resetError: resetToOrganizationDefaults.error,
    subscribeToUserTypographyChanges
  };
}

// =====================================================================================
// COMBINED TYPOGRAPHY HOOK
// =====================================================================================

/**
 * Combined hook that provides both organization and user typography
 * This is the primary hook to use in most components
 */
export function useTypography() {
  const orgTypography = useOrganizationTypography();
  const userTypography = useUserTypography();

  return {
    // Effective settings (what the user actually sees)
    typography: userTypography.effectiveTypography,
    
    // Organization-level
    organizationTypography: orgTypography.organizationTypography,
    canUpdateOrganization: orgTypography.canUpdate,
    updateOrganizationTypography: orgTypography.updateOrganizationTypography,
    isUpdatingOrganization: orgTypography.isUpdating,
    
    // User-level
    userTypographyOverride: userTypography.userTypography,
    hasCustomTypography: userTypography.hasCustomTypography,
    updateUserTypography: userTypography.updateUserTypography,
    isUpdatingUser: userTypography.isUpdating,
    resetToOrganizationDefaults: userTypography.resetToOrganizationDefaults,
    isResetting: userTypography.isResetting,
    
    // Loading states
    isLoading: orgTypography.isLoading || userTypography.isLoading,
    
    // Subscriptions
    subscribeToOrganizationChanges: orgTypography.subscribeToTypographyChanges,
    subscribeToUserChanges: userTypography.subscribeToUserTypographyChanges
  };
}
