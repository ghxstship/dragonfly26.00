#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const filesToFix = [
  'src/components/admin/members-overview-tab.tsx',
  'src/components/community/community-spotlight-tab.tsx',
  'src/components/companies/companies-overview-tab.tsx',
  'src/components/files/files-overview-tab.tsx',
  'src/components/locations/locations-overview-tab.tsx',
  'src/components/marketplace/marketplace-spotlight-tab.tsx',
  'src/components/opportunities/opportunities-spotlight-tab.tsx',
  'src/components/people/people-overview-tab.tsx',
  'src/components/resources/resources-spotlight-tab.tsx',
]

function fixSyntax(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  
  // Fix duplicate closing tags for OverviewTemplateOrganism
  content = content.replace(
    /(<\/OverviewTemplateOrganism>)\s*<\/OverviewTemplateOrganism>/g,
    '$1'
  )
  
  // Fix duplicate closing tags for SpotlightTemplateOrganism
  content = content.replace(
    /(<\/SpotlightTemplateOrganism>)\s*<\/SpotlightTemplateOrganism>/g,
    '$1'
  )
  
  fs.writeFileSync(filePath, content, 'utf8')
  console.log(`✅ Fixed: ${path.basename(filePath)}`)
}

console.log('🔧 Fixing ARIA wrapper syntax...\n')

const baseDir = path.join(__dirname, '..')

filesToFix.forEach(file => {
  const filePath = path.join(baseDir, file)
  if (fs.existsSync(filePath)) {
    fixSyntax(filePath)
  }
})

console.log(`\n✅ Fixed ${filesToFix.length} files`)
