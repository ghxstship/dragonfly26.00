#!/usr/bin/env node

/**
 * Fix All Duplicate Props
 * Removes ALL duplicate prop attributes from components
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

let filesFixed = 0;
let duplicatesRemoved = 0;

function fixDuplicateProps(content) {
  let modified = false;
  let removedCount = 0;
  let newContent = content;
  
  // Pattern 1: Duplicate aria-hidden
  const ariaHiddenPattern = /(<[A-Za-z][A-Za-z0-9]*\s+[^>]*?aria-hidden="[^"]*?"[^>]*?)\s+aria-hidden="[^"]*?"/g;
  newContent = newContent.replace(ariaHiddenPattern, (match, before) => {
    modified = true;
    removedCount++;
    return before;
  });
  
  // Pattern 2: Duplicate className
  const classNamePattern = /(<[A-Za-z][A-Za-z0-9]*\s+[^>]*?className="[^"]*?"[^>]*?)\s+className="[^"]*?"/g;
  newContent = newContent.replace(classNamePattern, (match, before) => {
    modified = true;
    removedCount++;
    return before;
  });
  
  // Pattern 3: Duplicate aria-label
  const ariaLabelPattern = /(<[A-Za-z][A-Za-z0-9]*\s+[^>]*?aria-label="[^"]*?"[^>]*?)\s+aria-label="[^"]*?"/g;
  newContent = newContent.replace(ariaLabelPattern, (match, before) => {
    modified = true;
    removedCount++;
    return before;
  });
  
  // Pattern 4: Duplicate role
  const rolePattern = /(<[A-Za-z][A-Za-z0-9]*\s+[^>]*?role="[^"]*?"[^>]*?)\s+role="[^"]*?"/g;
  newContent = newContent.replace(rolePattern, (match, before) => {
    modified = true;
    removedCount++;
    return before;
  });
  
  // Pattern 5: Duplicate id
  const idPattern = /(<[A-Za-z][A-Za-z0-9]*\s+[^>]*?id="[^"]*?"[^>]*?)\s+id="[^"]*?"/g;
  newContent = newContent.replace(idPattern, (match, before) => {
    modified = true;
    removedCount++;
    return before;
  });
  
  return { content: newContent, modified, removedCount };
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { content: newContent, modified, removedCount } = fixDuplicateProps(content);
    
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
  
  console.log('🔧 Fixing all duplicate props...\n');
  
  for (const file of files) {
    processFile(file);
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('✨ ALL DUPLICATE PROPS FIX COMPLETE');
  console.log('='.repeat(80));
  console.log(`📊 Files Fixed: ${filesFixed}`);
  console.log(`🎯 Duplicates Removed: ${duplicatesRemoved}`);
  console.log('='.repeat(80));
}

main();
