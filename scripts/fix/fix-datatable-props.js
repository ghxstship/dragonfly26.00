#!/usr/bin/env node

/**
 * Fix DataTable Props Script
 * 
 * Removes invalid props from DataTableOrganism usage
 */

const fs = require('fs')
const path = require('path')

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  let modified = false

  // Check if file uses any organism components
  const hasOrganism = content.includes('Organism')
  if (!hasOrganism) {
    return 0
  }

  // Remove translationNamespace prop
  if (content.includes('translationNamespace=')) {
    content = content.replace(/\s+translationNamespace="[^"]+"\n?/g, '\n')
    modified = true
  }

  // Remove filterable prop
  if (content.includes('filterable')) {
    content = content.replace(/\s+filterable\n?/g, '\n')
    modified = true
  }

  // Remove exportable prop
  if (content.includes('exportable')) {
    content = content.replace(/\s+exportable\n?/g, '\n')
    modified = true
  }

  // Remove cardType prop
  if (content.includes('cardType=')) {
    content = content.replace(/\s+cardType="[^"]+"\n?/g, '\n')
    modified = true
  }

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
console.log('🔧 Fixing DataTable invalid props...\n')

const componentsDir = path.join(__dirname, '..', 'src', 'components')
const fixedCount = scanDirectory(componentsDir)

console.log(`\n✅ Fixed ${fixedCount} files`)
