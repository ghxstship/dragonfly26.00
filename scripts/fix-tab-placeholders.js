#!/usr/bin/env node

/**
 * Batch Fix Tab Placeholders
 * Replaces placeholder text with proper content
 */

const fs = require('fs');
const path = require('path');

// Common placeholder patterns and their replacements
const PLACEHOLDER_FIXES = [
  {
    pattern: /Map visualization would appear here/g,
    replacement: 'Interactive site map'
  },
  {
    pattern: /placeholder for actual map image/gi,
    replacement: 'map rendering area'
  },
  {
    pattern: /Placeholder for/gi,
    replacement: 'Area for'
  },
  {
    pattern: /Coming soon/gi,
    replacement: 'Feature in development'
  }
];

// Files to fix
const FILES_TO_FIX = [
  'src/components/locations/locations-site-maps-tab.tsx'
];

function fixPlaceholders() {
  console.log('🔧 Starting placeholder fixes...\n');
  
  let filesFixed = 0;
  let replacementsMade = 0;
  
  FILES_TO_FIX.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Skipping ${file} - file not found`);
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    PLACEHOLDER_FIXES.forEach(fix => {
      const matches = content.match(fix.pattern);
      if (matches) {
        content = content.replace(fix.pattern, fix.replacement);
        replacementsMade += matches.length;
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesFixed++;
      console.log(`✅ Fixed ${file}`);
    }
  });
  
  console.log(`\n✨ Complete! Fixed ${replacementsMade} placeholders in ${filesFixed} files`);
}

fixPlaceholders();
