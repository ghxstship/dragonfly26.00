#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../src/components');

const filesToFix = [
  'dashboard/dashboard-my-assets-tab.tsx',
  'dashboard/dashboard-my-files-tab.tsx',
  'dashboard/dashboard-my-reports-tab.tsx',
  'dashboard/dashboard-overview-tab.tsx',
  'assets/counts-tab.tsx',
  'community/competitions-tab.tsx',
  'community/news-tab.tsx',
  'procurement/procurement-matching-tab.tsx',
  'procurement/procurement-receiving-tab.tsx',
  'admin/billing-tab.tsx',
  'admin/checklist-templates-tab.tsx',
  'admin/members-management-tab.tsx',
  'admin/organization-settings-tab.tsx',
  'admin/recurrence-rules-tab.tsx',
  'settings/team-tab.tsx',
  'profile/access-tab.tsx',
  'profile/history-tab.tsx',
  'profile/performance-tab.tsx',
  'profile/tags-tab.tsx'
];

console.log('Starting comprehensive remediation of all remaining violations...\n');

let filesProcessed = 0;
let totalReplacements = 0;

filesToFix.forEach(file => {
  const filePath = path.join(componentsDir, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`✗ ${file} (not found)`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let replacements = 0;
  
  // Transform: name: "..." -> nameKey: "..."
  const nameCount = (content.match(/(\s+)name:\s*"([^"]+)"/g) || []).length;
  content = content.replace(/(\s+)name:\s*"([^"]+)"/g, (match, indent, value) => {
    replacements++;
    const key = value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').substring(0, 50);
    return `${indent}nameKey: "${key}"`;
  });
  
  // Transform: label: "..." -> labelKey: "..."
  const labelCount = (content.match(/(\s+)label:\s*"([^"]+)"/g) || []).length;
  content = content.replace(/(\s+)label:\s*"([^"]+)"/g, (match, indent, value) => {
    replacements++;
    const key = value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').substring(0, 50);
    return `${indent}labelKey: "${key}"`;
  });
  
  // Transform: title: "..." -> titleKey: "..."
  const titleCount = (content.match(/(\s+)title:\s*"([^"]+)"/g) || []).length;
  content = content.replace(/(\s+)title:\s*"([^"]+)"/g, (match, indent, value) => {
    replacements++;
    const key = value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').substring(0, 50);
    return `${indent}titleKey: "${key}"`;
  });
  
  // Transform: description: "..." -> descriptionKey: "..."
  const descCount = (content.match(/(\s+)description:\s*"([^"]+)"/g) || []).length;
  content = content.replace(/(\s+)description:\s*"([^"]+)"/g, (match, indent, value) => {
    replacements++;
    const key = value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').substring(0, 60);
    return `${indent}descriptionKey: "${key}"`;
  });
  
  // Update JSX rendering to use t()
  content = content.replace(/\{([a-zA-Z_][a-zA-Z0-9_]*\.)name\}/g, (match, prefix) => {
    return `{t(${prefix}nameKey)}`;
  });
  
  content = content.replace(/\{([a-zA-Z_][a-zA-Z0-9_]*\.)label\}/g, (match, prefix) => {
    return `{t(${prefix}labelKey)}`;
  });
  
  content = content.replace(/\{([a-zA-Z_][a-zA-Z0-9_]*\.)title\}/g, (match, prefix) => {
    return `{t(${prefix}titleKey)}`;
  });
  
  content = content.replace(/\{([a-zA-Z_][a-zA-Z0-9_]*\.)description\}/g, (match, prefix) => {
    return `{t(${prefix}descriptionKey)}`;
  });
  
  if (replacements > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesProcessed++;
    totalReplacements += replacements;
    console.log(`✓ ${file} (${replacements} transformations)`);
  } else {
    console.log(`- ${file} (no changes needed)`);
  }
});

console.log('\n' + '='.repeat(80));
console.log(`REMEDIATION COMPLETE`);
console.log('='.repeat(80));
console.log(`Files processed: ${filesProcessed}`);
console.log(`Total transformations: ${totalReplacements}`);
console.log('\nRun audit script to verify completion.');
