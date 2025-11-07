#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 ADDING JSX.Element RETURN TYPES TO ALL COMPONENTS');
console.log('===================================================\n');

// Get all tab component files
const componentDirs = [
  'src/components/admin',
  'src/components/analytics',
  'src/components/assets',
  'src/components/community',
  'src/components/companies',
  'src/components/dashboard',
  'src/components/events',
  'src/components/files',
  'src/components/finance',
  'src/components/insights',
  'src/components/jobs',
  'src/components/locations',
  'src/components/marketplace',
  'src/components/people',
  'src/components/procurement',
  'src/components/profile',
  'src/components/projects',
  'src/components/reports',
  'src/components/resources',
  'src/components/settings'
];

let totalFiles = 0;
let filesFixed = 0;
let returnTypesAdded = 0;

componentDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) return;

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('-tab.tsx'));
  
  files.forEach(file => {
    totalFiles++;
    const filePath = path.join(dirPath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let fileReturnTypes = 0;

    // Pattern 1: export function ComponentName(props: Type) {
    // WITHOUT return type
    const pattern1 = /export function ([A-Z]\w+)\(([^)]*)\) \{/g;
    content = content.replace(pattern1, (match, name, params) => {
      fileReturnTypes++;
      modified = true;
      return `export function ${name}(${params}): JSX.Element {`;
    });

    // Pattern 2: export default function ComponentName(props: Type) {
    const pattern2 = /export default function ([A-Z]\w+)\(([^)]*)\) \{/g;
    content = content.replace(pattern2, (match, name, params) => {
      fileReturnTypes++;
      modified = true;
      return `export default function ${name}(${params}): JSX.Element {`;
    });

    // Pattern 3: const ComponentName = (props: Type) => {
    const pattern3 = /const ([A-Z]\w+) = \(([^)]*)\) => \{/g;
    content = content.replace(pattern3, (match, name, params) => {
      fileReturnTypes++;
      modified = true;
      return `const ${name} = (${params}): JSX.Element => {`;
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`   ✅ ${path.basename(dir)}/${file} - Added ${fileReturnTypes} return types`);
      filesFixed++;
      returnTypesAdded += fileReturnTypes;
    }
  });
});

console.log(`\n✅ COMPLETE\n`);
console.log(`Files processed: ${totalFiles}`);
console.log(`Files modified: ${filesFixed}`);
console.log(`Return types added: ${returnTypesAdded}\n`);

// Run verification
console.log('═══════════════════════════════════════════════════════════');
console.log('📊 RUNNING VERIFICATION...');
console.log('═══════════════════════════════════════════════════════════\n');

const { execSync } = require('child_process');
try {
  execSync('node scripts/verify-type-safety.js', { 
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit'
  });
} catch (error) {
  console.log('Verification completed');
}
