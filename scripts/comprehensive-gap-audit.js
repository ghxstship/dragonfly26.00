const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('='.repeat(80));
console.log('COMPREHENSIVE GAP AUDIT - RECONFIRMING ALL WORK');
console.log('='.repeat(80));
console.log('');

const results = {
  timestamp: new Date().toISOString(),
  totalFiles: 0,
  gaps: [],
  compliance: {
    i18n: { total: 0, compliant: 0, violations: [] },
    aria: { total: 0, compliant: 0, violations: [] },
    statCard: { total: 0, violations: [] },
    emptyState: { total: 0, violations: [] },
    buttons: { total: 0, dead: 0, violations: [] }
  }
};

// Get all tab files
const tabFiles = execSync(
  'find src/components -name "*-tab.tsx" -type f',
  { encoding: 'utf8', cwd: process.cwd() }
).trim().split('\n').filter(Boolean);

results.totalFiles = tabFiles.length;

console.log(`Found ${tabFiles.length} tab files\n`);
console.log('Auditing compliance...\n');

// Check i18n compliance
console.log('1. i18n Compliance:');
tabFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  results.compliance.i18n.total++;
  
  if (!content.includes('useTranslations')) {
    results.compliance.i18n.violations.push({
      file: path.basename(file),
      issue: 'Missing useTranslations import'
    });
  } else {
    results.compliance.i18n.compliant++;
  }
});

console.log(`   ✅ Compliant: ${results.compliance.i18n.compliant}/${results.compliance.i18n.total}`);
if (results.compliance.i18n.violations.length > 0) {
  console.log(`   ❌ Violations: ${results.compliance.i18n.violations.length}`);
  results.gaps.push({
    category: 'i18n',
    severity: 'HIGH',
    count: results.compliance.i18n.violations.length,
    files: results.compliance.i18n.violations.map(v => v.file)
  });
}
console.log('');

// Check ARIA compliance
console.log('2. ARIA Compliance:');
tabFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  results.compliance.aria.total++;
  
  // Check for aria-hidden on decorative icons
  const iconMatches = content.match(/<[A-Z]\w+\s+className="[^"]*h-\d/g) || [];
  const ariaMatches = content.match(/aria-hidden="true"/g) || [];
  
  if (iconMatches.length > 0 && ariaMatches.length === 0) {
    results.compliance.aria.violations.push({
      file: path.basename(file),
      issue: 'Icons without aria-hidden'
    });
  } else {
    results.compliance.aria.compliant++;
  }
});

console.log(`   ✅ Compliant: ${results.compliance.aria.compliant}/${results.compliance.aria.total}`);
if (results.compliance.aria.violations.length > 0) {
  console.log(`   ❌ Violations: ${results.compliance.aria.violations.length}`);
  results.gaps.push({
    category: 'ARIA',
    severity: 'HIGH',
    count: results.compliance.aria.violations.length,
    files: results.compliance.aria.violations.map(v => v.file)
  });
}
console.log('');

// Check for StatCard usage (should be replaced)
console.log('3. StatCard Usage (should be removed):');
tabFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  results.compliance.statCard.total++;
  
  if (content.includes('StatCard')) {
    results.compliance.statCard.violations.push({
      file: path.basename(file),
      issue: 'Still using StatCard component'
    });
  }
});

if (results.compliance.statCard.violations.length === 0) {
  console.log(`   ✅ Clean: 0 files using StatCard`);
} else {
  console.log(`   ❌ Found: ${results.compliance.statCard.violations.length} files still using StatCard`);
  results.gaps.push({
    category: 'StatCard',
    severity: 'MEDIUM',
    count: results.compliance.statCard.violations.length,
    files: results.compliance.statCard.violations.map(v => v.file)
  });
}
console.log('');

// Check EmptyState usage
console.log('4. EmptyState Component:');
tabFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  results.compliance.emptyState.total++;
  
  if (content.includes('EmptyState')) {
    const hasCorrectImport = content.includes('from "@/components/molecules"') || 
                            content.includes('from "@/components/shared/empty-state"');
    if (!hasCorrectImport && content.includes('from "@/components/shared"')) {
      results.compliance.emptyState.violations.push({
        file: path.basename(file),
        issue: 'Incorrect EmptyState import path'
      });
    }
  }
});

if (results.compliance.emptyState.violations.length === 0) {
  console.log(`   ✅ Clean: All EmptyState imports correct`);
} else {
  console.log(`   ❌ Found: ${results.compliance.emptyState.violations.length} incorrect imports`);
  results.gaps.push({
    category: 'EmptyState',
    severity: 'LOW',
    count: results.compliance.emptyState.violations.length,
    files: results.compliance.emptyState.violations.map(v => v.file)
  });
}
console.log('');

// Check for dead buttons (console.log, TODO, empty onClick)
console.log('5. Button Functionality:');
let deadButtonCount = 0;
tabFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Count buttons with issues
  const consoleLogButtons = (content.match(/onClick=\{[^}]*console\.log/g) || []).length;
  const todoButtons = (content.match(/onClick=\{[^}]*\/\/ TODO/g) || []).length;
  const emptyOnClick = (content.match(/onClick=\{\(\) => \{\s*\}\}/g) || []).length;
  
  const fileDeadButtons = consoleLogButtons + todoButtons + emptyOnClick;
  
  if (fileDeadButtons > 0) {
    deadButtonCount += fileDeadButtons;
    results.compliance.buttons.violations.push({
      file: path.basename(file),
      count: fileDeadButtons,
      types: {
        consoleLog: consoleLogButtons,
        todo: todoButtons,
        empty: emptyOnClick
      }
    });
  }
});

results.compliance.buttons.dead = deadButtonCount;

if (deadButtonCount === 0) {
  console.log(`   ✅ Clean: All buttons functional`);
} else {
  console.log(`   ❌ Found: ${deadButtonCount} dead/incomplete buttons in ${results.compliance.buttons.violations.length} files`);
  results.gaps.push({
    category: 'Buttons',
    severity: 'MEDIUM',
    count: deadButtonCount,
    files: results.compliance.buttons.violations.map(v => `${v.file} (${v.count})`)
  });
}
console.log('');

// Summary
console.log('='.repeat(80));
console.log('AUDIT SUMMARY');
console.log('='.repeat(80));
console.log('');
console.log(`Total Files Audited: ${results.totalFiles}`);
console.log(`Total Gaps Found: ${results.gaps.length} categories`);
console.log('');

if (results.gaps.length === 0) {
  console.log('✅ ✅ ✅ NO GAPS FOUND - 100% COMPLIANT ✅ ✅ ✅');
} else {
  console.log('GAPS BY SEVERITY:');
  const high = results.gaps.filter(g => g.severity === 'HIGH');
  const medium = results.gaps.filter(g => g.severity === 'MEDIUM');
  const low = results.gaps.filter(g => g.severity === 'LOW');
  
  if (high.length > 0) {
    console.log(`\n🔴 HIGH (${high.length}):`);
    high.forEach(gap => {
      console.log(`   - ${gap.category}: ${gap.count} violations`);
    });
  }
  
  if (medium.length > 0) {
    console.log(`\n🟡 MEDIUM (${medium.length}):`);
    medium.forEach(gap => {
      console.log(`   - ${gap.category}: ${gap.count} violations`);
    });
  }
  
  if (low.length > 0) {
    console.log(`\n🟢 LOW (${low.length}):`);
    low.forEach(gap => {
      console.log(`   - ${gap.category}: ${gap.count} violations`);
    });
  }
}

console.log('');
console.log('='.repeat(80));

// Save detailed report
fs.writeFileSync(
  'COMPREHENSIVE_GAP_AUDIT_REPORT.json',
  JSON.stringify(results, null, 2)
);

console.log('📄 Detailed report: COMPREHENSIVE_GAP_AUDIT_REPORT.json');
console.log('');

// Exit with error code if gaps found
process.exit(results.gaps.length > 0 ? 1 : 0);
