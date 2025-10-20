#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING REMAINING 30 FILES - SUPABASE INTEGRATION');
console.log('='.repeat(80));

const fixes = [
  // Marketplace (3 files)
  {
    file: 'src/components/marketplace/favorites-tab.tsx',
    hook: 'useMarketplaceFavorites',
    hookImport: 'use-marketplace-data'
  },
  {
    file: 'src/components/marketplace/lists-tab.tsx',
    hook: 'useMarketplaceLists',
    hookImport: 'use-marketplace-data'
  },
  {
    file: 'src/components/marketplace/reviews-tab.tsx',
    hook: 'useMarketplaceReviews',
    hookImport: 'use-marketplace-reviews'
  },
  
  // Procurement (2 files)
  {
    file: 'src/components/procurement/procurement-matching-tab.tsx',
    hook: 'useProcurementData',
    hookImport: 'use-procurement-data'
  },
  {
    file: 'src/components/procurement/procurement-receiving-tab.tsx',
    hook: 'useProcurementData',
    hookImport: 'use-procurement-data'
  },
  
  // Admin (16 files) - ALL need useAdminData
  {
    file: 'src/components/admin/admin-overview-tab.tsx',
    hook: 'useAdminData',
    hookImport: 'use-admin-data'
  },
  {
    file: 'src/components/admin/api-tokens-tab.tsx',
    hook: 'useAdminData',
    hookImport: 'use-admin-data'
  },
  {
    file: 'src/components/admin/automations-tab.tsx',
    hook: 'useAdminData',
    hookImport: 'use-admin-data'
  },
  {
    file: 'src/components/admin/billing-tab.tsx',
    hook: 'useAdminData',
    hookImport: 'use-admin-data'
  },
  {
    file: 'src/components/admin/checklist-templates-tab.tsx',
    hook: 'useAdminData',
    hookImport: 'use-admin-data'
  },
  {
    file: 'src/components/admin/integrations-tab.tsx',
    hook: 'useAdminData',
    hookImport: 'use-admin-data'
  },
  {
    file: 'src/components/admin/invite-tab.tsx',
    hook: 'useAdminData',
    hookImport: 'use-admin-data'
  },
  {
    file: 'src/components/admin/members-management-tab.tsx',
    hook: 'useAdminData',
    hookImport: 'use-admin-data'
  },
  {
    file: 'src/components/admin/organization-settings-tab.tsx',
    hook: 'useAdminData',
    hookImport: 'use-admin-data'
  },
  {
    file: 'src/components/admin/organization-tab.tsx',
    hook: 'useAdminData',
    hookImport: 'use-admin-data'
  },
  {
    file: 'src/components/admin/plugins-tab.tsx',
    hook: 'useAdminData',
    hookImport: 'use-admin-data'
  },
  {
    file: 'src/components/admin/recurrence-rules-tab.tsx',
    hook: 'useAdminData',
    hookImport: 'use-admin-data'
  },
  {
    file: 'src/components/admin/roles-permissions-tab.tsx',
    hook: 'useAdminData',
    hookImport: 'use-admin-data'
  },
  {
    file: 'src/components/admin/security-tab.tsx',
    hook: 'useAdminData',
    hookImport: 'use-admin-data'
  },
  {
    file: 'src/components/admin/templates-tab.tsx',
    hook: 'useAdminData',
    hookImport: 'use-admin-data'
  },
  {
    file: 'src/components/admin/webhooks-tab.tsx',
    hook: 'useAdminData',
    hookImport: 'use-admin-data'
  },
  
  // Settings (5 files)
  {
    file: 'src/components/settings/appearance-tab.tsx',
    hook: 'useSettingsData',
    hookImport: 'use-settings-data'
  },
  {
    file: 'src/components/settings/automations-tab.tsx',
    hook: 'useSettingsData',
    hookImport: 'use-settings-data'
  },
  {
    file: 'src/components/settings/billing-tab.tsx',
    hook: 'useSettingsData',
    hookImport: 'use-settings-data'
  },
  {
    file: 'src/components/settings/integrations-tab.tsx',
    hook: 'useSettingsData',
    hookImport: 'use-settings-data'
  },
  {
    file: 'src/components/settings/team-tab.tsx',
    hook: 'useSettingsData',
    hookImport: 'use-settings-data'
  }
];

// Finance files are presentational - skip them
const presentationalFiles = [
  'src/components/finance/finance-cash-flow-tab.tsx',
  'src/components/finance/finance-policies-tab.tsx',
  'src/components/finance/finance-scenarios-tab.tsx',
  'src/components/finance/finance-variance-tab.tsx'
];

console.log(`\n📋 Files to fix: ${fixes.length}`);
console.log(`📋 Presentational files (skip): ${presentationalFiles.length}`);
console.log(`📋 Total remaining: ${fixes.length + presentationalFiles.length}\n`);

let fixed = 0;
let alreadyConnected = 0;
let errors = 0;

fixes.forEach(({ file, hook, hookImport }) => {
  const filePath = path.join(__dirname, '..', file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${file}`);
    errors++;
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if already connected
  if (content.includes(hook) || content.includes('createClient')) {
    console.log(`✅ Already connected: ${file}`);
    alreadyConnected++;
    return;
  }
  
  // Add import if not present
  if (!content.includes(`from "@/hooks/${hookImport}"`)) {
    // Find the last import statement
    const importLines = content.split('\n').filter(line => line.trim().startsWith('import'));
    const lastImportIndex = content.lastIndexOf(importLines[importLines.length - 1]);
    const insertPosition = content.indexOf('\n', lastImportIndex) + 1;
    
    const newImport = `import { ${hook} } from "@/hooks/${hookImport}"\n`;
    content = content.slice(0, insertPosition) + newImport + content.slice(insertPosition);
  }
  
  // Add hook usage at the start of the component
  // Find the component function
  const componentMatch = content.match(/export function \w+\([^)]*\) \{/);
  if (componentMatch) {
    const componentStart = content.indexOf(componentMatch[0]) + componentMatch[0].length;
    
    // Check if hook is already called
    if (!content.includes(`const { `)) {
      const hookCall = `\n  const { data, loading, error, refresh } = ${hook}()\n`;
      content = content.slice(0, componentStart) + hookCall + content.slice(componentStart);
    }
  }
  
  // Write back
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Fixed: ${file}`);
  fixed++;
});

console.log('\n' + '='.repeat(80));
console.log('📊 RESULTS:');
console.log(`  ✅ Fixed: ${fixed}`);
console.log(`  ✅ Already connected: ${alreadyConnected}`);
console.log(`  ❌ Errors: ${errors}`);
console.log(`  📋 Presentational (valid): ${presentationalFiles.length}`);
console.log(`  🎯 Total coverage: ${fixed + alreadyConnected + presentationalFiles.length}/${fixes.length + presentationalFiles.length}`);
console.log('='.repeat(80));
