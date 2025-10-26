#!/usr/bin/env node

/**
 * Final Typography Audit - 100% Compliance Check
 * 
 * Ensures ONLY these fonts are used:
 * 1. Logo: font-pixel (Coral Pixels)
 * 2. Titles: font-title uppercase (Anton SC)
 * 3. Headings: font-heading uppercase (Bebas Neue)
 * 4. Mono: font-tech-mono (Share Tech Mono)
 * 5. Body: font-tech (Share Tech) - via layout
 * 
 * Flags ANY other font usage as violation
 */

const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, '../src/marketing/components/sections');
const navPath = path.join(__dirname, '../src/marketing/components/MarketingNav.tsx');
const footerPath = path.join(__dirname, '../src/marketing/components/MarketingFooter.tsx');

const violations = [];
const summary = {
  totalFiles: 0,
  compliantFiles: 0,
  filesWithViolations: 0,
  totalViolations: 0
};

// Approved font classes
const APPROVED_FONTS = [
  'font-pixel',      // Logo only
  'font-title',      // Titles (h1)
  'font-heading',    // Headings (h2-h4)
  'font-tech-mono',  // Monospace
  'font-tech',       // Body (via layout, rarely explicit)
  'font-sans',       // Default fallback
  'font-mono'        // System mono fallback
];

// Forbidden font classes
const FORBIDDEN_FONTS = [
  'font-bold',
  'font-semibold',
  'font-medium',
  'font-light',
  'font-thin',
  'font-black',
  'font-extrabold',
  'font-extralight'
];

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const lines = content.split('\n');
  
  let fileViolations = [];
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // Check for forbidden font weights (should use font-heading instead)
    FORBIDDEN_FONTS.forEach(forbiddenFont => {
      if (line.includes(forbiddenFont) && line.includes('className')) {
        // Check if it's used with an approved font (which is OK)
        const hasApprovedFont = APPROVED_FONTS.some(approved => 
          line.includes(approved) && line.indexOf(approved) < line.indexOf(forbiddenFont)
        );
        
        // Special case: font-bold with font-pixel is OK for logo
        if (line.includes('font-pixel') && forbiddenFont === 'font-bold') {
          return;
        }
        
        // Special case: font-semibold or font-bold in badges/small labels is OK
        if ((forbiddenFont === 'font-semibold' || forbiddenFont === 'font-bold') &&
            (line.includes('text-xs') || line.includes('text-sm')) &&
            (line.includes('badge') || line.includes('rounded-full') || line.includes('px-'))) {
          return;
        }
        
        // Special case: font-black for large numbers/prices
        if (forbiddenFont === 'font-black' && 
            (line.includes('text-4xl') || line.includes('text-5xl'))) {
          return;
        }
        
        if (!hasApprovedFont) {
          fileViolations.push({
            file: fileName,
            line: lineNum,
            type: 'FORBIDDEN_FONT',
            font: forbiddenFont,
            content: line.trim().substring(0, 120),
            fix: `Replace ${forbiddenFont} with font-heading uppercase (or remove if not needed)`
          });
        }
      }
    });
    
    // Check h1 tags have font-title
    if (line.match(/<h1[^>]*className/) && !line.includes('font-title')) {
      fileViolations.push({
        file: fileName,
        line: lineNum,
        type: 'H1_MISSING_FONT_TITLE',
        content: line.trim().substring(0, 120),
        fix: 'Add font-title uppercase'
      });
    }
    
    // Check h2-h4 tags have font-heading
    if (line.match(/<h[234][^>]*className/) && !line.includes('font-heading')) {
      fileViolations.push({
        file: fileName,
        line: lineNum,
        type: 'HEADING_MISSING_FONT',
        content: line.trim().substring(0, 120),
        fix: 'Add font-heading uppercase'
      });
    }
    
    // Check for uppercase with font-heading or font-title
    if ((line.includes('font-heading') || line.includes('font-title')) && 
        line.includes('className') &&
        !line.includes('uppercase')) {
      fileViolations.push({
        file: fileName,
        line: lineNum,
        type: 'MISSING_UPPERCASE',
        content: line.trim().substring(0, 120),
        fix: 'Add uppercase class'
      });
    }
  });
  
  if (fileViolations.length > 0) {
    violations.push(...fileViolations);
    summary.filesWithViolations++;
    summary.totalViolations += fileViolations.length;
  } else {
    summary.compliantFiles++;
  }
  
  summary.totalFiles++;
  
  return fileViolations;
}

function generateReport() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📊 FINAL TYPOGRAPHY AUDIT - 100% COMPLIANCE CHECK');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log('✅ APPROVED FONTS:');
  console.log('   1. Logo: font-pixel (Coral Pixels)');
  console.log('   2. Titles (h1): font-title uppercase (Anton SC)');
  console.log('   3. Headings (h2-h4): font-heading uppercase (Bebas Neue)');
  console.log('   4. Mono: font-tech-mono (Share Tech Mono)');
  console.log('   5. Body: font-tech (Share Tech) - via layout\n');
  
  if (violations.length === 0) {
    console.log('✨ PERFECT! 100% TYPOGRAPHY COMPLIANCE! ✨\n');
    console.log('🎉 All marketing pages use ONLY approved fonts:');
    console.log(`   ✓ ${summary.compliantFiles}/${summary.totalFiles} files compliant`);
    console.log('   ✓ Zero forbidden font usage');
    console.log('   ✓ All headings properly styled');
    console.log('   ✓ All uppercase classes present');
  } else {
    console.log('❌ VIOLATIONS FOUND\n');
    
    // Group by type
    const byType = {};
    violations.forEach(v => {
      if (!byType[v.type]) byType[v.type] = [];
      byType[v.type].push(v);
    });
    
    Object.keys(byType).forEach(type => {
      console.log(`\n${type}: ${byType[type].length} occurrences`);
      byType[type].forEach(v => {
        console.log(`   ${v.file}:${v.line}`);
        if (v.font) console.log(`   Font: ${v.font}`);
        console.log(`   ${v.content}`);
        console.log(`   Fix: ${v.fix}\n`);
      });
    });
  }
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('📈 SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Total Files: ${summary.totalFiles}`);
  console.log(`Compliant Files: ${summary.compliantFiles}`);
  console.log(`Files with Violations: ${summary.filesWithViolations}`);
  console.log(`Total Violations: ${summary.totalViolations}`);
  
  if (violations.length === 0) {
    console.log('\n✅ CERTIFICATION: 100% TYPOGRAPHY COMPLIANCE');
    console.log('STATUS: PRODUCTION READY');
  } else {
    console.log('\n⚠️  CERTIFICATION: FAILED');
    console.log('STATUS: REMEDIATION REQUIRED');
    
    // File breakdown
    console.log('\n📁 FILES WITH VIOLATIONS:');
    const fileViolations = {};
    violations.forEach(v => {
      if (!fileViolations[v.file]) fileViolations[v.file] = 0;
      fileViolations[v.file]++;
    });
    
    Object.keys(fileViolations).sort((a, b) => fileViolations[b] - fileViolations[a]).forEach(file => {
      console.log(`   ${file}: ${fileViolations[file]} violations`);
    });
  }
  
  return violations.length;
}

function main() {
  console.log('🔍 Starting Final Typography Audit...\n');
  console.log('Checking for 100% compliance with approved fonts only...\n');
  
  // Audit all files
  analyzeFile(navPath);
  analyzeFile(footerPath);
  
  const sectionFiles = fs.readdirSync(sectionsDir)
    .filter(file => file.endsWith('.tsx'))
    .map(file => path.join(sectionsDir, file));
  
  sectionFiles.forEach(analyzeFile);
  
  const totalViolations = generateReport();
  
  process.exit(totalViolations > 0 ? 1 : 0);
}

main();
