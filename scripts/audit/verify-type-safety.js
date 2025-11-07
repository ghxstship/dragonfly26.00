#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 TYPE SAFETY VERIFICATION');
console.log('===========================\n');

// Get all tab component files
const componentDirs = [
  'src/components/admin',
  'src/components/analytics',
  'src/components/assets',
  'src/components/community',
  'src/components/companies',
  'src/components/dashboard',
  'src/components/events',
  'src/components/files',
  'src/components/finance',
  'src/components/insights',
  'src/components/jobs',
  'src/components/locations',
  'src/components/marketplace',
  'src/components/people',
  'src/components/procurement',
  'src/components/profile',
  'src/components/projects',
  'src/components/reports',
  'src/components/resources',
  'src/components/settings'
];

const stats = {
  totalFiles: 0,
  filesWithAny: 0,
  anyCount: 0,
  filesWithReturnTypes: 0,
  filesWithPropTypes: 0,
  filesWithUnknown: 0,
  unknownCount: 0
};

const violations = {
  anyTypes: [],
  missingReturnTypes: [],
  missingPropTypes: []
};

componentDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) return;

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('-tab.tsx'));
  
  files.forEach(file => {
    stats.totalFiles++;
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Check for 'any' types
    const anyMatches = content.match(/:\s*any[\s,;\)\]>]/g);
    if (anyMatches) {
      stats.filesWithAny++;
      stats.anyCount += anyMatches.length;
      violations.anyTypes.push({
        file: `${path.basename(dir)}/${file}`,
        count: anyMatches.length
      });
    }

    // Check for 'unknown' types (our replacements)
    const unknownMatches = content.match(/:\s*unknown[\s,;\)\]>]/g);
    if (unknownMatches) {
      stats.filesWithUnknown++;
      stats.unknownCount += unknownMatches.length;
    }

    // Check for return type annotations on main component
    const hasReturnType = /export\s+(?:default\s+)?function\s+\w+\([^)]*\):\s*JSX\.Element/.test(content) ||
                          /const\s+\w+\s*=\s*\([^)]*\):\s*JSX\.Element\s*=>/.test(content);
    if (hasReturnType) {
      stats.filesWithReturnTypes++;
    } else {
      violations.missingReturnTypes.push(`${path.basename(dir)}/${file}`);
    }

    // Check for prop type interfaces
    const hasPropInterface = /interface\s+\w+Props/.test(content) || /type\s+\w+Props\s*=/.test(content);
    if (hasPropInterface) {
      stats.filesWithPropTypes++;
    } else {
      violations.missingPropTypes.push(`${path.basename(dir)}/${file}`);
    }
  });
});

console.log('📊 TYPE SAFETY STATISTICS\n');
console.log(`Total Files Analyzed: ${stats.totalFiles}`);
console.log(`\n✅ IMPROVEMENTS:`);
console.log(`   - Files with 'unknown' (safe): ${stats.filesWithUnknown} (${stats.unknownCount} occurrences)`);
console.log(`   - Files with return types: ${stats.filesWithReturnTypes}/${stats.totalFiles} (${Math.round(stats.filesWithReturnTypes/stats.totalFiles*100)}%)`);
console.log(`   - Files with prop interfaces: ${stats.filesWithPropTypes}/${stats.totalFiles} (${Math.round(stats.filesWithPropTypes/stats.totalFiles*100)}%)`);

console.log(`\n❌ REMAINING ISSUES:`);
console.log(`   - Files with 'any' types: ${stats.filesWithAny} (${stats.anyCount} occurrences)`);
console.log(`   - Files missing return types: ${violations.missingReturnTypes.length}`);
console.log(`   - Files missing prop types: ${violations.missingPropTypes.length}`);

// Calculate score
const anyScore = Math.max(0, 100 - (stats.anyCount * 2));
const returnTypeScore = Math.round((stats.filesWithReturnTypes / stats.totalFiles) * 100);
const propTypeScore = Math.round((stats.filesWithPropTypes / stats.totalFiles) * 100);
const overallScore = Math.round((anyScore * 0.4) + (returnTypeScore * 0.3) + (propTypeScore * 0.3));

console.log(`\n📈 TYPE SAFETY SCORE: ${overallScore}/100`);
console.log(`   - 'any' types: ${anyScore}/100`);
console.log(`   - Return types: ${returnTypeScore}/100`);
console.log(`   - Prop types: ${propTypeScore}/100`);

if (overallScore >= 95) {
  console.log(`\n🎉 STATUS: A+ (EXCELLENT) - Production Ready!`);
} else if (overallScore >= 90) {
  console.log(`\n✅ STATUS: A (VERY GOOD) - Minor improvements needed`);
} else if (overallScore >= 80) {
  console.log(`\n⚠️  STATUS: B (GOOD) - Some improvements needed`);
} else {
  console.log(`\n❌ STATUS: C (NEEDS WORK) - Significant improvements required`);
}

// Show top violators
if (violations.anyTypes.length > 0) {
  console.log(`\n🔴 TOP FILES WITH 'ANY' TYPES:`);
  violations.anyTypes
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .forEach(v => console.log(`   - ${v.file}: ${v.count} occurrences`));
}

// Save detailed report
const report = {
  timestamp: new Date().toISOString(),
  stats,
  violations,
  score: {
    overall: overallScore,
    anyTypes: anyScore,
    returnTypes: returnTypeScore,
    propTypes: propTypeScore
  }
};

const reportPath = path.join(__dirname, '../docs/TYPE_SAFETY_VERIFICATION_REPORT.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
console.log(`\n📄 Detailed report saved: ${reportPath}\n`);
