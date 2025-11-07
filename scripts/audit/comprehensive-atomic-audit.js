#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔬 COMPREHENSIVE ATOMIC-LEVEL AUDIT\n');
console.log('Zero Tolerance: Typography, Theme, and Color Alignment\n');
console.log('═'.repeat(80));

const violations = {
  typography: [],
  darkMode: [],
  colorAlignment: [],
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

// COLOR PATTERNS - Must have dark mode
const COLOR_PATTERNS = {
  text: [
    { light: 'text-gray-900', dark: 'dark:text-white', context: 'Primary text' },
    { light: 'text-gray-800', dark: 'dark:text-gray-100', context: 'Primary text alt' },
    { light: 'text-gray-700', dark: 'dark:text-gray-300', context: 'Secondary text' },
    { light: 'text-gray-600', dark: 'dark:text-gray-400', context: 'Tertiary text' },
    { light: 'text-gray-500', dark: 'dark:text-gray-400', context: 'Muted text' },
  ],
  background: [
    { light: 'bg-white', dark: 'dark:bg-gray-800', context: 'Cards/panels' },
    { light: 'bg-gray-50', dark: 'dark:bg-gray-900', context: 'Subtle background' },
    { light: 'bg-gray-100', dark: 'dark:bg-gray-800', context: 'Hover states' },
  ],
  border: [
    { light: 'border-gray-200', dark: 'dark:border-gray-700', context: 'Default borders' },
    { light: 'border-gray-300', dark: 'dark:border-gray-600', context: 'Emphasized borders' },
  ],
};

// SEMANTIC HTML RULES
const SEMANTIC_RULES = {
  h1: { font: 'font-title uppercase', maxPerPage: 1 },
  h2: { font: 'font-heading uppercase' },
  h3: { font: 'font-heading uppercase' },
  h4: { font: 'font-heading uppercase' },
  button: { font: 'font-heading uppercase' },
  nav: { linkFont: 'font-heading uppercase' },
};

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const relativePath = path.relative(process.cwd(), filePath);
  
  let h1Count = 0;
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // 1. TYPOGRAPHY VIOLATIONS
    FORBIDDEN_FONTS.forEach(forbiddenFont => {
      const regex = new RegExp(`\\b${forbiddenFont}\\b`, 'g');
      if (regex.test(line)) {
        violations.typography.push({
          file: relativePath,
          line: lineNum,
          type: 'FORBIDDEN_FONT',
          content: line.trim().substring(0, 100),
          violation: forbiddenFont,
          severity: 'CRITICAL',
        });
      }
    });
    
    // 2. SEMANTIC HTML + TYPOGRAPHY ALIGNMENT
    // Check h1 tags
    if (line.includes('<h1')) {
      h1Count++;
      if (!line.includes('font-title uppercase')) {
        violations.semanticHTML.push({
          file: relativePath,
          line: lineNum,
          type: 'H1_WRONG_FONT',
          content: line.trim().substring(0, 100),
          violation: 'h1 must use font-title uppercase',
          severity: 'CRITICAL',
        });
      }
    }
    
    // Check h2 tags
    if (line.includes('<h2') && !line.includes('font-heading uppercase')) {
      violations.semanticHTML.push({
        file: relativePath,
        line: lineNum,
        type: 'H2_WRONG_FONT',
        content: line.trim().substring(0, 100),
        violation: 'h2 must use font-heading uppercase',
        severity: 'HIGH',
      });
    }
    
    // Check h3 tags
    if (line.includes('<h3') && !line.includes('font-heading uppercase')) {
      violations.semanticHTML.push({
        file: relativePath,
        line: lineNum,
        type: 'H3_WRONG_FONT',
        content: line.trim().substring(0, 100),
        violation: 'h3 must use font-heading uppercase',
        severity: 'HIGH',
      });
    }
    
    // Check h4 tags
    if (line.includes('<h4') && !line.includes('font-heading uppercase')) {
      violations.semanticHTML.push({
        file: relativePath,
        line: lineNum,
        type: 'H4_WRONG_FONT',
        content: line.trim().substring(0, 100),
        violation: 'h4 must use font-heading uppercase',
        severity: 'MEDIUM',
      });
    }
    
    // 3. DARK MODE VIOLATIONS
    COLOR_PATTERNS.text.forEach(pattern => {
      if (line.includes(pattern.light) && !line.includes(pattern.dark)) {
        // Skip if it's a comment or already has a different dark: variant
        if (!line.trim().startsWith('//') && !line.trim().startsWith('*') && !line.includes('dark:text-')) {
          violations.darkMode.push({
            file: relativePath,
            line: lineNum,
            type: 'MISSING_DARK_TEXT',
            content: line.trim().substring(0, 100),
            violation: `${pattern.light} missing ${pattern.dark}`,
            context: pattern.context,
            severity: 'HIGH',
          });
        }
      }
    });
    
    COLOR_PATTERNS.background.forEach(pattern => {
      if (line.includes(pattern.light) && !line.includes(pattern.dark)) {
        if (!line.trim().startsWith('//') && !line.trim().startsWith('*') && !line.includes('dark:bg-')) {
          violations.darkMode.push({
            file: relativePath,
            line: lineNum,
            type: 'MISSING_DARK_BG',
            content: line.trim().substring(0, 100),
            violation: `${pattern.light} missing ${pattern.dark}`,
            context: pattern.context,
            severity: 'HIGH',
          });
        }
      }
    });
    
    COLOR_PATTERNS.border.forEach(pattern => {
      if (line.includes(pattern.light) && !line.includes(pattern.dark)) {
        if (!line.trim().startsWith('//') && !line.trim().startsWith('*') && !line.includes('dark:border-')) {
          violations.darkMode.push({
            file: relativePath,
            line: lineNum,
            type: 'MISSING_DARK_BORDER',
            content: line.trim().substring(0, 100),
            violation: `${pattern.light} missing ${pattern.dark}`,
            context: pattern.context,
            severity: 'MEDIUM',
          });
        }
      }
    });
    
    // 4. COLOR ALIGNMENT - Check for non-standard colors
    const colorRegex = /(text|bg|border)-(red|green|blue|yellow|purple|pink|indigo|orange)-(\d{3})/g;
    const matches = line.matchAll(colorRegex);
    for (const match of matches) {
      const fullClass = match[0];
      const type = match[1];
      const color = match[2];
      const shade = match[3];
      
      // Check if it has dark mode variant
      const darkVariant = `dark:${type}-${color}`;
      if (!line.includes(darkVariant)) {
        violations.colorAlignment.push({
          file: relativePath,
          line: lineNum,
          type: 'COLOR_NO_DARK_MODE',
          content: line.trim().substring(0, 100),
          violation: `${fullClass} missing dark mode variant`,
          severity: 'MEDIUM',
        });
      }
    }
  });
  
  // Check h1 count per file
  if (h1Count > 1) {
    violations.semanticHTML.push({
      file: relativePath,
      line: 0,
      type: 'MULTIPLE_H1',
      content: `File has ${h1Count} h1 tags`,
      violation: 'Only one h1 per page allowed',
      severity: 'CRITICAL',
    });
  }
  
  return {
    h1Count,
    lineCount: lines.length,
  };
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
  violations.colorAlignment.length +
  violations.semanticHTML.length;

// Report results
console.log('\n═'.repeat(80));
console.log('📊 COMPREHENSIVE AUDIT RESULTS\n');
console.log('═'.repeat(80));

if (totalViolations === 0) {
  console.log('\n✨ PERFECT! 100% ATOMIC-LEVEL COMPLIANCE! ✨\n');
  console.log('✅ Typography: ZERO violations');
  console.log('✅ Dark Mode: ZERO violations');
  console.log('✅ Color Alignment: ZERO violations');
  console.log('✅ Semantic HTML: ZERO violations');
  console.log('\n📚 APPROVED FONTS:');
  Object.entries(APPROVED_FONTS).forEach(([font, desc]) => {
    console.log(`   ✅ ${font} - ${desc}`);
  });
  console.log('\n═'.repeat(80));
  console.log('STATUS: PRODUCTION READY - ZERO TOLERANCE ACHIEVED');
  console.log('CERTIFICATION: A+ (100/100) - PERFECT ATOMIC COMPLIANCE');
  process.exit(0);
}

// Group violations by severity
const critical = [];
const high = [];
const medium = [];

[...violations.typography, ...violations.darkMode, ...violations.colorAlignment, ...violations.semanticHTML].forEach(v => {
  if (v.severity === 'CRITICAL') critical.push(v);
  else if (v.severity === 'HIGH') high.push(v);
  else medium.push(v);
});

console.log('\n❌ VIOLATIONS FOUND\n');

if (critical.length > 0) {
  console.log('🚨 CRITICAL VIOLATIONS (Must fix immediately):\n');
  critical.slice(0, 10).forEach(v => {
    console.log(`   ${v.file}:${v.line}`);
    console.log(`   Type: ${v.type}`);
    console.log(`   Issue: ${v.violation}`);
    console.log('');
  });
  if (critical.length > 10) {
    console.log(`   ... and ${critical.length - 10} more critical violations\n`);
  }
}

if (high.length > 0) {
  console.log('⚠️  HIGH PRIORITY VIOLATIONS:\n');
  high.slice(0, 5).forEach(v => {
    console.log(`   ${v.file}:${v.line} - ${v.type}`);
  });
  if (high.length > 5) {
    console.log(`   ... and ${high.length - 5} more high priority violations\n`);
  }
}

if (medium.length > 0) {
  console.log(`⚡ MEDIUM PRIORITY VIOLATIONS: ${medium.length} total\n`);
}

console.log('═'.repeat(80));
console.log('📈 SUMMARY BY CATEGORY');
console.log('═'.repeat(80));
console.log(`Typography Violations: ${violations.typography.length}`);
console.log(`Dark Mode Violations: ${violations.darkMode.length}`);
console.log(`Color Alignment Violations: ${violations.colorAlignment.length}`);
console.log(`Semantic HTML Violations: ${violations.semanticHTML.length}`);
console.log(`\nTotal Violations: ${totalViolations}`);
console.log(`\nSeverity Breakdown:`);
console.log(`  🚨 Critical: ${critical.length}`);
console.log(`  ⚠️  High: ${high.length}`);
console.log(`  ⚡ Medium: ${medium.length}`);

console.log('\n⚠️  STATUS: REMEDIATION REQUIRED');
console.log('ZERO TOLERANCE POLICY: All violations must be fixed for certification');

process.exit(1);
