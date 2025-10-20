#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 FIXING MISSING CLOSING BRACES\n');

const filesToFix = [
  'src/components/admin/members-overview-tab.tsx',
  'src/components/community/community-spotlight-tab.tsx',
  'src/components/companies/companies-overview-tab.tsx',
  'src/components/files/files-overview-tab.tsx',
  'src/components/locations/locations-overview-tab.tsx',
  'src/components/marketplace/marketplace-spotlight-tab.tsx',
  'src/components/molecules/data-display/EmptyState.tsx',
  'src/components/opportunities/opportunities-careers-tab.tsx',
  'src/components/opportunities/opportunities-grants-tab.tsx',
  'src/components/opportunities/opportunities-jobs-tab.tsx',
  'src/components/opportunities/opportunities-sponsorship-tab.tsx',
  'src/components/opportunities/opportunities-spotlight-tab.tsx',
  'src/components/organisms/templates/OverviewTemplateOrganism.tsx',
  'src/components/organisms/templates/SpotlightTemplateOrganism.tsx',
  'src/components/people/people-overview-tab.tsx',
  'src/components/resources/resources-spotlight-tab.tsx'
];

let fixCount = 0;

for (const file of filesToFix) {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠️  File not found: ${file}`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if file ends with proper closing brace
  const trimmed = content.trim();
  if (!trimmed.endsWith('}')) {
    content = content.trimEnd() + '\n}\n';
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✅ Added closing brace to ${file}`);
    fixCount++;
  }
}

console.log(`\n✅ Fixed ${fixCount} files\n`);

// Final verification
const finalErrors = parseInt(execSync('npm run lint 2>&1 | grep "Error:" | wc -l', {
  cwd: process.cwd(),
  encoding: 'utf-8'
}).trim());

console.log(`📊 Final errors: ${finalErrors}\n`);

if (finalErrors === 0) {
  console.log('🎉 100% COMPLETE - ZERO ERRORS!\n');
} else {
  console.log(`⚠️  ${finalErrors} errors remaining\n`);
}
