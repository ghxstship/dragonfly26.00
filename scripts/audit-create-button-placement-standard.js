#!/usr/bin/env node

/**
 * CREATE BUTTON PLACEMENT STANDARD AUDIT
 * 
 * STANDARD (from screenshot):
 * - Create button MUST be in module header (top-right)
 * - Create button MUST be ABOVE tab navigation
 * - Create button MUST NOT be inside individual tab components
 * - Pattern: Module layout handles create button, NOT tab components
 */

const fs = require('fs');
const path = require('path');

// All modules from registry
const MODULES = [
  'dashboard', 'projects', 'events', 'people', 'assets', 'locations', 'files',
  'admin', 'settings', 'profile', 'companies', 'community', 'marketplace',
  'resources', 'finance', 'procurement', 'jobs', 'reports', 'analytics', 'insights'
];

const results = {
  compliant: [],
  violations: [],
  summary: {
    total: 0,
    compliant: 0,
    violations: 0
  }
};

function auditTabComponent(moduleName, fileName, filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for create buttons inside tab components (VIOLATION)
  const violations = [];
  
  // Pattern 1: Button with "Create", "New", "Add" text
  const createButtonPatterns = [
    /Button[^>]*>[\s\S]*?(?:Create|New|\+ New|Add)/gi,
    /<button[^>]*>[\s\S]*?(?:Create|New|\+ New|Add)/gi,
    /\+ New [A-Z]/g,
    /Create New/gi,
    /Add New/gi
  ];
  
  createButtonPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(match => {
        violations.push({
          type: 'CREATE_BUTTON_IN_TAB',
          pattern: pattern.toString(),
          match: match.substring(0, 100),
          severity: 'HIGH'
        });
      });
    }
  });
  
  // Pattern 2: Check for action buttons in header
  const headerButtonPattern = /<div[^>]*className="[^"]*(?:flex|justify-end|items-center)[^"]*"[^>]*>[\s\S]*?<Button/gi;
  const headerMatches = content.match(headerButtonPattern);
  if (headerMatches) {
    headerMatches.forEach(match => {
      if (match.match(/(?:Create|New|Add)/i)) {
        violations.push({
          type: 'CREATE_BUTTON_IN_TAB_HEADER',
          match: match.substring(0, 150),
          severity: 'HIGH'
        });
      }
    });
  }
  
  return violations;
}

function auditModule(moduleName) {
  const componentDir = path.join(__dirname, '..', 'src', 'components', moduleName);
  
  if (!fs.existsSync(componentDir)) {
    console.log(`⚠️  Module directory not found: ${moduleName}`);
    return;
  }
  
  const files = fs.readdirSync(componentDir).filter(f => f.endsWith('-tab.tsx'));
  
  files.forEach(file => {
    const filePath = path.join(componentDir, file);
    const violations = auditTabComponent(moduleName, file, filePath);
    
    results.summary.total++;
    
    if (violations.length === 0) {
      results.compliant.push({
        module: moduleName,
        file: file,
        status: 'COMPLIANT'
      });
      results.summary.compliant++;
    } else {
      results.violations.push({
        module: moduleName,
        file: file,
        violations: violations,
        count: violations.length
      });
      results.summary.violations++;
    }
  });
}

// Run audit
console.log('🔍 CREATE BUTTON PLACEMENT STANDARD AUDIT\n');
console.log('STANDARD: Create buttons MUST be in module header, NOT in tab components\n');
console.log('=' .repeat(80) + '\n');

MODULES.forEach(module => {
  auditModule(module);
});

// Generate report
console.log('\n📊 AUDIT RESULTS\n');
console.log('=' .repeat(80));
console.log(`Total Tab Components: ${results.summary.total}`);
console.log(`✅ Compliant: ${results.summary.compliant} (${((results.summary.compliant / results.summary.total) * 100).toFixed(1)}%)`);
console.log(`❌ Violations: ${results.summary.violations} (${((results.summary.violations / results.summary.total) * 100).toFixed(1)}%)`);
console.log('=' .repeat(80) + '\n');

if (results.violations.length > 0) {
  console.log('❌ VIOLATIONS FOUND:\n');
  
  results.violations.forEach(item => {
    console.log(`\n📁 ${item.module}/${item.file}`);
    console.log(`   Violations: ${item.count}`);
    item.violations.forEach((v, idx) => {
      console.log(`   ${idx + 1}. ${v.type} (${v.severity})`);
      console.log(`      Match: ${v.match.replace(/\n/g, ' ')}`);
    });
  });
  
  console.log('\n\n🔧 REMEDIATION REQUIRED:\n');
  console.log('1. Remove ALL create buttons from tab components');
  console.log('2. Create buttons should ONLY exist in module layout headers');
  console.log('3. Module layouts handle create actions, NOT individual tabs');
  console.log('4. Follow the Jobs module screenshot pattern exactly\n');
}

// Write detailed report
const reportPath = path.join(__dirname, '..', 'CREATE_BUTTON_PLACEMENT_AUDIT.json');
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(`\n📄 Detailed report: ${reportPath}\n`);

// Exit with error if violations found
process.exit(results.violations.length > 0 ? 1 : 0);
