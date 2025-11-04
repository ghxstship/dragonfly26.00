/**
 * Waitlist Validation Schemas
 * 
 * Validation rules for waitlist and invite code forms
 */

import { WaitlistFormErrors, InviteCodeFormErrors } from '@/types/waitlist'

// =====================================================
// CONSTANTS
// =====================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INVITE_CODE_REGEX = /^[A-Z0-9]{6,20}$/i

// Disposable email domains to block
const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com',
  'throwaway.email',
  'guerrillamail.com',
  '10minutemail.com',
  'mailinator.com',
  'trashmail.com',
]

// =====================================================
// WAITLIST VALIDATION
// =====================================================

export function validateWaitlistSubmission(data: {
  email: string
  full_name: string
  company?: string
  role?: string
  use_case?: string
  referral_source?: string
  invite_code?: string
}): WaitlistFormErrors {
  const errors: WaitlistFormErrors = {}

  // Email validation
  if (!data.email || !data.email.trim()) {
    errors.email = 'Email is required'
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = 'Please enter a valid email address'
  } else {
    // Check for disposable email
    const domain = data.email.split('@')[1]?.toLowerCase()
    if (domain && DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
      errors.email = 'Disposable email addresses are not allowed'
    }
  }

  // Full name validation
  if (!data.full_name || !data.full_name.trim()) {
    errors.full_name = 'Full name is required'
  } else if (data.full_name.trim().length < 2) {
    errors.full_name = 'Full name must be at least 2 characters'
  } else if (data.full_name.trim().length > 100) {
    errors.full_name = 'Full name must be less than 100 characters'
  }

  // Company validation (optional)
  if (data.company && data.company.trim().length > 100) {
    errors.company = 'Company name must be less than 100 characters'
  }

  // Role validation (optional)
  if (data.role && data.role.trim().length > 100) {
    errors.role = 'Role must be less than 100 characters'
  }

  // Use case validation (optional but recommended)
  if (data.use_case) {
    if (data.use_case.trim().length < 10) {
      errors.use_case = 'Please provide more details (at least 10 characters)'
    } else if (data.use_case.trim().length > 1000) {
      errors.use_case = 'Use case must be less than 1000 characters'
    }
  }

  // Invite code validation (optional)
  if (data.invite_code && data.invite_code.trim()) {
    const code = data.invite_code.trim()
    if (!INVITE_CODE_REGEX.test(code)) {
      errors.invite_code = 'Invalid invite code format (6-20 alphanumeric characters)'
    }
  }

  return errors
}

export function hasWaitlistErrors(errors: WaitlistFormErrors): boolean {
  return Object.keys(errors).length > 0
}

// =====================================================
// INVITE CODE VALIDATION
// =====================================================

export function validateInviteCode(data: {
  code: string
  description?: string
  max_uses?: number
  valid_until?: string
  allowed_domains?: string[]
  default_role_slug?: string
}): InviteCodeFormErrors {
  const errors: InviteCodeFormErrors = {}

  // Code validation
  if (!data.code || !data.code.trim()) {
    errors.code = 'Code is required'
  } else {
    const code = data.code.trim()
    if (!INVITE_CODE_REGEX.test(code)) {
      errors.code = 'Code must be 6-20 alphanumeric characters'
    }
  }

  // Description validation (optional)
  if (data.description && data.description.trim().length > 500) {
    errors.description = 'Description must be less than 500 characters'
  }

  // Max uses validation (optional)
  if (data.max_uses !== undefined && data.max_uses !== null) {
    if (data.max_uses < 1) {
      errors.max_uses = 'Max uses must be at least 1'
    } else if (data.max_uses > 10000) {
      errors.max_uses = 'Max uses must be less than 10,000'
    }
  }

  // Valid until validation (optional)
  if (data.valid_until) {
    const validUntil = new Date(data.valid_until)
    const now = new Date()
    if (validUntil <= now) {
      errors.valid_until = 'Expiration date must be in the future'
    }
  }

  // Allowed domains validation (optional)
  if (data.allowed_domains && data.allowed_domains.length > 0) {
    for (const domain of data.allowed_domains) {
      if (!domain.startsWith('@')) {
        errors.allowed_domains = 'Domains must start with @ (e.g., @company.com)'
        break
      }
      if (domain.length < 3 || !domain.includes('.')) {
        errors.allowed_domains = 'Invalid domain format'
        break
      }
    }
  }

  return errors
}

export function hasInviteCodeErrors(errors: InviteCodeFormErrors): boolean {
  return Object.keys(errors).length > 0
}

// =====================================================
// EMAIL VALIDATION UTILITIES
// =====================================================

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email)
}

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  return domain ? DISPOSABLE_EMAIL_DOMAINS.includes(domain) : false
}

export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

// =====================================================
// INVITE CODE UTILITIES
// =====================================================

export function normalizeInviteCode(code: string): string {
  return code.toUpperCase().trim()
}

export function isValidInviteCodeFormat(code: string): boolean {
  return INVITE_CODE_REGEX.test(code)
}

export function generateInviteCode(length: number = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Removed ambiguous characters
  let code = ''
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// =====================================================
// DOMAIN VALIDATION
// =====================================================

export function validateEmailDomain(email: string, allowedDomains: string[]): boolean {
  if (!allowedDomains || allowedDomains.length === 0) {
    return true // No restrictions
  }
  
  const domain = '@' + email.split('@')[1]?.toLowerCase()
  return allowedDomains.some(allowed => domain === allowed.toLowerCase())
}

// =====================================================
// SANITIZATION
// =====================================================

export function sanitizeWaitlistInput(data: {
  email: string
  full_name: string
  company?: string
  role?: string
  use_case?: string
  referral_source?: string
  invite_code?: string
}) {
  return {
    email: normalizeEmail(data.email),
    full_name: data.full_name.trim(),
    company: data.company?.trim() || null,
    role: data.role?.trim() || null,
    use_case: data.use_case?.trim() || null,
    referral_source: data.referral_source?.trim() || null,
    invite_code: data.invite_code ? normalizeInviteCode(data.invite_code) : null,
  }
}

export function sanitizeInviteCodeInput(data: {
  code: string
  description?: string
  max_uses?: number
  valid_until?: string
  allowed_domains?: string[]
  default_role_slug?: string
}) {
  return {
    code: normalizeInviteCode(data.code),
    description: data.description?.trim() || null,
    max_uses: data.max_uses || null,
    valid_until: data.valid_until || null,
    allowed_domains: data.allowed_domains?.map(d => d.toLowerCase().trim()) || null,
    default_role_slug: data.default_role_slug?.trim() || null,
  }
}
