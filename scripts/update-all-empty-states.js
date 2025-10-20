#!/usr/bin/env node

/**
 * Update All Empty States Script
 * 
 * Systematically updates ALL empty state usages across the application:
 * 1. Update imports from shared/empty-state to molecules
 * 2. Remove all CTA-related props (icon, mainMessage, actionLabel, onAction, showIcon)
 * 3. Rename emptyMessage to emptyDescription
 * 4. Keep only variant and description props
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const componentsDir = path.join(__dirname, '../src/components')

// Find all files that import EmptyState
console.log('🔍 Finding all files with EmptyState usage...\n')

const grepResult = execSync(
  `grep -r "EmptyState" ${componentsDir} --include="*.tsx" --include="*.ts" -l`,
  { encoding: 'utf8' }
)

const filesToUpdate = grepResult
  .trim()
  .split('\n')
  .filter(f => f && !f.includes('EmptyState.tsx')) // Exclude the component itself
  .map(f => f.replace(componentsDir + '/', ''))

console.log(`Found ${filesToUpdate.length} files to update:\n`)
filesToUpdate.forEach(f => console.log(`  - ${f}`))
console.log()

function updateFile(filePath) {
  const fullPath = path.join(componentsDir, filePath)
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Skipping ${filePath} (not found)`)
    return false
  }
  
  let content = fs.readFileSync(fullPath, 'utf8')
  const original = content
  
  // 1. Update import statement
  content = content.replace(
    /import\s+{\s*EmptyState\s*}\s+from\s+"@\/components\/shared\/empty-state"/g,
    'import { EmptyState } from "@/components/molecules"'
  )
  
  // 2. Remove icon prop (with various icon components)
  content = content.replace(
    /\s+icon={[^}]+}/g,
    ''
  )
  
  // 3. Remove showIcon prop
  content = content.replace(
    /\s+showIcon={[^}]+}/g,
    ''
  )
  
  // 4. Replace mainMessage with nothing (use default)
  content = content.replace(
    /\s+mainMessage={[^}]+}/g,
    ''
  )
  
  // 5. Remove actionLabel prop
  content = content.replace(
    /\s+actionLabel={[^}]+}/g,
    ''
  )
  
  // 6. Remove onAction prop
  content = content.replace(
    /\s+onAction={[^}]+}/g,
    ''
  )
  
  // 7. Rename emptyMessage to emptyDescription in props
  content = content.replace(
    /emptyMessage\?:/g,
    'emptyDescription?:'
  )
  content = content.replace(
    /emptyMessage,/g,
    'emptyDescription,'
  )
  content = content.replace(
    /emptyMessage\s*\|\|/g,
    'emptyDescription ||'
  )
  
  // 8. Remove emptyAction and emptyActionLabel from interfaces
  content = content.replace(
    /\s+emptyAction\?:\s*\(\)\s*=>\s*void\n/g,
    '\n'
  )
  content = content.replace(
    /\s+emptyActionLabel\?:\s*string\n/g,
    '\n'
  )
  
  // 9. Remove from function params
  content = content.replace(
    /,?\s*emptyAction,?/g,
    ''
  )
  content = content.replace(
    /,?\s*emptyActionLabel,?/g,
    ''
  )
  
  // 10. Clean up multiple commas
  content = content.replace(/,\s*,/g, ',')
  
  // 11. Clean up trailing commas before closing braces
  content = content.replace(/,(\s*})/g, '$1')
  
  // 12. Clean up multiple spaces
  content = content.replace(/  +/g, ' ')
  
  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8')
    console.log(`✅ Updated ${filePath}`)
    return true
  }
  
  console.log(`⏭️  No changes needed for ${filePath}`)
  return false
}

// Main execution
console.log('🚀 Starting empty state standardization...\n')

let updatedCount = 0
let errorCount = 0

for (const file of filesToUpdate) {
  try {
    if (updateFile(file)) {
      updatedCount++
    }
  } catch (error) {
    console.error(`❌ Error updating ${file}:`, error.message)
    errorCount++
  }
}

console.log(`\n✨ Complete!`)
console.log(`   Updated: ${updatedCount} files`)
console.log(`   Skipped: ${filesToUpdate.length - updatedCount - errorCount} files`)
console.log(`   Errors: ${errorCount} files`)
console.log(`   Total: ${filesToUpdate.length} files processed`)
