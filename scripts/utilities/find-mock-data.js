#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../src/components');

const hubs = {
  finance: ['finance'],
  admin: ['admin'],
  events: ['events'],
  dashboard: ['dashboard'],
  assets: ['assets'],
  procurement: ['procurement'],
  resources: ['resources'],
  marketplace: ['marketplace'],
  settings: ['settings'],
  locations: ['locations'],
  people: ['people'],
  community: ['community'],
  files: ['files'],
  insights: ['insights'],
  analytics: ['analytics'],
  projects: ['projects'],
  reports: ['reports'],
  profile: ['profile']
};

const mockDataPatterns = [
  /const\s+\w+\s*=\s*\[[\s\S]*?\{[\s\S]*?id:\s*["'`]\d+["'`]/g,  // Array of objects with id
  /const\s+\w+\s*=\s*\{[\s\S]*?id:\s*["'`]\d+["'`]/g,  // Single object with id
  /const\s+mockData\s*=\s*\[[\s\S]*?\]/g,
  /const\s+dummyData\s*=\s*\[[\s\S]*?\]/g,
  /const\s+sampleData\s*=\s*\[[\s\S]*?\]/g,
  /const\s+testData\s*=\s*\[[\s\S]*?\]/g,
  /const\s+exampleData\s*=\s*\[[\s\S]*?\]/g,
  /const\s+\w+Data\s*=\s*\[\s*\{/g,  // Any array assignment ending in Data with objects
  /const\s+\w+Items\s*=\s*\[\s*\{/g,  // Any array assignment ending in Items with objects
  /const\s+\w+List\s*=\s*\[\s*\{/g,   // Any array assignment ending in List with objects
];

const stringPatterns = [
  /:\s*["'`][A-Z][^"'`]*["'`]/g,  // Property values starting with capital letter
  /name:\s*["'`]/g,
  /title:\s*["'`]/g,
  /description:\s*["'`]/g,
  /label:\s*["'`]/g,
  /value:\s*["'`][^"'`]*["'`]/g,
];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const issues = [];
  
  // Skip if file is using Supabase data properly
  const hasSupabaseHook = /use-\w+-data/.test(content);
  const hasDataDestructure = /const\s*\{[^}]*data[^}]*\}\s*=\s*use/.test(content);
  
  // Check for mock data patterns
  let mockDataCount = 0;
  mockDataPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      mockDataCount += matches.length;
    }
  });
  
  // Check for hardcoded strings in data structures
  let hardcodedStringCount = 0;
  const lines = content.split('\n');
  let inDataStructure = false;
  let braceCount = 0;
  
  lines.forEach((line, idx) => {
    // Track if we're inside a data structure
    if (/const\s+\w+\s*=\s*[\[{]/.test(line)) {
      inDataStructure = true;
      braceCount = (line.match(/[\[{]/g) || []).length - (line.match(/[\]}]/g) || []).length;
    } else if (inDataStructure) {
      braceCount += (line.match(/[\[{]/g) || []).length - (line.match(/[\]}]/g) || []).length;
      if (braceCount <= 0) {
        inDataStructure = false;
      }
    }
    
    if (inDataStructure) {
      // Count hardcoded strings in data structures
      const stringMatches = line.match(/["'`][A-Z][^"'`]{3,}["'`]/g);
      if (stringMatches) {
        hardcodedStringCount += stringMatches.length;
      }
    }
  });
  
  if (mockDataCount > 0 || hardcodedStringCount > 0) {
    issues.push({
      file: path.basename(filePath),
      path: filePath,
      mockDataDeclarations: mockDataCount,
      hardcodedStrings: hardcodedStringCount,
      hasSupabaseHook,
      hasDataDestructure
    });
  }
  
  return issues;
}

function scanHub(hubName, modules) {
  const results = [];
  
  modules.forEach(module => {
    const moduleDir = path.join(componentsDir, module);
    if (!fs.existsSync(moduleDir)) return;
    
    const files = fs.readdirSync(moduleDir).filter(f => f.endsWith('-tab.tsx'));
    
    files.forEach(file => {
      const filePath = path.join(moduleDir, file);
      const issues = scanFile(filePath);
      if (issues.length > 0) {
        results.push(...issues);
      }
    });
  });
  
  return results;
}

console.log('🔍 Scanning for mock data and hardcoded strings...\n');

const allResults = {};
let totalFiles = 0;
let totalStrings = 0;

Object.entries(hubs).forEach(([hubName, modules]) => {
  const results = scanHub(hubName, modules);
  if (results.length > 0) {
    allResults[hubName] = results;
    const stringCount = results.reduce((sum, r) => sum + r.hardcodedStrings + r.mockDataDeclarations, 0);
    totalFiles += results.length;
    totalStrings += stringCount;
    console.log(`${hubName.toUpperCase()} Hub: ${results.length} files, ${stringCount} issues 🔴`);
  }
});

console.log(`\n📊 TOTAL: ${totalFiles} files, ${totalStrings} issues\n`);

// Write detailed report
fs.writeFileSync(
  path.join(__dirname, '../docs/audits/MOCK_DATA_REPORT.json'),
  JSON.stringify(allResults, null, 2)
);

console.log('✅ Detailed report saved to docs/audits/MOCK_DATA_REPORT.json');
