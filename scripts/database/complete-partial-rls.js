#!/usr/bin/env node

/**
 * COMPLETE PARTIAL RLS POLICIES
 * Adds missing policies to tables with incomplete RLS coverage
 */

const fs = require('fs');
const path = require('path');

// Get all tables and their policies
function getAllTablesAndPolicies() {
  const migrationsDir = path.join(__dirname, '../supabase/migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();
  
  const tables = new Set();
  const policies = {};
  
  files.forEach(file => {
    const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    
    // Get tables
    const tableMatches = content.matchAll(/CREATE TABLE(?:\s+IF NOT EXISTS)?\s+(\w+)/gi);
    for (const match of tableMatches) {
      tables.add(match[1].toLowerCase());
    }
    
    // Get policies
    const policyMatches = content.matchAll(/CREATE POLICY\s+"([^"]+)"\s+ON\s+(\w+)\s+FOR\s+(\w+)/gi);
    for (const match of policyMatches) {
      const [, policyName, tableName, operation] = match;
      const table = tableName.toLowerCase();
      if (!policies[table]) {
        policies[table] = { SELECT: false, INSERT: false, UPDATE: false, DELETE: false };
      }
      policies[table][operation.toUpperCase()] = true;
    }
  });
  
  return { tables: Array.from(tables).sort(), policies };
}

// Generate missing policies for a table
function generateMissingPolicies(tableName, existingPolicies) {
  const policies = [];
  const missing = [];
  
  if (!existingPolicies.SELECT) {
    missing.push('SELECT');
    policies.push(`-- SELECT: Users can view their own data or team data`);
    policies.push(`CREATE POLICY "${tableName}_select_policy"`);
    policies.push(`  ON ${tableName}`);
    policies.push(`  FOR SELECT`);
    policies.push(`  USING (`);
    policies.push(`    auth.uid() = user_id`);
    policies.push(`    OR auth.uid() IN (`);
    policies.push(`      SELECT user_id FROM team_members`);
    policies.push(`      WHERE team_id = ${tableName}.team_id`);
    policies.push(`    )`);
    policies.push(`  );\n`);
  }
  
  if (!existingPolicies.INSERT) {
    missing.push('INSERT');
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
    policies.push(`  );\n`);
  }
  
  if (!existingPolicies.UPDATE) {
    missing.push('UPDATE');
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
    policies.push(`  );\n`);
  }
  
  if (!existingPolicies.DELETE) {
    missing.push('DELETE');
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
    policies.push(`  );\n`);
  }
  
  return { policies: policies.join('\n'), missing };
}

// Main function
function completePartialRLS() {
  console.log('🔧 COMPLETE PARTIAL RLS POLICIES\n');
  console.log('='.repeat(80));
  
  const { tables, policies } = getAllTablesAndPolicies();
  const partialTables = [];
  
  tables.forEach(table => {
    const tablePolicies = policies[table];
    if (tablePolicies) {
      const policyCount = Object.values(tablePolicies).filter(Boolean).length;
      if (policyCount > 0 && policyCount < 4) {
        partialTables.push({ table, policies: tablePolicies, count: policyCount });
      }
    }
  });
  
  console.log(`\n📊 Found ${partialTables.length} tables with partial RLS\n`);
  
  if (partialTables.length === 0) {
    console.log('✅ No tables with partial RLS found!');
    return;
  }
  
  // Generate migration
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0].replace('T', '_');
  const migrationFile = path.join(
    __dirname,
    '../supabase/migrations',
    `${timestamp}_complete_partial_rls_policies.sql`
  );
  
  let migrationContent = `-- Complete Partial RLS Policies\n`;
  migrationContent += `-- Generated: ${new Date().toISOString()}\n`;
  migrationContent += `-- Tables: ${partialTables.length}\n`;
  migrationContent += `-- Note: Review and adjust policies based on specific table requirements\n\n`;
  
  partialTables.forEach(({ table, policies: existingPolicies }) => {
    const { policies, missing } = generateMissingPolicies(table, existingPolicies);
    
    if (missing.length > 0) {
      console.log(`⚠️  ${table}: Adding ${missing.join(', ')} policies`);
      migrationContent += `-- ============================================================================\n`;
      migrationContent += `-- ${table.toUpperCase()} TABLE - COMPLETE RLS POLICIES\n`;
      migrationContent += `-- Missing: ${missing.join(', ')}\n`;
      migrationContent += `-- ============================================================================\n\n`;
      migrationContent += policies;
      migrationContent += '\n';
    }
  });
  
  fs.writeFileSync(migrationFile, migrationContent);
  
  console.log(`\n✅ Generated migration file:`);
  console.log(`   ${migrationFile}`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Review the generated migration file`);
  console.log(`   2. Adjust policies based on specific table requirements`);
  console.log(`   3. Test policies in development environment`);
  console.log(`   4. Apply migration: supabase db push`);
  console.log('\n' + '='.repeat(80));
}

// Run
completePartialRLS();
