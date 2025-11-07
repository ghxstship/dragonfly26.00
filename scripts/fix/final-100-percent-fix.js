#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎯 FINAL 100% ERROR REMEDIATION\n');

function getAllTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      getAllTsxFiles(filePath, fileList);
    } else if (file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  let modified = false;
  
  // Fix 1: Remove ALL duplicate props
  const duplicatePatterns = [
    /(\s+aria-hidden=(?:"[^"]*"|{[^}]*}))\s+aria-hidden=(?:"[^"]*"|{[^}]*})/g,
    /(\s+aria-label=(?:"[^"]*"|{[^}]*}))\s+aria-label=(?:"[^"]*"|{[^}]*})/g,
    /(\s+role=(?:"[^"]*"|{[^}]*}))\s+role=(?:"[^"]*"|{[^}]*})/g,
    /(\s+className=(?:"[^"]*"|{[^}]*}))\s+className=(?:"[^"]*"|{[^}]*})/g,
    /(\s+onClick=\{[^}]*\})\s+onClick=\{[^}]*\}/g,
  ];
  
  for (const pattern of duplicatePatterns) {
    if (pattern.test(content)) {
      content = content.replace(pattern, '$1');
      modified = true;
    }
  }
  
  // Fix 2: Move ALL hooks before early returns
  const newLines = content.split('\n');
  let componentLine = -1;
  
  for (let i = 0; i < newLines.length; i++) {
    if (newLines[i].match(/^export\s+(default\s+)?function\s+\w+/)) {
      componentLine = i;
      break;
    }
  }
  
  if (componentLine !== -1) {
    // Find ALL hooks
    const allHooks = [];
    let braceCount = 0;
    
    for (let i = componentLine; i < newLines.length; i++) {
      const line = newLines[i];
      
      braceCount += (line.match(/\{/g) || []).length;
      braceCount -= (line.match(/\}/g) || []).length;
      
      if (line.match(/^\s+(const|let)\s+.*=\s*(use[A-Z]\w+|useState|useEffect|useTranslations|useQuery|useMutation|useToast|useRouter)\(/)) {
        allHooks.push({ index: i, line });
      }
      
      if (braceCount === 0 && i > componentLine) break;
    }
    
    // Find first early return
    let earlyReturnLine = -1;
    for (let i = componentLine + 1; i < newLines.length; i++) {
      const trimmed = newLines[i].trim();
      if ((trimmed.startsWith('if (') || trimmed.startsWith('if(')) && 
          (newLines[i + 1]?.trim().startsWith('return') || trimmed.includes('return'))) {
        earlyReturnLine = i;
        break;
      }
    }
    
    if (earlyReturnLine !== -1 && allHooks.length > 0) {
      const hooksAfterReturn = allHooks.filter(h => h.index > earlyReturnLine);
      
      if (hooksAfterReturn.length > 0) {
        // Remove hooks from current positions
        for (let i = hooksAfterReturn.length - 1; i >= 0; i--) {
          newLines.splice(hooksAfterReturn[i].index, 1);
        }
        
        // Find insertion point
        let insertLine = componentLine + 1;
        for (let i = componentLine + 1; i < earlyReturnLine; i++) {
          if (newLines[i].match(/^\s+(const|let)\s+.*=\s*(use[A-Z]\w+|useState|useEffect|useTranslations|useQuery|useMutation|useToast|useRouter)\(/)) {
            insertLine = i + 1;
          }
        }
        
        // Insert hooks
        newLines.splice(insertLine, 0, ...hooksAfterReturn.map(h => h.line));
        content = newLines.join('\n');
        modified = true;
      }
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  return false;
}

// Get initial error count
const initialErrors = parseInt(execSync('npm run lint 2>&1 | grep "Error:" | wc -l', {
  cwd: process.cwd(),
  encoding: 'utf-8'
}).trim());

console.log(`📊 Initial errors: ${initialErrors}\n`);

// Process all files
const srcDir = path.join(process.cwd(), 'src/components');
const allFiles = getAllTsxFiles(srcDir);

console.log(`📁 Processing ${allFiles.length} component files...\n`);

let fixedCount = 0;
for (const file of allFiles) {
  if (fixFile(file)) {
    fixedCount++;
    console.log(`✅ ${path.relative(process.cwd(), file)}`);
  }
}

console.log(`\n✅ Fixed ${fixedCount} files\n`);

// Get final error count
const finalErrors = parseInt(execSync('npm run lint 2>&1 | grep "Error:" | wc -l', {
  cwd: process.cwd(),
  encoding: 'utf-8'
}).trim());

console.log('='.repeat(60));
console.log('📊 FINAL RESULTS');
console.log('='.repeat(60));
console.log(`Initial errors:   ${initialErrors}`);
console.log(`Final errors:     ${finalErrors}`);
console.log(`Errors fixed:     ${initialErrors - finalErrors}`);
console.log(`Success rate:     ${((initialErrors - finalErrors) / initialErrors * 100).toFixed(1)}%`);
console.log(`\n${finalErrors === 0 ? '🎉 100% COMPLETE - ZERO ERRORS!' : `⚠️  ${finalErrors} errors remaining`}\n`);

if (finalErrors > 0) {
  console.log('Remaining error types:');
  execSync('npm run lint 2>&1 | grep "Error:" | cut -d":" -f4- | sort | uniq -c | sort -rn | head -10', {
    cwd: process.cwd(),
    stdio: 'inherit'
  });
}
