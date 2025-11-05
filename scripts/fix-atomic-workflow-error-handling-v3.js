#!/usr/bin/env node

/**
 * ATOMIC WORKFLOW ERROR HANDLING REMEDIATION V3
 * 
 * Final version that ensures error variables are properly destructured
 * from hooks before being used in error handling blocks.
 * 
 * Based on: ATOMIC_WORKFLOW_COMPLETE_AUDIT.json
 * Date: November 5, 2025
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SRC_DIR = path.join(__dirname, '../src');
const COMPONENTS_DIR = path.join(SRC_DIR, 'components');

// Statistics
const stats = {
  componentsFixed: 0,
  errors: [],
  details: []
};

/**
 * Fix error variable references in a component
 */
function fixComponent(componentPath) {
  const fullPath = path.join(COMPONENTS_DIR, componentPath);
  
  if (!fs.existsSync(fullPath)) {
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;
  
  // Check if file has error handling block but missing error variables in hook
  const hasErrorBlock = content.includes('if (isError || error)') || 
                        content.includes('if (error)') ||
                        content.includes('if (isError)');
  
  if (!hasErrorBlock) {
    return; // No error handling to fix
  }
  
  // Find all hook calls and check if they have error/isError
  const hookPattern = /const\s*\{\s*([^}]+)\}\s*=\s*(use\w+\([^)]*\))/g;
  let matches = [];
  let match;
  
  while ((match = hookPattern.exec(content)) !== null) {
    matches.push({
      fullMatch: match[0],
      destructured: match[1],
      hookCall: match[2],
      index: match.index
    });
  }
  
  if (matches.length === 0) {
    return;
  }
  
  // Fix each hook that's missing error/isError
  matches.forEach(hookMatch => {
    const vars = hookMatch.destructured.split(',').map(v => v.trim().split(':')[0].trim());
    const hasError = vars.includes('error');
    const hasIsError = vars.includes('isError');
    
    if (!hasError || !hasIsError) {
      let newVars = hookMatch.destructured.trim();
      
      if (!hasError) {
        newVars += ', error';
      }
      if (!hasIsError) {
        newVars += ', isError';
      }
      
      const newHook = `const { ${newVars} } = ${hookMatch.hookCall}`;
      content = content.replace(hookMatch.fullMatch, newHook);
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    stats.componentsFixed++;
    stats.details.push(`✅ Fixed: ${componentPath}`);
    console.log(`✅ Fixed: ${componentPath}`);
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Atomic Workflow Error Handling V3 - Final Fix\n');
  console.log('=' .repeat(60));
  console.log('📋 Adding missing error variables to hook destructuring');
  console.log('-'.repeat(60));
  
  // Get all tab component files
  const findFiles = (dir, pattern) => {
    const results = [];
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        results.push(...findFiles(fullPath, pattern));
      } else if (file.name.match(pattern)) {
        results.push(fullPath.replace(COMPONENTS_DIR + '/', ''));
      }
    }
    
    return results;
  };
  
  const allTabFiles = findFiles(COMPONENTS_DIR, /-tab\.tsx$/);
  
  allTabFiles.forEach(componentPath => {
    try {
      fixComponent(componentPath);
    } catch (error) {
      stats.errors.push(`Error fixing ${componentPath}: ${error.message}`);
      console.error(`❌ Error: ${componentPath}:`, error.message);
    }
  });
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 REMEDIATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Components fixed: ${stats.componentsFixed}`);
  console.log(`❌ Errors: ${stats.errors.length}`);
  
  if (stats.errors.length > 0) {
    console.log('\n❌ ERRORS:');
    stats.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  console.log('\n' + '='.repeat(60));
  if (stats.componentsFixed > 0) {
    console.log(`✅ SUCCESS - Fixed ${stats.componentsFixed} components`);
  } else {
    console.log('✅ All components already have proper error handling');
  }
  console.log('='.repeat(60));
}

// Run the script
main();
