#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 COMPREHENSIVE MARKETING PAGES TYPOGRAPHY AUDIT\n');
console.log('Scanning all marketing pages for typography violations...\n');
console.log('═'.repeat(80));

const FORBIDDEN_FONTS = [
  'font-medium',
  'font-semibold',
  'font-bold',
  'font-extrabold',
  'font-black',
  'font-light',
  'font-thin',
  'font-normal',
];

const violations = [];
const marketingPagesDir = path.join(process.cwd(), 'src/app/[locale]/(marketing)');

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const relativePath = path.relative(process.cwd(), filePath);
  const fileViolations = [];
  
  lines.forEach((line, index) => {
    FORBIDDEN_FONTS.forEach(forbiddenFont => {
      const regex = new RegExp(`\\b${forbiddenFont}\\b`, 'g');
      if (regex.test(line)) {
        fileViolations.push({
          file: relativePath,
          line: index + 1,
          content: line.trim(),
          font: forbiddenFont,
        });
      }
    });
    
    // Check for missing dark mode on text elements
    if (line.includes('text-gray-') && !line.includes('dark:text-')) {
      fileViolations.push({
        file: relativePath,
        line: index + 1,
        content: line.trim(),
        font: 'MISSING_DARK_MODE',
      });
    }
  });
  
  return fileViolations;
}

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else if (entry.name === 'page.tsx') {
      const fileViolations = scanFile(fullPath);
      if (fileViolations.length > 0) {
        violations.push(...fileViolations);
      }
    }
  });
}

scanDirectory(marketingPagesDir);

// Group violations by file
const violationsByFile = {};
violations.forEach(v => {
  if (!violationsByFile[v.file]) {
    violationsByFile[v.file] = [];
  }
  violationsByFile[v.file].push(v);
});

console.log('\n📊 AUDIT RESULTS\n');
console.log('═'.repeat(80));

if (Object.keys(violationsByFile).length === 0) {
  console.log('\n✨ PERFECT! 100% TYPOGRAPHY COMPLIANCE! ✨\n');
  console.log('✅ All marketing pages use approved fonts');
  console.log('✅ All pages have dark mode support');
  console.log('\n═'.repeat(80));
  console.log('STATUS: PRODUCTION READY');
  process.exit(0);
} else {
  console.log('\n❌ VIOLATIONS FOUND\n');
  
  Object.keys(violationsByFile).sort().forEach(file => {
    const fileViolations = violationsByFile[file];
    const forbiddenFonts = fileViolations.filter(v => v.font !== 'MISSING_DARK_MODE');
    const darkModeIssues = fileViolations.filter(v => v.font === 'MISSING_DARK_MODE');
    
    console.log(`\n📁 ${file}`);
    
    if (forbiddenFonts.length > 0) {
      console.log(`   ⚠️  Forbidden fonts: ${forbiddenFonts.length}`);
      forbiddenFonts.slice(0, 3).forEach(v => {
        console.log(`      Line ${v.line}: ${v.font}`);
      });
      if (forbiddenFonts.length > 3) {
        console.log(`      ... and ${forbiddenFonts.length - 3} more`);
      }
    }
    
    if (darkModeIssues.length > 0) {
      console.log(`   🌙 Missing dark mode: ${darkModeIssues.length} instances`);
    }
  });
  
  console.log('\n═'.repeat(80));
  console.log('📈 SUMMARY');
  console.log('═'.repeat(80));
  console.log(`Files with violations: ${Object.keys(violationsByFile).length}`);
  console.log(`Total violations: ${violations.length}`);
  console.log('\n⚠️  STATUS: REMEDIATION REQUIRED');
  console.log('\nFiles needing fixes:');
  Object.keys(violationsByFile).sort().forEach(file => {
    console.log(`  - ${file.split('/').pop().replace('page.tsx', '')} (${violationsByFile[file].length} issues)`);
  });
  process.exit(1);
}
