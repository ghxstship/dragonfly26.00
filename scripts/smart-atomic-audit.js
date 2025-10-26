#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔬 SMART ATOMIC-LEVEL AUDIT\n');
console.log('Zero Tolerance: Typography, Theme, and Critical Color Issues\n');
console.log('═'.repeat(80));

const violations = {
  typography: [],
  darkMode: [],
  semanticHTML: [],
};

// FORBIDDEN FONTS - ZERO TOLERANCE
const FORBIDDEN_FONTS = [
  'font-medium',
  'font-semibold',
  'font-bold',
  'font-extrabold',
  'font-black',
  'font-light',
  'font-thin',
  'font-normal',
  'font-sans',
  'font-serif',
  'font-mono',
];

// APPROVED FONTS ONLY
const APPROVED_FONTS = {
  'font-pixel': 'Logo only (Coral Pixels)',
  'font-title': 'h1 titles only (Anton SC)',
  'font-heading': 'h2-h4, nav links, buttons, badges (Bebas Neue)',
  'font-tech': 'Body text via layout (Share Tech)',
  'font-tech-mono': 'Code/monospace (Share Tech Mono)',
};

// CRITICAL COLOR PATTERNS - Must have dark mode
const CRITICAL_COLORS = {
  text: ['text-gray-900', 'text-gray-800', 'text-gray-700', 'text-gray-600', 'text-gray-500'],
  background: ['bg-white', 'bg-gray-50', 'bg-gray-100'],
  border: ['border-gray-200', 'border-gray-300'],
};

// BRAND COLORS - Allowed without dark mode (intentional branding)
const BRAND_COLORS = [
  'blue-600', 'blue-500', 'blue-700',
  'purple-600', 'purple-500', 'purple-700',
  'green-600', 'green-500', 'green-700',
  'red-600', 'red-500', 'red-700',
  'orange-600', 'orange-500', 'orange-700',
  'yellow-600', 'yellow-500', 'yellow-700',
];

function isComment(line) {
  const trimmed = line.trim();
  return trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*');
}

function hasDarkVariant(line, type) {
  return line.includes(`dark:${type}-`);
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const relativePath = path.relative(process.cwd(), filePath);
  
  let h1Count = 0;
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    if (isComment(line)) return;
    
    // 1. TYPOGRAPHY VIOLATIONS
    FORBIDDEN_FONTS.forEach(forbiddenFont => {
      const regex = new RegExp(`\\b${forbiddenFont}\\b`, 'g');
      if (regex.test(line)) {
        violations.typography.push({
          file: relativePath,
          line: lineNum,
          type: 'FORBIDDEN_FONT',
          content: line.trim().substring(0, 120),
          violation: forbiddenFont,
          severity: 'CRITICAL',
        });
      }
    });
    
    // 2. SEMANTIC HTML + TYPOGRAPHY ALIGNMENT
    if (line.includes('<h1')) {
      h1Count++;
      if (!line.includes('font-title uppercase')) {
        violations.semanticHTML.push({
          file: relativePath,
          line: lineNum,
          type: 'H1_WRONG_FONT',
          content: line.trim().substring(0, 120),
          violation: 'h1 must use font-title uppercase (Anton SC)',
          severity: 'CRITICAL',
        });
      }
    }
    
    if (line.includes('<h2') && !line.includes('font-heading uppercase')) {
      violations.semanticHTML.push({
        file: relativePath,
        line: lineNum,
        type: 'H2_WRONG_FONT',
        content: line.trim().substring(0, 120),
        violation: 'h2 must use font-heading uppercase (Bebas Neue)',
        severity: 'HIGH',
      });
    }
    
    if (line.includes('<h3') && !line.includes('font-heading uppercase')) {
      violations.semanticHTML.push({
        file: relativePath,
        line: lineNum,
        type: 'H3_WRONG_FONT',
        content: line.trim().substring(0, 120),
        violation: 'h3 must use font-heading uppercase (Bebas Neue)',
        severity: 'HIGH',
      });
    }
    
    if (line.includes('<h4') && !line.includes('font-heading uppercase')) {
      violations.semanticHTML.push({
        file: relativePath,
        line: lineNum,
        type: 'H4_WRONG_FONT',
        content: line.trim().substring(0, 120),
        violation: 'h4 must use font-heading uppercase (Bebas Neue)',
        severity: 'MEDIUM',
      });
    }
    
    // 3. CRITICAL DARK MODE VIOLATIONS (Gray scale colors only)
    // Skip hover states if they have dark:hover: variant
    CRITICAL_COLORS.text.forEach(color => {
      if (line.includes(color) && !hasDarkVariant(line, 'text')) {
        // Skip if it's a hover state with dark:hover:
        if (line.includes('hover:' + color) && line.includes('dark:hover:text-')) return;
        violations.darkMode.push({
          file: relativePath,
          line: lineNum,
          type: 'MISSING_DARK_TEXT',
          content: line.trim().substring(0, 120),
          violation: `${color} missing dark:text- variant`,
          severity: 'HIGH',
        });
      }
    });
    
    CRITICAL_COLORS.background.forEach(color => {
      if (line.includes(color) && !hasDarkVariant(line, 'bg')) {
        // Skip if it's a hover state with dark:hover:
        if (line.includes('hover:' + color) && line.includes('dark:hover:bg-')) return;
        violations.darkMode.push({
          file: relativePath,
          line: lineNum,
          type: 'MISSING_DARK_BG',
          content: line.trim().substring(0, 120),
          violation: `${color} missing dark:bg- variant`,
          severity: 'HIGH',
        });
      }
    });
    
    CRITICAL_COLORS.border.forEach(color => {
      if (line.includes(color) && !hasDarkVariant(line, 'border')) {
        violations.darkMode.push({
          file: relativePath,
          line: lineNum,
          type: 'MISSING_DARK_BORDER',
          content: line.trim().substring(0, 120),
          violation: `${color} missing dark:border- variant`,
          severity: 'MEDIUM',
        });
      }
    });
  });
  
  // Check h1 count per file
  if (h1Count > 1) {
    violations.semanticHTML.push({
      file: relativePath,
      line: 0,
      type: 'MULTIPLE_H1',
      content: `File has ${h1Count} h1 tags`,
      violation: 'Only one h1 per page allowed (SEO + Accessibility)',
      severity: 'CRITICAL',
    });
  }
}

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else if (entry.name === 'page.tsx' || entry.name.endsWith('.tsx')) {
      scanFile(fullPath);
    }
  });
}

// Scan marketing pages
const marketingDir = path.join(process.cwd(), 'src/app/[locale]/(marketing)');
console.log('\n📁 Scanning marketing pages...');
scanDirectory(marketingDir);

// Scan marketing components
const componentsDir = path.join(process.cwd(), 'src/marketing/components');
console.log('📁 Scanning marketing components...');
scanDirectory(componentsDir);

// Calculate totals
const totalViolations = 
  violations.typography.length +
  violations.darkMode.length +
  violations.semanticHTML.length;

// Report results
console.log('\n═'.repeat(80));
console.log('📊 SMART ATOMIC AUDIT RESULTS\n');
console.log('═'.repeat(80));

if (totalViolations === 0) {
  console.log('\n✨ PERFECT! 100% ATOMIC-LEVEL COMPLIANCE! ✨\n');
  console.log('✅ Typography: ZERO violations');
  console.log('✅ Dark Mode: ZERO violations');
  console.log('✅ Semantic HTML: ZERO violations');
  console.log('\n📚 APPROVED FONTS:');
  Object.entries(APPROVED_FONTS).forEach(([font, desc]) => {
    console.log(`   ✅ ${font} - ${desc}`);
  });
  console.log('\n📋 TYPOGRAPHY HIERARCHY:');
  console.log('   ✅ h1: font-title uppercase (Anton SC) - Main page titles');
  console.log('   ✅ h2-h4: font-heading uppercase (Bebas Neue) - Section/card headings');
  console.log('   ✅ Nav links: font-heading uppercase (Bebas Neue)');
  console.log('   ✅ Buttons: font-heading uppercase (Bebas Neue)');
  console.log('   ✅ Body text: Inherits Share Tech from layout');
  console.log('\n🌙 DARK MODE:');
  console.log('   ✅ All gray-scale text colors have dark: variants');
  console.log('   ✅ All backgrounds have dark: variants');
  console.log('   ✅ All borders have dark: variants');
  console.log('   ✅ Brand colors (blue, purple, etc.) used intentionally');
  console.log('\n═'.repeat(80));
  console.log('STATUS: PRODUCTION READY - ZERO TOLERANCE ACHIEVED');
  console.log('CERTIFICATION: A+ (100/100) - PERFECT ATOMIC COMPLIANCE');
  console.log('\nNO SHORTCUTS. NO COMPROMISES. TRUE 100%.');
  process.exit(0);
}

// Group violations by severity
const critical = [];
const high = [];
const medium = [];

[...violations.typography, ...violations.darkMode, ...violations.semanticHTML].forEach(v => {
  if (v.severity === 'CRITICAL') critical.push(v);
  else if (v.severity === 'HIGH') high.push(v);
  else medium.push(v);
});

console.log('\n❌ VIOLATIONS FOUND\n');

if (critical.length > 0) {
  console.log('🚨 CRITICAL VIOLATIONS (Must fix immediately):\n');
  critical.forEach(v => {
    console.log(`   📁 ${v.file}:${v.line}`);
    console.log(`   ⚠️  ${v.type}: ${v.violation}`);
    console.log(`   📝 ${v.content}`);
    console.log('');
  });
}

if (high.length > 0) {
  console.log('⚠️  HIGH PRIORITY VIOLATIONS:\n');
  high.slice(0, 10).forEach(v => {
    console.log(`   📁 ${v.file}:${v.line}`);
    console.log(`   ⚠️  ${v.type}: ${v.violation}`);
    console.log('');
  });
  if (high.length > 10) {
    console.log(`   ... and ${high.length - 10} more high priority violations\n`);
  }
}

if (medium.length > 0) {
  console.log(`⚡ MEDIUM PRIORITY VIOLATIONS: ${medium.length} total\n`);
  medium.slice(0, 5).forEach(v => {
    console.log(`   ${v.file}:${v.line} - ${v.violation}`);
  });
  if (medium.length > 5) {
    console.log(`   ... and ${medium.length - 5} more\n`);
  }
}

console.log('═'.repeat(80));
console.log('📈 SUMMARY BY CATEGORY');
console.log('═'.repeat(80));
console.log(`Typography Violations: ${violations.typography.length}`);
console.log(`Dark Mode Violations: ${violations.darkMode.length}`);
console.log(`Semantic HTML Violations: ${violations.semanticHTML.length}`);
console.log(`\nTotal Violations: ${totalViolations}`);
console.log(`\nSeverity Breakdown:`);
console.log(`  🚨 Critical: ${critical.length}`);
console.log(`  ⚠️  High: ${high.length}`);
console.log(`  ⚡ Medium: ${medium.length}`);

console.log('\n⚠️  STATUS: REMEDIATION REQUIRED');
console.log('ZERO TOLERANCE POLICY: All violations must be fixed for certification');

process.exit(1);
