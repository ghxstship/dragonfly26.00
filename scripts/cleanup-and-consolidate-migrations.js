#!/usr/bin/env node

/**
 * CLEANUP AND CONSOLIDATE MIGRATIONS
 * Removes orphaned directories, consolidates seed files, integrates everything into master numbering
 */

const fs = require('fs');
const path = require('path');

const MIGRATIONS_DIR = path.join(__dirname, '../supabase/migrations');
const SUPABASE_DIR = path.join(__dirname, '../supabase');
const FINAL_BACKUP_DIR = path.join(MIGRATIONS_DIR, 'backup_final_before_cleanup_' + Date.now());

console.log('🧹 CLEANUP AND CONSOLIDATE MIGRATIONS');
console.log('======================================\n');

// Step 1: Create final backup
console.log('📦 STEP 1: CREATING FINAL BACKUP');
console.log('=================================\n');

fs.mkdirSync(FINAL_BACKUP_DIR, { recursive: true });

// Backup everything in migrations directory
const allMigrationFiles = fs.readdirSync(MIGRATIONS_DIR);
let backedUp = 0;

allMigrationFiles.forEach(item => {
  const source = path.join(MIGRATIONS_DIR, item);
  const dest = path.join(FINAL_BACKUP_DIR, item);
  
  if (fs.statSync(source).isFile()) {
    fs.copyFileSync(source, dest);
    backedUp++;
  } else if (fs.statSync(source).isDirectory() && !item.startsWith('backup_final')) {
    // Backup directories too
    fs.mkdirSync(dest, { recursive: true });
    const dirFiles = fs.readdirSync(source);
    dirFiles.forEach(f => {
      fs.copyFileSync(path.join(source, f), path.join(dest, f));
    });
    backedUp += dirFiles.length;
  }
});

console.log(`✅ Backed up ${backedUp} items to:`);
console.log(`   ${FINAL_BACKUP_DIR}\n`);

// Step 2: Analyze orphaned directories
console.log('🔍 STEP 2: ANALYZING ORPHANED DIRECTORIES');
console.log('==========================================\n');

const orphanedDirs = [
  'deprecated',
  'backup_complete_1762315721312',
  'backup_1762306372633',
  'applied'
];

const orphanedFiles = {};

orphanedDirs.forEach(dir => {
  const dirPath = path.join(MIGRATIONS_DIR, dir);
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.sql'));
    orphanedFiles[dir] = files;
    console.log(`📁 ${dir}: ${files.length} files`);
    if (files.length <= 10) {
      files.forEach(f => console.log(`   - ${f}`));
    } else {
      files.slice(0, 5).forEach(f => console.log(`   - ${f}`));
      console.log(`   ... (${files.length - 5} more)`);
    }
    console.log('');
  }
});

// Step 3: Analyze seed files
console.log('🔍 STEP 3: ANALYZING SEED FILES');
console.log('================================\n');

const seedFiles = [
  'seed.sql',
  'seed-part2.sql',
  'seed-part3.sql',
  'storage-buckets-config.sql'
];

const seedInfo = {};

seedFiles.forEach(file => {
  const filepath = path.join(SUPABASE_DIR, file);
  if (fs.existsSync(filepath)) {
    const stats = fs.statSync(filepath);
    const content = fs.readFileSync(filepath, 'utf8');
    const lines = content.split('\n').length;
    seedInfo[file] = {
      size: stats.size,
      lines: lines,
      exists: true
    };
    console.log(`📄 ${file}:`);
    console.log(`   Size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`   Lines: ${lines}`);
  } else {
    seedInfo[file] = { exists: false };
    console.log(`📄 ${file}: NOT FOUND`);
  }
  console.log('');
});

// Step 4: Consolidate seed files into single migration
console.log('🔄 STEP 4: CONSOLIDATING SEED FILES');
console.log('====================================\n');

let consolidatedSeed = [
  '-- CONSOLIDATED SEED DATA',
  '-- Generated: ' + new Date().toISOString(),
  '-- Combines: seed.sql, seed-part2.sql, seed-part3.sql, storage-buckets-config.sql',
  '',
  '-- This migration contains demo/seed data for development and testing',
  '-- It should be applied AFTER all schema migrations',
  '',
  '-- ============================================================================',
  '-- PART 1: ORIGINAL SEED DATA',
  '-- ============================================================================',
  ''
].join('\n');

// Read and combine seed files
seedFiles.forEach(file => {
  const filepath = path.join(SUPABASE_DIR, file);
  if (fs.existsSync(filepath)) {
    const content = fs.readFileSync(filepath, 'utf8');
    consolidatedSeed += `\n-- FROM: ${file}\n`;
    consolidatedSeed += content;
    consolidatedSeed += '\n\n';
  }
});

// Find the highest migration number
const currentMigrations = fs.readdirSync(MIGRATIONS_DIR)
  .filter(f => f.match(/^[0-9]{3}_/) && f.endsWith('.sql'))
  .sort();

const lastMigration = currentMigrations[currentMigrations.length - 1];
const lastNumber = parseInt(lastMigration.match(/^([0-9]{3})/)[1]);
const newSeedNumber = lastNumber + 1;

const consolidatedSeedPath = path.join(MIGRATIONS_DIR, `${String(newSeedNumber).padStart(3, '0')}_data_consolidated_seed_data.sql`);
fs.writeFileSync(consolidatedSeedPath, consolidatedSeed);

console.log(`✅ Created consolidated seed migration:`);
console.log(`   ${String(newSeedNumber).padStart(3, '0')}_data_consolidated_seed_data.sql`);
console.log(`   Size: ${(consolidatedSeed.length / 1024).toFixed(2)} KB\n`);

// Step 5: Remove orphaned directories
console.log('🗑️  STEP 5: REMOVING ORPHANED DIRECTORIES');
console.log('=========================================\n');

let removedDirs = 0;
let removedFiles = 0;

orphanedDirs.forEach(dir => {
  const dirPath = path.join(MIGRATIONS_DIR, dir);
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    files.forEach(f => {
      fs.unlinkSync(path.join(dirPath, f));
      removedFiles++;
    });
    fs.rmdirSync(dirPath);
    removedDirs++;
    console.log(`✅ Removed: ${dir}/ (${files.length} files)`);
  }
});

console.log(`\nTotal: ${removedDirs} directories, ${removedFiles} files removed\n`);

// Step 6: Move seed files to archive
console.log('📦 STEP 6: ARCHIVING ORIGINAL SEED FILES');
console.log('=========================================\n');

const archiveDir = path.join(SUPABASE_DIR, 'seed-archive');
fs.mkdirSync(archiveDir, { recursive: true });

let archivedSeeds = 0;

seedFiles.forEach(file => {
  const source = path.join(SUPABASE_DIR, file);
  const dest = path.join(archiveDir, file);
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, dest);
    fs.unlinkSync(source);
    archivedSeeds++;
    console.log(`✅ Archived: ${file}`);
  }
});

console.log(`\nTotal: ${archivedSeeds} seed files archived to supabase/seed-archive/\n`);

// Step 7: Create README for seed archive
const readmePath = path.join(archiveDir, 'README.md');
const readmeContent = `# Seed Data Archive

These files have been consolidated into migration \`${String(newSeedNumber).padStart(3, '0')}_data_consolidated_seed_data.sql\`.

They are kept here for reference only and should not be used directly.

## Original Files

${seedFiles.map(f => `- ${f}`).join('\n')}

## Consolidated Migration

All seed data is now in:
\`/supabase/migrations/${String(newSeedNumber).padStart(3, '0')}_data_consolidated_seed_data.sql\`

This migration should be applied AFTER all schema migrations.

---

**Archived:** ${new Date().toISOString()}
`;

fs.writeFileSync(readmePath, readmeContent);
console.log(`✅ Created README.md in seed-archive/\n`);

// Step 8: Generate final report
console.log('📊 STEP 8: GENERATING FINAL REPORT');
console.log('===================================\n');

const finalMigrations = fs.readdirSync(MIGRATIONS_DIR)
  .filter(f => f.match(/^[0-9]{3}_/) && f.endsWith('.sql'))
  .sort();

const report = {
  timestamp: new Date().toISOString(),
  summary: {
    totalMigrations: finalMigrations.length,
    highestNumber: newSeedNumber,
    sequentialRange: `001-${String(newSeedNumber).padStart(3, '0')}`,
    orphanedDirsRemoved: removedDirs,
    orphanedFilesRemoved: removedFiles,
    seedFilesArchived: archivedSeeds,
    consolidatedSeedMigration: `${String(newSeedNumber).padStart(3, '0')}_data_consolidated_seed_data.sql`
  },
  removedDirectories: orphanedDirs.filter(dir => fs.existsSync(path.join(MIGRATIONS_DIR, dir)) === false),
  archivedSeedFiles: seedFiles.filter(f => fs.existsSync(path.join(SUPABASE_DIR, f)) === false),
  finalMigrationList: finalMigrations,
  backupLocation: FINAL_BACKUP_DIR
};

const reportPath = path.join(__dirname, '../docs/audits/CLEANUP_CONSOLIDATION_REPORT.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log(`✅ Report saved: ${reportPath}\n`);

// Step 9: Update application order
console.log('📝 STEP 9: UPDATING APPLICATION ORDER');
console.log('======================================\n');

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
console.log(`✅ Updated: ${orderPath}\n`);

// Final summary
console.log('✅ CLEANUP COMPLETE');
console.log('===================\n');

console.log('📊 Summary:');
console.log(`   Total Migrations: ${finalMigrations.length}`);
console.log(`   Sequential Range: 001-${String(newSeedNumber).padStart(3, '0')}`);
console.log(`   Orphaned Dirs Removed: ${removedDirs}`);
console.log(`   Orphaned Files Removed: ${removedFiles}`);
console.log(`   Seed Files Archived: ${archivedSeeds}`);
console.log(`   Consolidated Seed: ${String(newSeedNumber).padStart(3, '0')}_data_consolidated_seed_data.sql\n`);

console.log('📁 Directory Structure:');
console.log('   /supabase/migrations/');
console.log(`   ├── 001-${String(newSeedNumber).padStart(3, '0')}_*.sql (${finalMigrations.length} files)`);
console.log(`   └── ${path.basename(FINAL_BACKUP_DIR)}/ (backup)\n`);
console.log('   /supabase/seed-archive/');
console.log(`   ├── seed.sql`);
console.log(`   ├── seed-part2.sql`);
console.log(`   ├── seed-part3.sql`);
console.log(`   ├── storage-buckets-config.sql`);
console.log(`   └── README.md\n`);

console.log('🎉 ALL CLEANUP AND CONSOLIDATION COMPLETE!\n');
console.log('Next steps:');
console.log('1. Review: cat docs/audits/MIGRATION_APPLICATION_ORDER_FINAL.txt');
console.log('2. Apply: node scripts/apply-all-migrations-sequentially.js');
console.log('3. Verify: node scripts/check-remote-migrations.js\n');
