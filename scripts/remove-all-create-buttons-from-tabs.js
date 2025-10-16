#!/usr/bin/env node

/**
 * REMOVE ALL CREATE BUTTONS FROM TAB COMPONENTS
 * 
 * STANDARD: Create buttons MUST be in module header, NOT in tab components
 * This script removes ALL create button patterns from tab components
 */

const fs = require('fs');
const path = require('path');

const MODULES = [
  'dashboard', 'projects', 'events', 'people', 'assets', 'locations', 'files',
  'admin', 'settings', 'profile', 'companies', 'community', 'marketplace',
  'resources', 'finance', 'procurement', 'jobs', 'reports', 'analytics', 'insights'
];

const results = {
  processed: [],
  errors: [],
  summary: {
    totalFiles: 0,
    modified: 0,
    skipped: 0,
    errors: 0
  }
};

function removeCreateButtons(content) {
  let modified = content;
  let changesMade = false;
  
  // Pattern 1: Remove entire action button sections with create buttons
  // Matches: <div className="flex..."><Button>...Create/New/Add...</Button></div>
  const actionSectionPattern = /<div[^>]*className="[^"]*(?:flex|justify-end|items-center)[^"]*"[^>]*>\s*<Button[^>]*>[\s\S]*?(?:Create|New|\+ New|Add)[\s\S]*?<\/Button>\s*<\/div>/gi;
  
  const actionMatches = modified.match(actionSectionPattern);
  if (actionMatches) {
    actionMatches.forEach(match => {
      // Only remove if it contains create-related text
      if (match.match(/(?:Create|New|\+ New|Add)/i)) {
        modified = modified.replace(match, '');
        changesMade = true;
      }
    });
  }
  
  // Pattern 2: Remove standalone create buttons
  // Matches: <Button...>...Create/New/Add...</Button>
  const buttonPattern = /<Button[^>]*>[\s\S]*?(?:Create|New|\+ New|Add)[^<]*<\/Button>/gi;
  
  const buttonMatches = modified.match(buttonPattern);
  if (buttonMatches) {
    buttonMatches.forEach(match => {
      // Check if it's a create-related button
      if (match.match(/(?:Create|New|\+ New|Add)/i) && 
          !match.match(/(?:View|Edit|Delete|Download|Export|Import|Filter|Sort|Search)/i)) {
        modified = modified.replace(match, '');
        changesMade = true;
      }
    });
  }
  
  // Pattern 3: Remove button sections with Plus icon and create text
  const plusButtonPattern = /<Button[^>]*>[\s\S]*?<Plus[^>]*>[\s\S]*?<\/Button>/gi;
  
  const plusMatches = modified.match(plusButtonPattern);
  if (plusMatches) {
    plusMatches.forEach(match => {
      modified = modified.replace(match, '');
      changesMade = true;
    });
  }
  
  // Pattern 4: Remove action sections with "Standard Positioning" comment
  const standardPositioningPattern = /\/\*\s*Action Buttons - Standard Positioning\s*\*\/[\s\S]*?<\/div>/gi;
  
  const standardMatches = modified.match(standardPositioningPattern);
  if (standardMatches) {
    standardMatches.forEach(match => {
      modified = modified.replace(match, '');
      changesMade = true;
    });
  }
  
  // Pattern 5: Clean up empty divs left behind
  modified = modified.replace(/<div[^>]*className="[^"]*(?:flex|justify-end|items-center)[^"]*"[^>]*>\s*<\/div>/gi, '');
  
  // Pattern 6: Clean up multiple consecutive blank lines
  modified = modified.replace(/\n\n\n+/g, '\n\n');
  
  return { modified, changesMade };
}

function processTabComponent(moduleName, fileName, filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { modified, changesMade } = removeCreateButtons(content);
    
    if (changesMade) {
      fs.writeFileSync(filePath, modified, 'utf8');
      results.processed.push({
        module: moduleName,
        file: fileName,
        status: 'MODIFIED'
      });
      results.summary.modified++;
      return true;
    } else {
      results.processed.push({
        module: moduleName,
        file: fileName,
        status: 'SKIPPED'
      });
      results.summary.skipped++;
      return false;
    }
  } catch (error) {
    results.errors.push({
      module: moduleName,
      file: fileName,
      error: error.message
    });
    results.summary.errors++;
    return false;
  }
}

function processModule(moduleName) {
  const componentDir = path.join(__dirname, '..', 'src', 'components', moduleName);
  
  if (!fs.existsSync(componentDir)) {
    console.log(`⚠️  Module directory not found: ${moduleName}`);
    return;
  }
  
  const files = fs.readdirSync(componentDir).filter(f => f.endsWith('-tab.tsx'));
  
  files.forEach(file => {
    const filePath = path.join(componentDir, file);
    results.summary.totalFiles++;
    processTabComponent(moduleName, file, filePath);
  });
}

// Run remediation
console.log('🔧 REMOVING CREATE BUTTONS FROM TAB COMPONENTS\n');
console.log('STANDARD: Create buttons belong in module headers, NOT in tabs\n');
console.log('=' .repeat(80) + '\n');

MODULES.forEach(module => {
  processModule(module);
});

// Generate report
console.log('\n📊 REMEDIATION RESULTS\n');
console.log('=' .repeat(80));
console.log(`Total Files Processed: ${results.summary.totalFiles}`);
console.log(`✅ Modified: ${results.summary.modified}`);
console.log(`⏭️  Skipped (no changes): ${results.summary.skipped}`);
console.log(`❌ Errors: ${results.summary.errors}`);
console.log('=' .repeat(80) + '\n');

if (results.summary.modified > 0) {
  console.log('✅ MODIFIED FILES:\n');
  results.processed
    .filter(item => item.status === 'MODIFIED')
    .forEach(item => {
      console.log(`   ✓ ${item.module}/${item.file}`);
    });
}

if (results.errors.length > 0) {
  console.log('\n❌ ERRORS:\n');
  results.errors.forEach(item => {
    console.log(`   ✗ ${item.module}/${item.file}: ${item.error}`);
  });
}

// Write detailed report
const reportPath = path.join(__dirname, '..', 'CREATE_BUTTON_REMEDIATION_REPORT.json');
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(`\n📄 Detailed report: ${reportPath}\n`);

console.log('🎯 NEXT STEPS:\n');
console.log('1. Run audit script to verify compliance');
console.log('2. Ensure module layouts have create buttons in headers');
console.log('3. Test all modules to confirm functionality\n');

process.exit(results.errors.length > 0 ? 1 : 0);
