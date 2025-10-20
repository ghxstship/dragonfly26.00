#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 COMPREHENSIVE ERROR DETECTION & REMEDIATION\n');

// Get lint output
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

// Parse errors by file
const fileErrors = {};
const lines = lintOutput.split('\n');

let currentFile = null;
for (const line of lines) {
  if (line.startsWith('./src/')) {
    currentFile = line.trim();
    if (!fileErrors[currentFile]) {
      fileErrors[currentFile] = [];
    }
  } else if (currentFile && line.includes('Error:')) {
    const match = line.match(/(\d+):(\d+)\s+Error:\s+(.+)/);
    if (match) {
      fileErrors[currentFile].push({
        line: parseInt(match[1]),
        column: parseInt(match[2]),
        message: match[3].trim()
      });
    }
  }
}

console.log(`📊 Found ${Object.keys(fileErrors).length} files with errors\n`);

// Categorize errors
const errorCategories = {
  'React Hooks called conditionally': [],
  'No duplicate props allowed': [],
  'Parsing error': [],
  'Other': []
};

for (const [file, errors] of Object.entries(fileErrors)) {
  for (const error of errors) {
    if (error.message.includes('React Hook') && error.message.includes('conditionally')) {
      errorCategories['React Hooks called conditionally'].push({ file, ...error });
    } else if (error.message.includes('No duplicate props allowed')) {
      errorCategories['No duplicate props allowed'].push({ file, ...error });
    } else if (error.message.includes('Parsing error')) {
      errorCategories['Parsing error'].push({ file, ...error });
    } else {
      errorCategories['Other'].push({ file, ...error });
    }
  }
}

console.log('📋 ERROR BREAKDOWN:');
for (const [category, errors] of Object.entries(errorCategories)) {
  console.log(`  ${category}: ${errors.length} errors`);
}
console.log('');

// Fix React Hooks conditionally called errors
console.log('🔧 FIXING: React Hooks called conditionally...');
const hooksFiles = new Set(errorCategories['React Hooks called conditionally'].map(e => e.file));

for (const file of hooksFiles) {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  // Find early returns before hooks
  let hasEarlyReturn = false;
  let firstHookLine = -1;
  let earlyReturnLine = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for hooks
    if (line.match(/\s+(use[A-Z]\w+|useState|useEffect|useTranslations|useQuery|useMutation)\(/)) {
      if (firstHookLine === -1) {
        firstHookLine = i;
      }
    }
    
    // Check for early returns
    if (line.match(/^\s+if\s*\([^)]+\)\s*return/) || line.match(/^\s+return\s+/)) {
      if (firstHookLine === -1 && earlyReturnLine === -1) {
        earlyReturnLine = i;
        hasEarlyReturn = true;
      }
    }
  }
  
  if (hasEarlyReturn && firstHookLine > earlyReturnLine) {
    console.log(`  ⚠️  ${file}: Has early return before hooks (line ${earlyReturnLine + 1})`);
    
    // Move all hooks before early return
    const hookLines = [];
    const nonHookLines = [];
    let inFunctionBody = false;
    let functionStartLine = -1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detect function start
      if (line.match(/^export\s+(default\s+)?function/) || line.match(/^const\s+\w+\s*=\s*\(/)) {
        inFunctionBody = true;
        functionStartLine = i;
        nonHookLines.push(line);
        continue;
      }
      
      if (inFunctionBody && i > functionStartLine && i < earlyReturnLine) {
        // Extract hooks
        if (line.match(/\s+(const|let)\s+.*=\s*(use[A-Z]\w+|useState|useEffect|useTranslations|useQuery|useMutation)\(/)) {
          hookLines.push(line);
        } else {
          nonHookLines.push(line);
        }
      } else {
        nonHookLines.push(line);
      }
    }
    
    // Reconstruct file with hooks at top
    if (hookLines.length > 0) {
      const newLines = [];
      let inserted = false;
      
      for (let i = 0; i < nonHookLines.length; i++) {
        newLines.push(nonHookLines[i]);
        
        // Insert hooks right after function declaration
        if (!inserted && i === functionStartLine) {
          newLines.push('');
          newLines.push('  // Hooks must be called at the top');
          hookLines.forEach(hook => newLines.push(hook));
          newLines.push('');
          inserted = true;
        }
      }
      
      content = newLines.join('\n');
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`  ✅ Fixed: ${file}`);
    }
  }
}

// Fix duplicate props
console.log('\n🔧 FIXING: Duplicate props...');
const duplicatePropsFiles = new Set(errorCategories['No duplicate props allowed'].map(e => e.file));

for (const file of duplicatePropsFiles) {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // Find and remove duplicate aria-hidden, aria-label, role, etc.
  const duplicatePatterns = [
    /(\s+aria-hidden="[^"]*")\s+aria-hidden="[^"]*"/g,
    /(\s+aria-label="[^"]*")\s+aria-label="[^"]*"/g,
    /(\s+role="[^"]*")\s+role="[^"]*"/g,
    /(\s+className="[^"]*")\s+className="[^"]*"/g,
    /(\s+onClick=\{[^}]*\})\s+onClick=\{[^}]*\}/g,
  ];
  
  for (const pattern of duplicatePatterns) {
    if (pattern.test(content)) {
      content = content.replace(pattern, '$1');
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✅ Fixed: ${file}`);
  }
}

// Fix parsing errors
console.log('\n🔧 FIXING: Parsing errors...');
const parsingErrorFiles = errorCategories['Parsing error'];

for (const error of parsingErrorFiles) {
  const filePath = path.join(process.cwd(), error.file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  // Check the specific line
  if (error.line <= lines.length) {
    const problematicLine = lines[error.line - 1];
    console.log(`  ⚠️  ${error.file}:${error.line}`);
    console.log(`     Line: ${problematicLine.trim()}`);
    
    // Common parsing fixes
    let fixed = false;
    
    // Fix missing semicolons
    if (!problematicLine.trim().endsWith(';') && !problematicLine.trim().endsWith('{') && !problematicLine.trim().endsWith('}')) {
      lines[error.line - 1] = problematicLine + ';';
      fixed = true;
    }
    
    // Fix unclosed brackets
    const openBrackets = (problematicLine.match(/\{/g) || []).length;
    const closeBrackets = (problematicLine.match(/\}/g) || []).length;
    if (openBrackets > closeBrackets) {
      lines[error.line - 1] = problematicLine + '}';
      fixed = true;
    }
    
    if (fixed) {
      content = lines.join('\n');
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`  ✅ Fixed: ${error.file}`);
    }
  }
}

console.log('\n✅ REMEDIATION COMPLETE\n');
console.log('Running lint again to verify...\n');

// Run lint again
try {
  execSync('npm run lint 2>&1 | grep "Error:" | wc -l', { 
    cwd: process.cwd(),
    encoding: 'utf-8',
    stdio: 'inherit'
  });
} catch (error) {
  // Ignore
}

console.log('\n✅ DONE');
