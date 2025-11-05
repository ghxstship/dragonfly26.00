#!/usr/bin/env node

/**
 * ZERO TOLERANCE PRODUCTION BUILD VALIDATION
 * 
 * Validates that the production build is completely error/warning/issue free
 * 
 * Created: November 5, 2025
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 ZERO TOLERANCE PRODUCTION BUILD VALIDATION\n');
console.log('=' .repeat(80));

const results = {
  timestamp: new Date().toISOString(),
  checks: [],
  passed: 0,
  failed: 0,
  warnings: 0
};

function runCheck(name, command, successCriteria) {
  console.log(`\n📋 ${name}...`);
  
  try {
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: path.join(__dirname, '..')
    });
    
    const passed = successCriteria(output);
    
    results.checks.push({
      name,
      status: passed ? 'PASS' : 'FAIL',
      output: output.substring(0, 500)
    });
    
    if (passed) {
      console.log(`✅ ${name}: PASSED`);
      results.passed++;
    } else {
      console.log(`❌ ${name}: FAILED`);
      results.failed++;
    }
    
    return passed;
  } catch (error) {
    console.log(`❌ ${name}: ERROR`);
    console.log(error.message);
    
    results.checks.push({
      name,
      status: 'ERROR',
      error: error.message
    });
    
    results.failed++;
    return false;
  }
}

// Check 1: TypeScript Compilation
runCheck(
  'TypeScript Compilation',
  'npx tsc --noEmit',
  (output) => output.length === 0 || !output.includes('error')
);

// Check 2: ESLint
runCheck(
  'ESLint',
  'npm run lint',
  (output) => output.includes('No ESLint warnings or errors')
);

// Check 3: Next.js Build
runCheck(
  'Next.js Production Build',
  'npm run build',
  (output) => output.includes('Compiled successfully') && !output.includes('Failed to compile')
);

// Check 4: Package Vulnerabilities
runCheck(
  'Package Vulnerabilities',
  'npm audit --omit=dev',
  (output) => output.includes('found 0 vulnerabilities') || (!output.includes('high') && !output.includes('critical'))
);

// Summary
console.log('\n' + '='.repeat(80));
console.log('\n📊 VALIDATION SUMMARY\n');
console.log(`✅ Passed: ${results.passed}`);
console.log(`❌ Failed: ${results.failed}`);
console.log(`⚠️  Warnings: ${results.warnings}`);

const grade = results.failed === 0 ? 'A+ (100/100)' : 
              results.failed <= 1 ? 'A (95/100)' :
              results.failed <= 2 ? 'B (85/100)' : 'F';

console.log(`\n🎯 GRADE: ${grade}`);

if (results.failed === 0) {
  console.log('\n🎉 ZERO TOLERANCE STANDARD MET!');
  console.log('✅ Production build is completely error/warning/issue free');
  console.log('✅ Ready for immediate deployment');
} else {
  console.log('\n⚠️  ZERO TOLERANCE STANDARD NOT MET');
  console.log(`❌ ${results.failed} check(s) failed`);
  console.log('🔧 Remediation required before deployment');
}

// Save results
const reportPath = path.join(__dirname, '..', 'docs', 'audits', 'PRODUCTION_BUILD_VALIDATION.json');
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

console.log(`\n📄 Full report saved to: ${reportPath}`);
console.log('\n' + '='.repeat(80));

process.exit(results.failed === 0 ? 0 : 1);
