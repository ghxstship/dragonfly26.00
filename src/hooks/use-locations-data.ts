'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Location {
  id: string
  organization_id: string
  name: string
  type: 'office' | 'warehouse' | 'site' | 'facility' | 'other'
  address: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  country: string | null
  latitude: number | null
  longitude: number | null
  area_sqft: number | null
  capacity: number | null
  status: 'active' | 'inactive' | 'under_construction'
  manager_id: string | null
  parent_location_id: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface LocationAccess {
  id: string
  location_id: string
  user_id: string
  access_level: 'full' | 'limited' | 'view_only'
  granted_by: string
  granted_at: string
  expires_at: string | null
}

export interface BIMModel {
  id: string
  location_id: string
  name: string
  version: string
  file_url: string
  file_size: number
  format: string
  uploaded_by: string
  created_at: string
  updated_at: string
}

export interface LocationZone {
  id: string
  location_id: string
  name: string
  type: string
  floor: number | null
  area_sqft: number | null
  capacity: number | null
  is_restricted: boolean
  created_at: string
}

export function useLocationsData() {
  const [locations, setLocations] = useState<Location[]>([])
  const [accessControls, setAccessControls] = useState<LocationAccess[]>([])
  const [bimModels, setBimModels] = useState<BIMModel[]>([])
  const [zones, setZones] = useState<LocationZone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchAllData()
    const channel = supabase
      .channel('locations-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'locations' }, fetchLocations)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'location_access' }, fetchAccessControls)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  async function fetchAllData() {
    setLoading(true)
    try {
      await Promise.all([fetchLocations(), fetchAccessControls(), fetchBIMModels(), fetchZones()])
      setError(null)
    } catch (err: any) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchLocations() {
    const { data, error } = await supabase.from('locations').select('*').order('name')
    if (error) throw error
    setLocations(data || [])
  }

  async function fetchAccessControls() {
    const { data, error } = await supabase.from('location_access').select('*, profiles(full_name)').order('granted_at', { ascending: false })
    if (error) throw error
    setAccessControls(data || [])
  }

  async function fetchBIMModels() {
    const { data, error } = await supabase.from('bim_models').select('*').order('created_at', { ascending: false })
    if (!error && data) setBimModels(data)
  }

  async function fetchZones() {
    const { data, error } = await supabase.from('location_zones').select('*').order('name')
    if (!error && data) setZones(data)
  }

  async function createLocation(locationData: Omit<Location, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase.from('locations').insert(locationData).select().single()
    if (error) throw error
    await fetchLocations()
    return data
  }

  async function updateLocation(id: string, updates: Partial<Location>) {
    const { id: _, created_at, ...validUpdates } = updates as any
    const { data, error } = await supabase.from('locations').update({ ...validUpdates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    await fetchLocations()
    return data
  }

  async function deleteLocation(id: string) {
    const { error } = await supabase.from('locations').delete().eq('id', id)
    if (error) throw error
    await fetchLocations()
  }

  async function grantAccess(accessData: Omit<LocationAccess, 'id' | 'granted_at'>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    
    const { data, error } = await supabase.from('location_access').insert({ ...accessData, granted_by: user.id, granted_at: new Date().toISOString() }).select().single()
    if (error) throw error
    await fetchAccessControls()
    return data
  }

  async function revokeAccess(id: string) {
    const { error } = await supabase.from('location_access').delete().eq('id', id)
    if (error) throw error
    await fetchAccessControls()
  }

  async function uploadBIMModel(locationId: string, file: File) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const fileExt = file.name.split('.').pop()
    const fileName = `${locationId}-${Date.now()}.${fileExt}`
    const filePath = `bim-models/${fileName}`

    const { error: uploadError } = await supabase.storage.from('location-files').upload(filePath, file)
    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('location-files').getPublicUrl(filePath)

    const { data: model, error } = await supabase.from('bim_models').insert({
      location_id: locationId,
      name: file.name,
      version: '1.0',
      file_url: data.publicUrl,
      file_size: file.size,
      format: fileExt || 'unknown',
      uploaded_by: user.id,
    }).select().single()

    if (error) throw error
    await fetchBIMModels()
    return model
  }

  async function findNearbyLocations(latitude: number, longitude: number, radiusKm: number = 10) {
    // Using PostGIS for spatial queries
    const { data, error } = await supabase.rpc('find_nearby_locations', {
      lat: latitude,
      lng: longitude,
      radius_km: radiusKm,
    })
    if (error) throw error
    return data
  }

  return {
    locations, accessControls, bimModels, zones, loading, error,
    createLocation, updateLocation, deleteLocation,
    grantAccess, revokeAccess, uploadBIMModel, findNearbyLocations,
    refresh: fetchAllData,
  }
}
