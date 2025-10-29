#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/components/reports/create-report-dialog.tsx',
  'src/components/webhooks/create-webhook-dialog.tsx',
  'src/components/assets/barcode-scanner-overlay.tsx',
  'src/components/members/invite-dialog.tsx',
  'src/components/files/file-share-dialog.tsx',
  'src/components/people/keyboard-shortcuts.tsx',
  'src/components/api-tokens/create-token-dialog.tsx',
  'src/components/dashboard/widget-customization-dialog.tsx',
  'src/components/dashboard/quick-actions/create-task-dialog.tsx',
  'src/components/dashboard/quick-actions/book-travel-dialog.tsx',
  'src/components/dashboard/quick-actions/log-expense-dialog.tsx',
  'src/components/dashboard/quick-actions/upload-file-dialog.tsx',
  'src/components/marketplace/marketplace-wishlist-button.tsx',
  'src/components/marketplace/marketplace-review-form.tsx',
  'src/components/admin/webhooks-tab.tsx',
  'src/components/admin/checklist-templates-tab.tsx',
  'src/components/shared/create-item-dialog-enhanced.tsx',
  'src/components/layout/workspace-switcher.tsx',
  'src/components/insights/create-objective-dialog.tsx',
  'src/components/ui/command.tsx',
];

let totalFixed = 0;

filesToFix.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  const originalContent = content;
  
  // Fix the syntax: move max-h-[90vh] overflow-y-auto into className
  // Pattern 1: className="..." max-h-[90vh] overflow-y-auto>
  content = content.replace(
    /className="([^"]+)"\s+max-h-\[90vh\]\s+overflow-y-auto>/g,
    'className="$1 max-h-[90vh] overflow-y-auto">'
  );
  
  // Pattern 2: Handle cases where there might be newlines or extra spaces
  content = content.replace(
    /className="([^"]+)"\s+max-h-\[90vh\]\s+overflow-y-auto/g,
    'className="$1 max-h-[90vh] overflow-y-auto"'
  );
  
  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
    totalFixed++;
  } else {
    console.log(`ℹ️  No changes needed: ${filePath}`);
  }
});

console.log(`\n✨ Fixed ${totalFixed} files`);
