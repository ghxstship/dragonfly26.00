#!/usr/bin/env node

/**
 * Standardize Empty States Script
 * 
 * Updates all components to use the new standardized EmptyState molecule:
 * 1. Replace old EmptyState imports from shared/empty-state
 * 2. Remove all CTA props (actionLabel, onAction)
 * 3. Simplify to just description prop
 * 4. Update import to use molecules
 */

const fs = require('fs')
const path = require('path')

const componentsDir = path.join(__dirname, '../src/components')

// Files to update
const filesToUpdate = [
  // Data view organisms
  'organisms/data-views/BoardViewOrganism.tsx',
  'organisms/data-views/DataTableOrganism.tsx',
  'organisms/data-views/ListViewOrganism.tsx',
  'organisms/data-views/CalendarOrganism.tsx',
  'organisms/data-views/BoxViewOrganism.tsx',
  'organisms/data-views/PortfolioViewOrganism.tsx',
  'organisms/data-views/WorkloadViewOrganism.tsx',
  'organisms/data-views/CardGridOrganism.tsx',
  'organisms/data-views/ActivityViewOrganism.tsx',
  'organisms/data-views/TimelineOrganism.tsx',
  'organisms/data-views/PivotTableOrganism.tsx',
  
  // Shared components
  'shared/enhanced-table-view.tsx',
  
  // Tab components with hardcoded empty states
  'admin/plugins-tab.tsx',
  'events/events-run-of-show-tab.tsx',
  'events/events-tours-tab.tsx',
  'locations/locations-directory-tab.tsx',
  'locations/locations-site-maps-tab.tsx',
  'settings/automations-tab.tsx',
]

function updateFile(filePath) {
  const fullPath = path.join(componentsDir, filePath)
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Skipping ${filePath} (not found)`)
    return
  }
  
  let content = fs.readFileSync(fullPath, 'utf8')
  let modified = false
  
  // 1. Update import statement
  if (content.includes('from "@/components/shared/empty-state"')) {
    content = content.replace(
      /import\s+{\s*EmptyState\s*}\s+from\s+"@\/components\/shared\/empty-state"/g,
      'import { EmptyState } from "@/components/molecules"'
    )
    modified = true
  }
  
  // 2. Remove icon prop from EmptyState usage
  content = content.replace(
    /(<EmptyState[^>]*)\s+icon={[^}]+}/g,
    '$1'
  )
  
  // 3. Remove showIcon prop
  content = content.replace(
    /(<EmptyState[^>]*)\s+showIcon={[^}]+}/g,
    '$1'
  )
  
  // 4. Remove actionLabel prop
  content = content.replace(
    /(<EmptyState[^>]*)\s+actionLabel={[^}]+}/g,
    '$1'
  )
  
  // 5. Remove onAction prop
  content = content.replace(
    /(<EmptyState[^>]*)\s+onAction={[^}]+}/g,
    '$1'
  )
  
  // 6. Replace mainMessage with standardized approach (remove prop, use default)
  content = content.replace(
    /(<EmptyState[^>]*)\s+mainMessage={[^}]+}/g,
    '$1'
  )
  
  // 7. Clean up multiple spaces
  content = content.replace(/\s{2,}/g, ' ')
  
  // 8. Clean up empty lines in JSX
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n')
  
  if (modified || content !== fs.readFileSync(fullPath, 'utf8')) {
    fs.writeFileSync(fullPath, content, 'utf8')
    console.log(`✅ Updated ${filePath}`)
    return true
  }
  
  console.log(`⏭️  No changes needed for ${filePath}`)
  return false
}

// Main execution
console.log('🚀 Standardizing empty states across application...\n')

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
console.log(`   Errors: ${errorCount} files`)
console.log(`   Total: ${filesToUpdate.length} files processed`)
