#!/usr/bin/env node

/**
 * Cleanup Empty State Formatting Script
 * 
 * Fixes formatting issues from the initial update:
 * 1. Remove orphaned mainMessage, actionLabel props
 * 2. Fix multi-line JSX formatting
 * 3. Clean up whitespace
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const componentsDir = path.join(__dirname, '../src/components')

// Find all files that still have EmptyState
const grepResult = execSync(
  `grep -r "EmptyState" ${componentsDir} --include="*.tsx" -l`,
  { encoding: 'utf8' }
)

const filesToClean = grepResult
  .trim()
  .split('\n')
  .filter(f => f && !f.includes('EmptyState.tsx'))
  .map(f => f.replace(componentsDir + '/', ''))

console.log(`🧹 Cleaning up ${filesToClean.length} files...\n`)

function cleanFile(filePath) {
  const fullPath = path.join(componentsDir, filePath)
  
  if (!fs.existsSync(fullPath)) {
    return false
  }
  
  let content = fs.readFileSync(fullPath, 'utf8')
  const original = content
  
  // Fix EmptyState JSX blocks - remove orphaned props
  // Pattern: <EmptyState ... mainMessage="..." ... />
  content = content.replace(
    /<EmptyState\s+([^>]*?)mainMessage="[^"]*"([^>]*?)\/>/g,
    (match, before, after) => {
      // Remove actionLabel if present
      let cleaned = before + after
      cleaned = cleaned.replace(/\s*actionLabel="[^"]*"/g, '')
      cleaned = cleaned.replace(/\s*actionLabel={[^}]+}/g, '')
      cleaned = cleaned.replace(/\s*onAction={[^}]+}/g, '')
      cleaned = cleaned.replace(/\s*icon={[^}]+}/g, '')
      cleaned = cleaned.replace(/\s*showIcon={[^}]+}/g, '')
      
      // Clean up extra spaces
      cleaned = cleaned.replace(/\s+/g, ' ').trim()
      
      return `<EmptyState ${cleaned} />`
    }
  )
  
  // Fix multi-line EmptyState blocks
  content = content.replace(
    /<EmptyState\s+([^>]*?)mainMessage="[^"]*"([^>]*?)>/g,
    (match, before, after) => {
      let cleaned = before + after
      cleaned = cleaned.replace(/\s*actionLabel="[^"]*"/g, '')
      cleaned = cleaned.replace(/\s*actionLabel={[^}]+}/g, '')
      cleaned = cleaned.replace(/\s*onAction={[^}]+}/g, '')
      cleaned = cleaned.replace(/\s*icon={[^}]+}/g, '')
      cleaned = cleaned.replace(/\s*showIcon={[^}]+}/g, '')
      cleaned = cleaned.replace(/\s+/g, ' ').trim()
      
      return `<EmptyState ${cleaned}>`
    }
  )
  
  // Remove closing /> that might be orphaned
  content = content.replace(/}\s*\/>/g, '\n              />')
  
  // Clean up extra newlines
  content = content.replace(/\n\n\n+/g, '\n\n')
  
  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8')
    console.log(`✅ Cleaned ${filePath}`)
    return true
  }
  
  return false
}

let cleanedCount = 0

for (const file of filesToClean) {
  try {
    if (cleanFile(file)) {
      cleanedCount++
    }
  } catch (error) {
    console.error(`❌ Error cleaning ${file}:`, error.message)
  }
}

console.log(`\n✨ Cleaned ${cleanedCount} files`)
