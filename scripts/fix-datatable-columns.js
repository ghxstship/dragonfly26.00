#!/usr/bin/env node

/**
 * Fix DataTable Columns Script
 * 
 * Converts labelKey to label in DataTableOrganism column definitions
 */

const fs = require('fs')
const path = require('path')

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  let modified = false

  // Pattern: { key: 'xxx', labelKey: 'xxx', ... }
  // Replace with: { key: 'xxx', label: t('xxx'), ... }
  
  // First check if file uses DataTableOrganism
  if (!content.includes('DataTableOrganism')) {
    return 0
  }

  // Check if it has labelKey in column definitions
  if (!content.includes('labelKey:')) {
    return 0
  }

  // Replace labelKey with label and wrap value in t()
  const labelKeyPattern = /labelKey:\s*['"]([^'"]+)['"]/g
  content = content.replace(labelKeyPattern, (match, key) => {
    modified = true
    return `label: t('${key}')`
  })

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`✅ Fixed: ${path.basename(filePath)}`)
    return 1
  }

  return 0
}

function scanDirectory(dir) {
  let fixedCount = 0
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      fixedCount += scanDirectory(filePath)
    } else if (file.endsWith('-tab.tsx')) {
      fixedCount += fixFile(filePath)
    }
  })

  return fixedCount
}

// Main execution
console.log('🔧 Fixing DataTable column definitions...\n')

const componentsDir = path.join(__dirname, '..', 'src', 'components')
const fixedCount = scanDirectory(componentsDir)

console.log(`\n✅ Fixed ${fixedCount} files`)
