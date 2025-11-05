#!/usr/bin/env node

/**
 * SEQUENTIAL MIGRATION AUDIT - 100% VERIFICATION
 * Audits each migration from 001-148 sequentially with NO GAPS
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MIGRATIONS_DIR = path.join(__dirname, '../supabase/migrations');

console.log('🔍 SEQUENTIAL MIGRATION AUDIT - 001 TO 148');
console.log('============================================\n');

// Step 1: Verify all 148 files exist
console.log('📋 STEP 1: VERIFYING ALL 148 MIGRATION FILES EXIST');
console.log('===================================================\n');

const results = [];
let allFilesExist = true;

for (let i = 1; i <= 148; i++) {
  const number = String(i).padStart(3, '0');
  const pattern = new RegExp(`^${number}_.*\\.sql$`);
  
  const files = fs.readdirSync(MIGRATIONS_DIR);
  const matchingFile = files.find(f => pattern.test(f));
  
  if (matchingFile) {
    const filepath = path.join(MIGRATIONS_DIR, matchingFile);
    const stats = fs.statSync(filepath);
    const content = fs.readFileSync(filepath, 'utf8');
    const lines = content.split('\n').length;
    
    results.push({
      number,
      filename: matchingFile,
      exists: true,
      size: stats.size,
      lines: lines
    });
    
    if (i <= 10 || i % 20 === 0 || i > 145) {
      console.log(`✅ ${number}: ${matchingFile} (${(stats.size / 1024).toFixed(1)} KB, ${lines} lines)`);
    }
  } else {
    results.push({
      number,
      filename: null,
      exists: false,
      size: 0,
      lines: 0
    });
    
    console.log(`❌ ${number}: MISSING`);
    allFilesExist = false;
  }
}

const existCount = results.filter(r => r.exists).length;
console.log(`\n📊 File Verification: ${existCount}/148 files exist\n`);

if (!allFilesExist) {
  console.error('❌ CRITICAL: Not all migration files exist!');
  console.error('Cannot proceed with sequential audit.\n');
  process.exit(1);
}

// Step 2: Get remote migration status
console.log('📊 STEP 2: CHECKING REMOTE DATABASE STATUS');
console.log('===========================================\n');

let migrationListOutput;
try {
  migrationListOutput = execSync('npx supabase migration list', {
    cwd: path.join(__dirname, '..'),
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  });
} catch (error) {
  console.error('❌ Error checking remote status:', error.message);
  process.exit(1);
}

// Parse remote status
const remoteStatus = new Map();
const lines = migrationListOutput.split('\n');

lines.forEach(line => {
  if (line.includes('|') && !line.includes('Local | Remote') && !line.includes('---')) {
    const parts = line.split('|').map(p => p.trim());
    if (parts.length >= 3 && parts[0]) {
      remoteStatus.set(parts[0], {
        local: parts[0],
        remote: parts[1] || null,
        time: parts[2],
        applied: !!parts[1]
      });
    }
  }
});

console.log(`Remote status loaded: ${remoteStatus.size} entries\n`);

// Step 3: Sequential audit - check each migration 001-148
console.log('🔍 STEP 3: SEQUENTIAL AUDIT (001-148)');
console.log('======================================\n');

const audit = [];
let applied = 0;
let pending = 0;

for (let i = 1; i <= 148; i++) {
  const number = String(i).padStart(3, '0');
  const result = results.find(r => r.number === number);
  const status = remoteStatus.get(number);
  
  const entry = {
    sequence: i,
    number,
    filename: result.filename,
    fileExists: result.exists,
    size: result.size,
    lines: result.lines,
    remoteApplied: status ? status.applied : false,
    status: null
  };
  
  if (!result.exists) {
    entry.status = 'MISSING_FILE';
  } else if (status && status.applied) {
    entry.status = 'APPLIED';
    applied++;
  } else {
    entry.status = 'PENDING';
    pending++;
  }
  
  audit.push(entry);
  
  // Show progress
  if (i <= 20 || i % 20 === 0 || i > 145) {
    const statusIcon = entry.status === 'APPLIED' ? '✅' : entry.status === 'PENDING' ? '⏳' : '❌';
    console.log(`${statusIcon} ${number}: ${entry.status.padEnd(12)} ${result.filename}`);
  }
}

console.log(`\n📊 Sequential Audit Complete: ${applied} applied, ${pending} pending\n`);

// Step 4: Identify gaps
console.log('🔍 STEP 4: CHECKING FOR GAPS IN SEQUENCE');
console.log('=========================================\n');

const gaps = [];
for (let i = 1; i <= 148; i++) {
  const number = String(i).padStart(3, '0');
  const entry = audit.find(a => a.number === number);
  
  if (!entry || !entry.fileExists) {
    gaps.push(number);
  }
}

if (gaps.length === 0) {
  console.log('✅ NO GAPS FOUND - Complete sequence 001-148\n');
} else {
  console.log(`❌ GAPS FOUND: ${gaps.length}\n`);
  gaps.forEach(num => console.log(`   Missing: ${num}`));
  console.log('');
}

// Step 5: Category breakdown
console.log('📋 STEP 5: BREAKDOWN BY CATEGORY');
console.log('=================================\n');

const categories = {};

audit.forEach(entry => {
  if (entry.filename) {
    const match = entry.filename.match(/^[0-9]{3}_([^_]+)_/);
    const category = match ? match[1] : 'unknown';
    
    if (!categories[category]) {
      categories[category] = { applied: 0, pending: 0, total: 0 };
    }
    
    categories[category].total++;
    if (entry.status === 'APPLIED') {
      categories[category].applied++;
    } else if (entry.status === 'PENDING') {
      categories[category].pending++;
    }
  }
});

Object.entries(categories).sort((a, b) => a[0].localeCompare(b[0])).forEach(([cat, stats]) => {
  const pct = ((stats.applied / stats.total) * 100).toFixed(1);
  const icon = stats.pending === 0 ? '✅' : '⏳';
  console.log(`${icon} ${cat.padEnd(15)} ${stats.applied.toString().padStart(3)}/${stats.total.toString().padStart(3)} (${pct}%)`);
});

console.log('');

// Step 6: List all pending migrations
console.log('⏳ STEP 6: PENDING MIGRATIONS');
console.log('=============================\n');

const pendingList = audit.filter(a => a.status === 'PENDING');

if (pendingList.length === 0) {
  console.log('✅ NO PENDING MIGRATIONS - All 148 applied!\n');
} else {
  console.log(`Found ${pendingList.length} pending migrations:\n`);
  
  pendingList.forEach(entry => {
    console.log(`  ${entry.number}. ${entry.filename}`);
  });
  console.log('');
}

// Step 7: Generate detailed report
console.log('📄 STEP 7: GENERATING DETAILED REPORT');
console.log('======================================\n');

const report = {
  timestamp: new Date().toISOString(),
  summary: {
    totalMigrations: 148,
    filesExist: existCount,
    applied: applied,
    pending: pending,
    gaps: gaps.length,
    completionPercentage: ((applied / 148) * 100).toFixed(2),
    sequenceIntegrity: gaps.length === 0 ? 'COMPLETE' : 'INCOMPLETE'
  },
  categories: Object.entries(categories).map(([name, stats]) => ({
    name,
    applied: stats.applied,
    pending: stats.pending,
    total: stats.total,
    percentage: ((stats.applied / stats.total) * 100).toFixed(1)
  })),
  sequentialAudit: audit,
  gaps: gaps,
  pendingMigrations: pendingList.map(e => ({
    number: e.number,
    filename: e.filename,
    size: e.size,
    lines: e.lines
  })),
  verification: {
    allFilesExist: existCount === 148,
    noGaps: gaps.length === 0,
    fullyImplemented: pending === 0,
    readyForProduction: existCount === 148 && gaps.length === 0 && pending === 0
  }
};

const reportPath = path.join(__dirname, '../docs/audits/SEQUENTIAL_MIGRATION_AUDIT.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log(`✅ Detailed report saved: ${reportPath}\n`);

// Step 8: Final verdict
console.log('🎯 STEP 8: FINAL VERDICT');
console.log('========================\n');

console.log(`Total Migrations: 148`);
console.log(`Files Exist: ${existCount}/148 (${((existCount/148)*100).toFixed(1)}%)`);
console.log(`Applied: ${applied}/148 (${((applied/148)*100).toFixed(1)}%)`);
console.log(`Pending: ${pending}/148 (${((pending/148)*100).toFixed(1)}%)`);
console.log(`Gaps: ${gaps.length}\n`);

if (existCount === 148 && gaps.length === 0 && pending === 0) {
  console.log('✅ VERDICT: 100% COMPLETE - NO GAPS');
  console.log('====================================\n');
  console.log('🎉 SUCCESS! All 148 migrations are:');
  console.log('   ✅ Present as files (001-148)');
  console.log('   ✅ Applied to remote database');
  console.log('   ✅ Sequential with no gaps');
  console.log('   ✅ Ready for production\n');
  process.exit(0);
} else {
  console.log('⏳ VERDICT: INCOMPLETE');
  console.log('=======================\n');
  
  if (existCount < 148) {
    console.log(`❌ Missing ${148 - existCount} migration files`);
  }
  if (gaps.length > 0) {
    console.log(`❌ ${gaps.length} gaps in sequence`);
  }
  if (pending > 0) {
    console.log(`⏳ ${pending} migrations pending application`);
  }
  
  console.log('\n💡 NEXT STEPS:\n');
  
  if (pending > 0) {
    console.log('To complete implementation, run ONE of these:\n');
    console.log('Option 1 - Mark as applied (if tables exist):');
    console.log(`   npx supabase migration repair --status applied ${pendingList.map(p => p.number).join(' ')}\n`);
    console.log('Option 2 - Apply migrations (if tables missing):');
    console.log('   npx supabase db push --include-all\n');
  }
  
  console.log('Then re-run this audit:');
  console.log('   node scripts/sequential-migration-audit.js\n');
  
  process.exit(1);
}
