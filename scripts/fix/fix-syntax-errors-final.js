#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 FIXING ALL SYNTAX ERRORS - FINAL PASS\n');

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
  
  // Fix 1: Remove lines that are just closing braces with whitespace
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed === '}' && i > 0 && i < lines.length - 1) {
      const prevLine = lines[i - 1].trim();
      const nextLine = lines[i + 1].trim();
      
      // Check if this is an orphaned closing brace
      if (!prevLine.endsWith('{') && !nextLine.startsWith('}') && !prevLine.endsWith(',')) {
        // Count braces in surrounding context
        let openCount = 0;
        let closeCount = 0;
        for (let j = Math.max(0, i - 10); j < Math.min(lines.length, i + 10); j++) {
          openCount += (lines[j].match(/\{/g) || []).length;
          closeCount += (lines[j].match(/\}/g) || []).length;
        }
        
        if (closeCount > openCount) {
          lines[i] = '';
          modified = true;
          console.log(`  ✓ Removed orphaned } at line ${i + 1} in ${path.basename(filePath)}`);
        }
      }
    }
  }
  
  // Fix 2: Remove duplicate props in JSX
  content = lines.join('\n');
  const duplicateProps = [
    /(\s+aria-hidden=(?:"[^"]*"|{[^}]*}))\s+aria-hidden=(?:"[^"]*"|{[^}]*})/g,
    /(\s+aria-label=(?:"[^"]*"|{[^}]*}))\s+aria-label=(?:"[^"]*"|{[^}]*})/g,
    /(\s+role=(?:"[^"]*"|{[^}]*}))\s+role=(?:"[^"]*"|{[^}]*})/g,
    /(\s+className=(?:"[^"]*"|{[^}]*}))\s+className=(?:"[^"]*"|{[^}]*})/g,
  ];
  
  for (const pattern of duplicateProps) {
    if (pattern.test(content)) {
      content = content.replace(pattern, '$1');
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  return false;
}

const srcDir = path.join(process.cwd(), 'src/components');
const allFiles = getAllTsxFiles(srcDir);

console.log(`📁 Processing ${allFiles.length} files...\n`);

let fixCount = 0;
for (const file of allFiles) {
  if (fixFile(file)) {
    fixCount++;
  }
}

console.log(`\n✅ Fixed ${fixCount} files\n`);

// Get final error count
const finalErrors = parseInt(execSync('npm run lint 2>&1 | grep "Error:" | wc -l', {
  cwd: process.cwd(),
  encoding: 'utf-8'
}).trim());

console.log(`📊 Remaining errors: ${finalErrors}\n`);

if (finalErrors > 0) {
  console.log('Top remaining error types:');
  execSync('npm run lint 2>&1 | grep "Error:" | cut -d":" -f4- | sort | uniq -c | sort -rn | head -10', {
    cwd: process.cwd(),
    stdio: 'inherit'
  });
}
