#!/usr/bin/env node

/**
 * Production Cleanup and Validation
 * Removes ONLY unnecessary files (backups, temp, logs) and validates build with ZERO TOLERANCE
 * 
 * NOTE: Development files (scripts, tests, docs) stay in repo but are excluded from production builds
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '../..');

// Files/directories to remove (truly unnecessary - backups, temp files, logs)
const UNNECESSARY_ITEMS = [
  // Backup directory from reorganization
  '.reorganization-backup',
  
  // Archived files
  'docs/audits/archived-root-files',
  
  // Temporary/backup files
  'src/i18n/messages/no.json.backup',
];

const operations = {
  removed: [],
  kept: [],
  errors: []
};

function removeItem(itemPath) {
  const fullPath = path.join(ROOT, itemPath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Not found (skipping): ${itemPath}`);
    return;
  }

  try {
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`✓ Removed directory: ${itemPath}`);
    } else {
      fs.unlinkSync(fullPath);
      console.log(`✓ Removed file: ${itemPath}`);
    }
    
    operations.removed.push(itemPath);
  } catch (error) {
    console.error(`✗ Error removing ${itemPath}: ${error.message}`);
    operations.errors.push({ item: itemPath, error: error.message });
  }
}

function validateBuild() {
  console.log('\n' + '='.repeat(80));
  console.log('PRODUCTION BUILD VALIDATION - ZERO TOLERANCE');
  console.log('='.repeat(80) + '\n');

  try {
    // 1. Install dependencies
    console.log('📦 Installing dependencies...');
    execSync('npm ci', { cwd: ROOT, stdio: 'inherit' });
    console.log('✓ Dependencies installed\n');

    // 2. Run linter
    console.log('🔍 Running ESLint (zero tolerance)...');
    try {
      execSync('npm run lint', { cwd: ROOT, stdio: 'inherit' });
      console.log('✓ Linting passed with zero errors\n');
    } catch (error) {
      console.error('✗ LINTING FAILED - Fix all errors before proceeding');
      throw error;
    }

    // 3. Type check
    console.log('📝 Running TypeScript type check...');
    try {
      execSync('npx tsc --noEmit', { cwd: ROOT, stdio: 'inherit' });
      console.log('✓ Type checking passed with zero errors\n');
    } catch (error) {
      console.error('✗ TYPE CHECKING FAILED - Fix all errors before proceeding');
      throw error;
    }

    // 4. Build production
    console.log('🏗️  Building production bundle...');
    try {
      execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });
      console.log('✓ Production build successful\n');
    } catch (error) {
      console.error('✗ BUILD FAILED - Fix all errors before proceeding');
      throw error;
    }

    console.log('='.repeat(80));
    console.log('✅ ALL VALIDATIONS PASSED - ZERO ERRORS/WARNINGS');
    console.log('='.repeat(80) + '\n');
    
    return true;
  } catch (error) {
    console.log('\n' + '='.repeat(80));
    console.log('❌ VALIDATION FAILED - ZERO TOLERANCE NOT MET');
    console.log('='.repeat(80) + '\n');
    return false;
  }
}

console.log('\n' + '='.repeat(80));
console.log('PRODUCTION CLEANUP');
console.log('='.repeat(80) + '\n');

console.log('Removing non-production files...\n');

// Remove unnecessary items
UNNECESSARY_ITEMS.forEach(item => {
  removeItem(item);
});

console.log('\n' + '='.repeat(80));
console.log('CLEANUP SUMMARY');
console.log('='.repeat(80) + '\n');

console.log(`✓ Items removed: ${operations.removed.length}`);
console.log(`✗ Errors: ${operations.errors.length}`);

if (operations.errors.length > 0) {
  console.log('\nErrors encountered:');
  operations.errors.forEach(err => {
    console.log(`  - ${err.item}: ${err.error}`);
  });
}

// Save cleanup log
const logPath = path.join(ROOT, 'docs', 'PRODUCTION_CLEANUP_LOG.json');
fs.writeFileSync(logPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  operations,
  validation: 'pending'
}, null, 2));

console.log(`\n✅ Cleanup log saved to: ${logPath}`);
console.log('\n' + '='.repeat(80) + '\n');

// Run validation
const validationPassed = validateBuild();

// Update log with validation result
const log = JSON.parse(fs.readFileSync(logPath, 'utf8'));
log.validation = validationPassed ? 'passed' : 'failed';
fs.writeFileSync(logPath, JSON.stringify(log, null, 2));

process.exit(validationPassed ? 0 : 1);
