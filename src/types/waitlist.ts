/**
 * Waitlist System Types
 * 
 * TypeScript type definitions for the gated invite and waitlist system
 */

// =====================================================
// WAITLIST TYPES
// =====================================================

export type WaitlistStatus = 'pending' | 'approved' | 'rejected' | 'invited'

export interface Waitlist {
  id: string
  
  // User Information
  email: string
  full_name: string
  company: string | null
  role: string | null
  use_case: string | null
  
  // Status Tracking
  status: WaitlistStatus
  priority: number
  
  // Metadata
  referral_source: string | null
  metadata: Record<string, unknown>
  
  // Admin Notes
  admin_notes: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  
  // Invitation Tracking
  invited_at: string | null
  invitation_id: string | null
  
  // Timestamps
  created_at: string
  updated_at: string
}

export interface WaitlistSubmission {
  email: string
  full_name: string
  company?: string
  role?: string
  use_case?: string
  referral_source?: string
  invite_code?: string
}

export interface WaitlistStats {
  total: number
  pending: number
  approved: number
  invited: number
  rejected: number
  avg_wait_hours: number | null
}

// =====================================================
// INVITE CODE TYPES
// =====================================================

export interface InviteCode {
  id: string
  
  // Code Details
  code: string
  description: string | null
  
  // Usage Limits
  max_uses: number | null
  current_uses: number
  
  // Validity Period
  valid_from: string
  valid_until: string | null
  is_active: boolean
  
  // Restrictions
  allowed_domains: string[] | null
  auto_approve: boolean
  
  // Default Role Assignment
  default_role_slug: string | null
  
  // Tracking
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface InviteCodeCreate {
  code: string
  description?: string
  max_uses?: number
  valid_from?: string
  valid_until?: string
  allowed_domains?: string[]
  auto_approve?: boolean
  default_role_slug?: string
}

export interface InviteCodeValidation {
  valid: boolean
  error?: string
  code_id?: string
  auto_approve?: boolean
  default_role_slug?: string
}

export interface InviteCodeUsage {
  id: string
  invite_code_id: string
  email: string
  user_id: string | null
  ip_address: string | null
  user_agent: string | null
  used_at: string
}

// =====================================================
// API REQUEST/RESPONSE TYPES
// =====================================================

export interface WaitlistSubmitRequest {
  email: string
  full_name: string
  company?: string
  role?: string
  use_case?: string
  referral_source?: string
  invite_code?: string
}

export interface WaitlistSubmitResponse {
  success: boolean
  message: string
  status: WaitlistStatus
  position?: number
  waitlist_id?: string
}

export interface WaitlistCheckRequest {
  email: string
}

export interface WaitlistCheckResponse {
  exists: boolean
  status?: WaitlistStatus
  position?: number
  estimated_wait_hours?: number
  created_at?: string
}

export interface WaitlistApproveRequest {
  waitlist_id: string
  organization_id: string
  workspace_id: string
  role_slug: string
  message?: string
}

export interface WaitlistApproveResponse {
  success: boolean
  invitation_id: string
  message: string
}

export interface WaitlistRejectRequest {
  waitlist_id: string
  reason?: string
}

export interface WaitlistRejectResponse {
  success: boolean
  message: string
}

export interface ValidateSignupRequest {
  email: string
  invite_code?: string
}

export interface ValidateSignupResponse {
  authorized: boolean
  reason?: string
  invitation_token?: string
  via_invite_code?: boolean
}

// =====================================================
// ADMIN LIST TYPES
// =====================================================

export interface WaitlistListParams {
  status?: WaitlistStatus
  page?: number
  limit?: number
  sort?: 'priority' | 'created_at' | 'updated_at'
  order?: 'asc' | 'desc'
  search?: string
}

export interface WaitlistListResponse {
  entries: Waitlist[]
  total: number
  page: number
  pages: number
  limit: number
}

export interface InviteCodeListParams {
  is_active?: boolean
  page?: number
  limit?: number
  sort?: 'created_at' | 'current_uses' | 'code'
  order?: 'asc' | 'desc'
}

export interface InviteCodeListResponse {
  codes: InviteCode[]
  total: number
  page: number
  pages: number
  limit: number
}

// =====================================================
// FORM VALIDATION TYPES
// =====================================================

export interface WaitlistFormErrors {
  email?: string
  full_name?: string
  company?: string
  role?: string
  use_case?: string
  referral_source?: string
  invite_code?: string
}

export interface InviteCodeFormErrors {
  code?: string
  description?: string
  max_uses?: string
  valid_until?: string
  allowed_domains?: string
  default_role_slug?: string
}

// =====================================================
// UTILITY TYPES
// =====================================================

export type ReferralSource = 
  | 'search'
  | 'social_media'
  | 'word_of_mouth'
  | 'blog'
  | 'event'
  | 'partner'
  | 'other'

export const REFERRAL_SOURCES: { value: ReferralSource; label: string }[] = [
  { value: 'search', label: 'Search Engine' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'word_of_mouth', label: 'Word of Mouth' },
  { value: 'blog', label: 'Blog/Article' },
  { value: 'event', label: 'Event/Conference' },
  { value: 'partner', label: 'Partner/Referral' },
  { value: 'other', label: 'Other' },
]

export const WAITLIST_STATUS_LABELS: Record<WaitlistStatus, string> = {
  pending: 'Pending Review',
  approved: 'Approved',
  invited: 'Invited',
  rejected: 'Rejected',
}

export const WAITLIST_STATUS_COLORS: Record<WaitlistStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  approved: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  invited: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}
