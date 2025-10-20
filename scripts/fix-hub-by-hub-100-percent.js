#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎯 HUB-BY-HUB 100% ERROR REMEDIATION\n');

// Hub organization
const hubs = {
  'System Hub': ['admin', 'settings', 'profile'],
  'Production Hub': ['dashboard', 'projects', 'events', 'people', 'assets', 'locations', 'files'],
  'Business Hub': ['companies', 'jobs', 'procurement', 'finance', 'opportunities'],
  'Intelligence Hub': ['reports', 'insights'],
  'Network Hub': ['community', 'marketplace', 'resources']
};

function getErrorsForModule(moduleName) {
  try {
    const output = execSync(`npm run lint 2>&1 | grep "./src/components/${moduleName}/"`, {
      cwd: process.cwd(),
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024
    });
    return output.split('\n').filter(line => line.includes('Error:')).length;
  } catch (e) {
    return 0;
  }
}

function fixModule(moduleName) {
  console.log(`\n🔧 Fixing ${moduleName}...`);
  
  const moduleDir = path.join(process.cwd(), 'src/components', moduleName);
  if (!fs.existsSync(moduleDir)) {
    console.log(`  ⚠️  Module directory not found`);
    return 0;
  }
  
  const files = fs.readdirSync(moduleDir).filter(f => f.endsWith('.tsx'));
  let fixCount = 0;
  
  for (const file of files) {
    const filePath = path.join(moduleDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    
    // Fix 1: Remove duplicate props
    const duplicateProps = [
      { regex: /(\s+aria-hidden="[^"]*")\s+aria-hidden="[^"]*"/g, name: 'aria-hidden' },
      { regex: /(\s+aria-label="[^"]*")\s+aria-label="[^"]*"/g, name: 'aria-label' },
      { regex: /(\s+role="[^"]*")\s+role="[^"]*"/g, name: 'role' },
      { regex: /(\s+className="[^"]*")\s+className="[^"]*"/g, name: 'className' },
      { regex: /(\s+onClick=\{[^}]*\})\s+onClick=\{[^}]*\}/g, name: 'onClick' },
    ];
    
    for (const { regex, name } of duplicateProps) {
      if (regex.test(content)) {
        content = content.replace(regex, '$1');
        modified = true;
        console.log(`    ✓ Removed duplicate ${name} in ${file}`);
      }
    }
    
    // Fix 2: Fix incomplete useState arrays
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Fix: const [x, setX] = useState([ with no closing
      if (line.match(/useState\(\[\s*$/) && !lines[i + 1]?.trim().startsWith('{')) {
        lines[i] = line.replace(/useState\(\[\s*$/, 'useState([])');
        modified = true;
        console.log(`    ✓ Fixed incomplete useState in ${file}:${i + 1}`);
      }
    }
    
    if (modified) {
      content = lines.join('\n');
      fs.writeFileSync(filePath, content, 'utf-8');
      fixCount++;
    }
  }
  
  return fixCount;
}

// Process each hub sequentially
let totalFixed = 0;
const initialErrors = parseInt(execSync('npm run lint 2>&1 | grep "Error:" | wc -l', {
  cwd: process.cwd(),
  encoding: 'utf-8'
}).trim());

console.log(`📊 Initial errors: ${initialErrors}\n`);

for (const [hubName, modules] of Object.entries(hubs)) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🏢 ${hubName}`);
  console.log('='.repeat(60));
  
  for (const moduleName of modules) {
    const errorsBefore = getErrorsForModule(moduleName);
    if (errorsBefore === 0) {
      console.log(`\n✅ ${moduleName}: Already clean (0 errors)`);
      continue;
    }
    
    console.log(`\n📦 ${moduleName}: ${errorsBefore} errors`);
    const fixed = fixModule(moduleName);
    
    const errorsAfter = getErrorsForModule(moduleName);
    const improvement = errorsBefore - errorsAfter;
    
    if (improvement > 0) {
      console.log(`  ✅ Fixed ${improvement} errors (${fixed} files modified)`);
      totalFixed += improvement;
    } else if (errorsAfter > 0) {
      console.log(`  ⚠️  ${errorsAfter} errors remaining`);
    }
  }
}

const finalErrors = parseInt(execSync('npm run lint 2>&1 | grep "Error:" | wc -l', {
  cwd: process.cwd(),
  encoding: 'utf-8'
}).trim());

console.log(`\n${'='.repeat(60)}`);
console.log('📊 FINAL SUMMARY');
console.log('='.repeat(60));
console.log(`Initial errors:   ${initialErrors}`);
console.log(`Final errors:     ${finalErrors}`);
console.log(`Errors fixed:     ${initialErrors - finalErrors}`);
console.log(`Success rate:     ${((initialErrors - finalErrors) / initialErrors * 100).toFixed(1)}%`);
console.log(`\n${finalErrors === 0 ? '🎉 100% COMPLETE!' : `⚠️  ${finalErrors} errors remaining`}\n`);
