#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 AUTOMATED FIX: ALL CONDITIONAL HOOKS\n');

const filesToFix = [
  'src/components/admin/api-tokens-tab.tsx',
  'src/components/admin/automations-tab.tsx',
  'src/components/admin/checklist-templates-tab.tsx',
  'src/components/admin/custom-statuses-tab.tsx',
  'src/components/admin/integrations-tab.tsx',
  'src/components/admin/invite-tab.tsx',
  'src/components/admin/members-management-tab.tsx',
  'src/components/admin/organization-settings-tab.tsx',
  'src/components/admin/organization-tab.tsx',
  'src/components/admin/plugins-tab.tsx',
  'src/components/admin/recurrence-rules-tab.tsx',
  'src/components/admin/roles-permissions-tab.tsx',
  'src/components/admin/security-tab.tsx',
  'src/components/admin/templates-tab.tsx',
  'src/components/admin/webhooks-tab.tsx',
  'src/components/analytics/analytics-comparisons-tab.tsx',
  'src/components/analytics/analytics-custom-views-tab.tsx',
  'src/components/analytics/analytics-data-sources-tab.tsx',
  'src/components/analytics/analytics-forecasting-tab.tsx',
  'src/components/analytics/analytics-metrics-library-tab.tsx',
  'src/components/analytics/analytics-overview-tab.tsx',
  'src/components/analytics/analytics-performance-tab.tsx',
  'src/components/analytics/analytics-pivot-tables-tab.tsx',
  'src/components/analytics/analytics-realtime-tab.tsx',
  'src/components/analytics/analytics-trends-tab.tsx',
  'src/components/members/invite-tab.tsx',
  'src/components/profile/access-tab.tsx',
  'src/components/profile/basic-info-tab.tsx',
  'src/components/profile/certifications-tab.tsx',
  'src/components/profile/emergency-tab.tsx',
  'src/components/profile/health-tab.tsx',
  'src/components/profile/performance-tab.tsx',
  'src/components/profile/professional-tab.tsx',
  'src/components/profile/social-tab.tsx',
  'src/components/profile/tags-tab.tsx',
  'src/components/profile/travel-tab.tsx',
  'src/components/settings/account-tab.tsx',
  'src/components/settings/appearance-tab.tsx',
  'src/components/settings/integrations-tab.tsx',
  'src/components/settings/team-tab.tsx',
];

let fixCount = 0;

function fixFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    return false;
  }
  
  let content = fs.readFileSync(fullPath, 'utf-8');
  const lines = content.split('\n');
  
  // Find component function start
  let componentLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^export\s+(default\s+)?function\s+\w+/)) {
      componentLine = i;
      break;
    }
  }
  
  if (componentLine === -1) return false;
  
  // Find early return line
  let earlyReturnLine = -1;
  for (let i = componentLine + 1; i < Math.min(componentLine + 100, lines.length); i++) {
    if (lines[i].trim().startsWith('if (') && lines[i + 1]?.trim().startsWith('return')) {
      earlyReturnLine = i;
      break;
    }
  }
  
  if (earlyReturnLine === -1) return false;
  
  // Find hooks after early return
  const hooksAfterReturn = [];
  let returnBlockEnd = earlyReturnLine;
  
  // Find end of early return block
  let braceCount = 0;
  for (let i = earlyReturnLine; i < lines.length; i++) {
    braceCount += (lines[i].match(/\{/g) || []).length;
    braceCount -= (lines[i].match(/\}/g) || []).length;
    if (braceCount === 0 && i > earlyReturnLine) {
      returnBlockEnd = i;
      break;
    }
  }
  
  // Find hooks after the return block
  for (let i = returnBlockEnd + 1; i < Math.min(returnBlockEnd + 50, lines.length); i++) {
    const line = lines[i];
    if (line.match(/^\s+(const|let)\s+.*=\s*(use[A-Z]\w+|useState|useEffect|useTranslations|useQuery|useMutation)\(/)) {
      hooksAfterReturn.push(i);
    }
    // Stop at main return
    if (line.trim().startsWith('return (') || line.trim() === 'return (') {
      break;
    }
  }
  
  if (hooksAfterReturn.length === 0) return false;
  
  console.log(`  🔧 ${filePath}`);
  console.log(`     Found ${hooksAfterReturn.length} hooks after early return`);
  
  // Extract hook lines
  const hookLines = hooksAfterReturn.map(i => lines[i]);
  
  // Remove hooks from current position (reverse order)
  for (let i = hooksAfterReturn.length - 1; i >= 0; i--) {
    lines.splice(hooksAfterReturn[i], 1);
  }
  
  // Find where to insert (after existing hooks, before early return)
  let insertLine = componentLine + 1;
  
  // Skip existing hooks
  for (let i = componentLine + 1; i < earlyReturnLine; i++) {
    if (lines[i].match(/^\s+(const|let)\s+.*=\s*(use[A-Z]\w+|useState|useEffect|useTranslations|useQuery|useMutation)\(/)) {
      insertLine = i + 1;
    }
  }
  
  // Insert hooks
  lines.splice(insertLine, 0, ...hookLines);
  
  // Write back
  fs.writeFileSync(fullPath, lines.join('\n'), 'utf-8');
  console.log(`     ✅ Moved hooks before early return`);
  
  return true;
}

for (const file of filesToFix) {
  if (fixFile(file)) {
    fixCount++;
  }
}

console.log(`\n✅ FIXED ${fixCount}/${filesToFix.length} FILES\n`);
