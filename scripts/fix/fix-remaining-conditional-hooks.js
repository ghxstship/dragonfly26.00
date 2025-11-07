#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 FIXING REMAINING CONDITIONAL HOOKS\n');

// Get files with conditional hook errors
let lintOutput;
try {
  lintOutput = execSync('npm run lint 2>&1', { 
    cwd: process.cwd(),
    encoding: 'utf-8',
    maxBuffer: 10 * 1024 * 1024
  });
} catch (error) {
  lintOutput = error.stdout || '';
}

// Parse files with conditional hook errors
const filesWithErrors = new Set();
const lines = lintOutput.split('\n');
let currentFile = null;

for (const line of lines) {
  if (line.startsWith('./src/')) {
    currentFile = line.trim();
  } else if (currentFile && line.includes('React Hook') && line.includes('conditionally')) {
    filesWithErrors.add(currentFile);
  }
}

console.log(`📁 Found ${filesWithErrors.size} files with conditional hook errors\n`);

let fixCount = 0;

for (const file of filesWithErrors) {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) continue;
  
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
  
  if (componentLine === -1) continue;
  
  // Find all hooks in the component
  const allHooks = [];
  let inComponent = false;
  let braceCount = 0;
  
  for (let i = componentLine; i < lines.length; i++) {
    const line = lines[i];
    
    if (i === componentLine) {
      inComponent = true;
    }
    
    if (inComponent) {
      braceCount += (line.match(/\{/g) || []).length;
      braceCount -= (line.match(/\}/g) || []).length;
      
      // Check for hooks
      if (line.match(/^\s+(const|let)\s+.*=\s*(use[A-Z]\w+|useState|useEffect|useTranslations|useQuery|useMutation|useToast|useRouter)\(/)) {
        allHooks.push({ index: i, line });
      }
      
      if (braceCount === 0 && i > componentLine) {
        break;
      }
    }
  }
  
  if (allHooks.length === 0) continue;
  
  // Find early return
  let earlyReturnLine = -1;
  for (let i = componentLine + 1; i < lines.length; i++) {
    if (lines[i].trim().startsWith('if (') && lines[i + 1]?.trim().startsWith('return')) {
      earlyReturnLine = i;
      break;
    }
  }
  
  if (earlyReturnLine === -1) continue;
  
  // Find hooks after early return
  const hooksAfterReturn = allHooks.filter(h => h.index > earlyReturnLine);
  
  if (hooksAfterReturn.length === 0) continue;
  
  console.log(`  🔧 ${file}`);
  console.log(`     Moving ${hooksAfterReturn.length} hooks before early return (line ${earlyReturnLine + 1})`);
  
  // Remove hooks from their current positions (reverse order)
  for (let i = hooksAfterReturn.length - 1; i >= 0; i--) {
    lines.splice(hooksAfterReturn[i].index, 1);
  }
  
  // Find where to insert (after existing hooks at top)
  let insertLine = componentLine + 1;
  for (let i = componentLine + 1; i < earlyReturnLine; i++) {
    if (lines[i].match(/^\s+(const|let)\s+.*=\s*(use[A-Z]\w+|useState|useEffect|useTranslations|useQuery|useMutation|useToast|useRouter)\(/)) {
      insertLine = i + 1;
    }
  }
  
  // Insert hooks
  lines.splice(insertLine, 0, ...hooksAfterReturn.map(h => h.line));
  
  // Write back
  fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
  console.log(`     ✅ Fixed`);
  fixCount++;
}

console.log(`\n✅ FIXED ${fixCount} FILES\n`);
