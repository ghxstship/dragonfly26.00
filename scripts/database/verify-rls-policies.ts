/**
 * RLS Policy Verification Script
 * 
 * Verifies that Row Level Security is enabled and policies exist
 * for all tables required by data hooks.
 * 
 * Usage: npx tsx scripts/verify-rls-policies.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })
dotenv.config({ path: path.join(__dirname, '../.env') })
dotenv.config()

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// All 70 tables from Phase 3 verification
const ALL_TABLES = [
  // Admin & Settings (16)
  'audit_logs', 'system_settings', 'api_tokens', 'webhooks',
  'integrations', 'automations', 'custom_fields', 'custom_statuses',
  'templates', 'checklist_templates', 'user_preferences', 'user_integrations',
  'user_automations', 'notification_settings', 'appearance_settings', 'billing_info',
  
  // Business Operations (14)
  'companies', 'company_contacts', 'company_contracts', 'company_documents',
  'company_notes', 'jobs', 'job_pipelines', 'job_offers',
  'job_invoices', 'job_team_members', 'purchase_orders', 'purchase_requisitions',
  'goods_receipts', 'vendors',
  
  // Production & Assets (12)
  'locations', 'location_access', 'bim_models', 'location_zones',
  'files', 'file_versions', 'file_shares', 'folders',
  'assets', 'asset_transactions', 'asset_maintenance', 'production_advances',
  
  // Community & Marketplace (12)
  'community_posts', 'community_connections', 'community_events', 'competitions',
  'showcases', 'marketplace_products', 'marketplace_orders', 'marketplace_reviews',
  'marketplace_categories', 'product_variants', 'product_options', 'inventory_levels',
  
  // Intelligence & Analytics (6)
  'analytics_metrics', 'analytics_dashboards', 'analytics_reports',
  'reports', 'report_templates', 'report_schedules',
  
  // Core System (10)
  'profiles', 'community_member_levels', 'projects', 'tasks',
  'events', 'people', 'finance_transactions', 'invoices',
  'expenses', 'budgets'
]

interface RLSStatus {
  table_name: string
  rls_enabled: boolean
  policies: PolicyInfo[]
  policy_count: number
  has_select: boolean
  has_insert: boolean
  has_update: boolean
  has_delete: boolean
  status: 'complete' | 'partial' | 'none'
}

interface PolicyInfo {
  name: string
  command: string
  roles: string[]
}

async function checkRLSStatus(tableName: string): Promise<RLSStatus> {
  try {
    // Query pg_tables to check if RLS is enabled
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('check_rls_enabled', { table_name: tableName })
      .single()
    
    if (tableError) {
      // If RPC doesn't exist, try alternative method
      return {
        table_name: tableName,
        rls_enabled: false,
        policies: [],
        policy_count: 0,
        has_select: false,
        has_insert: false,
        has_update: false,
        has_delete: false,
        status: 'none'
      }
    }
    
    // Query pg_policies to get policy information
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_table_policies', { table_name: tableName })
    
    const policyList: PolicyInfo[] = policies || []
    const hasSelect = policyList.some(p => p.command === 'SELECT')
    const hasInsert = policyList.some(p => p.command === 'INSERT')
    const hasUpdate = policyList.some(p => p.command === 'UPDATE')
    const hasDelete = policyList.some(p => p.command === 'DELETE')
    
    let status: 'complete' | 'partial' | 'none' = 'none'
    if ((tableInfo as any)?.rls_enabled) {
      if (hasSelect && hasInsert && hasUpdate && hasDelete) {
        status = 'complete'
      } else if (policyList.length > 0) {
        status = 'partial'
      }
    }
    
    return {
      table_name: tableName,
      rls_enabled: (tableInfo as any)?.rls_enabled || false,
      policies: policyList,
      policy_count: policyList.length,
      has_select: hasSelect,
      has_insert: hasInsert,
      has_update: hasUpdate,
      has_delete: hasDelete,
      status
    }
  } catch (err) {
    // Fallback: assume RLS not configured
    return {
      table_name: tableName,
      rls_enabled: false,
      policies: [],
      policy_count: 0,
      has_select: false,
      has_insert: false,
      has_update: false,
      has_delete: false,
      status: 'none'
    }
  }
}

async function main() {
  console.log('=' .repeat(60))
  console.log('RLS POLICY VERIFICATION')
  console.log('=' .repeat(60))
  console.log(`\nSupabase URL: ${supabaseUrl}`)
  console.log(`Timestamp: ${new Date().toISOString()}`)
  console.log(`\nChecking ${ALL_TABLES.length} tables...`)
  
  const results: RLSStatus[] = []
  
  // Check each table
  for (const table of ALL_TABLES) {
    const status = await checkRLSStatus(table)
    results.push(status)
    
    const icon = status.rls_enabled ? '✅' : '❌'
    const policyStatus = status.status === 'complete' ? '✅' : 
                        status.status === 'partial' ? '⚠️' : '❌'
    console.log(`  ${icon} ${table.padEnd(30)} RLS: ${status.rls_enabled ? 'ON' : 'OFF'} ${policyStatus} (${status.policy_count} policies)`)
  }
  
  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('SUMMARY')
  console.log('='.repeat(60))
  
  const rlsEnabled = results.filter(r => r.rls_enabled).length
  const complete = results.filter(r => r.status === 'complete').length
  const partial = results.filter(r => r.status === 'partial').length
  const none = results.filter(r => r.status === 'none').length
  
  console.log(`\nRLS Enabled: ${rlsEnabled}/${ALL_TABLES.length} tables`)
  console.log(`Policy Status:`)
  console.log(`  ✅ Complete (CRUD): ${complete} tables`)
  console.log(`  ⚠️  Partial: ${partial} tables`)
  console.log(`  ❌ None: ${none} tables`)
  
  // Missing RLS
  if (rlsEnabled < ALL_TABLES.length) {
    console.log('\n❌ TABLES WITHOUT RLS:')
    results.filter(r => !r.rls_enabled).forEach(r => {
      console.log(`  - ${r.table_name}`)
    })
  }
  
  // Incomplete policies
  if (partial > 0) {
    console.log('\n⚠️  TABLES WITH INCOMPLETE POLICIES:')
    results.filter(r => r.status === 'partial').forEach(r => {
      const missing = []
      if (!r.has_select) missing.push('SELECT')
      if (!r.has_insert) missing.push('INSERT')
      if (!r.has_update) missing.push('UPDATE')
      if (!r.has_delete) missing.push('DELETE')
      console.log(`  - ${r.table_name}: Missing ${missing.join(', ')}`)
    })
  }
  
  // Grade
  const percentage = Math.round((complete / ALL_TABLES.length) * 100)
  let grade = 'F'
  if (percentage >= 90) grade = 'A'
  else if (percentage >= 80) grade = 'B'
  else if (percentage >= 70) grade = 'C'
  else if (percentage >= 60) grade = 'D'
  
  console.log(`\n📊 RLS Completeness: ${percentage}% (Grade: ${grade})`)
  
  // Security assessment
  if (complete === ALL_TABLES.length) {
    console.log('\n✅ All tables have complete RLS policies!')
    console.log('🔒 Security: EXCELLENT')
    process.exit(0)
  } else if (rlsEnabled === ALL_TABLES.length) {
    console.log('\n⚠️  RLS enabled but some policies incomplete')
    console.log('🔒 Security: MODERATE')
    process.exit(1)
  } else {
    console.log('\n❌ Some tables missing RLS entirely')
    console.log('🔒 Security: HIGH RISK')
    process.exit(1)
  }
}

main().catch(console.error)
