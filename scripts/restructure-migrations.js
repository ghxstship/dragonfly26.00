#!/usr/bin/env node

/**
 * RESTRUCTURE ALL MIGRATIONS
 * Renames and organizes migrations into sequential order
 * Phase 1: Foundation → Phase 8: Fixes
 */

const fs = require('fs');
const path = require('path');

const MIGRATIONS_DIR = path.join(__dirname, '../supabase/migrations');
const DEPRECATED_DIR = path.join(MIGRATIONS_DIR, 'deprecated');
const BACKUP_DIR = path.join(MIGRATIONS_DIR, 'backup_' + Date.now());

console.log('🔄 RESTRUCTURING ALL MIGRATIONS');
console.log('================================\n');

// Load the restructuring plan
const planPath = path.join(__dirname, '../docs/audits/MIGRATION_RESTRUCTURE_PLAN.json');
if (!fs.existsSync(planPath)) {
  console.error('❌ Error: Run comprehensive-migration-audit.js first');
  process.exit(1);
}

const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));
const restructurePlan = plan.restructurePlan;

console.log(`📋 Restructuring Plan Loaded`);
console.log(`Total Migrations: ${restructurePlan.length}`);
console.log(`Phases: 8 (Foundation → Fixes)\n`);

// Create backup directory
fs.mkdirSync(BACKUP_DIR, { recursive: true });
console.log(`📦 Backup directory created: ${BACKUP_DIR}\n`);

// Step 1: Backup all current migrations
console.log(`📦 STEP 1: BACKING UP CURRENT STATE`);
console.log(`===================================\n`);

const allCurrentFiles = fs.readdirSync(MIGRATIONS_DIR)
  .filter(f => f.endsWith('.sql'));

allCurrentFiles.forEach(f => {
  const source = path.join(MIGRATIONS_DIR, f);
  const dest = path.join(BACKUP_DIR, f);
  fs.copyFileSync(source, dest);
});

console.log(`✅ Backed up ${allCurrentFiles.length} files\n`);

// Step 2: Move deprecated files back to main directory temporarily
console.log(`📂 STEP 2: CONSOLIDATING FILES`);
console.log(`==============================\n`);

if (fs.existsSync(DEPRECATED_DIR)) {
  const deprecatedFiles = fs.readdirSync(DEPRECATED_DIR)
    .filter(f => f.endsWith('.sql'));
  
  deprecatedFiles.forEach(f => {
    const source = path.join(DEPRECATED_DIR, f);
    const dest = path.join(MIGRATIONS_DIR, f);
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(source, dest);
      console.log(`  Restored: ${f}`);
    }
  });
  console.log(`\n✅ Restored ${deprecatedFiles.length} deprecated files\n`);
}

// Step 3: Rename all migrations according to plan
console.log(`🔄 STEP 3: RENAMING MIGRATIONS`);
console.log(`==============================\n`);

const renameMap = new Map();
let renamed = 0;
let skipped = 0;

restructurePlan.forEach((item, idx) => {
  const oldPath = path.join(
    item.location === 'deprecated' ? DEPRECATED_DIR : MIGRATIONS_DIR,
    item.oldName
  );
  const newPath = path.join(MIGRATIONS_DIR, item.newName);
  
  // Check if source file exists
  if (!fs.existsSync(oldPath)) {
    // Try in main migrations dir
    const altPath = path.join(MIGRATIONS_DIR, item.oldName);
    if (fs.existsSync(altPath)) {
      renameMap.set(altPath, newPath);
    } else {
      console.log(`  ⚠️  Skip: ${item.oldName} (not found)`);
      skipped++;
      return;
    }
  } else {
    renameMap.set(oldPath, newPath);
  }
});

// Perform renames in two passes to avoid conflicts
console.log(`\nPass 1: Rename to temporary names...`);
const tempMap = new Map();

renameMap.forEach((newPath, oldPath) => {
  const tempPath = oldPath + '.tmp';
  fs.renameSync(oldPath, tempPath);
  tempMap.set(tempPath, newPath);
  renamed++;
});

console.log(`Pass 2: Rename to final names...\n`);

tempMap.forEach((newPath, tempPath) => {
  fs.renameSync(tempPath, newPath);
  const newName = path.basename(newPath);
  if (renamed <= 20 || renamed % 10 === 0) {
    console.log(`  ✅ ${path.basename(tempPath, '.tmp')} → ${newName}`);
  }
});

if (renamed > 20) {
  console.log(`  ... (${renamed - 20} more)`);
}

console.log(`\n✅ Renamed ${renamed} migrations`);
if (skipped > 0) {
  console.log(`⚠️  Skipped ${skipped} missing files\n`);
}

// Step 4: Clean up deprecated directory
console.log(`\n🧹 STEP 4: CLEANING UP`);
console.log(`======================\n`);

if (fs.existsSync(DEPRECATED_DIR)) {
  const remaining = fs.readdirSync(DEPRECATED_DIR).filter(f => f.endsWith('.sql'));
  if (remaining.length === 0) {
    console.log(`✅ Deprecated directory is empty\n`);
  } else {
    console.log(`⚠️  ${remaining.length} files remain in deprecated/\n`);
  }
}

// Step 5: Generate migration order file
console.log(`📝 STEP 5: GENERATING APPLICATION ORDER`);
console.log(`=======================================\n`);

const finalMigrations = fs.readdirSync(MIGRATIONS_DIR)
  .filter(f => f.endsWith('.sql') && !f.includes('.skip'))
  .sort();

const orderPath = path.join(__dirname, '../docs/audits/MIGRATION_APPLICATION_ORDER.txt');
const orderContent = [
  '# MIGRATION APPLICATION ORDER',
  '# Generated: ' + new Date().toISOString(),
  '# Total Migrations: ' + finalMigrations.length,
  '',
  '# Apply in this exact order for 100% completion:',
  '',
  ...finalMigrations.map((f, idx) => `${idx + 1}. ${f}`)
].join('\n');

fs.writeFileSync(orderPath, orderContent);
console.log(`✅ Application order saved to: ${orderPath}\n`);

// Step 6: Update Supabase migration history
console.log(`📊 STEP 6: SUMMARY`);
console.log(`==================\n`);

console.log(`Restructuring Complete!`);
console.log(`- Total Migrations: ${finalMigrations.length}`);
console.log(`- Renamed: ${renamed}`);
console.log(`- Skipped: ${skipped}`);
console.log(`- Backup Location: ${BACKUP_DIR}`);
console.log(`- Application Order: ${orderPath}\n`);

console.log(`✅ ALL MIGRATIONS RESTRUCTURED\n`);
console.log(`Next Steps:`);
console.log(`1. Review the new migration order`);
console.log(`2. Reset remote database migration history:`);
console.log(`   npx supabase migration repair --status reverted <all-old-numbers>`);
console.log(`3. Apply migrations sequentially:`);
console.log(`   npx supabase db push\n`);

// Generate repair command
const oldNumbers = Array.from(new Set(
  restructurePlan
    .map(item => item.oldName.match(/^(\d+)/)?.[1])
    .filter(Boolean)
)).sort((a, b) => parseInt(a) - parseInt(b));

if (oldNumbers.length > 0) {
  console.log(`Migration Repair Command:`);
  console.log(`npx supabase migration repair --status reverted ${oldNumbers.join(' ')}\n`);
}
