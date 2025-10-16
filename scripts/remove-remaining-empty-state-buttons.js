#!/usr/bin/env node

/**
 * Remove remaining buttons from empty states
 * These are buttons that appear inside empty state divs
 */

const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/components/events/events-itineraries-tab.tsx',
  'src/components/events/events-reservations-tab.tsx',
  'src/components/events/events-shipping-receiving-tab.tsx',
  'src/components/files/files-all-documents-tab.tsx',
  'src/components/files/files-call-sheets-tab.tsx',
  'src/components/files/files-insurance-permits-tab.tsx',
  'src/components/files/files-media-assets-tab.tsx',
  'src/components/files/files-production-reports-tab.tsx',
  'src/components/locations/locations-coordination-tab.tsx',
  'src/components/locations/locations-spatial-features-tab.tsx',
  'src/components/locations/locations-warehousing-tab.tsx',
  'src/components/people/people-assignments-tab.tsx',
  'src/components/people/people-timekeeping-tab.tsx',
  'src/components/profile/endorsements-tab.tsx',
];

let fixed = 0;

filesToFix.forEach(filePath => {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf-8');
  const original = content;
  
  // Pattern: Remove button from empty state while keeping the text
  // Match: <p>...mb-4</p>\n<Button>...</Button>
  const pattern = /(<p className="text-sm[^>]*>.*?<\/p>)\s*<Button[^>]*>[\s\S]*?<\/Button>/g;
  
  content = content.replace(pattern, (match, paragraph) => {
    // Remove mb-4 from paragraph and return just the paragraph
    return paragraph.replace(/mb-4/, '');
  });
  
  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`✅ Fixed: ${filePath}`);
    fixed++;
  } else {
    console.log(`ℹ️  No changes: ${filePath}`);
  }
});

console.log(`\n✅ Fixed ${fixed} files`);
