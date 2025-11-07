#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const marketingDir = path.join(__dirname, '../src/marketing');

// Patterns to detect violations
const patterns = {
  hardcodedStrings: [
    /className="[^"]*">[A-Z][^<]+</g,  // Text in JSX
    /placeholder="[A-Z][^"]+"/g,        // Hardcoded placeholders
    /title:\s*["'][A-Z][^"']+["']/g,    // Hardcoded titles
    /description:\s*["'][A-Z][^"']+["']/g, // Hardcoded descriptions
    /name:\s*["'][A-Z][^"']+["']/g,     // Hardcoded names
  ],
  missingI18n: /useTranslations/,
  missingAria: [
    /aria-label/,
    /aria-hidden/,
    /aria-live/,
    /role=/,
  ],
};

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(marketingDir, filePath);
  
  const violations = {
    file: relativePath,
    hardcodedStrings: 0,
    hasI18n: false,
    ariaLabels: 0,
    ariaHidden: 0,
    ariaLive: 0,
    roles: 0,
  };
  
  // Check for hardcoded strings
  patterns.hardcodedStrings.forEach(pattern => {
    const matches = content.match(pattern) || [];
    violations.hardcodedStrings += matches.length;
  });
  
  // Check for i18n
  violations.hasI18n = patterns.missingI18n.test(content);
  
  // Check for ARIA attributes
  violations.ariaLabels = (content.match(/aria-label/g) || []).length;
  violations.ariaHidden = (content.match(/aria-hidden/g) || []).length;
  violations.ariaLive = (content.match(/aria-live/g) || []).length;
  violations.roles = (content.match(/role=/g) || []).length;
  
  return violations;
}

function scanDirectory(dir) {
  const files = [];
  
  function walk(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    items.forEach(item => {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        files.push(fullPath);
      }
    });
  }
  
  walk(dir);
  return files;
}

console.log('🔍 MARKETING SITE I18N & ACCESSIBILITY AUDIT\n');
console.log('=' .repeat(80));

const files = scanDirectory(marketingDir);
const results = files.map(scanFile);

// Calculate totals
const totals = {
  files: results.length,
  withI18n: results.filter(r => r.hasI18n).length,
  withoutI18n: results.filter(r => !r.hasI18n).length,
  totalHardcodedStrings: results.reduce((sum, r) => sum + r.hardcodedStrings, 0),
  totalAriaLabels: results.reduce((sum, r) => sum + r.ariaLabels, 0),
  totalAriaHidden: results.reduce((sum, r) => sum + r.ariaHidden, 0),
  totalAriaLive: results.reduce((sum, r) => sum + r.ariaLive, 0),
  totalRoles: results.reduce((sum, r) => sum + r.roles, 0),
};

console.log('\n📊 SUMMARY');
console.log('=' .repeat(80));
console.log(`Total Files: ${totals.files}`);
console.log(`Files with i18n: ${totals.withI18n} (${Math.round(totals.withI18n / totals.files * 100)}%)`);
console.log(`Files without i18n: ${totals.withoutI18n} (${Math.round(totals.withoutI18n / totals.files * 100)}%)`);
console.log(`Total Hardcoded Strings: ${totals.totalHardcodedStrings}`);
console.log(`Total ARIA Labels: ${totals.totalAriaLabels}`);
console.log(`Total ARIA Hidden: ${totals.totalAriaHidden}`);
console.log(`Total ARIA Live: ${totals.totalAriaLive}`);
console.log(`Total Role Attributes: ${totals.totalRoles}`);

// Grade calculation
const i18nScore = (totals.withI18n / totals.files) * 100;
const ariaScore = Math.min(100, ((totals.totalAriaLabels + totals.totalAriaHidden) / totals.files) * 10);
const hardcodedPenalty = Math.min(50, totals.totalHardcodedStrings / 10);
const finalScore = Math.max(0, (i18nScore * 0.5 + ariaScore * 0.5) - hardcodedPenalty);

console.log('\n🎯 GRADE');
console.log('=' .repeat(80));
console.log(`i18n Coverage: ${i18nScore.toFixed(1)}%`);
console.log(`ARIA Coverage: ${ariaScore.toFixed(1)}%`);
console.log(`Hardcoded String Penalty: -${hardcodedPenalty.toFixed(1)} points`);
console.log(`Final Score: ${finalScore.toFixed(1)}/100`);

let grade = 'F';
if (finalScore >= 90) grade = 'A+';
else if (finalScore >= 85) grade = 'A';
else if (finalScore >= 80) grade = 'A-';
else if (finalScore >= 75) grade = 'B+';
else if (finalScore >= 70) grade = 'B';
else if (finalScore >= 65) grade = 'B-';
else if (finalScore >= 60) grade = 'C+';
else if (finalScore >= 55) grade = 'C';
else if (finalScore >= 50) grade = 'C-';
else if (finalScore >= 45) grade = 'D+';
else if (finalScore >= 40) grade = 'D';

console.log(`Grade: ${grade}`);
console.log(`Status: ${finalScore >= 90 ? '✅ PRODUCTION READY' : '❌ NEEDS WORK'}`);

console.log('\n📋 FILES NEEDING REMEDIATION');
console.log('=' .repeat(80));
results
  .filter(r => !r.hasI18n || r.hardcodedStrings > 5)
  .forEach(r => {
    console.log(`\n${r.file}`);
    console.log(`  i18n: ${r.hasI18n ? '✅' : '❌'}`);
    console.log(`  Hardcoded Strings: ${r.hardcodedStrings}`);
    console.log(`  ARIA Labels: ${r.ariaLabels}`);
    console.log(`  ARIA Hidden: ${r.ariaHidden}`);
  });

console.log('\n' + '='.repeat(80));
console.log(`\nTarget: A+ (100/100) - TRUE 100% COMPLIANCE`);
console.log(`Current: ${grade} (${finalScore.toFixed(1)}/100)`);
console.log(`Gap: ${(100 - finalScore).toFixed(1)} points\n`);

// Save results to JSON
const reportPath = path.join(__dirname, '../docs/audits/MARKETING_I18N_ACCESSIBILITY_AUDIT.json');
fs.writeFileSync(reportPath, JSON.stringify({ totals, results, grade, finalScore }, null, 2));
console.log(`📄 Full report saved to: ${reportPath}\n`);
