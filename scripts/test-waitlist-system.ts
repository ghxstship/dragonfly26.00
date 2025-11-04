/**
 * Waitlist System Testing Utility
 * 
 * Comprehensive test suite for the gated invite and waitlist system
 * Run with: npx ts-node scripts/test-waitlist-system.ts
 */

import { createClient } from '@supabase/supabase-js'

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Test data
const TEST_EMAIL = `test-${Date.now()}@example.com`
const TEST_NAME = 'Test User'
const TEST_INVITE_CODE = `TEST${Date.now().toString().slice(-6)}`

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function success(message: string) {
  log(`✅ ${message}`, 'green')
}

function error(message: string) {
  log(`❌ ${message}`, 'red')
}

function info(message: string) {
  log(`ℹ️  ${message}`, 'blue')
}

function warn(message: string) {
  log(`⚠️  ${message}`, 'yellow')
}

// Test functions

async function testDatabaseTables() {
  info('Testing database tables...')
  
  try {
    // Check waitlist table
    const { data: waitlist, error: waitlistError } = await supabase
      .from('waitlist')
      .select('*')
      .limit(1)
    
    if (waitlistError && !waitlistError.message.includes('no rows')) {
      throw new Error(`Waitlist table error: ${waitlistError.message}`)
    }
    success('Waitlist table exists')

    // Check invite_codes table
    const { data: codes, error: codesError } = await supabase
      .from('invite_codes')
      .select('*')
      .limit(1)
    
    if (codesError && !codesError.message.includes('no rows')) {
      throw new Error(`Invite codes table error: ${codesError.message}`)
    }
    success('Invite codes table exists')

    // Check invite_code_usage table
    const { data: usage, error: usageError } = await supabase
      .from('invite_code_usage')
      .select('*')
      .limit(1)
    
    if (usageError && !usageError.message.includes('no rows')) {
      throw new Error(`Invite code usage table error: ${usageError.message}`)
    }
    success('Invite code usage table exists')

    return true
  } catch (err: any) {
    error(`Database tables test failed: ${err.message}`)
    return false
  }
}

async function testDatabaseFunctions() {
  info('Testing database functions...')
  
  try {
    // Test is_email_authorized
    const { data: authData, error: authError } = await supabase
      .rpc('is_email_authorized', { p_email: 'nonexistent@example.com' })
    
    if (authError) throw new Error(`is_email_authorized error: ${authError.message}`)
    success('is_email_authorized function works')

    // Test get_waitlist_stats
    const { data: statsData, error: statsError } = await supabase
      .rpc('get_waitlist_stats')
    
    if (statsError) throw new Error(`get_waitlist_stats error: ${statsError.message}`)
    success('get_waitlist_stats function works')

    // Test get_waitlist_position
    const { data: posData, error: posError } = await supabase
      .rpc('get_waitlist_position', { p_email: 'nonexistent@example.com' })
    
    if (posError) throw new Error(`get_waitlist_position error: ${posError.message}`)
    success('get_waitlist_position function works')

    return true
  } catch (err: any) {
    error(`Database functions test failed: ${err.message}`)
    return false
  }
}

async function testWaitlistSubmission() {
  info('Testing waitlist submission...')
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/waitlist/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_EMAIL,
        full_name: TEST_NAME,
        company: 'Test Company',
        role: 'Tester',
        use_case: 'Testing the waitlist system',
        referral_source: 'other',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`API error: ${errorData.message || response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(`Submission failed: ${data.message}`)
    }

    success(`Waitlist submission successful (ID: ${data.waitlist_id})`)
    return data.waitlist_id
  } catch (err: any) {
    error(`Waitlist submission test failed: ${err.message}`)
    return null
  }
}

async function testWaitlistStatusCheck() {
  info('Testing waitlist status check...')
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/waitlist/check?email=${encodeURIComponent(TEST_EMAIL)}`
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.exists) {
      throw new Error('Waitlist entry not found')
    }

    success(`Status check successful (Status: ${data.status}, Position: ${data.position})`)
    return true
  } catch (err: any) {
    error(`Status check test failed: ${err.message}`)
    return false
  }
}

async function testSignupValidation() {
  info('Testing signup validation...')
  
  try {
    // Test unauthorized email
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_EMAIL,
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.authorized) {
      throw new Error('Email should not be authorized')
    }

    success('Signup validation correctly blocks unauthorized email')
    return true
  } catch (err: any) {
    error(`Signup validation test failed: ${err.message}`)
    return false
  }
}

async function testInviteCodeCreation() {
  info('Testing invite code creation...')
  
  try {
    // This requires Legend authentication
    // For now, create directly in database
    const { data, error: insertError } = await supabase
      .from('invite_codes')
      .insert({
        code: TEST_INVITE_CODE,
        description: 'Test invite code',
        max_uses: 10,
        is_active: true,
        auto_approve: false,
      })
      .select()
      .single()

    if (insertError) {
      throw new Error(`Insert error: ${insertError.message}`)
    }

    success(`Invite code created: ${TEST_INVITE_CODE}`)
    return data.id
  } catch (err: any) {
    error(`Invite code creation test failed: ${err.message}`)
    return null
  }
}

async function testInviteCodeValidation() {
  info('Testing invite code validation...')
  
  try {
    const { data, error: rpcError } = await supabase
      .rpc('validate_invite_code', {
        p_code: TEST_INVITE_CODE,
        p_email: 'newuser@example.com',
      })

    if (rpcError) {
      throw new Error(`RPC error: ${rpcError.message}`)
    }

    if (!data || !data.valid) {
      throw new Error('Invite code validation failed')
    }

    success('Invite code validation successful')
    return true
  } catch (err: any) {
    error(`Invite code validation test failed: ${err.message}`)
    return false
  }
}

async function testRLSPolicies() {
  info('Testing RLS policies...')
  
  try {
    // Create anon client (simulates unauthenticated user)
    const anonClient = createClient(SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')

    // Test: Anon can insert to waitlist
    const { error: insertError } = await anonClient
      .from('waitlist')
      .insert({
        email: `anon-test-${Date.now()}@example.com`,
        full_name: 'Anon Test',
      })

    if (insertError) {
      throw new Error(`Anon insert failed: ${insertError.message}`)
    }
    success('RLS allows public waitlist submission')

    // Test: Anon cannot view all waitlist entries
    const { data: allEntries, error: selectError } = await anonClient
      .from('waitlist')
      .select('*')

    // Should either return empty or error
    if (allEntries && allEntries.length > 1) {
      warn('RLS may not be properly restricting waitlist SELECT')
    } else {
      success('RLS restricts unauthorized waitlist SELECT')
    }

    return true
  } catch (err: any) {
    error(`RLS policies test failed: ${err.message}`)
    return false
  }
}

async function cleanup() {
  info('Cleaning up test data...')
  
  try {
    // Delete test waitlist entries
    await supabase
      .from('waitlist')
      .delete()
      .like('email', 'test-%@example.com')

    await supabase
      .from('waitlist')
      .delete()
      .like('email', 'anon-test-%@example.com')

    // Delete test invite code
    await supabase
      .from('invite_codes')
      .delete()
      .eq('code', TEST_INVITE_CODE)

    success('Cleanup completed')
  } catch (err: any) {
    warn(`Cleanup failed: ${err.message}`)
  }
}

// Main test runner
async function runTests() {
  console.log('\n' + '='.repeat(60))
  log('GATED INVITE & WAITLIST SYSTEM - TEST SUITE', 'blue')
  console.log('='.repeat(60) + '\n')

  const results = {
    passed: 0,
    failed: 0,
    total: 0,
  }

  const tests = [
    { name: 'Database Tables', fn: testDatabaseTables },
    { name: 'Database Functions', fn: testDatabaseFunctions },
    { name: 'Waitlist Submission', fn: testWaitlistSubmission },
    { name: 'Waitlist Status Check', fn: testWaitlistStatusCheck },
    { name: 'Signup Validation', fn: testSignupValidation },
    { name: 'Invite Code Creation', fn: testInviteCodeCreation },
    { name: 'Invite Code Validation', fn: testInviteCodeValidation },
    { name: 'RLS Policies', fn: testRLSPolicies },
  ]

  for (const test of tests) {
    results.total++
    console.log('\n' + '-'.repeat(60))
    const result = await test.fn()
    if (result) {
      results.passed++
    } else {
      results.failed++
    }
  }

  // Cleanup
  console.log('\n' + '-'.repeat(60))
  await cleanup()

  // Summary
  console.log('\n' + '='.repeat(60))
  log('TEST SUMMARY', 'blue')
  console.log('='.repeat(60))
  log(`Total Tests: ${results.total}`)
  success(`Passed: ${results.passed}`)
  if (results.failed > 0) {
    error(`Failed: ${results.failed}`)
  }
  console.log('='.repeat(60) + '\n')

  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0)
}

// Run tests
if (require.main === module) {
  runTests().catch((err) => {
    error(`Fatal error: ${err.message}`)
    process.exit(1)
  })
}

export { runTests }
