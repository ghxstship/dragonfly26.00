#!/usr/bin/env node

/**
 * ADD I18N TO ALL MARKETING COMPONENTS
 * Automatically adds useTranslations import and hook to all marketing section components
 */

const fs = require('fs')
const path = require('path')

const SECTIONS_DIR = path.join(__dirname, '../src/marketing/components/sections')

const componentsToUpdate = [
  'CTASection.tsx',
  'DetailedFeaturesSection.tsx',
  'DetailedPricingSection.tsx',
  'FAQSection.tsx',
  'FeaturesOverviewSection.tsx',
  'HeroSection.tsx',
  'HowItWorksSection.tsx',
  'IntegrationsSection.tsx',
  'PricingSection.tsx',
  'ProblemSection.tsx',
  'RolesSection.tsx',
  'SecuritySection.tsx',
  'SolutionSection.tsx',
  'SolutionsSection.tsx',
  'TestimonialsSection.tsx',
  'TrustBar.tsx'
]

let updatedCount = 0
let skippedCount = 0
let errorCount = 0

console.log('🔧 Adding i18n to marketing components...\n')

componentsToUpdate.forEach(filename => {
  const filePath = path.join(SECTIONS_DIR, filename)
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${filename} - FILE NOT FOUND`)
    errorCount++
    return
  }
  
  let content = fs.readFileSync(filePath, 'utf-8')
  
  // Check if already has useTranslations
  if (content.includes('useTranslations')) {
    console.log(`⏭️  ${filename} - Already has i18n`)
    skippedCount++
    return
  }
  
  // Add import if not present
  if (!content.includes('import { useTranslations } from "next-intl"')) {
    // Find the last import statement
    const importLines = content.split('\n').filter(line => line.trim().startsWith('import'))
    if (importLines.length > 0) {
      const lastImport = importLines[importLines.length - 1]
      content = content.replace(lastImport, `${lastImport}\nimport { useTranslations } from "next-intl"`)
    } else {
      // Add after "use client" if present
      if (content.includes('"use client"')) {
        content = content.replace('"use client"', '"use client"\n\nimport { useTranslations } from "next-intl"')
      } else {
        // Add at the top
        content = 'import { useTranslations } from "next-intl"\n\n' + content
      }
    }
  }
  
  // Add hook inside the component function
  // Find the component function declaration
  const componentMatch = content.match(/export\s+(?:default\s+)?function\s+(\w+)\s*\([^)]*\)\s*(?::\s*JSX\.Element\s*)?\{/)
  
  if (componentMatch) {
    const componentName = componentMatch[1]
    const hookLine = `  const t = useTranslations('marketing')`
    
    // Check if hook already exists
    if (!content.includes(hookLine)) {
      // Insert after the opening brace of the function
      const insertPosition = componentMatch.index + componentMatch[0].length
      content = content.slice(0, insertPosition) + '\n' + hookLine + '\n' + content.slice(insertPosition)
    }
  }
  
  // Write back
  fs.writeFileSync(filePath, content)
  console.log(`✅ ${filename} - i18n added`)
  updatedCount++
})

console.log('\n' + '='.repeat(80))
console.log(`\n📊 SUMMARY:`)
console.log(`  Updated: ${updatedCount}`)
console.log(`  Skipped: ${skippedCount}`)
console.log(`  Errors: ${errorCount}`)
console.log(`  Total: ${componentsToUpdate.length}`)

if (updatedCount > 0) {
  console.log(`\n✅ Successfully added i18n imports and hooks to ${updatedCount} components`)
  console.log(`\n⚠️  NOTE: You still need to replace hardcoded strings with t() calls manually or with another script`)
}

process.exit(errorCount > 0 ? 1 : 0)
