#!/usr/bin/env node

/**
 * AGGRESSIVE REMOVAL OF ALL ACTION BUTTONS FROM TAB COMPONENTS
 * 
 * This script removes ALL button-related code from tab components
 * Tab components should ONLY display data, not have action buttons
 */

const fs = require('fs');
const path = require('path');

const MODULES = [
  'dashboard', 'projects', 'events', 'people', 'assets', 'locations', 'files',
  'admin', 'settings', 'profile', 'companies', 'community', 'marketplace',
  'resources', 'finance', 'procurement', 'jobs', 'reports', 'analytics', 'insights'
];

const results = {
  modified: 0,
  skipped: 0,
  errors: 0
};

function removeAllActionButtons(content) {
  let modified = content;
  
  // Remove all sections with action buttons (comprehensive patterns)
  const patterns = [
    // Action button sections with comments
    /\/\*\s*Action Buttons.*?\*\/[\s\S]*?(?=\n\s*{?\/\*|<div|<Card|<section|$)/gi,
    
    // Flex containers with buttons at the top of components
    /<div[^>]*className="[^"]*flex[^"]*items-center[^"]*justify-between[^"]*"[^>]*>[\s\S]*?<Button[\s\S]*?<\/div>/gi,
    /<div[^>]*className="[^"]*flex[^"]*justify-end[^"]*"[^>]*>[\s\S]*?<Button[\s\S]*?<\/div>/gi,
    /<div[^>]*className="[^"]*flex[^"]*gap-[^"]*"[^>]*>[\s\S]*?<Button[\s\S]*?<\/div>/gi,
    
    // Section elements with role="region" containing buttons
    /<section[^>]*role="region"[^>]*aria-labelledby="[^"]*actions[^"]*"[^>]*>[\s\S]*?<\/section>/gi,
    
    // Any standalone Button imports and usage (but keep the import statement)
    // We'll handle this more carefully
  ];
  
  patterns.forEach(pattern => {
    modified = modified.replace(pattern, '');
  });
  
  // Remove empty divs
  modified = modified.replace(/<div[^>]*>\s*<\/div>/gi, '');
  
  // Clean up multiple blank lines
  modified = modified.replace(/\n\n\n+/g, '\n\n');
  
  // Remove trailing whitespace
  modified = modified.replace(/[ \t]+$/gm, '');
  
  return modified;
}

function processFile(moduleName, fileName) {
  const filePath = path.join(__dirname, '..', 'src', 'components', moduleName, fileName);
  
  try {
    const original = fs.readFileSync(filePath, 'utf8');
    const modified = removeAllActionButtons(original);
    
    if (original !== modified) {
      fs.writeFileSync(filePath, modified, 'utf8');
      console.log(`✓ ${moduleName}/${fileName}`);
      results.modified++;
    } else {
      results.skipped++;
    }
  } catch (error) {
    console.error(`✗ ${moduleName}/${fileName}: ${error.message}`);
    results.errors++;
  }
}

function processModule(moduleName) {
  const componentDir = path.join(__dirname, '..', 'src', 'components', moduleName);
  
  if (!fs.existsSync(componentDir)) {
    return;
  }
  
  const files = fs.readdirSync(componentDir).filter(f => f.endsWith('-tab.tsx'));
  files.forEach(file => processFile(moduleName, file));
}

console.log('🔧 AGGRESSIVE ACTION BUTTON REMOVAL\n');
console.log('Removing ALL action button sections from tab components...\n');

MODULES.forEach(processModule);

console.log(`\n📊 RESULTS:`);
console.log(`✅ Modified: ${results.modified}`);
console.log(`⏭️  Skipped: ${results.skipped}`);
console.log(`❌ Errors: ${results.errors}\n`);
