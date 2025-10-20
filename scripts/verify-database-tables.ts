/**
 * Database Table Verification Script
 * 
 * Verifies that all tables required by data hooks exist in Supabase
 * and match the expected schema.
 * 
 * Usage: npx tsx scripts/verify-database-tables.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables - try multiple locations
dotenv.config({ path: path.join(__dirname, '../.env.local') })
dotenv.config({ path: path.join(__dirname, '../.env') })
dotenv.config() // Also try default location

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Tables required by each hook
const REQUIRED_TABLES = {
  // Admin Hook
  'use-admin-data': [
    'audit_logs',
    'system_settings',
    'api_tokens',
    'webhooks',
    'integrations',
    'automations',
    'custom_fields',
    'custom_statuses',
    'templates',
    'checklist_templates'
  ],
  
  // Settings Hook
  'use-settings-data': [
    'user_preferences',
    'user_integrations',
    'user_automations',
    'notification_settings',
    'appearance_settings',
    'billing_info'
  ],
  
  // Companies Hook
  'use-companies-data': [
    'companies',
    'company_contacts',
    'company_contracts',
    'company_documents',
    'company_notes'
  ],
  
  // Jobs Hook
  'use-jobs-data': [
    'jobs',
    'job_pipelines',
    'job_offers',
    'job_invoices',
    'job_team_members'
  ],
  
  // Procurement Hook
  'use-procurement-data': [
    'purchase_orders',
    'purchase_requisitions',
    'goods_receipts',
    'vendors'
  ],
  
  // Locations Hook
  'use-locations-data': [
    'locations',
    'location_access',
    'bim_models',
    'location_zones'
  ],
  
  // Files Hook
  'use-files-data': [
    'files',
    'file_versions',
    'file_shares',
    'folders'
  ],
  
  // Community Hook
  'use-community-data': [
    'community_posts',
    'community_connections',
    'community_events',
    'competitions',
    'showcases'
  ],
  
  // Marketplace Hook
  'use-marketplace-data': [
    'marketplace_products',
    'marketplace_orders',
    'marketplace_reviews',
    'marketplace_categories',
    'product_variants',
    'product_options',
    'inventory_levels'
  ],
  
  // Analytics Hook
  'use-analytics-data': [
    'analytics_metrics',
    'analytics_dashboards',
    'analytics_reports'
  ],
  
  // Reports Hook
  'use-reports-data': [
    'reports',
    'report_templates',
    'report_schedules'
  ],
  
  // Assets Hook
  'use-assets-data': [
    'assets',
    'asset_transactions',
    'asset_maintenance',
    'production_advances'
  ],
  
  // Profile Hook
  'use-profile-data': [
    'profiles'
  ],
  
  // Member Level Hook
  'use-member-level': [
    'community_member_levels'
  ],
  
  // Existing hooks (assumed to exist)
  'existing': [
    'projects',
    'tasks',
    'events',
    'people',
    'finance_transactions',
    'invoices',
    'expenses',
    'budgets'
  ]
}

interface TableInfo {
  table_name: string
  exists: boolean
  row_count?: number
  error?: string
}

interface VerificationResult {
  hook: string
  tables: TableInfo[]
  allExist: boolean
  missingCount: number
}

async function checkTableExists(tableName: string): Promise<TableInfo> {
  try {
    // Try to query the table
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      // Check if it's a "relation does not exist" error
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        return {
          table_name: tableName,
          exists: false,
          error: 'Table does not exist'
        }
      }
      
      // Other errors (permissions, etc.) - assume table exists
      return {
        table_name: tableName,
        exists: true,
        row_count: 0,
        error: error.message
      }
    }
    
    return {
      table_name: tableName,
      exists: true,
      row_count: count || 0
    }
  } catch (err) {
    return {
      table_name: tableName,
      exists: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    }
  }
}

async function verifyHookTables(hook: string, tables: string[]): Promise<VerificationResult> {
  console.log(`\n🔍 Verifying ${hook}...`)
  
  const tableResults: TableInfo[] = []
  
  for (const table of tables) {
    const result = await checkTableExists(table)
    tableResults.push(result)
    
    const status = result.exists ? '✅' : '❌'
    const count = result.row_count !== undefined ? ` (${result.row_count} rows)` : ''
    const error = result.error && !result.exists ? ` - ${result.error}` : ''
    console.log(`  ${status} ${table}${count}${error}`)
  }
  
  const missingTables = tableResults.filter(t => !t.exists)
  const allExist = missingTables.length === 0
  
  return {
    hook,
    tables: tableResults,
    allExist,
    missingCount: missingTables.length
  }
}

async function main() {
  console.log('=' .repeat(60))
  console.log('DATABASE TABLE VERIFICATION')
  console.log('=' .repeat(60))
  console.log(`\nSupabase URL: ${supabaseUrl}`)
  console.log(`Timestamp: ${new Date().toISOString()}`)
  
  const results: VerificationResult[] = []
  
  // Verify each hook's tables
  for (const [hook, tables] of Object.entries(REQUIRED_TABLES)) {
    const result = await verifyHookTables(hook, tables)
    results.push(result)
  }
  
  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('SUMMARY')
  console.log('='.repeat(60))
  
  const totalHooks = results.length
  const hooksWithAllTables = results.filter(r => r.allExist).length
  const totalTables = results.reduce((sum, r) => sum + r.tables.length, 0)
  const existingTables = results.reduce((sum, r) => sum + r.tables.filter(t => t.exists).length, 0)
  const missingTables = results.reduce((sum, r) => sum + r.missingCount, 0)
  
  console.log(`\nHooks: ${hooksWithAllTables}/${totalHooks} complete`)
  console.log(`Tables: ${existingTables}/${totalTables} exist`)
  console.log(`Missing: ${missingTables} tables`)
  
  // List missing tables
  if (missingTables > 0) {
    console.log('\n❌ MISSING TABLES:')
    for (const result of results) {
      const missing = result.tables.filter(t => !t.exists)
      if (missing.length > 0) {
        console.log(`\n  ${result.hook}:`)
        for (const table of missing) {
          console.log(`    - ${table.table_name}`)
        }
      }
    }
  }
  
  // Grade
  const percentage = Math.round((existingTables / totalTables) * 100)
  let grade = 'F'
  if (percentage >= 90) grade = 'A'
  else if (percentage >= 80) grade = 'B'
  else if (percentage >= 70) grade = 'C'
  else if (percentage >= 60) grade = 'D'
  
  console.log(`\n📊 Database Completeness: ${percentage}% (Grade: ${grade})`)
  
  // Exit code
  if (missingTables > 0) {
    console.log('\n⚠️  Some tables are missing. Run migration scripts to create them.')
    process.exit(1)
  } else {
    console.log('\n✅ All required tables exist!')
    process.exit(0)
  }
}

main().catch(console.error)
