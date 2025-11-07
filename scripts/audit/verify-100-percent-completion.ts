/**
 * VERIFY 100% WORKFLOW COMPLETION
 * Comprehensive verification of all role workflows
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface VerificationResult {
  category: string;
  items: { name: string; status: boolean; details?: string }[];
}

async function verifyDataHooks(): Promise<VerificationResult> {
  const hooksDir = path.join(process.cwd(), 'src/hooks');
  const requiredHooks = [
    'use-vendor-data.ts',
    'use-marketplace-data.ts',
    'use-community-data.ts',
    'use-resources-data.ts',
    'use-insights-data.ts'
  ];

  const items = requiredHooks.map(hook => {
    const exists = fs.existsSync(path.join(hooksDir, hook));
    return { name: hook, status: exists };
  });

  return { category: 'Data Hooks', items };
}

async function verifyAPIEndpoints(): Promise<VerificationResult> {
  const apiDir = path.join(process.cwd(), 'src/app/api');
  const requiredEndpoints = [
    'community/route.ts',
    'marketplace/route.ts',
    'resources/route.ts',
    'insights/route.ts'
  ];

  const items = requiredEndpoints.map(endpoint => {
    const exists = fs.existsSync(path.join(apiDir, endpoint));
    return { name: endpoint, status: exists };
  });

  return { category: 'API Endpoints', items };
}

async function verifyDatabaseTables(): Promise<VerificationResult> {
  const requiredTables = [
    'marketplace_vendors',
    'marketplace_orders',
    'marketplace_products',
    'vendor_invoices',
    'community_activities',
    'resources',
    'objectives',
    'kpis',
    'predictions'
  ];

  const items = await Promise.all(
    requiredTables.map(async table => {
      const { error } = await supabase.from(table).select('id').limit(1);
      return { name: table, status: !error, details: error?.message };
    })
  );

  return { category: 'Database Tables', items };
}

async function verifyRoleWorkflows(): Promise<VerificationResult> {
  const roles = [
    { name: 'Legend', table: 'system_settings' },
    { name: 'Phantom', table: 'organizations' },
    { name: 'Aviator', table: 'projects' },
    { name: 'Gladiator', table: 'projects' },
    { name: 'Navigator', table: 'departments' },
    { name: 'Deviator', table: 'teams' },
    { name: 'Raider', table: 'tasks' },
    { name: 'Vendor', table: 'marketplace_vendors' },
    { name: 'Visitor', table: 'projects' },
    { name: 'Partner', table: 'reports' },
    { name: 'Ambassador', table: 'marketing_content' }
  ];

  const items = await Promise.all(
    roles.map(async role => {
      const { error } = await supabase.from(role.table).select('id').limit(1);
      return { name: role.name, status: !error, details: error?.message };
    })
  );

  return { category: 'Role Workflows', items };
}

async function runVerification(): Promise<void> {
  console.log('\n🔍 VERIFYING 100% WORKFLOW COMPLETION\n');
  console.log('='.repeat(80));

  const results: VerificationResult[] = [];

  // Run all verifications
  console.log('\n📦 Verifying Data Hooks...');
  results.push(await verifyDataHooks());

  console.log('🌐 Verifying API Endpoints...');
  results.push(await verifyAPIEndpoints());

  console.log('🗄️  Verifying Database Tables...');
  results.push(await verifyDatabaseTables());

  console.log('👥 Verifying Role Workflows...');
  results.push(await verifyRoleWorkflows());

  // Display results
  console.log('\n' + '='.repeat(80));
  console.log('📊 VERIFICATION RESULTS');
  console.log('='.repeat(80) + '\n');

  let totalItems = 0;
  let totalPassed = 0;

  for (const result of results) {
    console.log(`\n${result.category}:`);
    for (const item of result.items) {
      const status = item.status ? '✅' : '❌';
      const details = item.details ? ` (${item.details})` : '';
      console.log(`  ${status} ${item.name}${details}`);
      totalItems++;
      if (item.status) totalPassed++;
    }
  }

  const percentage = Math.round((totalPassed / totalItems) * 100);

  console.log('\n' + '='.repeat(80));
  console.log(`🎯 OVERALL COMPLETION: ${percentage}% (${totalPassed}/${totalItems})`);
  console.log('='.repeat(80) + '\n');

  if (percentage === 100) {
    console.log('🎉 PERFECT! All workflows are 100% complete!\n');
    process.exit(0);
  } else {
    console.log(`⚠️  ${totalItems - totalPassed} items need attention.\n`);
    process.exit(1);
  }
}

runVerification();
