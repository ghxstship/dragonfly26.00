#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const files = [
  'src/components/people/people-assignments-tab.tsx',
  'src/components/people/people-onboarding-tab.tsx',
  'src/components/people/people-openings-tab.tsx',
  'src/components/people/people-personnel-tab.tsx',
  'src/components/people/people-teams-tab.tsx',
  'src/components/people/people-timekeeping-tab.tsx',
  'src/components/people/people-training-tab.tsx',
];

files.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Fix the conditional hook call pattern
  // FROM:
  // const { data: fetchedData, loading: fetchLoading } = data 
  //   ? { data, loading } 
  //   : useModuleData('people', 'assignments', workspaceId)
  
  // TO:
  // const hookResult = useModuleData('people', 'assignments', workspaceId)
  // const { data: fetchedData, loading: fetchLoading } = data 
  //   ? { data, loading } 
  //   : hookResult
  
  const conditionalHookPattern = /const\s+{\s*data:\s*fetchedData,\s*loading:\s*fetchLoading\s*}\s*=\s*data\s*\?\s*{\s*data,\s*loading\s*}\s*:\s*useModuleData\([^)]+\)/g;
  
  content = content.replace(conditionalHookPattern, (match) => {
    // Extract the useModuleData call
    const moduleDataMatch = match.match(/useModuleData\(([^)]+)\)/);
    if (moduleDataMatch) {
      const args = moduleDataMatch[1];
      return `const hookResult = useModuleData(${args})\n  const { data: fetchedData, loading: fetchLoading } = data \n    ? { data, loading } \n    : hookResult`;
    }
    return match;
  });
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Fixed: ${filePath}`);
});

console.log('\n✅ All React Hooks errors fixed!');
