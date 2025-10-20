#!/usr/bin/env node

/**
 * RLS POLICIES AUDIT SCRIPT
 * Identifies all tables missing RLS policies and generates comprehensive security policies
 */

const fs = require('fs');
const path = require('path');

// Tables that need RLS policies based on audit
const MISSING_RLS_TABLES = [
  // Admin Module
  'automations',
  'custom_statuses',
  'plugins',
  
  // Analytics Module
  'comparisons',
  'custom_views',
  'metrics_library',
  'pivot_tables',
  'trends',
  
  // Community Module
  'competitions',
  'news',
  'showcase',
  
  // Companies Module
  'companies_compliance',
  'companies_invoices',
  'companies_reviews',
  'companies_work_orders',
  
  // Jobs Module
  'scopes_of_work',
  
  // Dashboard Module
  'my_advances',
  'my_agenda',
  'my_assets',
  'my_expenses',
  'my_files',
  'my_jobs',
  'my_orders',
  'my_reports',
  'my_tasks',
  'my_travel',
  
  // Events Module
  'all_events',
  'blocks',
  'run_of_show',
  'schedules',
  'sessions',
  'speakers',
  'sponsors',
  'tracks',
  
  // Files Module
  'file_versions',
  'folders',
  
  // Finance Module
  'approvals',
  'budgets',
  'categories',
  'cost_centers',
  'forecasts',
  'gl_accounts',
  'invoices',
  'journal_entries',
  'payments',
  'purchase_orders',
  'reconciliations',
  'statements',
  'tax_codes',
  'transactions',
  'vendors',
];

// Check existing migrations for RLS policies
function checkExistingPolicies() {
  const migrationsDir = path.join(__dirname, '../supabase/migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();
  
  const existingPolicies = {};
  
  files.forEach(file => {
    const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    const policyMatches = content.matchAll(/CREATE POLICY "([^"]+)" ON (\w+)/g);
    
    for (const match of policyMatches) {
      const [, policyName, tableName] = match;
      if (!existingPolicies[tableName]) {
        existingPolicies[tableName] = [];
      }
      existingPolicies[tableName].push(policyName);
    }
  });
  
  return existingPolicies;
}

// Generate comprehensive RLS policies for a table
function generateRLSPolicies(tableName) {
  const policies = [];
  
  // Enable RLS
  policies.push(`-- Enable RLS for ${tableName}`);
  policies.push(`ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;`);
  policies.push('');
  
  // SELECT policy - Users can view their own data or public data
  policies.push(`-- SELECT: Users can view their own data`);
  policies.push(`CREATE POLICY "${tableName}_select_policy"`);
  policies.push(`  ON ${tableName}`);
  policies.push(`  FOR SELECT`);
  policies.push(`  USING (`);
  policies.push(`    auth.uid() = user_id`);
  policies.push(`    OR auth.uid() IN (`);
  policies.push(`      SELECT user_id FROM team_members`);
  policies.push(`      WHERE team_id = ${tableName}.team_id`);
  policies.push(`    )`);
  policies.push(`  );`);
  policies.push('');
  
  // INSERT policy - Users can insert their own data
  policies.push(`-- INSERT: Users can create their own data`);
  policies.push(`CREATE POLICY "${tableName}_insert_policy"`);
  policies.push(`  ON ${tableName}`);
  policies.push(`  FOR INSERT`);
  policies.push(`  WITH CHECK (`);
  policies.push(`    auth.uid() = user_id`);
  policies.push(`    OR auth.uid() IN (`);
  policies.push(`      SELECT user_id FROM team_members`);
  policies.push(`      WHERE team_id = ${tableName}.team_id`);
  policies.push(`      AND role IN ('admin', 'owner')`);
  policies.push(`    )`);
  policies.push(`  );`);
  policies.push('');
  
  // UPDATE policy - Users can update their own data
  policies.push(`-- UPDATE: Users can update their own data`);
  policies.push(`CREATE POLICY "${tableName}_update_policy"`);
  policies.push(`  ON ${tableName}`);
  policies.push(`  FOR UPDATE`);
  policies.push(`  USING (`);
  policies.push(`    auth.uid() = user_id`);
  policies.push(`    OR auth.uid() IN (`);
  policies.push(`      SELECT user_id FROM team_members`);
  policies.push(`      WHERE team_id = ${tableName}.team_id`);
  policies.push(`      AND role IN ('admin', 'owner')`);
  policies.push(`    )`);
  policies.push(`  );`);
  policies.push('');
  
  // DELETE policy - Only owners/admins can delete
  policies.push(`-- DELETE: Only owners/admins can delete`);
  policies.push(`CREATE POLICY "${tableName}_delete_policy"`);
  policies.push(`  ON ${tableName}`);
  policies.push(`  FOR DELETE`);
  policies.push(`  USING (`);
  policies.push(`    auth.uid() IN (`);
  policies.push(`      SELECT user_id FROM team_members`);
  policies.push(`      WHERE team_id = ${tableName}.team_id`);
  policies.push(`      AND role IN ('admin', 'owner')`);
  policies.push(`    )`);
  policies.push(`  );`);
  policies.push('');
  
  return policies.join('\n');
}

// Main audit function
function auditRLSPolicies() {
  console.log('🔍 RLS POLICIES AUDIT\n');
  console.log('=' .repeat(80));
  
  const existingPolicies = checkExistingPolicies();
  const missingPolicies = [];
  
  console.log('\n📊 AUDIT RESULTS:\n');
  
  MISSING_RLS_TABLES.forEach(table => {
    const policies = existingPolicies[table] || [];
    const hasPolicies = policies.length > 0;
    
    if (!hasPolicies) {
      missingPolicies.push(table);
      console.log(`❌ ${table}: NO POLICIES`);
    } else {
      console.log(`✅ ${table}: ${policies.length} policies`);
    }
  });
  
  console.log('\n' + '='.repeat(80));
  console.log(`\n📈 SUMMARY:`);
  console.log(`   Total Tables Checked: ${MISSING_RLS_TABLES.length}`);
  console.log(`   Tables with Policies: ${MISSING_RLS_TABLES.length - missingPolicies.length}`);
  console.log(`   Tables Missing Policies: ${missingPolicies.length}`);
  console.log(`   Coverage: ${((1 - missingPolicies.length / MISSING_RLS_TABLES.length) * 100).toFixed(1)}%`);
  
  if (missingPolicies.length > 0) {
    console.log('\n🚨 TABLES MISSING RLS POLICIES:\n');
    missingPolicies.forEach((table, i) => {
      console.log(`   ${i + 1}. ${table}`);
    });
    
    // Generate migration file
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0].replace('T', '_');
    const migrationFile = path.join(
      __dirname,
      '../supabase/migrations',
      `${timestamp}_add_missing_rls_policies.sql`
    );
    
    let migrationContent = `-- Add Missing RLS Policies\n`;
    migrationContent += `-- Generated: ${new Date().toISOString()}\n`;
    migrationContent += `-- Tables: ${missingPolicies.length}\n\n`;
    
    missingPolicies.forEach(table => {
      migrationContent += `-- ============================================================================\n`;
      migrationContent += `-- ${table.toUpperCase()} TABLE RLS POLICIES\n`;
      migrationContent += `-- ============================================================================\n\n`;
      migrationContent += generateRLSPolicies(table);
      migrationContent += '\n';
    });
    
    fs.writeFileSync(migrationFile, migrationContent);
    
    console.log(`\n✅ Generated migration file:`);
    console.log(`   ${migrationFile}`);
    console.log(`\n📝 Next steps:`);
    console.log(`   1. Review the generated migration file`);
    console.log(`   2. Adjust policies based on specific table requirements`);
    console.log(`   3. Apply migration: supabase db push`);
  } else {
    console.log('\n✅ All tables have RLS policies!');
  }
  
  console.log('\n' + '='.repeat(80));
}

// Run audit
auditRLSPolicies();
