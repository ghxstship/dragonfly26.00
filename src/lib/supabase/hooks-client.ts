import { createClient } from './client'

// Singleton Supabase client for hooks
// This prevents unnecessary re-creations and satisfies ESLint exhaustive-deps
let supabaseInstance: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient()
  }
  return supabaseInstance
}
