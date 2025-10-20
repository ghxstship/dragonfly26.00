#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 FIXING PARSING ERRORS - FINAL PASS\n');

// Get files with parsing errors
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

const filesWithParsingErrors = new Set();
const lines = lintOutput.split('\n');
let currentFile = null;

for (const line of lines) {
  if (line.startsWith('./src/')) {
    currentFile = line.trim();
  } else if (currentFile && line.includes('Parsing error')) {
    filesWithParsingErrors.add(currentFile);
  }
}

console.log(`📁 Found ${filesWithParsingErrors.size} files with parsing errors\n`);

let fixCount = 0;

for (const file of filesWithParsingErrors) {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  let modified = false;
  
  // Find incomplete useState declarations before early returns
  for (let i = 0; i < lines.length - 5; i++) {
    const line = lines[i];
    
    // Check for useState with opening bracket but no closing
    if (line.match(/useState\(\[/) && !line.includes('])')) {
      // Check if next few lines have early return
      let hasEarlyReturn = false;
      for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
        if (lines[j].trim().startsWith('if (') && lines[j + 1]?.trim().startsWith('return')) {
          hasEarlyReturn = true;
          break;
        }
      }
      
      if (hasEarlyReturn) {
        // Close the array immediately
        lines[i] = line.replace(/useState\(\[$/, 'useState([])');
        modified = true;
        console.log(`  🔧 ${file}:${i + 1} - Closed incomplete useState array`);
      }
    }
    
    // Check for other incomplete statements
    if (line.match(/=\s*\[$/) && !lines[i + 1]?.trim().startsWith(']')) {
      let hasEarlyReturn = false;
      for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
        if (lines[j].trim().startsWith('if (') && lines[j + 1]?.trim().startsWith('return')) {
          hasEarlyReturn = true;
          break;
        }
      }
      
      if (hasEarlyReturn) {
        lines[i] = line.replace(/=\s*\[$/, '= []');
        modified = true;
        console.log(`  🔧 ${file}:${i + 1} - Closed incomplete array`);
      }
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
    fixCount++;
    console.log(`  ✅ Fixed: ${file}\n`);
  }
}

console.log(`\n✅ FIXED ${fixCount} FILES\n`);

// Run lint again
try {
  const errorCount = execSync('npm run lint 2>&1 | grep "Error:" | wc -l', {
    cwd: process.cwd(),
    encoding: 'utf-8'
  }).trim();
  console.log(`Remaining errors: ${errorCount}\n`);
} catch (e) {
  // Ignore
}
