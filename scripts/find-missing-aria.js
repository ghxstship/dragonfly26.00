#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  
  // Check if file has ARIA attributes
  const hasAria = content.includes('aria-') || content.includes('role=')
  
  if (!hasAria) {
    return path.basename(filePath)
  }
  
  return null
}

function scanDirectory(dir) {
  const missing = []
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      missing.push(...scanDirectory(filePath))
    } else if (file.endsWith('-tab.tsx')) {
      const result = checkFile(filePath)
      if (result) {
        missing.push(filePath)
      }
    }
  })

  return missing
}

const componentsDir = path.join(__dirname, '..', 'src', 'components')
const missing = scanDirectory(componentsDir)

console.log(`\n📊 Components missing ARIA: ${missing.length}\n`)
missing.forEach(file => console.log(`  - ${file}`))
