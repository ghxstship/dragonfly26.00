#!/usr/bin/env node

/**
 * Dashboard Implementation Verification Script
 * Checks that all dashboard components and integrations are properly set up
 */

const fs = require('fs');
const path = require('path');

const CHECKS = {
  files: [
    // Quick Action Dialogs
    'src/components/dashboard/quick-actions/log-expense-dialog.tsx',
    'src/components/dashboard/quick-actions/book-travel-dialog.tsx',
    'src/components/dashboard/quick-actions/create-task-dialog.tsx',
    'src/components/dashboard/quick-actions/upload-file-dialog.tsx',
    'src/components/dashboard/quick-actions/index.ts',
    
    // Widget Components
    'src/components/dashboard/widget-customization-dialog.tsx',
    'src/components/dashboard/dashboard-overview-tab.tsx',
    
    // Hooks
    'src/hooks/use-dashboard-widgets.ts',
    'src/hooks/use-dashboard-data.ts',
    
    // UI Components
    'src/components/ui/toast.tsx',
    'src/components/ui/toaster.tsx',
    'src/lib/hooks/use-toast.ts',
    
    // Database
    'supabase/migrations/065_user_dashboard_widgets.sql',
    
    // Documentation
    'docs/features/DASHBOARD_QUICK_ACTIONS.md',
    'DASHBOARD_IMPLEMENTATION_SUMMARY.md',
  ],
  
  imports: [
    {
      file: 'src/components/dashboard/quick-actions/log-expense-dialog.tsx',
      imports: ['toast']
    },
    {
      file: 'src/components/dashboard/quick-actions/book-travel-dialog.tsx',
      imports: ['toast']
    },
    {
      file: 'src/components/dashboard/quick-actions/create-task-dialog.tsx',
      imports: ['toast']
    },
    {
      file: 'src/components/dashboard/quick-actions/upload-file-dialog.tsx',
      imports: ['toast']
    },
    {
      file: 'src/components/dashboard/dashboard-overview-tab.tsx',
      imports: ['WidgetCustomizationDialog', 'handleRefresh', 'widgetCustomizationOpen']
    },
  ],
  
  migrations: [
    'supabase/migrations/065_user_dashboard_widgets.sql'
  ]
};

let passed = 0;
let failed = 0;
const errors = [];

console.log('🔍 Verifying Dashboard Implementation...\n');

// Check files exist
console.log('📁 Checking Files...');
CHECKS.files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
    passed++;
  } else {
    console.log(`  ❌ ${file} - NOT FOUND`);
    errors.push(`Missing file: ${file}`);
    failed++;
  }
});

// Check imports
console.log('\n📦 Checking Imports...');
CHECKS.imports.forEach(({ file, imports }) => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    imports.forEach(imp => {
      if (content.includes(imp)) {
        console.log(`  ✅ ${file} imports/uses "${imp}"`);
        passed++;
      } else {
        console.log(`  ❌ ${file} missing "${imp}"`);
        errors.push(`Missing import/usage "${imp}" in ${file}`);
        failed++;
      }
    });
  } else {
    console.log(`  ⚠️  Skipping ${file} - file not found`);
  }
});

// Check migration
console.log('\n🗄️  Checking Database Migration...');
CHECKS.migrations.forEach(migration => {
  const migrationPath = path.join(__dirname, '..', migration);
  if (fs.existsSync(migrationPath)) {
    const content = fs.readFileSync(migrationPath, 'utf8');
    
    // Check for key elements
    const checks = [
      { name: 'user_dashboard_widgets table', pattern: 'CREATE TABLE user_dashboard_widgets' },
      { name: 'RLS policies', pattern: 'ALTER TABLE user_dashboard_widgets ENABLE ROW LEVEL SECURITY' },
      { name: 'SELECT policy', pattern: 'Users can view own widgets' },
      { name: 'INSERT policy', pattern: 'Users can insert own widgets' },
      { name: 'UPDATE policy', pattern: 'Users can update own widgets' },
      { name: 'DELETE policy', pattern: 'Users can delete own widgets' },
      { name: 'Indexes', pattern: 'CREATE INDEX' },
    ];
    
    checks.forEach(({ name, pattern }) => {
      if (content.includes(pattern)) {
        console.log(`  ✅ ${name}`);
        passed++;
      } else {
        console.log(`  ❌ ${name} - NOT FOUND`);
        errors.push(`Missing ${name} in migration`);
        failed++;
      }
    });
  } else {
    console.log(`  ❌ Migration file not found`);
    failed++;
  }
});

// Check quick action exports
console.log('\n📤 Checking Quick Action Exports...');
const indexPath = path.join(__dirname, '..', 'src/components/dashboard/quick-actions/index.ts');
if (fs.existsSync(indexPath)) {
  const content = fs.readFileSync(indexPath, 'utf8');
  const expectedExports = [
    'LogExpenseDialog',
    'BookTravelDialog',
    'CreateTaskDialog',
    'UploadFileDialog'
  ];
  
  expectedExports.forEach(exp => {
    if (content.includes(exp)) {
      console.log(`  ✅ ${exp} exported`);
      passed++;
    } else {
      console.log(`  ❌ ${exp} not exported`);
      errors.push(`Missing export: ${exp}`);
      failed++;
    }
  });
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 Verification Summary');
console.log('='.repeat(50));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

if (failed > 0) {
  console.log('\n❌ Errors Found:');
  errors.forEach(err => console.log(`  - ${err}`));
  console.log('\n⚠️  Some checks failed. Please review the errors above.');
  process.exit(1);
} else {
  console.log('\n✅ All checks passed! Dashboard implementation is complete.');
  console.log('\n📝 Next Steps:');
  console.log('  1. Apply database migration: supabase db push');
  console.log('  2. Test all quick actions manually');
  console.log('  3. Test widget customization');
  console.log('  4. Deploy to production');
  process.exit(0);
}
