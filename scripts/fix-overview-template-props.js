#!/usr/bin/env node

/**
 * Fix OverviewTemplate Props Script
 * 
 * Adds translationNamespace prop to OverviewTemplateOrganism usage
 */

const fs = require('fs')
const path = require('path')

function getModuleName(filePath) {
  const basename = path.basename(filePath, '-overview-tab.tsx')
  // Extract module name from filename (e.g., 'members-overview-tab.tsx' -> 'members')
  return basename.replace('-overview-tab', '')
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  
  // Check if file uses OverviewTemplateOrganism
  if (!content.includes('OverviewTemplateOrganism')) {
    return 0
  }

  // Check if translationNamespace is already present
  if (content.includes('translationNamespace=')) {
    return 0
  }

  // Get the module name from the file path
  const parts = filePath.split(path.sep)
  const componentDir = parts[parts.length - 2] // e.g., 'admin', 'people', etc.
  const filename = path.basename(filePath, '.tsx')
  
  // Determine the namespace based on directory and filename
  let namespace = ''
  if (filename.includes('members-overview')) {
    namespace = 'admin.membersOverview'
  } else if (componentDir === 'companies') {
    namespace = 'companies.overview'
  } else if (componentDir === 'people') {
    namespace = 'people.overview'
  } else if (componentDir === 'locations') {
    namespace = 'locations.overview'
  } else if (componentDir === 'files') {
    namespace = 'files.overview'
  }

  if (!namespace) {
    return 0
  }

  // Add translationNamespace prop after the opening tag
  const pattern = /(<OverviewTemplateOrganism\s*\n)/
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
    } else if (file.endsWith('-overview-tab.tsx')) {
      fixedCount += fixFile(filePath)
    }
  })

  return fixedCount
}

// Main execution
console.log('🔧 Adding translationNamespace to OverviewTemplateOrganism...\n')

const componentsDir = path.join(__dirname, '..', 'src', 'components')
const fixedCount = scanDirectory(componentsDir)

console.log(`\n✅ Fixed ${fixedCount} files`)
