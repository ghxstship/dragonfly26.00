#!/usr/bin/env node

/**
 * Normalize Marketing Section Heading Sizes
 * 
 * OBJECTIVE: Standardize all section h2 headings to consistent size (excluding Hero)
 * 
 * STANDARD SIZE: text-2xl md:text-3xl lg:text-4xl
 * 
 * SECTIONS TO UPDATE:
 * - ProblemSection ✅ Already correct
 * - SolutionSection ✅ Already correct
 * - FeaturesOverviewSection ❌ text-3xl sm:text-4xl md:text-5xl lg:text-6xl (too large, using h1)
 * - HowItWorksSection ✅ Already correct
 * - RolesSection ❌ text-2xl md:text-3xl lg:text-4xl (missing responsive variants)
 * - TestimonialsSection ❌ text-2xl md:text-3xl lg:text-4xl md:text-3xl md:text-4xl lg:text-5xl (duplicates)
 * - SecuritySection ❌ text-2xl md:text-3xl lg:text-4xl md:text-3xl md:text-4xl lg:text-5xl (duplicates)
 * - FAQSection ❌ text-2xl md:text-3xl lg:text-4xl md:text-3xl md:text-4xl lg:text-5xl (duplicates)
 * - CTASection ❌ text-2xl md:text-3xl lg:text-4xl md:text-3xl md:text-4xl lg:text-5xl (duplicates)
 * 
 * EXCLUDED: HeroSection (intentionally larger)
 */

const fs = require('fs')
const path = require('path')

const SECTIONS_DIR = path.join(__dirname, '../src/marketing/components/sections')

// Standard heading size for all sections (except Hero)
const STANDARD_HEADING = 'text-2xl md:text-3xl lg:text-4xl'

const fixes = [
  {
    file: 'FeaturesOverviewSection.tsx',
    description: 'Change h1 to h2 and normalize size',
    oldPattern: /<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading uppercase text-gray-900 dark:text-white mb-6">/,
    newPattern: `<h2 className="${STANDARD_HEADING} font-heading uppercase text-gray-900 dark:text-white mb-6">`
  },
  {
    file: 'RolesSection.tsx',
    description: 'Normalize heading size',
    oldPattern: /<h2 className="text-2xl md:text-3xl lg:text-4xl text-gray-900 dark:text-white mb-6 font-heading uppercase">/,
    newPattern: `<h2 className="${STANDARD_HEADING} text-gray-900 dark:text-white mb-6 font-heading uppercase">`
  },
  {
    file: 'TestimonialsSection.tsx',
    description: 'Remove duplicate classes and normalize',
    oldPattern: /<h2 className="text-2xl md:text-3xl lg:text-4xl md:text-3xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white mb-6 font-heading uppercase">/,
    newPattern: `<h2 className="${STANDARD_HEADING} text-gray-900 dark:text-white mb-6 font-heading uppercase">`
  },
  {
    file: 'SecuritySection.tsx',
    description: 'Remove duplicate classes and normalize',
    oldPattern: /<h2 className="text-2xl md:text-3xl lg:text-4xl md:text-3xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white mb-6 font-heading uppercase">/,
    newPattern: `<h2 className="${STANDARD_HEADING} text-gray-900 dark:text-white mb-6 font-heading uppercase">`
  },
  {
    file: 'FAQSection.tsx',
    description: 'Remove duplicate classes and normalize',
    oldPattern: /<h2 className="text-2xl md:text-3xl lg:text-4xl md:text-3xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white mb-6 font-heading uppercase">/,
    newPattern: `<h2 className="${STANDARD_HEADING} text-gray-900 dark:text-white mb-6 font-heading uppercase">`
  },
  {
    file: 'CTASection.tsx',
    description: 'Remove duplicate classes and normalize',
    oldPattern: /<h2 className="text-2xl md:text-3xl lg:text-4xl md:text-3xl md:text-4xl lg:text-5xl text-white mb-6 font-heading uppercase">/,
    newPattern: `<h2 className="${STANDARD_HEADING} text-white mb-6 font-heading uppercase">`
  }
]

console.log('🎯 Normalizing Marketing Section Heading Sizes\n')
console.log(`Standard size: ${STANDARD_HEADING}\n`)

let totalFixed = 0

fixes.forEach(fix => {
  const filePath = path.join(SECTIONS_DIR, fix.file)
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${fix.file} - File not found`)
    return
  }
  
  let content = fs.readFileSync(filePath, 'utf8')
  
  if (content.match(fix.oldPattern)) {
    content = content.replace(fix.oldPattern, fix.newPattern)
    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`✅ ${fix.file}`)
    console.log(`   ${fix.description}`)
    totalFixed++
  } else {
    console.log(`⏭️  ${fix.file} - Already correct or pattern not found`)
  }
})

console.log(`\n✨ Complete! Fixed ${totalFixed}/${fixes.length} files`)
console.log('\nSTANDARD HEADING SIZE:')
console.log(`  ${STANDARD_HEADING}`)
console.log('\nRESPONSIVE BEHAVIOR:')
console.log('  Mobile:  text-2xl (24px)')
console.log('  Tablet:  text-3xl (30px)')
console.log('  Desktop: text-4xl (36px)')
console.log('\nEXCLUDED: HeroSection (intentionally larger with text-4xl sm:text-5xl md:text-6xl lg:text-7xl)')
