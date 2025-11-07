#!/usr/bin/env node

/**
 * Fix SpotlightTemplate Props Script
 * 
 * Adds translationNamespace prop to SpotlightTemplateOrganism usage
 */

const fs = require('fs')
const path = require('path')

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  
  // Check if file uses SpotlightTemplateOrganism
  if (!content.includes('SpotlightTemplateOrganism')) {
    return 0
  }

  // Check if translationNamespace is already present
  if (content.includes('translationNamespace=')) {
    return 0
  }

  // Get the module name from the file path
  const parts = filePath.split(path.sep)
  const componentDir = parts[parts.length - 2] // e.g., 'community', 'marketplace', etc.
  const filename = path.basename(filePath, '.tsx')
  
  // Determine the namespace based on directory
  let namespace = ''
  if (componentDir === 'community') {
    namespace = 'community.spotlight'
  } else if (componentDir === 'marketplace') {
    namespace = 'marketplace.spotlight'
  } else if (componentDir === 'resources') {
    namespace = 'resources.spotlight'
  } else if (componentDir === 'opportunities') {
    namespace = 'opportunities.spotlight'
  }

  if (!namespace) {
    return 0
  }

  // Add translationNamespace prop after the opening tag
  const pattern = /(<SpotlightTemplateOrganism\s*\n)/
  if (pattern.test(content)) {
    content = content.replace(pattern, `$1      translationNamespace="${namespace}"\n`)
    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`✅ Fixed: ${path.basename(filePath)} (namespace: ${namespace})`)
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
    } else if (file.endsWith('-spotlight-tab.tsx')) {
      fixedCount += fixFile(filePath)
    }
  })

  return fixedCount
}

// Main execution
console.log('🔧 Adding translationNamespace to SpotlightTemplateOrganism...\n')

const componentsDir = path.join(__dirname, '..', 'src', 'components')
const fixedCount = scanDirectory(componentsDir)

console.log(`\n✅ Fixed ${fixedCount} files`)
