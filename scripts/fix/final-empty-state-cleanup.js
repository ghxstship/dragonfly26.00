#!/usr/bin/env node

/**
 * Final Empty State Cleanup Script
 * 
 * Removes remaining mainMessage and actionLabel props from EmptyState components
 */

const fs = require('fs')
const path = require('path')

const componentsDir = path.join(__dirname, '../src/components')

const filesToFix = [
  'admin/plugins-tab.tsx',
  'events/events-run-of-show-tab.tsx',
  'events/events-tours-tab.tsx',
  'locations/locations-site-maps-tab.tsx',
  'settings/automations-tab.tsx',
  'shared/enhanced-table-view.tsx',
]

function fixFile(filePath) {
  const fullPath = path.join(componentsDir, filePath)
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Skipping ${filePath} (not found)`)
    return false
  }
  
  let content = fs.readFileSync(fullPath, 'utf8')
  const original = content
  
  // Remove mainMessage prop (handles both string literals and template expressions)
  content = content.replace(/\s+mainMessage="[^"]*"/g, '')
  content = content.replace(/\s+mainMessage={[^}]+}/g, '')
  
  // Remove actionLabel prop
  content = content.replace(/\s+actionLabel="[^"]*"/g, '')
  content = content.replace(/\s+actionLabel={[^}]+}/g, '')
  
  // Remove onAction prop
  content = content.replace(/\s+onAction={[^}]+}/g, '')
  
  // Remove icon prop
  content = content.replace(/\s+icon={[^}]+}/g, '')
  
  // Remove showIcon prop
  content = content.replace(/\s+showIcon={[^}]+}/g, '')
  
  // Fix orphaned closing braces
  content = content.replace(/}\s*\/>/g, '/>')
  
  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8')
    console.log(`✅ Fixed ${filePath}`)
    return true
  }
  
  console.log(`⏭️  No changes needed for ${filePath}`)
  return false
}

console.log('🔧 Final cleanup of EmptyState props...\n')

let fixedCount = 0

for (const file of filesToFix) {
  try {
    if (fixFile(file)) {
      fixedCount++
    }
  } catch (error) {
    console.error(`❌ Error fixing ${file}:`, error.message)
  }
}

console.log(`\n✨ Fixed ${fixedCount} files`)
