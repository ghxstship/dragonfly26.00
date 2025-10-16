#!/usr/bin/env node
/**
 * Systematically apply layout fixes to all tab components
 */

const fs = require('fs');
const path = require('path');

// Files that need action buttons added
const NEEDS_ACTION_BUTTONS = [
  'src/components/insights/insights-key-results-tab.tsx',
  'src/components/insights/insights-objectives-tab.tsx',
  'src/components/insights/insights-reviews-tab.tsx',
  'src/components/admin/billing-tab.tsx',
  'src/components/admin/security-tab.tsx',
  'src/components/profile/certifications-tab.tsx',
  'src/components/profile/professional-tab.tsx',
  'src/components/profile/access-tab.tsx',
  'src/components/profile/health-tab.tsx',
  'src/components/profile/travel-profile-tab.tsx',
  'src/components/profile/basic-info-tab.tsx',
  'src/components/profile/social-media-tab.tsx',
  'src/components/profile/emergency-contact-tab.tsx',
  'src/components/analytics/analytics-overview-tab.tsx',
  'src/components/analytics/analytics-pivot-tables-tab.tsx',
  'src/components/analytics/analytics-metrics-library-tab.tsx',
  'src/components/reports/reports-custom-builder-tab.tsx',
];

// Files that need space-y-6 wrapper
const NEEDS_SPACE_Y6 = [
  'src/components/assets/catalog-tab.tsx',
  'src/components/assets/inventory-tab.tsx',
  'src/components/assets/assets-advances-tab.tsx',
  'src/components/assets/counts-tab.tsx',
];

function addActionButtonsToFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(fullPath, 'utf-8');
  
  // Skip if already has action buttons
  if (content.includes('Action Buttons') || content.includes('action buttons')) {
    console.log(`ℹ️  Skipping ${filePath} - already has action buttons`);
    return false;
  }
  
  // Find the return statement with <div className="space-y-
  const returnMatch = content.match(/return\s*\(\s*<div className="space-y-(\d+)">/);
  
  if (!returnMatch) {
    console.log(`⚠️  Could not find return div in ${filePath}`);
    return false;
  }
  
  const actionButtonsSection = `
      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Manage and track items
        </p>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create
        </Button>
      </div>
`;
  
  // Insert action buttons right after the opening div
  const insertPoint = content.indexOf(returnMatch[0]) + returnMatch[0].length;
  content = content.slice(0, insertPoint) + actionButtonsSection + content.slice(insertPoint);
  
  // Ensure Plus is imported
  if (content.includes('<Plus ') && !content.includes('import { Plus')) {
    const lucideImportMatch = content.match(/import \{([^}]+)\} from ['"]lucide-react['"]/);
    if (lucideImportMatch) {
      const imports = lucideImportMatch[1].trim();
      const newImports = imports + ', Plus';
      content = content.replace(lucideImportMatch[0], `import {${newImports}} from "lucide-react"`);
    } else {
      // Find first import statement and add after it
      const firstImportMatch = content.match(/import .+ from .+/);
      if (firstImportMatch) {
        const insertAt = content.indexOf(firstImportMatch[0]) + firstImportMatch[0].length;
        content = content.slice(0, insertAt) + '\nimport { Plus } from "lucide-react"' + content.slice(insertAt);
      }
    }
  }
  
  fs.writeFileSync(fullPath, content);
  console.log(`✅ Added action buttons to ${filePath}`);
  return true;
}

function addSpaceY6Wrapper(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(fullPath, 'utf-8');
  
  // Check if already has space-y-6
  if (content.match(/return\s*\(\s*<div className="[^"]*space-y-6/)) {
    console.log(`ℹ️  Skipping ${filePath} - already has space-y-6`);
    return false;
  }
  
  // Find return statement and add space-y-6 to className
  const returnDivMatch = content.match(/(return\s*\(\s*<div className=")([^"]*)(")/);
  
  if (returnDivMatch) {
    const existingClasses = returnDivMatch[2];
    const newClasses = existingClasses ? `${existingClasses} space-y-6` : 'space-y-6';
    content = content.replace(returnDivMatch[0], `${returnDivMatch[1]}${newClasses}${returnDivMatch[3]}`);
    
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Added space-y-6 to ${filePath}`);
    return true;
  }
  
  console.log(`⚠️  Could not find return div in ${filePath}`);
  return false;
}

function main() {
  console.log('Applying layout standardization fixes...\n');
  
  let fixedCount = 0;
  
  console.log('📝 Adding action button sections...');
  NEEDS_ACTION_BUTTONS.forEach(file => {
    if (addActionButtonsToFile(file)) fixedCount++;
  });
  
  console.log('\n📐 Adding space-y-6 wrappers...');
  NEEDS_SPACE_Y6.forEach(file => {
    if (addSpaceY6Wrapper(file)) fixedCount++;
  });
  
  console.log(`\n✅ Fixed ${fixedCount} files`);
  console.log('\nNote: Some files require manual review (incomplete implementations, etc.)');
}

main();
