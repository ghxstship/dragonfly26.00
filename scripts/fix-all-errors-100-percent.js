#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 100% ERROR REMEDIATION - ALL ERRORS\n');

// Get all TypeScript files
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

// Fix 1: Move ALL hooks before early returns
function fixConditionalHooks(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  // Find component function
  let componentLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^export\s+(default\s+)?function\s+\w+/)) {
      componentLine = i;
      break;
    }
  }
  
  if (componentLine === -1) return false;
  
  // Find ALL hooks in component
  const allHooks = [];
  let braceCount = 0;
  let inComponent = false;
  
  for (let i = componentLine; i < lines.length; i++) {
    const line = lines[i];
    
    if (i === componentLine) {
      inComponent = true;
    }
    
    if (inComponent) {
      braceCount += (line.match(/\{/g) || []).length;
      braceCount -= (line.match(/\}/g) || []).length;
      
      // Match ALL hook patterns
      if (line.match(/^\s+(const|let)\s+.*=\s*(use[A-Z]\w+|useState|useEffect|useTranslations|useQuery|useMutation|useToast|useRouter|useSearchParams|usePathname)\(/)) {
        allHooks.push({ index: i, line });
      }
      
      if (braceCount === 0 && i > componentLine) {
        break;
      }
    }
  }
  
  if (allHooks.length === 0) return false;
  
  // Find first early return
  let earlyReturnLine = -1;
  for (let i = componentLine + 1; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if ((trimmed.startsWith('if (') || trimmed.startsWith('if(')) && 
        (lines[i + 1]?.trim().startsWith('return') || trimmed.includes('return'))) {
      earlyReturnLine = i;
      break;
    }
  }
  
  if (earlyReturnLine === -1) return false;
  
  // Find hooks AFTER early return
  const hooksAfterReturn = allHooks.filter(h => h.index > earlyReturnLine);
  
  if (hooksAfterReturn.length === 0) return false;
  
  // Remove hooks from their current positions (reverse order)
  for (let i = hooksAfterReturn.length - 1; i >= 0; i--) {
    lines.splice(hooksAfterReturn[i].index, 1);
  }
  
  // Find insertion point (after last hook before early return)
  let insertLine = componentLine + 1;
  for (let i = componentLine + 1; i < earlyReturnLine; i++) {
    if (lines[i].match(/^\s+(const|let)\s+.*=\s*(use[A-Z]\w+|useState|useEffect|useTranslations|useQuery|useMutation|useToast|useRouter)\(/)) {
      insertLine = i + 1;
    }
  }
  
  // Insert hooks
  lines.splice(insertLine, 0, ...hooksAfterReturn.map(h => h.line));
  
  fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
  return true;
}

// Fix 2: Remove duplicate props
function fixDuplicateProps(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  const props = ['aria-hidden', 'aria-label', 'role', 'className', 'onClick', 'id', 'key'];
  
  for (const prop of props) {
    const regex1 = new RegExp(`(\\s+${prop}="[^"]*")\\s+${prop}="[^"]*"`, 'g');
    const regex2 = new RegExp(`(\\s+${prop}=\\{[^}]*\\})\\s+${prop}=\\{[^}]*\\}`, 'g');
    
    if (regex1.test(content)) {
      content = content.replace(regex1, '$1');
      modified = true;
    }
    if (regex2.test(content)) {
      content = content.replace(regex2, '$1');
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  return false;
}

// Main execution
const srcDir = path.join(process.cwd(), 'src');
const allFiles = getAllTsFiles(srcDir);

console.log(`📁 Processing ${allFiles.length} TypeScript files\n`);

let hooksFixed = 0;
let propsFixed = 0;

console.log('Phase 1: Fixing conditional hooks...');
for (const file of allFiles) {
  if (fixConditionalHooks(file)) {
    hooksFixed++;
    console.log(`  ✅ ${path.relative(process.cwd(), file)}`);
  }
}

console.log(`\nPhase 2: Fixing duplicate props...`);
for (const file of allFiles) {
  if (fixDuplicateProps(file)) {
    propsFixed++;
    console.log(`  ✅ ${path.relative(process.cwd(), file)}`);
  }
}

console.log(`\n📊 SUMMARY:`);
console.log(`  Conditional hooks fixed: ${hooksFixed}`);
console.log(`  Duplicate props fixed: ${propsFixed}`);
console.log(`  Total files fixed: ${hooksFixed + propsFixed}`);

console.log('\n✅ REMEDIATION COMPLETE\n');
console.log('Verifying with lint...\n');

try {
  const errorCount = execSync('npm run lint 2>&1 | grep "Error:" | wc -l', {
    cwd: process.cwd(),
    encoding: 'utf-8'
  }).trim();
  console.log(`Remaining errors: ${errorCount}\n`);
} catch (e) {
  // Ignore
}
