#!/usr/bin/env node

/**
 * UPDATE ALL MARKETING COMPONENTS WITH I18N
 * Systematically updates all marketing components to use translation keys
 */

const fs = require('fs')
const path = require('path')

const SECTIONS_DIR = path.join(__dirname, '../src/marketing/components/sections')

// Mapping of hardcoded strings to translation keys
const replacements = {
  // DetailedPricingSection.tsx
  'DetailedPricingSection.tsx': [
    { find: '"ATLVS Pricing"', replace: '{t("pricing.title")}' },
    { find: '"Choose the perfect plan for your production needs"', replace: '{t("pricing.subtitle")}' },
    { find: '"Save 2 Months"', replace: '{t("pricing.save20")}' },
    { find: '"Monthly"', replace: '{t("pricing.monthly")}', context: 'billing toggle' },
    { find: '"Annual"', replace: '{t("pricing.annually")}', context: 'billing toggle' },
    { find: '"Community"', replace: '{t("pricing.community.name")}', context: 'tier name' },
    { find: '"Free"', replace: '{t("pricing.community.price")}', context: 'price' },
    { find: '"Forever"', replace: '{t("pricing.community.period")}', context: 'period' },
    { find: '"Perfect for getting started"', replace: '{t("pricing.community.description")}' },
    { find: '"Get Started"', replace: '{t("pricing.community.cta")}', context: 'button' },
    { find: '"Pro"', replace: '{t("pricing.pro.name")}', context: 'tier name' },
    { find: '"Independent Contractor"', replace: '{t("pricing.pro.description")}' },
    { find: '"Team"', replace: '{t("pricing.team.name")}', context: 'tier name' },
    { find: '"Most Popular"', replace: '{t("pricing.team.badge")}' },
    { find: '"Enterprise"', replace: '{t("pricing.enterprise.name")}', context: 'tier name' },
  ],
  
  // HeroSection.tsx
  'HeroSection.tsx': [
    { find: '"Production Management That Actually Works"', replace: '{t("hero.headline")}' },
    { find: '"For Experiential Teams"', replace: '{t("hero.headlineHighlight")}' },
    { find: '"Start Free Today"', replace: '{t("hero.ctaPrimary")}' },
    { find: '"See It in Action"', replace: '{t("hero.ctaSecondary")}' },
  ],
  
  // FAQSection.tsx
  'FAQSection.tsx': [
    { find: '"Frequently Asked Questions"', replace: '{t("faq.title")}' },
    { find: '"Everything you need to know"', replace: '{t("faq.subtitle")}' },
  ],
  
  // CTASection.tsx
  'CTASection.tsx': [
    { find: '"Ready to Transform Your Production Workflow?"', replace: '{t("cta.title")}' },
    { find: '"Join thousands of production professionals using ATLVS"', replace: '{t("cta.subtitle")}' },
    { find: '"Start Free Trial"', replace: '{t("cta.primary")}' },
    { find: '"Schedule Demo"', replace: '{t("cta.secondary")}' },
    { find: '"No credit card required"', replace: '{t("cta.noCard")}' },
  ],
  
  // TrustBar.tsx
  'TrustBar.tsx': [
    { find: '"Trusted by production teams worldwide"', replace: '{t("trustBar.trustedBy")}' },
  ],
  
  // ProblemSection.tsx
  'ProblemSection.tsx': [
    { find: '"The Production Chaos Problem"', replace: '{t("problem.title")}' },
    { find: '"You know the drill"', replace: '{t("problem.subtitle")}' },
  ],
  
  // SolutionSection.tsx
  'SolutionSection.tsx': [
    { find: '"One Platform. Zero Chaos."', replace: '{t("solution.title")}' },
    { find: '"Everything in its right place"', replace: '{t("solution.subtitle")}' },
  ],
  
  // HowItWorksSection.tsx
  'HowItWorksSection.tsx': [
    { find: '"How It Works"', replace: '{t("howItWorks.title")}' },
    { find: '"Set sail in minutes, not months"', replace: '{t("howItWorks.subtitle")}' },
  ],
  
  // SecuritySection.tsx
  'SecuritySection.tsx': [
    { find: '"Enterprise-Grade Security"', replace: '{t("security.title")}' },
    { find: '"Your data is protected at every level"', replace: '{t("security.subtitle")}' },
  ],
  
  // TestimonialsSection.tsx
  'TestimonialsSection.tsx': [
    { find: '"Trusted by Production Teams Worldwide"', replace: '{t("testimonials.title")}' },
    { find: '"Real stories from real producers"', replace: '{t("testimonials.subtitle")}' },
  ],
}

console.log('🔧 Updating marketing components with i18n...\n')

let totalReplacements = 0
let filesUpdated = 0

Object.entries(replacements).forEach(([filename, fileReplacements]) => {
  const filePath = path.join(SECTIONS_DIR, filename)
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${filename} - FILE NOT FOUND`)
    return
  }
  
  let content = fs.readFileSync(filePath, 'utf-8')
  let replacementCount = 0
  
  fileReplacements.forEach(({ find, replace, context }) => {
    const regex = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
    const matches = content.match(regex)
    
    if (matches) {
      content = content.replace(regex, replace)
      replacementCount += matches.length
      console.log(`  ✓ ${find} → ${replace}${context ? ` (${context})` : ''}`)
    }
  })
  
  if (replacementCount > 0) {
    fs.writeFileSync(filePath, content)
    console.log(`✅ ${filename} - ${replacementCount} replacements\n`)
    filesUpdated++
    totalReplacements += replacementCount
  } else {
    console.log(`⏭️  ${filename} - No changes needed\n`)
  }
})

console.log('='.repeat(80))
console.log(`\n📊 SUMMARY:`)
console.log(`  Files updated: ${filesUpdated}`)
console.log(`  Total replacements: ${totalReplacements}`)
console.log(`\n⚠️  NOTE: This script handles common strings. Manual review needed for:`)
console.log(`  - Complex nested strings`)
console.log(`  - Dynamic content`)
console.log(`  - Role abilities and feature lists`)
console.log(`\n🎯 NEXT: Review updated files and handle remaining hardcoded strings`)

process.exit(0)
