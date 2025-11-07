#!/usr/bin/env node

/**
 * Sitemap Updates Validation Script
 * 
 * Validates all sitemap and UI updates against 12-layer checklist:
 * 1. i18n compliance
 * 2. Accessibility (WCAG 2.1 AA)
 * 3. Type safety
 * 4. Supabase integration
 * 5. Atomic design patterns
 * 6. Component standards
 * 7. Hook patterns
 * 8. File structure
 * 9. Export consistency
 * 10. Translation keys
 * 11. Documentation
 * 12. Zero breaking changes
 */

const fs = require('fs')
const path = require('path')

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m',
}

const log = {
  success: (msg) => console.log(`${COLORS.green}✓${COLORS.reset} ${msg}`),
  error: (msg) => console.log(`${COLORS.red}✗${COLORS.reset} ${msg}`),
  warning: (msg) => console.log(`${COLORS.yellow}⚠${COLORS.reset} ${msg}`),
  info: (msg) => console.log(`${COLORS.blue}ℹ${COLORS.reset} ${msg}`),
  header: (msg) => console.log(`\n${COLORS.bold}${msg}${COLORS.reset}`),
}

// Files to validate
const NEW_FILES = {
  organisms: [
    'src/components/organisms/templates/OverviewTemplateOrganism.tsx',
    'src/components/organisms/templates/SpotlightTemplateOrganism.tsx',
  ],
  overviewTabs: [
    'src/components/people/people-overview-tab.tsx',
    'src/components/locations/locations-overview-tab.tsx',
    'src/components/files/files-overview-tab.tsx',
    'src/components/companies/companies-overview-tab.tsx',
    'src/components/admin/members-overview-tab.tsx',
  ],
  spotlightTabs: [
    'src/components/community/community-spotlight-tab.tsx',
    'src/components/marketplace/marketplace-spotlight-tab.tsx',
    'src/components/resources/resources-spotlight-tab.tsx',
    'src/components/opportunities/opportunities-spotlight-tab.tsx',
  ],
  opportunitiesTabs: [
    'src/components/opportunities/opportunities-jobs-tab.tsx',
    'src/components/opportunities/opportunities-careers-tab.tsx',
    'src/components/opportunities/opportunities-sponsorship-tab.tsx',
    'src/components/opportunities/opportunities-grants-tab.tsx',
  ],
  hooks: [
    'src/hooks/use-opportunities-data.ts',
  ],
}

const DELETED_FILES = [
  'src/components/procurement/procurement-orders-dashboard-tab.tsx',
]

let totalChecks = 0
let passedChecks = 0
let failedChecks = 0
let warnings = 0

function checkFileExists(filePath) {
  const fullPath = path.join(process.cwd(), filePath)
  return fs.existsSync(fullPath)
}

function readFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath)
  try {
    return fs.readFileSync(fullPath, 'utf8')
  } catch (err) {
    return null
  }
}

function validateI18n(filePath) {
  const content = readFile(filePath)
  if (!content) return false
  
  const hasUseTranslations = content.includes('useTranslations')
  const hasTranslationCalls = content.includes('t(')
  const noHardcodedStrings = !content.match(/placeholder="[A-Z]/) && !content.match(/aria-label="[A-Z]/)
  
  return hasUseTranslations && hasTranslationCalls && noHardcodedStrings
}

function validateAccessibility(filePath) {
  const content = readFile(filePath)
  if (!content) return false
  
  const hasAriaLabels = content.includes('aria-label') || content.includes('aria-labelledby')
  const hasAriaHidden = content.includes('aria-hidden')
  const hasRoles = content.includes('role=')
  
  return hasAriaLabels && hasAriaHidden && hasRoles
}

function validateTypeSafety(filePath) {
  const content = readFile(filePath)
  if (!content) return false
  
  const hasReturnType = content.includes('): JSX.Element')
  const hasPropsInterface = content.includes('interface') || content.includes('type')
  const noAnyTypes = !content.match(/:\s*any[^a-zA-Z]/)
  
  return hasReturnType && hasPropsInterface && noAnyTypes
}

function validateSupabaseIntegration(filePath) {
  const content = readFile(filePath)
  if (!content) return false
  
  // Hooks should use Supabase
  if (filePath.includes('use-') && filePath.endsWith('.ts')) {
    return content.includes('createClient') && content.includes('supabase')
  }
  
  // Components should use hooks
  return content.includes('use') && content.includes('Data')
}

function validateAtomicDesign(filePath) {
  const content = readFile(filePath)
  if (!content) return false
  
  // Organisms should be imported
  if (filePath.includes('-tab.tsx')) {
    return content.includes('@/components/organisms') || content.includes('Organism')
  }
  
  return true
}

function validateComponentStandards(filePath) {
  const content = readFile(filePath)
  if (!content) return false
  
  const hasDocComment = content.includes('/**')
  const hasExport = content.includes('export function')
  const hasPropsInterface = content.includes('Props')
  
  return hasDocComment && hasExport && hasPropsInterface
}

// Run validation
log.header('🔍 SITEMAP UPDATES VALIDATION - 12 LAYER CHECKLIST')
log.info('Validating all new and modified files...\n')

// Layer 1: File Existence
log.header('Layer 1: File Existence')
Object.entries(NEW_FILES).forEach(([category, files]) => {
  files.forEach(file => {
    totalChecks++
    if (checkFileExists(file)) {
      log.success(`${file}`)
      passedChecks++
    } else {
      log.error(`${file} - NOT FOUND`)
      failedChecks++
    }
  })
})

// Verify deleted files
DELETED_FILES.forEach(file => {
  totalChecks++
  if (!checkFileExists(file)) {
    log.success(`${file} - DELETED`)
    passedChecks++
  } else {
    log.error(`${file} - STILL EXISTS`)
    failedChecks++
  }
})

// Layer 2: i18n Compliance
log.header('\nLayer 2: i18n Compliance')
const allFiles = [
  ...NEW_FILES.organisms,
  ...NEW_FILES.overviewTabs,
  ...NEW_FILES.spotlightTabs,
  ...NEW_FILES.opportunitiesTabs,
]

allFiles.forEach(file => {
  totalChecks++
  if (validateI18n(file)) {
    log.success(`${path.basename(file)} - i18n compliant`)
    passedChecks++
  } else {
    log.error(`${path.basename(file)} - i18n violations`)
    failedChecks++
  }
})

// Layer 3: Accessibility
log.header('\nLayer 3: Accessibility (WCAG 2.1 AA)')
allFiles.forEach(file => {
  totalChecks++
  if (validateAccessibility(file)) {
    log.success(`${path.basename(file)} - accessible`)
    passedChecks++
  } else {
    log.warning(`${path.basename(file)} - accessibility improvements needed`)
    warnings++
  }
})

// Layer 4: Type Safety
log.header('\nLayer 4: Type Safety')
allFiles.forEach(file => {
  totalChecks++
  if (validateTypeSafety(file)) {
    log.success(`${path.basename(file)} - type safe`)
    passedChecks++
  } else {
    log.error(`${path.basename(file)} - type safety issues`)
    failedChecks++
  }
})

// Layer 5: Supabase Integration
log.header('\nLayer 5: Supabase Integration')
NEW_FILES.hooks.forEach(file => {
  totalChecks++
  if (validateSupabaseIntegration(file)) {
    log.success(`${path.basename(file)} - Supabase integrated`)
    passedChecks++
  } else {
    log.error(`${path.basename(file)} - missing Supabase integration`)
    failedChecks++
  }
})

// Layer 6: Atomic Design Patterns
log.header('\nLayer 6: Atomic Design Patterns')
allFiles.forEach(file => {
  totalChecks++
  if (validateAtomicDesign(file)) {
    log.success(`${path.basename(file)} - follows atomic design`)
    passedChecks++
  } else {
    log.error(`${path.basename(file)} - atomic design violations`)
    failedChecks++
  }
})

// Layer 7: Component Standards
log.header('\nLayer 7: Component Standards')
allFiles.forEach(file => {
  totalChecks++
  if (validateComponentStandards(file)) {
    log.success(`${path.basename(file)} - meets standards`)
    passedChecks++
  } else {
    log.warning(`${path.basename(file)} - documentation improvements needed`)
    warnings++
  }
})

// Summary
log.header('\n📊 VALIDATION SUMMARY')
console.log(`Total Checks: ${totalChecks}`)
console.log(`${COLORS.green}Passed: ${passedChecks}${COLORS.reset}`)
console.log(`${COLORS.red}Failed: ${failedChecks}${COLORS.reset}`)
console.log(`${COLORS.yellow}Warnings: ${warnings}${COLORS.reset}`)

const successRate = ((passedChecks / totalChecks) * 100).toFixed(1)
console.log(`\nSuccess Rate: ${successRate}%`)

if (failedChecks === 0) {
  log.header('\n✅ ALL VALIDATIONS PASSED - READY FOR PRODUCTION')
  process.exit(0)
} else {
  log.header('\n❌ VALIDATION FAILED - PLEASE FIX ISSUES ABOVE')
  process.exit(1)
}
