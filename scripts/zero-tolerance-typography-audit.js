#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 ZERO TOLERANCE TYPOGRAPHY AUDIT\n');
console.log('Scanning ALL marketing files line-by-line for forbidden fonts...\n');
console.log('═'.repeat(80));

// Approved fonts ONLY
const APPROVED_FONTS = [
  'font-pixel',      // Logo (Coral Pixels)
  'font-title',      // h1 titles (Anton SC)
  'font-heading',    // h2-h4 headings (Bebas Neue)
  'font-tech',       // Body text (Share Tech)
  'font-tech-mono',  // Monospace (Share Tech Mono)
];

// FORBIDDEN fonts - ZERO TOLERANCE
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
let totalFiles = 0;
let compliantFiles = 0;

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      scanFile(filePath);
    }
  });
}

function scanFile(filePath) {
  totalFiles++;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const fileViolations = [];
  
  lines.forEach((line, index) => {
    FORBIDDEN_FONTS.forEach(forbiddenFont => {
      // Match the forbidden font class (not as part of a longer word)
      const regex = new RegExp(`\\b${forbiddenFont}\\b`, 'g');
      if (regex.test(line)) {
        fileViolations.push({
          file: path.relative(process.cwd(), filePath),
          line: index + 1,
          content: line.trim(),
          font: forbiddenFont,
        });
      }
    });
  });
  
  if (fileViolations.length === 0) {
    compliantFiles++;
  } else {
    violations.push(...fileViolations);
  }
}

// Scan marketing directory
const marketingDir = path.join(process.cwd(), 'src/marketing');
scanDirectory(marketingDir);

// Scan Button component (critical for all buttons)
const buttonPath = path.join(process.cwd(), 'src/components/ui/button.tsx');
if (fs.existsSync(buttonPath)) {
  scanFile(buttonPath);
}

// Report results
console.log('\n📊 AUDIT RESULTS\n');
console.log('═'.repeat(80));

if (violations.length === 0) {
  console.log('\n✨ PERFECT! 100% TYPOGRAPHY COMPLIANCE! ✨\n');
  console.log('✅ APPROVED FONTS ONLY:');
  APPROVED_FONTS.forEach((font, i) => {
    const descriptions = [
      'Logo (Coral Pixels)',
      'Titles h1 (Anton SC)',
      'Headings h2-h4 (Bebas Neue)',
      'Body text (Share Tech)',
      'Monospace (Share Tech Mono)',
    ];
    console.log(`   ${i + 1}. ${font} - ${descriptions[i]}`);
  });
  console.log('\n✅ ZERO FORBIDDEN FONTS');
  console.log(`✅ ${totalFiles} files scanned`);
  console.log(`✅ ${compliantFiles}/${totalFiles} files compliant (100%)`);
  console.log('\n═'.repeat(80));
  console.log('📈 SUMMARY');
  console.log('═'.repeat(80));
  console.log(`Total Files: ${totalFiles}`);
  console.log(`Compliant Files: ${compliantFiles}`);
  console.log(`Files with Violations: 0`);
  console.log(`Total Violations: 0`);
  console.log('\n✅ CERTIFICATION: 100% TYPOGRAPHY COMPLIANCE');
  console.log('STATUS: PRODUCTION READY');
  console.log('\nNO SHORTCUTS. NO COMPROMISES. TRUE 100%.');
  process.exit(0);
} else {
  console.log('\n❌ VIOLATIONS FOUND\n');
  
  // Group violations by file
  const violationsByFile = {};
  violations.forEach(v => {
    if (!violationsByFile[v.file]) {
      violationsByFile[v.file] = [];
    }
    violationsByFile[v.file].push(v);
  });
  
  Object.keys(violationsByFile).forEach(file => {
    console.log(`\n📁 ${file}`);
    violationsByFile[file].forEach(v => {
      console.log(`   Line ${v.line}: ${v.font}`);
      console.log(`   ${v.content}`);
      console.log(`   ❌ FORBIDDEN: ${v.font}`);
      console.log(`   ✅ FIX: Replace with approved font (font-heading uppercase or font-title uppercase)\n`);
    });
  });
  
  console.log('\n═'.repeat(80));
  console.log('📈 SUMMARY');
  console.log('═'.repeat(80));
  console.log(`Total Files: ${totalFiles}`);
  console.log(`Compliant Files: ${compliantFiles}`);
  console.log(`Files with Violations: ${Object.keys(violationsByFile).length}`);
  console.log(`Total Violations: ${violations.length}`);
  console.log('\n⚠️  CERTIFICATION: FAILED');
  console.log('STATUS: REMEDIATION REQUIRED');
  console.log('\nZERO TOLERANCE POLICY: All violations must be fixed.');
  process.exit(1);
}
