#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔧 Removing incorrect hook imports...\n');

// Find all files with incorrect imports
const result = execSync(
  'grep -l "useFinanceData\\|useProjectsData\\|useEventsData\\|useProcurementData" src/components/**/*.tsx 2>/dev/null || true',
  { encoding: 'utf8', cwd: process.cwd() }
);

const files = result.trim().split('\n').filter(f => f);

console.log(`Found ${files.length} files with incorrect imports\n`);

let fixed = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;

  // Remove import lines
  const importPatterns = [
    /import\s+{\s*useFinanceData\s*}\s+from\s+["']@\/hooks\/use-finance-data["'];?\s*\n/g,
    /import\s+{\s*useProjectsData\s*}\s+from\s+["']@\/hooks\/use-projects-data["'];?\s*\n/g,
    /import\s+{\s*useEventsData\s*}\s+from\s+["']@\/hooks\/use-events-data["'];?\s*\n/g,
    /import\s+{\s*useProcurementData\s*}\s+from\s+["']@\/hooks\/use-procurement-data["'];?\s*\n/g
  ];

  importPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      content = content.replace(pattern, '');
      modified = true;
    }
  });

  // Remove hook calls (various patterns)
  const hookCallPatterns = [
    /\s*const\s+{\s*data:\s*\w+,\s*isLoading:\s*\w+,\s*error:\s*\w+\s*}\s*=\s*useFinanceData\(\);?\s*\n/g,
    /\s*const\s+{\s*data,\s*isLoading,\s*error\s*}\s*=\s*useFinanceData\(\);?\s*\n/g,
    /\s*const\s+{\s*data:\s*\w+,\s*isLoading:\s*\w+,\s*error:\s*\w+\s*}\s*=\s*useProjectsData\(\);?\s*\n/g,
    /\s*const\s+{\s*data,\s*isLoading,\s*error\s*}\s*=\s*useProjectsData\(\);?\s*\n/g,
    /\s*const\s+{\s*data:\s*\w+,\s*isLoading:\s*\w+,\s*error:\s*\w+\s*}\s*=\s*useEventsData\(\);?\s*\n/g,
    /\s*const\s+{\s*data,\s*isLoading,\s*error\s*}\s*=\s*useEventsData\(\);?\s*\n/g,
    /\s*const\s+{\s*data:\s*\w+,\s*isLoading:\s*\w+,\s*error:\s*\w+\s*}\s*=\s*useProcurementData\(\);?\s*\n/g,
    /\s*const\s+{\s*data,\s*isLoading,\s*error\s*}\s*=\s*useProcurementData\(\);?\s*\n/g
  ];

  hookCallPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      content = content.replace(pattern, '\n');
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    fixed++;
    console.log(`✅ ${file.replace(process.cwd() + '/', '')}`);
  }
});

console.log(`\n✅ Fixed ${fixed}/${files.length} files`);
