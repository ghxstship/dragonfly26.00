#!/usr/bin/env node

/**
 * Assets Module Tab Verification Script
 * 
 * This script helps verify that all Assets module tabs are loading correctly
 * after the foreign key relationship fixes.
 * 
 * Usage:
 *   node scripts/test-assets-module-tabs.js [workspaceId]
 * 
 * If no workspaceId is provided, it will prompt for one.
 */

const readline = require('readline');

const ASSETS_TABS = [
  { name: 'Overview', slug: 'overview', description: 'Assets dashboard with summary stats' },
  { name: 'Tracking', slug: 'tracking', description: 'Asset check-in/check-out transactions' },
  { name: 'Inventory', slug: 'inventory', description: 'Complete asset catalog' },
  { name: 'Maintenance', slug: 'maintenance', description: 'Maintenance schedules and records' },
  { name: 'Approvals', slug: 'approvals', description: 'Production advance approvals' },
  { name: 'Advances', slug: 'advances', description: 'Production advances list' },
  { name: 'Catalog', slug: 'catalog', description: 'Asset catalog view' },
];

const RELATED_TABS = [
  { module: 'dashboard', name: 'My Assets', slug: 'my-assets', description: 'Personal checked-out assets' },
  { module: 'events', name: 'Equipment', slug: 'equipment', description: 'Event equipment list' },
];

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

function printHeader() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║   Assets Module Tab Verification Script                  ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
}

function printSummary(workspaceId) {
  console.log('📋 Test Summary:');
  console.log(`   Workspace ID: ${workspaceId}`);
  console.log(`   Base URL: ${BASE_URL}`);
  console.log(`   Assets Tabs: ${ASSETS_TABS.length}`);
  console.log(`   Related Tabs: ${RELATED_TABS.length}`);
  console.log(`   Total Routes: ${ASSETS_TABS.length + RELATED_TABS.length}\n`);
}

function printTestPlan() {
  console.log('🧪 Test Plan:\n');
  
  console.log('Assets Module Routes:');
  ASSETS_TABS.forEach((tab, index) => {
    console.log(`   ${index + 1}. ${tab.name.padEnd(15)} → /workspace/{id}/assets/${tab.slug}`);
    console.log(`      ${tab.description}`);
  });
  
  console.log('\nRelated Module Routes:');
  RELATED_TABS.forEach((tab, index) => {
    console.log(`   ${index + 1}. ${tab.name.padEnd(15)} → /workspace/{id}/${tab.module}/${tab.slug}`);
    console.log(`      ${tab.description}`);
  });
  console.log('');
}

function generateTestURLs(workspaceId) {
  const urls = [];
  
  // Assets module tabs
  ASSETS_TABS.forEach(tab => {
    urls.push({
      module: 'assets',
      name: tab.name,
      url: `${BASE_URL}/workspace/${workspaceId}/assets/${tab.slug}`,
      description: tab.description
    });
  });
  
  // Related module tabs
  RELATED_TABS.forEach(tab => {
    urls.push({
      module: tab.module,
      name: tab.name,
      url: `${BASE_URL}/workspace/${workspaceId}/${tab.module}/${tab.slug}`,
      description: tab.description
    });
  });
  
  return urls;
}

function printTestURLs(workspaceId) {
  const urls = generateTestURLs(workspaceId);
  
  console.log('🔗 Test URLs:\n');
  console.log('Copy and paste these URLs into your browser to test:\n');
  
  urls.forEach((item, index) => {
    console.log(`${index + 1}. ${item.name}`);
    console.log(`   ${item.url}`);
    console.log(`   ✓ Check: No "Error loading data" message`);
    console.log(`   ✓ Check: Location information displays correctly`);
    console.log(`   ✓ Check: Related data (personnel, productions) displays`);
    console.log('');
  });
}

function printManualTestChecklist() {
  console.log('📝 Manual Testing Checklist:\n');
  console.log('For each route, verify:');
  console.log('   ☐ Page loads without errors');
  console.log('   ☐ No "Error loading data" message appears');
  console.log('   ☐ Data displays in the table/list');
  console.log('   ☐ Location information shows correctly (name, city)');
  console.log('   ☐ Personnel names display (if applicable)');
  console.log('   ☐ Production names display (if applicable)');
  console.log('   ☐ Asset type and status display correctly');
  console.log('   ☐ No console errors in browser DevTools');
  console.log('');
}

function printDatabaseVerification() {
  console.log('🗄️  Database Verification Queries:\n');
  console.log('Run these queries in Supabase SQL Editor to verify data:\n');
  
  console.log('-- 1. Verify assets table structure');
  console.log('SELECT column_name, data_type, is_nullable');
  console.log('FROM information_schema.columns');
  console.log('WHERE table_name = \'assets\'');
  console.log('ORDER BY ordinal_position;\n');
  
  console.log('-- 2. Verify assets with locations');
  console.log('SELECT a.id, a.name, a.location_id, l.name as location_name, l.city');
  console.log('FROM assets a');
  console.log('LEFT JOIN locations l ON a.location_id = l.id');
  console.log('LIMIT 10;\n');
  
  console.log('-- 3. Verify asset transactions with relationships');
  console.log('SELECT ');
  console.log('    at.id,');
  console.log('    a.name as asset_name,');
  console.log('    p.first_name || \' \' || p.last_name as checked_out_to,');
  console.log('    prod.name as production_name,');
  console.log('    e.name as event_name');
  console.log('FROM asset_transactions at');
  console.log('LEFT JOIN assets a ON at.asset_id = a.id');
  console.log('LEFT JOIN personnel p ON at.checked_out_to = p.id');
  console.log('LEFT JOIN productions prod ON at.production_id = prod.id');
  console.log('LEFT JOIN events e ON at.event_id = e.id');
  console.log('LIMIT 10;\n');
  
  console.log('-- 4. Verify maintenance records');
  console.log('SELECT ');
  console.log('    am.id,');
  console.log('    a.name as asset_name,');
  console.log('    a.type,');
  console.log('    p.first_name || \' \' || p.last_name as performed_by,');
  console.log('    am.scheduled_date');
  console.log('FROM asset_maintenance am');
  console.log('LEFT JOIN assets a ON am.asset_id = a.id');
  console.log('LEFT JOIN personnel p ON am.performed_by = p.id');
  console.log('LIMIT 10;\n');
  
  console.log('-- 5. Verify production advances');
  console.log('SELECT ');
  console.log('    pa.id,');
  console.log('    prod.name as production_name,');
  console.log('    prod.status,');
  console.log('    u1.raw_user_meta_data->>\'first_name\' || \' \' || u1.raw_user_meta_data->>\'last_name\' as requested_by,');
  console.log('    u2.raw_user_meta_data->>\'first_name\' || \' \' || u2.raw_user_meta_data->>\'last_name\' as approved_by');
  console.log('FROM production_advances pa');
  console.log('LEFT JOIN productions prod ON pa.production_id = prod.id');
  console.log('LEFT JOIN auth.users u1 ON pa.requested_by = u1.id');
  console.log('LEFT JOIN auth.users u2 ON pa.approved_by = u2.id');
  console.log('LIMIT 10;\n');
}

function printFixSummary() {
  console.log('🔧 Applied Fixes Summary:\n');
  console.log('✅ Fixed: current_location_id → location:locations!location_id');
  console.log('✅ Fixed: asset_type → type');
  console.log('✅ Fixed: transaction_date → created_at');
  console.log('✅ Fixed: requested_date → created_at');
  console.log('✅ Added: Personnel relationships (checked_out_to, performed_by)');
  console.log('✅ Added: Production and event relationships');
  console.log('✅ Fixed: Proper foreign key syntax across all queries');
  console.log('');
}

async function promptForWorkspaceId() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Enter workspace ID (or press Enter to use example ID): ', (answer) => {
      rl.close();
      resolve(answer.trim() || 'a8747baa-1336-4a0f-b813-979a73076d0');
    });
  });
}

async function main() {
  printHeader();
  
  let workspaceId = process.argv[2];
  
  if (!workspaceId) {
    workspaceId = await promptForWorkspaceId();
  }
  
  printSummary(workspaceId);
  printTestPlan();
  printTestURLs(workspaceId);
  printManualTestChecklist();
  printDatabaseVerification();
  printFixSummary();
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📌 Next Steps:');
  console.log('   1. Test each URL in your browser');
  console.log('   2. Run database verification queries');
  console.log('   3. Check browser console for errors');
  console.log('   4. Mark items in the checklist as you test');
  console.log('═══════════════════════════════════════════════════════════\n');
}

// Run the script
main().catch(console.error);
