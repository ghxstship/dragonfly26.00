#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 FIXING DUPLICATE FUNCTION SIGNATURES\n');

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
  let modified = false;
  
  // Pattern: export function Name(): JSX.Element {{ params }: Props): JSX.Element {
  const duplicateSignaturePattern = /^export function (\w+)\(\): JSX\.Element \{\{ ([^}]+) \}: (\w+)\): JSX\.Element \{/gm;
  
  if (duplicateSignaturePattern.test(content)) {
    content = content.replace(duplicateSignaturePattern, 'export function $1({ $2 }: $3): JSX.Element {');
    modified = true;
    console.log(`  ✅ Fixed duplicate signature in ${path.relative(process.cwd(), filePath)}`);
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  return false;
}

const srcDir = path.join(process.cwd(), 'src/components');
const allFiles = getAllTsxFiles(srcDir);

console.log(`📁 Scanning ${allFiles.length} files...\n`);

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

console.log(`Remaining errors: ${finalErrors}\n`);
