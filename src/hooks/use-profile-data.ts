'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface ProfileData {
  id: string
  full_name: string | null
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  date_of_birth: string | null
  avatar_url: string | null
  bio: string | null
  
  // Professional
  job_title: string | null
  company: string | null
  department: string | null
  employee_id: string | null
  hire_date: string | null
  
  // Contact & Address
  address: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  country: string | null
  
  // Emergency Contact
  emergency_contact_name: string | null
  emergency_contact_relationship: string | null
  emergency_contact_phone: string | null
  emergency_contact_email: string | null
  
  // Health
  blood_type: string | null
  allergies: string | null
  medical_conditions: string | null
  medications: string | null
  dietary_restrictions: string[]
  special_accommodations: string | null
  doctor_name: string | null
  doctor_phone: string | null
  insurance_provider: string | null
  policy_number: string | null
  
  // Travel
  passport_number: string | null
  passport_expiry: string | null
  passport_country: string | null
  tsa_precheck: string | null
  visa_information: string | null
  global_entry: string | null
  known_traveler_number: string | null
  seat_preference: string | null
  meal_preference: string | null
  frequent_flyer_programs: string | null
  hotel_preferences: string | null
  loyalty_programs: string | null
  mobility_assistance: boolean
  wheelchair_required: boolean
  other_travel_needs: string | null
  
  // Social Media
  linkedin_url: string | null
  twitter_url: string | null
  instagram_url: string | null
  website_url: string | null
  
  // Preferences
  theme: string | null
  language: string | null
  timezone: string | null
  email_notifications: boolean
  push_notifications: boolean
  
  // Arrays stored as JSONB
  skills: string[]
  certifications: any[]
  education: any[]
  work_experience: any[]
  endorsements: any[]
  tags: string[]
  
  // Metadata
  metadata: any
  onboarding_completed: boolean
  onboarding_completed_at: string | null
  
  created_at: string
  updated_at: string
}

/**
 * Hook for fetching and managing user profile data
 */
export function useProfileData() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchProfile()
    
    // Set up real-time subscription
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        () => {
          fetchProfile()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchProfile() {
    try {
      setLoading(true)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Not authenticated')
      }

      const { data, error: queryError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (queryError) throw queryError

      // Get email from auth user and ensure arrays are properly initialized
      const profileWithEmail = {
        ...data,
        email: user.email,
        skills: data.skills || [],
        certifications: data.certifications || [],
        education: data.education || [],
        work_experience: data.work_experience || [],
        endorsements: data.endorsements || [],
        tags: data.tags || [],
        dietary_restrictions: data.dietary_restrictions || [],
        metadata: data.metadata || {},
        mobility_assistance: data.mobility_assistance || false,
        wheelchair_required: data.wheelchair_required || false,
      }

      setProfile(profileWithEmail as ProfileData)
      setError(null)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile(updates: Partial<ProfileData>) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Remove id and email from updates (can't update these)
      const { id, email, created_at, ...validUpdates } = updates as any

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          ...validUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single()

      if (updateError) throw updateError

      await fetchProfile() // Refresh data
      return data
    } catch (err) {
      console.error('Error updating profile:', err)
      throw err
    }
  }

  async function uploadAvatar(file: File): Promise<string> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile with new avatar URL
      await updateProfile({ avatar_url: data.publicUrl })

      return data.publicUrl
    } catch (err) {
      console.error('Error uploading avatar:', err)
      throw err
    }
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    refreshProfile: fetchProfile,
  }
}
