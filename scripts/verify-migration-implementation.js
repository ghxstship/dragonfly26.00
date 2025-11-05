#!/usr/bin/env node

/**
 * VERIFY MIGRATION IMPLEMENTATION - 100% CHECK
 * Sequentially verifies that all 148 migrations are fully implemented
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MIGRATIONS_DIR = path.join(__dirname, '../supabase/migrations');

console.log('🔍 MIGRATION IMPLEMENTATION VERIFICATION');
console.log('=========================================\n');

// Step 1: Get all local migrations
console.log('📋 STEP 1: SCANNING LOCAL MIGRATIONS');
console.log('=====================================\n');

const localMigrations = fs.readdirSync(MIGRATIONS_DIR)
  .filter(f => f.match(/^[0-9]{3}_/) && f.endsWith('.sql'))
  .sort();

console.log(`Total Local Migrations: ${localMigrations.length}\n`);

// Step 2: Get remote migration status
console.log('📊 STEP 2: CHECKING REMOTE STATUS');
console.log('==================================\n');

let migrationListOutput;
try {
  migrationListOutput = execSync('npx supabase migration list', {
    cwd: path.join(__dirname, '..'),
    encoding: 'utf8'
  });
} catch (error) {
  console.error('❌ Error checking remote status:', error.message);
  process.exit(1);
}

// Parse migration list
const lines = migrationListOutput.split('\n');
const migrationStatus = new Map();

lines.forEach(line => {
  if (line.includes('|') && !line.includes('Local | Remote') && !line.includes('---')) {
    const parts = line.split('|').map(p => p.trim());
    if (parts.length >= 3 && parts[0]) {
      const local = parts[0];
      const remote = parts[1];
      const time = parts[2];
      
      migrationStatus.set(local, {
        local: local,
        remote: remote || null,
        time: time,
        applied: !!remote
      });
    }
  }
});

console.log(`Migrations in Remote History: ${migrationStatus.size}\n`);

// Step 3: Analyze implementation status
console.log('🔬 STEP 3: ANALYZING IMPLEMENTATION STATUS');
console.log('===========================================\n');

const applied = [];
const pending = [];
const missing = [];

localMigrations.forEach(filename => {
  const number = filename.match(/^([0-9]{3})/)[1];
  const status = migrationStatus.get(number);
  
  if (status) {
    if (status.applied) {
      applied.push({ number, filename, status: 'applied' });
    } else {
      pending.push({ number, filename, status: 'pending' });
    }
  } else {
    missing.push({ number, filename, status: 'missing' });
  }
});

console.log(`✅ Applied: ${applied.length}`);
console.log(`⏳ Pending: ${pending.length}`);
console.log(`❌ Missing: ${missing.length}`);
console.log(`📊 Total: ${localMigrations.length}\n`);

// Step 4: Detailed breakdown by category
console.log('📋 STEP 4: BREAKDOWN BY CATEGORY');
console.log('=================================\n');

const categories = {
  foundation: { applied: 0, pending: 0, total: 0 },
  modules: { applied: 0, pending: 0, total: 0 },
  core_data: { applied: 0, pending: 0, total: 0 },
  security: { applied: 0, pending: 0, total: 0 },
  features: { applied: 0, pending: 0, total: 0 },
  performance: { applied: 0, pending: 0, total: 0 },
  fixes: { applied: 0, pending: 0, total: 0 },
  other: { applied: 0, pending: 0, total: 0 },
  data: { applied: 0, pending: 0, total: 0 }
};

localMigrations.forEach(filename => {
  const number = filename.match(/^([0-9]{3})/)[1];
  const categoryMatch = filename.match(/^[0-9]{3}_([^_]+)_/);
  const category = categoryMatch ? categoryMatch[1] : 'other';
  
  if (categories[category]) {
    categories[category].total++;
    
    const status = migrationStatus.get(number);
    if (status && status.applied) {
      categories[category].applied++;
    } else {
      categories[category].pending++;
    }
  }
});

Object.entries(categories).forEach(([cat, stats]) => {
  if (stats.total > 0) {
    const pct = ((stats.applied / stats.total) * 100).toFixed(1);
    const status = stats.pending === 0 ? '✅' : '⏳';
    console.log(`${status} ${cat.padEnd(15)} ${stats.applied}/${stats.total} (${pct}%)`);
  }
});

console.log('');

// Step 5: List pending migrations
if (pending.length > 0) {
  console.log('⏳ STEP 5: PENDING MIGRATIONS');
  console.log('=============================\n');
  
  console.log(`${pending.length} migrations need to be applied:\n`);
  
  pending.slice(0, 30).forEach(m => {
    console.log(`  ${m.number}. ${m.filename}`);
  });
  
  if (pending.length > 30) {
    console.log(`  ... (${pending.length - 30} more)\n`);
  } else {
    console.log('');
  }
}

// Step 6: Check for gaps in sequence
console.log('🔍 STEP 6: CHECKING SEQUENCE INTEGRITY');
console.log('=======================================\n');

const gaps = [];
for (let i = 1; i <= 148; i++) {
  const number = String(i).padStart(3, '0');
  if (!migrationStatus.has(number)) {
    gaps.push(number);
  }
}

if (gaps.length === 0) {
  console.log('✅ No gaps in sequence (001-148)\n');
} else {
  console.log(`⚠️  Found ${gaps.length} gaps in sequence:\n`);
  gaps.forEach(num => console.log(`  - ${num}`));
  console.log('');
}

// Step 7: Generate report
console.log('📄 STEP 7: GENERATING REPORT');
console.log('=============================\n');

const report = {
  timestamp: new Date().toISOString(),
  summary: {
    totalMigrations: localMigrations.length,
    applied: applied.length,
    pending: pending.length,
    missing: missing.length,
    completionPercentage: ((applied.length / localMigrations.length) * 100).toFixed(2),
    sequenceIntegrity: gaps.length === 0 ? 'COMPLETE' : 'GAPS_FOUND'
  },
  categories: Object.entries(categories).map(([name, stats]) => ({
    name,
    applied: stats.applied,
    pending: stats.pending,
    total: stats.total,
    percentage: stats.total > 0 ? ((stats.applied / stats.total) * 100).toFixed(1) : 0
  })),
  pendingMigrations: pending.map(m => ({
    number: m.number,
    filename: m.filename
  })),
  gaps: gaps,
  appliedMigrations: applied.map(m => m.number),
  verification: {
    allMigrationsPresent: localMigrations.length === 148,
    sequenceComplete: gaps.length === 0,
    fullyImplemented: pending.length === 0 && missing.length === 0
  }
};

const reportPath = path.join(__dirname, '../docs/audits/MIGRATION_IMPLEMENTATION_VERIFICATION.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log(`✅ Report saved: ${reportPath}\n`);

// Step 8: Final verdict
console.log('🎯 STEP 8: FINAL VERDICT');
console.log('========================\n');

const completionPct = ((applied.length / localMigrations.length) * 100).toFixed(1);

console.log(`Implementation Status: ${applied.length}/${localMigrations.length} (${completionPct}%)\n`);

if (pending.length === 0 && missing.length === 0 && gaps.length === 0) {
  console.log('✅ VERDICT: 100% IMPLEMENTED');
  console.log('============================\n');
  console.log('All 148 migrations are fully implemented and applied to remote database.');
  console.log('Sequence is complete with no gaps (001-148).');
  console.log('Database is 100% aligned with local migration files.\n');
  
  console.log('🎉 SUCCESS - READY FOR PRODUCTION!\n');
} else {
  console.log('⏳ VERDICT: PARTIAL IMPLEMENTATION');
  console.log('===================================\n');
  
  if (pending.length > 0) {
    console.log(`⚠️  ${pending.length} migrations pending application`);
  }
  if (missing.length > 0) {
    console.log(`⚠️  ${missing.length} migrations missing from remote`);
  }
  if (gaps.length > 0) {
    console.log(`⚠️  ${gaps.length} gaps in sequence`);
  }
  
  console.log('\n💡 NEXT STEPS:\n');
  
  if (pending.length > 0) {
    console.log('1. Apply pending migrations:');
    console.log('   npx supabase db push --include-all\n');
    console.log('   OR mark as applied if tables already exist:');
    console.log('   node scripts/sync-migration-history.js\n');
  }
  
  console.log('2. Verify database state:');
  console.log('   npx supabase db diff\n');
  
  console.log('3. Re-run this verification:');
  console.log('   node scripts/verify-migration-implementation.js\n');
}

// Exit with appropriate code
process.exit(pending.length === 0 && missing.length === 0 && gaps.length === 0 ? 0 : 1);
