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

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  
  // Remove orphaned closing tags after self-closing tags
  content = content.replace(/\/>\s*<\/(OverviewTemplateOrganism|SpotlightTemplateOrganism)>/g, '/>')
  
  fs.writeFileSync(filePath, content, 'utf8')
  console.log(`✅ Fixed: ${path.basename(filePath)}`)
}

console.log('🔧 Removing duplicate closing tags...\n')

const baseDir = path.join(__dirname, '..')

filesToFix.forEach(file => {
  const filePath = path.join(baseDir, file)
  if (fs.existsSync(filePath)) {
    fixFile(filePath)
  }
})

console.log(`\n✅ Fixed ${filesToFix.length} files`)
