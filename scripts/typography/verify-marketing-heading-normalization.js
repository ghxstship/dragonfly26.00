#!/usr/bin/env node

/**
 * Verify Marketing Section Heading Normalization
 * 
 * Confirms all section headings (except Hero) use the standard size:
 * text-2xl md:text-3xl lg:text-4xl
 */

const fs = require('fs')
const path = require('path')

const SECTIONS_DIR = path.join(__dirname, '../src/marketing/components/sections')
const STANDARD_HEADING = 'text-2xl md:text-3xl lg:text-4xl'

const sectionsToCheck = [
  { file: 'ProblemSection.tsx', name: 'Problem' },
  { file: 'SolutionSection.tsx', name: 'Solution' },
  { file: 'FeaturesOverviewSection.tsx', name: 'Features Overview' },
  { file: 'HowItWorksSection.tsx', name: 'How It Works' },
  { file: 'RolesSection.tsx', name: 'Roles' },
  { file: 'TestimonialsSection.tsx', name: 'Testimonials' },
  { file: 'SecuritySection.tsx', name: 'Security' },
  { file: 'FAQSection.tsx', name: 'FAQ' },
  { file: 'CTASection.tsx', name: 'CTA' }
]

console.log('🔍 Verifying Marketing Section Heading Normalization\n')
console.log(`Standard heading size: ${STANDARD_HEADING}\n`)

let allCorrect = true
let correctCount = 0

sectionsToCheck.forEach(section => {
  const filePath = path.join(SECTIONS_DIR, section.file)
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${section.name} - File not found`)
    allCorrect = false
    return
  }
  
  const content = fs.readFileSync(filePath, 'utf8')
  
  // Check for standard heading pattern
  const hasStandardHeading = content.includes(`<h2 className="${STANDARD_HEADING}`)
  
  // Check for duplicate classes (should not exist)
  const hasDuplicates = /text-2xl md:text-3xl lg:text-4xl md:text-3xl md:text-4xl lg:text-5xl/.test(content)
  
  // Check for oversized headings (should not exist in sections)
  const hasOversized = /text-3xl sm:text-4xl md:text-5xl lg:text-6xl/.test(content)
  
  if (hasStandardHeading && !hasDuplicates && !hasOversized) {
    console.log(`✅ ${section.name}`)
    correctCount++
  } else {
    console.log(`❌ ${section.name}`)
    if (!hasStandardHeading) console.log(`   Missing standard heading`)
    if (hasDuplicates) console.log(`   Has duplicate classes`)
    if (hasOversized) console.log(`   Has oversized heading`)
    allCorrect = false
  }
})

console.log(`\n${'='.repeat(50)}`)
console.log(`Results: ${correctCount}/${sectionsToCheck.length} sections normalized`)

if (allCorrect) {
  console.log('\n✨ SUCCESS! All marketing section headings are normalized.')
  console.log('\nSTANDARD HEADING:')
  console.log(`  ${STANDARD_HEADING}`)
  console.log('\nRESPONSIVE BEHAVIOR:')
  console.log('  Mobile:  text-2xl (24px)')
  console.log('  Tablet:  text-3xl (30px)')
  console.log('  Desktop: text-4xl (36px)')
  console.log('\nEXCLUDED: HeroSection (uses text-4xl sm:text-5xl md:text-6xl lg:text-7xl)')
  process.exit(0)
} else {
  console.log('\n❌ FAILED: Some sections still need normalization.')
  process.exit(1)
}
