#!/usr/bin/env node

/**
 * Fix Duplicate aria-hidden Attributes
 * Removes duplicate aria-hidden="true" attributes from components
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

let filesFixed = 0;
let duplicatesRemoved = 0;

function fixDuplicateAriaHidden(content) {
  let modified = false;
  let removedCount = 0;
  
  // Pattern: matches elements with duplicate aria-hidden="true"
  // Example: <Icon aria-hidden="true" className="..." aria-hidden="true" />
  const pattern = /(<[A-Z][a-zA-Z0-9]*\s+[^>]*?aria-hidden="true"[^>]*?)\s+aria-hidden="true"/g;
  
  const newContent = content.replace(pattern, (match, before) => {
    modified = true;
    removedCount++;
    return before;
  });
  
  return { content: newContent, modified, removedCount };
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { content: newContent, modified, removedCount } = fixDuplicateAriaHidden(content);
    
    if (modified) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
      filesFixed++;
      duplicatesRemoved += removedCount;
      console.log(`✅ Fixed ${removedCount} duplicate(s) in: ${path.relative(ROOT_DIR, filePath)}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function findFiles(dir, pattern) {
  const files = [];
  
  function traverse(currentDir) {
    try {
      const items = fs.readdirSync(currentDir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item.name);
        
        if (item.isDirectory()) {
          if (!item.name.startsWith('.') && item.name !== 'node_modules') {
            traverse(fullPath);
          }
        } else if (pattern.test(item.name)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${currentDir}:`, error.message);
    }
  }
  
  traverse(dir);
  return files;
}

function main() {
  console.log('🔍 Finding TypeScript/TSX files...\n');
  
  const files = findFiles(SRC_DIR, /\.(tsx?|jsx?)$/);
  console.log(`📁 Found ${files.length} files\n`);
  
  console.log('🔧 Fixing duplicate aria-hidden attributes...\n');
  
  for (const file of files) {
    processFile(file);
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('✨ DUPLICATE ARIA-HIDDEN FIX COMPLETE');
  console.log('='.repeat(80));
  console.log(`📊 Files Fixed: ${filesFixed}`);
  console.log(`🎯 Duplicates Removed: ${duplicatesRemoved}`);
  console.log('='.repeat(80));
}

main();
