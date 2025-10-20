#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 COMPREHENSIVE ERROR REMEDIATION - 100%\n');

const fixes = {
  duplicateProps: 0,
  conditionalHooks: 0,
  parsingErrors: 0,
  other: 0
};

// Helper: Fix duplicate props in a single line
function removeDuplicateProps(line) {
  let fixed = line;
  let modified = false;
  
  // Pattern: prop="value" prop="value" or prop={value} prop={value}
  const props = ['aria-hidden', 'aria-label', 'role', 'className', 'onClick', 'id', 'key'];
  
  for (const prop of props) {
    // Match: prop="..." prop="..." or prop={...} prop={...}
    const regex1 = new RegExp(`(\\s+${prop}="[^"]*")\\s+${prop}="[^"]*"`, 'g');
    const regex2 = new RegExp(`(\\s+${prop}=\\{[^}]*\\})\\s+${prop}=\\{[^}]*\\}`, 'g');
    
    if (regex1.test(fixed)) {
      fixed = fixed.replace(regex1, '$1');
      modified = true;
    }
    if (regex2.test(fixed)) {
      fixed = fixed.replace(regex2, '$1');
      modified = true;
    }
  }
  
  return { fixed, modified };
}

// Helper: Fix file with duplicate props
function fixDuplicatePropsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  let modified = false;
  
  for (let i = 0; i < lines.length; i++) {
    const result = removeDuplicateProps(lines[i]);
    if (result.modified) {
      lines[i] = result.fixed;
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
    return true;
  }
  return false;
}

// Helper: Fix conditional hooks
function fixConditionalHooksInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  // Find component function
  let componentStart = -1;
  let componentName = '';
  
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^export\s+(default\s+)?function\s+(\w+)/);
    if (match) {
      componentStart = i;
      componentName = match[2];
      break;
    }
  }
  
  if (componentStart === -1) return false;
  
  // Find all hooks and early returns in the component
  const hooks = [];
  const earlyReturns = [];
  let inComponent = false;
  let braceCount = 0;
  
  for (let i = componentStart; i < lines.length; i++) {
    const line = lines[i];
    
    if (i === componentStart) {
      inComponent = true;
    }
    
    if (inComponent) {
      braceCount += (line.match(/\{/g) || []).length;
      braceCount -= (line.match(/\}/g) || []).length;
      
      // Check for hooks
      if (line.match(/^\s+(const|let)\s+.*=\s*(use[A-Z]\w+|useState|useEffect|useTranslations|useQuery|useMutation)\(/)) {
        hooks.push(i);
      }
      
      // Check for early returns
      if (line.match(/^\s+if\s*\([^)]*\)\s*{?\s*return/) || 
          (line.match(/^\s+if\s*\([^)]*\)\s*{?$/) && lines[i+1]?.match(/^\s+return/))) {
        earlyReturns.push(i);
      }
      
      if (braceCount === 0 && i > componentStart) {
        break;
      }
    }
  }
  
  // If there are hooks after early returns, we need to reorganize
  if (hooks.length > 0 && earlyReturns.length > 0) {
    const firstHook = hooks[0];
    const firstEarlyReturn = earlyReturns[0];
    
    if (firstHook > firstEarlyReturn) {
      // Extract hook lines
      const hookLines = hooks.map(i => lines[i]);
      
      // Remove hooks from original positions (in reverse to maintain indices)
      for (let i = hooks.length - 1; i >= 0; i--) {
        lines.splice(hooks[i], 1);
      }
      
      // Insert hooks right after function declaration
      const insertPos = componentStart + 1;
      lines.splice(insertPos, 0, '', '  // Hooks called unconditionally at top', ...hookLines, '');
      
      fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
      return true;
    }
  }
  
  return false;
}

// Get all TypeScript/TSX files
function getAllTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      getAllTsFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// Main execution
const srcDir = path.join(process.cwd(), 'src');
const allFiles = getAllTsFiles(srcDir);

console.log(`📁 Found ${allFiles.length} TypeScript files\n`);

// Phase 1: Fix duplicate props
console.log('🔧 Phase 1: Fixing duplicate props...');
for (const file of allFiles) {
  if (fixDuplicatePropsInFile(file)) {
    fixes.duplicateProps++;
    console.log(`  ✅ ${path.relative(process.cwd(), file)}`);
  }
}
console.log(`   Fixed ${fixes.duplicateProps} files\n`);

// Phase 2: Fix conditional hooks
console.log('🔧 Phase 2: Fixing conditional hooks...');
for (const file of allFiles) {
  if (fixConditionalHooksInFile(file)) {
    fixes.conditionalHooks++;
    console.log(`  ✅ ${path.relative(process.cwd(), file)}`);
  }
}
console.log(`   Fixed ${fixes.conditionalHooks} files\n`);

// Summary
console.log('📊 SUMMARY:');
console.log(`  Duplicate props fixed: ${fixes.duplicateProps}`);
console.log(`  Conditional hooks fixed: ${fixes.conditionalHooks}`);
console.log(`  Total files fixed: ${fixes.duplicateProps + fixes.conditionalHooks}`);

console.log('\n✅ REMEDIATION COMPLETE\n');
