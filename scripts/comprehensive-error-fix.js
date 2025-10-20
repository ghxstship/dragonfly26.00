const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Analyzing TypeScript errors...\n');

// Get all TypeScript errors
let errors;
try {
  execSync('npx tsc --noEmit 2>&1', { cwd: path.join(__dirname, '..'), encoding: 'utf8' });
  console.log('✅ No TypeScript errors found!');
  process.exit(0);
} catch (e) {
  errors = e.stdout;
}

// Parse errors by file
const errorsByFile = {};
const lines = errors.split('\n');

lines.forEach(line => {
  const match = line.match(/^(.+?)\((\d+),(\d+)\): error TS\d+: (.+)$/);
  if (match) {
    const [, file, lineNum, col, message] = match;
    if (!errorsByFile[file]) {
      errorsByFile[file] = [];
    }
    errorsByFile[file].push({ line: parseInt(lineNum), col: parseInt(col), message });
  }
});

const fileCount = Object.keys(errorsByFile).length;
const totalErrors = Object.values(errorsByFile).reduce((sum, errs) => sum + errs.length, 0);

console.log(`📊 Found ${totalErrors} errors across ${fileCount} files\n`);

// Sort files by error count
const sortedFiles = Object.entries(errorsByFile)
  .sort((a, b) => b[1].length - a[1].length)
  .slice(0, 20);

console.log('Top 20 files with most errors:\n');
sortedFiles.forEach(([file, errs]) => {
  const shortFile = file.replace(/^src\/components\//, '');
  console.log(`  ${errs.length.toString().padStart(3)} errors - ${shortFile}`);
});

console.log('\n🔧 Applying automated fixes...\n');

let fixedCount = 0;

// Fix 1: Remove orphaned code fragments
const filesToClean = [
  'src/components/admin/billing-tab.tsx',
  'src/components/settings/billing-tab.tsx'
];

filesToClean.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    
    // Remove orphaned .invoices fragments
    content = content.replace(/^\s*\.invoices \|\| \{ invoices: \[\], loading: false \}\s*$/gm, '');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Cleaned: ${file}`);
      fixedCount++;
    }
  }
});

// Fix 2: Fix malformed style props (missing double braces)
const styleFixPatterns = [
  {
    pattern: /style=\{\s*backgroundColor:\s*([^}]+)\s*\}/g,
    replacement: 'style={{ backgroundColor: $1 }}'
  },
  {
    pattern: /style=\{\s*color:\s*([^}]+)\s*\}/g,
    replacement: 'style={{ color: $1 }}'
  }
];

function fixStyleProps(filePath) {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  styleFixPatterns.forEach(({ pattern, replacement }) => {
    content = content.replace(pattern, replacement);
  });
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

// Fix 3: Fix value={ { pattern (extra space/brace)
function fixValueProps(filePath) {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Fix value={ {expression pattern
  content = content.replace(/value=\{\s*\{([^}]+\.reduce[^}]+)\}/g, 'value={$1}');
  content = content.replace(/value=\{\s*\{([^}]+\.filter[^}]+)\}/g, 'value={$1}');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

// Apply fixes to all component files
const componentsDir = path.join(__dirname, '..', 'src', 'components');

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let fixed = false;
      
      if (fixStyleProps(filePath)) {
        fixed = true;
      }
      
      if (fixValueProps(filePath)) {
        fixed = true;
      }
      
      if (fixed) {
        const relPath = filePath.replace(path.join(__dirname, '..') + '/', '');
        console.log(`✅ Fixed: ${relPath}`);
        fixedCount++;
      }
    }
  });
}

walkDir(componentsDir);

console.log(`\n✅ Applied ${fixedCount} automated fixes`);
console.log('\n📝 Remaining errors require manual intervention:');
console.log('   - Missing variable declarations (setInvoices, currentPlan, etc.)');
console.log('   - Conditional React Hook calls (must be at top level)');
console.log('   - Type assertions needed (unknown types)');
console.log('   - Duplicate prop names');
console.log('\n💡 Run "npx tsc --noEmit" to see remaining errors');
