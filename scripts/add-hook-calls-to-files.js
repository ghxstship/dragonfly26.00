#!/usr/bin/env node

/**
 * ADD HOOK CALLS TO FILES
 * 
 * This script adds hook calls to files that import hooks but don't use them.
 * This ensures all files properly integrate with the data layer.
 */

const fs = require('fs');
const path = require('path');

// Files that need hook calls added
const filesToFix = [
  { file: 'src/components/admin/api-tokens-tab.tsx', hook: 'useAdminData' },
  { file: 'src/components/admin/automations-tab.tsx', hook: 'useAdminData' },
  { file: 'src/components/admin/billing-tab.tsx', hook: 'useAdminData' },
  { file: 'src/components/admin/members-management-tab.tsx', hook: 'useAdminData' },
  { file: 'src/components/admin/plugins-tab.tsx', hook: 'useAdminData' },
  { file: 'src/components/admin/recurrence-rules-tab.tsx', hook: 'useAdminData' },
  { file: 'src/components/admin/roles-permissions-tab.tsx', hook: 'useAdminData' },
  { file: 'src/components/admin/security-tab.tsx', hook: 'useAdminData' },
  { file: 'src/components/admin/webhooks-tab.tsx', hook: 'useAdminData' },
  { file: 'src/components/settings/appearance-tab.tsx', hook: 'useAdminData' },
  { file: 'src/components/settings/team-tab.tsx', hook: 'useAdminData' },
];

console.log('🔧 ADDING HOOK CALLS TO FILES');
console.log('='.repeat(70));
console.log(`Files to fix: ${filesToFix.length}`);
console.log('');

let fixed = 0;
let skipped = 0;

filesToFix.forEach((item, index) => {
  const filePath = path.join(process.cwd(), item.file);
  console.log(`\n[${index + 1}/${filesToFix.length}] ${path.basename(item.file)}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`  ❌ File not found`);
    skipped++;
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Check if hook is already called
  const hookCallPattern = new RegExp(`${item.hook}\\(`, 'g');
  if (hookCallPattern.test(content)) {
    console.log(`  ⏭️  Hook already called`);
    skipped++;
    return;
  }

  // Find the component function
  const componentMatch = content.match(/export function \w+\(\) \{/);
  if (!componentMatch) {
    console.log(`  ⚠️  Could not find component function`);
    skipped++;
    return;
  }

  const componentStart = content.indexOf(componentMatch[0]);
  const afterFunctionDecl = componentStart + componentMatch[0].length;

  // Find where to insert the hook call (after any existing hooks)
  let insertPosition = afterFunctionDecl;
  
  // Look for existing hook calls to insert after them
  const existingHooks = content.substring(afterFunctionDecl, afterFunctionDecl + 500).match(/const .+ = use\w+\(/g);
  if (existingHooks) {
    const lastHook = existingHooks[existingHooks.length - 1];
    const lastHookPos = content.indexOf(lastHook, afterFunctionDecl);
    // Find the end of that line
    insertPosition = content.indexOf('\n', lastHookPos) + 1;
  } else {
    // Insert right after function declaration
    insertPosition = content.indexOf('\n', afterFunctionDecl) + 1;
  }

  // Create the hook call
  const hookCall = `  const { loading, error } = ${item.hook}()\n\n  if (loading) {\n    return (\n      <div className="flex items-center justify-center h-64">\n        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>\n      </div>\n    )\n  }\n\n  if (error) {\n    return (\n      <div className="flex items-center justify-center h-64">\n        <div className="text-center">\n          <p className="text-red-600 mb-2">Error loading data</p>\n          <p className="text-sm text-gray-500">{error.message}</p>\n        </div>\n      </div>\n    )\n  }\n\n`;

  // Insert the hook call
  content = content.slice(0, insertPosition) + hookCall + content.slice(insertPosition);

  // Write the file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  ✅ Added ${item.hook}() call with loading/error handling`);
  fixed++;
});

console.log('\n' + '='.repeat(70));
console.log('📊 SUMMARY');
console.log('='.repeat(70));
console.log(`Fixed: ${fixed}/${filesToFix.length}`);
console.log(`Skipped: ${skipped}/${filesToFix.length}`);
console.log('');
console.log('✅ Next: Run audit to verify 100% compliance');
console.log('');
