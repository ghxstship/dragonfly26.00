#!/usr/bin/env node

/**
 * Fix Missing ARIA Attributes
 * 
 * Adds ARIA attributes to components that are missing them
 */

const fs = require('fs')
const path = require('path')

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  let modified = false

  // Check if file already has ARIA attributes
  if (content.includes('aria-') || content.includes('role=')) {
    return 0
  }

  // Add role="main" and aria-label to the main container
  const mainDivPattern = /return \(\s*<div className="space-y-4">/
  if (mainDivPattern.test(content)) {
    content = content.replace(
      mainDivPattern,
      'return (\n    <div role="main" aria-label="Tab content" className="space-y-4">'
    )
    modified = true
  }

  // Add aria-hidden to icons
  const iconPattern = /<([A-Z][a-zA-Z]+) className="([^"]*h-[45])/g
  content = content.replace(iconPattern, (match, iconName, className) => {
    if (!match.includes('aria-hidden')) {
      modified = true
      return `<${iconName} className="${className}" aria-hidden="true"`
    }
    return match
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
console.log('🔧 Adding missing ARIA attributes...\n')

const componentsDir = path.join(__dirname, '..', 'src', 'components')
const fixedCount = scanDirectory(componentsDir)

console.log(`\n✅ Fixed ${fixedCount} files`)
