#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING CONDITIONAL HOOKS - 100% REMEDIATION\n');

const filesToFix = [
  'src/components/admin/admin-overview-tab.tsx',
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

function fixConditionalHooks(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`  ⚠️  File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(fullPath, 'utf-8');
  const lines = content.split('\n');
  
  // Find the component function
  let componentStart = -1;
  let componentName = '';
  
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^export\s+(default\s+)?function\s+(\w+)/);
    if (match) {
      componentStart = i;
      componentName = match[2];
      break;
    }
  }
  
  if (componentStart === -1) return false;
  
  // Find early return (before hooks)
  let earlyReturnStart = -1;
  let earlyReturnEnd = -1;
  let firstHookLine = -1;
  
  for (let i = componentStart + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for hooks
    if (line.match(/^(const|let)\s+.*=\s*(use[A-Z]\w+|useState|useEffect|useTranslations|useQuery|useMutation)\(/)) {
      if (firstHookLine === -1) {
        firstHookLine = i;
      }
    }
    
    // Check for early return pattern: if (!something) { return ... }
    if (line.startsWith('if') && (line.includes('!authChecked') || line.includes('!session') || line.includes('loading'))) {
      earlyReturnStart = i;
      // Find the closing brace
      let braceCount = 0;
      for (let j = i; j < lines.length; j++) {
        braceCount += (lines[j].match(/\{/g) || []).length;
        braceCount -= (lines[j].match(/\}/g) || []).length;
        if (braceCount === 0 && j > i) {
          earlyReturnEnd = j;
          break;
        }
      }
      break;
    }
  }
  
  // If hooks are after early return, we need to move them
  if (earlyReturnStart !== -1 && firstHookLine !== -1 && firstHookLine > earlyReturnStart) {
    console.log(`  🔧 Fixing: ${filePath}`);
    console.log(`     Early return at line ${earlyReturnStart + 1}, first hook at line ${firstHookLine + 1}`);
    
    // Extract all hooks after the early return
    const hooksToMove = [];
    for (let i = firstHookLine; i < lines.length; i++) {
      const line = lines[i];
      if (line.match(/^\s+(const|let)\s+.*=\s*(use[A-Z]\w+|useState|useEffect|useTranslations|useQuery|useMutation)\(/)) {
        hooksToMove.push({ index: i, line });
      }
      // Stop at the return statement of the component
      if (line.trim().startsWith('return (') || line.trim() === 'return (') {
        break;
      }
    }
    
    if (hooksToMove.length > 0) {
      // Remove hooks from their current positions (reverse order to maintain indices)
      for (let i = hooksToMove.length - 1; i >= 0; i--) {
        lines.splice(hooksToMove[i].index, 1);
      }
      
      // Insert hooks right after component declaration, before early return
      const insertIndex = componentStart + 1;
      const hooksCode = [
        '',
        '  // All hooks must be called unconditionally at the top',
        ...hooksToMove.map(h => h.line),
        ''
      ];
      
      lines.splice(insertIndex, 0, ...hooksCode);
      
      // Write back
      fs.writeFileSync(fullPath, lines.join('\n'), 'utf-8');
      console.log(`     ✅ Moved ${hooksToMove.length} hooks before early return`);
      return true;
    }
  }
  
  return false;
}

console.log(`📁 Processing ${filesToFix.length} files...\n`);

for (const file of filesToFix) {
  if (fixConditionalHooks(file)) {
    fixCount++;
  }
}

console.log(`\n✅ FIXED ${fixCount} FILES\n`);
console.log('Verifying with lint...\n');
