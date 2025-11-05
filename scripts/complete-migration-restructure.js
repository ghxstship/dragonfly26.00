#!/usr/bin/env node

/**
 * COMPLETE MIGRATION RESTRUCTURE - FRESH START
 * Audits and restructures ALL migrations with perfect sequential numbering
 * 001-146 with category prefixes
 */

const fs = require('fs');
const path = require('path');

const MIGRATIONS_DIR = path.join(__dirname, '../supabase/migrations');
const BACKUP_DIR = path.join(MIGRATIONS_DIR, 'backup_complete_' + Date.now());
const DEPRECATED_DIR = path.join(MIGRATIONS_DIR, 'deprecated');

console.log('🔄 COMPLETE MIGRATION RESTRUCTURE - FRESH START');
console.log('================================================\n');

// Step 1: Create comprehensive backup
console.log('📦 STEP 1: CREATING COMPLETE BACKUP');
console.log('====================================\n');

fs.mkdirSync(BACKUP_DIR, { recursive: true });

const allFiles = fs.readdirSync(MIGRATIONS_DIR)
  .filter(f => (f.endsWith('.sql') || f.endsWith('.sql.skip')) && f !== 'backup_complete_' + Date.now());

allFiles.forEach(f => {
  const source = path.join(MIGRATIONS_DIR, f);
  const dest = path.join(BACKUP_DIR, f);
  if (fs.statSync(source).isFile()) {
    fs.copyFileSync(source, dest);
  }
});

console.log(`✅ Backed up ${allFiles.length} files to:`);
console.log(`   ${BACKUP_DIR}\n`);

// Step 2: Analyze ALL migrations
console.log('🔬 STEP 2: ANALYZING ALL MIGRATIONS');
console.log('====================================\n');

function categorizeMigration(filename, content) {
  const lower = filename.toLowerCase();
  const contentLower = content.toLowerCase();
  
  // Foundation - Core schema
  if (lower.match(/^00[0-9]_/) || lower.includes('foundation') || 
      lower.includes('projects_module') || lower.includes('events_module') ||
      lower.includes('people_module') || lower.includes('assets_module') ||
      lower.includes('locations_module') || lower.includes('files_companies') ||
      lower.includes('branded_rbac_system') || lower.includes('subscriptions_and_invitations') ||
      lower.includes('storage_layer') || lower.includes('api_layer')) {
    return { category: 'foundation', priority: 1 };
  }
  
  // Modules - Feature modules
  if (lower.includes('module') && !lower.includes('foundation') ||
      lower.includes('analytics') || lower.includes('insights') ||
      lower.includes('finance') || lower.includes('procurement') ||
      lower.includes('opportunities') || lower.includes('jobs_module') ||
      lower.includes('reports_module')) {
    return { category: 'modules', priority: 2 };
  }
  
  // Core Data - Essential tables and data
  if (lower.includes('profiles') || lower.includes('onboarding') ||
      lower.includes('subscription_pricing') || lower.includes('job_title') ||
      lower.includes('names_to_profiles') || lower.includes('travel_arrangements') ||
      lower.includes('workspace_id_to_company') || lower.includes('profile_foreign_keys') ||
      lower.includes('refactor_production') || lower.includes('asset_categories') ||
      lower.includes('seed_') || lower.includes('catalog')) {
    return { category: 'core_data', priority: 3 };
  }
  
  // Security - RLS, RBAC, permissions
  if (lower.includes('rls') || lower.includes('rbac') || lower.includes('security') ||
      lower.includes('permissions') || lower.includes('policies') ||
      contentLower.includes('create policy') || contentLower.includes('row level security')) {
    return { category: 'security', priority: 4 };
  }
  
  // Architecture - Hierarchy, normalization
  if (lower.includes('hierarchy') || lower.includes('normalization') ||
      lower.includes('architecture')) {
    return { category: 'architecture', priority: 5 };
  }
  
  // Features - Advanced functionality
  if (lower.includes('work_orders') || lower.includes('compliance') ||
      lower.includes('communication') || lower.includes('invoicing') ||
      lower.includes('checklists') || lower.includes('workflows') ||
      lower.includes('cost_tracking') || lower.includes('recruiting') ||
      lower.includes('inventory') || lower.includes('agreements') ||
      lower.includes('background_jobs') || lower.includes('billing_cycle') ||
      lower.includes('missing_tables') || lower.includes('create_missing')) {
    return { category: 'features', priority: 6 };
  }
  
  // Performance - Indexes, optimization
  if (lower.includes('performance') || lower.includes('optimization') ||
      lower.includes('index') || lower.includes('cleanup_unused') ||
      lower.includes('foreign_key_indexes') || lower.includes('essential_indexes') ||
      contentLower.includes('create index')) {
    return { category: 'performance', priority: 7 };
  }
  
  // Enhancements - Modern features
  if (lower.includes('field_comments') || lower.includes('presence') ||
      lower.includes('dashboard_sharing') || lower.includes('rollup') ||
      lower.includes('sso') || lower.includes('saml') ||
      lower.includes('version_history') || lower.includes('waitlist') ||
      lower.includes('remediation_tables')) {
    return { category: 'enhancements', priority: 8 };
  }
  
  // Fixes - Bug fixes, warnings
  if (lower.includes('fix') || lower.includes('resolve') ||
      lower.includes('warning') || lower.includes('linter') ||
      lower.includes('error') || lower.includes('drop_if_exists')) {
    return { category: 'fixes', priority: 9 };
  }
  
  // Demo/Test data
  if (lower.includes('demo') || lower.includes('seed') || lower.includes('test')) {
    return { category: 'data', priority: 10 };
  }
  
  return { category: 'other', priority: 11 };
}

const migrations = [];

allFiles.forEach(filename => {
  if (filename.startsWith('backup_')) return;
  
  const filepath = path.join(MIGRATIONS_DIR, filename);
  if (!fs.statSync(filepath).isFile()) return;
  
  const content = fs.readFileSync(filepath, 'utf8');
  const { category, priority } = categorizeMigration(filename, content);
  
  // Extract original timestamp if exists
  const timestampMatch = filename.match(/^(\d+)/);
  const originalNumber = timestampMatch ? parseInt(timestampMatch[1]) : 999999;
  
  migrations.push({
    filename,
    category,
    priority,
    originalNumber,
    size: fs.statSync(filepath).size,
    isSkipped: filename.endsWith('.skip')
  });
});

// Sort by priority, then by original number
migrations.sort((a, b) => {
  if (a.priority !== b.priority) return a.priority - b.priority;
  return a.originalNumber - b.originalNumber;
});

console.log(`Total Migrations Found: ${migrations.length}\n`);

// Show category breakdown
const categoryCount = {};
migrations.forEach(m => {
  categoryCount[m.category] = (categoryCount[m.category] || 0) + 1;
});

console.log('Category Breakdown:');
Object.entries(categoryCount).sort((a, b) => a[0].localeCompare(b[0])).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count}`);
});
console.log('');

// Step 3: Generate new sequential names
console.log('📝 STEP 3: GENERATING NEW SEQUENTIAL NAMES');
console.log('==========================================\n');

const renameMap = new Map();
let sequence = 1;

migrations.forEach(m => {
  if (m.isSkipped) {
    // Keep .skip files with their original names
    return;
  }
  
  // Generate new name
  const baseName = m.filename
    .replace(/^[0-9_]+/, '')
    .replace(/^_+/, '')
    .replace(/_deferred/, '')
    .replace(/_old/, '')
    .replace(/_complete/, '')
    .replace(/_final/, '')
    .replace(/_part[0-9]/, '')
    .replace(/_v[0-9]/, '');
  
  const newName = `${String(sequence).padStart(3, '0')}_${m.category}_${baseName}`;
  
  renameMap.set(m.filename, newName);
  
  if (sequence <= 20 || sequence % 20 === 0) {
    console.log(`${sequence}. ${m.filename}`);
    console.log(`   → ${newName}\n`);
  }
  
  sequence++;
});

if (sequence > 20) {
  console.log(`... (${sequence - 21} more)\n`);
}

console.log(`Total Migrations to Rename: ${renameMap.size}\n`);

// Step 4: Perform rename
console.log('🔄 STEP 4: RENAMING ALL MIGRATIONS');
console.log('===================================\n');

// Two-pass rename to avoid conflicts
const tempMap = new Map();

// Pass 1: Rename to temp
renameMap.forEach((newName, oldName) => {
  const oldPath = path.join(MIGRATIONS_DIR, oldName);
  const tempPath = oldPath + '.tmp';
  
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, tempPath);
    tempMap.set(tempPath, path.join(MIGRATIONS_DIR, newName));
  }
});

console.log(`Pass 1: Renamed ${tempMap.size} files to temporary names`);

// Pass 2: Rename to final
let renamed = 0;
tempMap.forEach((finalPath, tempPath) => {
  fs.renameSync(tempPath, finalPath);
  renamed++;
});

console.log(`Pass 2: Renamed ${renamed} files to final names\n`);

// Step 5: Generate documentation
console.log('📄 STEP 5: GENERATING DOCUMENTATION');
console.log('====================================\n');

const finalMigrations = fs.readdirSync(MIGRATIONS_DIR)
  .filter(f => f.endsWith('.sql') && !f.includes('.skip') && !f.startsWith('backup_'))
  .sort();

// Application order
const orderPath = path.join(__dirname, '../docs/audits/MIGRATION_APPLICATION_ORDER_FINAL.txt');
const orderContent = [
  '# COMPLETE MIGRATION APPLICATION ORDER',
  '# Generated: ' + new Date().toISOString(),
  '# Total Migrations: ' + finalMigrations.length,
  '',
  '# Apply in this exact order for 100% completion:',
  '',
  ...finalMigrations.map((f, idx) => `${String(idx + 1).padStart(3, '0')}. ${f}`)
].join('\n');

fs.writeFileSync(orderPath, orderContent);
console.log(`✅ Application order: ${orderPath}`);

// Restructure report
const reportPath = path.join(__dirname, '../docs/audits/COMPLETE_RESTRUCTURE_REPORT.json');
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    totalMigrations: finalMigrations.length,
    renamed: renamed,
    skipped: migrations.filter(m => m.isSkipped).length,
    backupLocation: BACKUP_DIR
  },
  categories: Object.entries(categoryCount).map(([name, count]) => ({ name, count })),
  migrations: finalMigrations.map((f, idx) => ({
    sequence: idx + 1,
    filename: f,
    category: f.split('_')[1],
    originalName: Array.from(renameMap.entries()).find(([old, newName]) => newName === f)?.[0] || f
  }))
};

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`✅ Detailed report: ${reportPath}\n`);

// Step 6: Summary
console.log('✅ RESTRUCTURE COMPLETE');
console.log('=======================\n');

console.log(`📊 Summary:`);
console.log(`   Total Migrations: ${finalMigrations.length}`);
console.log(`   Renamed: ${renamed}`);
console.log(`   Sequential: 001-${String(finalMigrations.length).padStart(3, '0')}`);
console.log(`   Backup: ${BACKUP_DIR}\n`);

console.log(`📋 Category Distribution:`);
Object.entries(categoryCount).sort((a, b) => a[0].localeCompare(b[0])).forEach(([cat, count]) => {
  const pct = ((count / finalMigrations.length) * 100).toFixed(1);
  console.log(`   ${cat.padEnd(15)} ${String(count).padStart(3)} (${pct}%)`);
});

console.log(`\n🚀 Next Steps:`);
console.log(`   1. Review: cat docs/audits/MIGRATION_APPLICATION_ORDER_FINAL.txt`);
console.log(`   2. Apply: node scripts/apply-all-migrations-sequentially.js`);
console.log(`   3. Verify: node scripts/check-remote-migrations.js\n`);

console.log(`✅ ALL ${finalMigrations.length} MIGRATIONS RESTRUCTURED WITH PERFECT SEQUENTIAL ORDER\n`);
