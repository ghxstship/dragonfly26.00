#!/usr/bin/env node

/**
 * COMPREHENSIVE RLS POLICIES AUDIT
 * Identifies all existing tables and their RLS policy coverage
 */

const fs = require('fs');
const path = require('path');

// Get all tables from migrations
function getAllTables() {
  const migrationsDir = path.join(__dirname, '../supabase/migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();
  
  const tables = new Set();
  
  files.forEach(file => {
    const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    
    // Match CREATE TABLE statements
    const tableMatches = content.matchAll(/CREATE TABLE(?:\s+IF NOT EXISTS)?\s+(\w+)/gi);
    for (const match of tableMatches) {
      tables.add(match[1].toLowerCase());
    }
  });
  
  return Array.from(tables).sort();
}

// Get all RLS policies from migrations
function getAllPolicies() {
  const migrationsDir = path.join(__dirname, '../supabase/migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();
  
  const policies = {};
  
  files.forEach(file => {
    const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    
    // Match CREATE POLICY statements
    const policyMatches = content.matchAll(/CREATE POLICY\s+"([^"]+)"\s+ON\s+(\w+)/gi);
    for (const match of policyMatches) {
      const [, policyName, tableName] = match;
      const table = tableName.toLowerCase();
      if (!policies[table]) {
        policies[table] = [];
      }
      policies[table].push(policyName);
    }
    
    // Match ALTER TABLE ... ENABLE ROW LEVEL SECURITY
    const rlsMatches = content.matchAll(/ALTER TABLE\s+(\w+)\s+ENABLE ROW LEVEL SECURITY/gi);
    for (const match of rlsMatches) {
      const table = match[1].toLowerCase();
      if (!policies[table]) {
        policies[table] = [];
      }
    }
  });
  
  return policies;
}

// Generate RLS policies for a table
function generateRLSPolicies(tableName) {
  const policies = [];
  
  policies.push(`-- ============================================================================`);
  policies.push(`-- ${tableName.toUpperCase()} TABLE RLS POLICIES`);
  policies.push(`-- ============================================================================\n`);
  
  // Enable RLS
  policies.push(`-- Enable RLS for ${tableName}`);
  policies.push(`ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;\n`);
  
  // SELECT policy
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
  
  // INSERT policy
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
  
  // UPDATE policy
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
  
  // DELETE policy
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
  
  return policies.join('\n');
}

// Main audit function
function auditRLSPolicies() {
  console.log('🔍 COMPREHENSIVE RLS POLICIES AUDIT\n');
  console.log('='.repeat(80));
  
  const allTables = getAllTables();
  const allPolicies = getAllPolicies();
  
  const tablesWithRLS = [];
  const tablesWithoutRLS = [];
  const tablesWithPartialRLS = [];
  
  console.log(`\n📊 AUDIT RESULTS:\n`);
  
  allTables.forEach(table => {
    const policies = allPolicies[table] || [];
    const policyCount = policies.length;
    
    if (policyCount === 0) {
      tablesWithoutRLS.push(table);
      console.log(`❌ ${table}: NO RLS`);
    } else if (policyCount < 4) {
      tablesWithPartialRLS.push({ table, count: policyCount });
      console.log(`⚠️  ${table}: ${policyCount} policies (incomplete)`);
    } else {
      tablesWithRLS.push({ table, count: policyCount });
      console.log(`✅ ${table}: ${policyCount} policies`);
    }
  });
  
  console.log('\n' + '='.repeat(80));
  console.log(`\n📈 SUMMARY:`);
  console.log(`   Total Tables: ${allTables.length}`);
  console.log(`   Tables with Complete RLS: ${tablesWithRLS.length} (${((tablesWithRLS.length / allTables.length) * 100).toFixed(1)}%)`);
  console.log(`   Tables with Partial RLS: ${tablesWithPartialRLS.length} (${((tablesWithPartialRLS.length / allTables.length) * 100).toFixed(1)}%)`);
  console.log(`   Tables without RLS: ${tablesWithoutRLS.length} (${((tablesWithoutRLS.length / allTables.length) * 100).toFixed(1)}%)`);
  console.log(`   Overall RLS Coverage: ${(((tablesWithRLS.length + tablesWithPartialRLS.length) / allTables.length) * 100).toFixed(1)}%`);
  
  const score = ((tablesWithRLS.length / allTables.length) * 100);
  console.log(`   RLS Security Score: ${score.toFixed(1)}/100`);
  
  if (tablesWithoutRLS.length > 0) {
    console.log(`\n🚨 TABLES WITHOUT RLS POLICIES (${tablesWithoutRLS.length}):\n`);
    tablesWithoutRLS.forEach((table, i) => {
      console.log(`   ${(i + 1).toString().padStart(3)}. ${table}`);
    });
    
    // Generate migration file
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0].replace('T', '_');
    const migrationFile = path.join(
      __dirname,
      '../supabase/migrations',
      `${timestamp}_add_comprehensive_rls_policies.sql`
    );
    
    let migrationContent = `-- Add Comprehensive RLS Policies\n`;
    migrationContent += `-- Generated: ${new Date().toISOString()}\n`;
    migrationContent += `-- Tables: ${tablesWithoutRLS.length}\n`;
    migrationContent += `-- Note: Review and adjust policies based on specific table requirements\n\n`;
    
    tablesWithoutRLS.forEach(table => {
      migrationContent += generateRLSPolicies(table);
      migrationContent += '\n';
    });
    
    fs.writeFileSync(migrationFile, migrationContent);
    
    console.log(`\n✅ Generated migration file:`);
    console.log(`   ${migrationFile}`);
  }
  
  if (tablesWithPartialRLS.length > 0) {
    console.log(`\n⚠️  TABLES WITH PARTIAL RLS (${tablesWithPartialRLS.length}):\n`);
    tablesWithPartialRLS.forEach(({ table, count }, i) => {
      console.log(`   ${(i + 1).toString().padStart(3)}. ${table} (${count} policies)`);
    });
  }
  
  console.log(`\n📝 Next steps:`);
  if (tablesWithoutRLS.length > 0) {
    console.log(`   1. Review the generated migration file`);
    console.log(`   2. Adjust policies based on specific table requirements`);
    console.log(`   3. Test policies in development environment`);
    console.log(`   4. Apply migration: supabase db push`);
  } else {
    console.log(`   ✅ All tables have RLS policies!`);
    console.log(`   Consider reviewing partial RLS tables for completeness`);
  }
  
  console.log('\n' + '='.repeat(80));
  
  // Generate audit report
  const reportPath = path.join(__dirname, '../docs/audits/RLS_POLICIES_AUDIT_2025_01_20.md');
  let report = `# RLS POLICIES AUDIT REPORT\n\n`;
  report += `**Date:** ${new Date().toISOString().split('T')[0]}\n`;
  report += `**Score:** ${score.toFixed(1)}/100\n\n`;
  report += `## Summary\n\n`;
  report += `- **Total Tables:** ${allTables.length}\n`;
  report += `- **Complete RLS:** ${tablesWithRLS.length} (${((tablesWithRLS.length / allTables.length) * 100).toFixed(1)}%)\n`;
  report += `- **Partial RLS:** ${tablesWithPartialRLS.length} (${((tablesWithPartialRLS.length / allTables.length) * 100).toFixed(1)}%)\n`;
  report += `- **No RLS:** ${tablesWithoutRLS.length} (${((tablesWithoutRLS.length / allTables.length) * 100).toFixed(1)}%)\n\n`;
  
  if (tablesWithoutRLS.length > 0) {
    report += `## Tables Without RLS\n\n`;
    tablesWithoutRLS.forEach((table, i) => {
      report += `${i + 1}. \`${table}\`\n`;
    });
    report += `\n`;
  }
  
  if (tablesWithPartialRLS.length > 0) {
    report += `## Tables With Partial RLS\n\n`;
    tablesWithPartialRLS.forEach(({ table, count }, i) => {
      report += `${i + 1}. \`${table}\` - ${count} policies\n`;
    });
    report += `\n`;
  }
  
  fs.writeFileSync(reportPath, report);
  console.log(`\n📄 Audit report saved: ${reportPath}\n`);
}

// Run audit
auditRLSPolicies();
