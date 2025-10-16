#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Fixing conditional hooks in people module...\n');

// Find all files with the pattern
const files = execSync(
  'grep -l "? { data, loading }" src/components/people/*.tsx',
  { cwd: process.cwd(), encoding: 'utf8' }
).trim().split('\n').filter(f => f);

console.log(`Found ${files.length} files to fix\n`);

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Pattern to match and fix
  const pattern = /const\s+{\s*data:\s*fetchedData,\s*loading:\s*fetchLoading\s*}\s*=\s*data\s*\?\s*{\s*data,\s*loading\s*}\s*:\s*useModuleData\(\s*'([^']+)',\s*'([^']+)',\s*workspaceId\s*\)/;
  
  const match = content.match(pattern);
  if (match) {
    const module = match[1];
    const tab = match[2];
    
    const replacement = `const { data: hookData, loading: hookLoading } = useModuleData(workspaceId, '${module}', '${tab}')
  const fetchedData = data || hookData
  const fetchLoading = loading !== undefined ? loading : hookLoading`;
    
    content = content.replace(pattern, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${file}`);
  } else {
    console.log(`⚠️  Pattern not found in: ${file}`);
  }
});

console.log('\n✅ Done!');
