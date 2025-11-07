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

function addAria(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  let modified = false

  // Pattern 1: Add role and aria-label to OverviewTemplateOrganism
  if (content.includes('OverviewTemplateOrganism') && !content.includes('role="main"')) {
    const pattern = /return \(\s*<OverviewTemplateOrganism/
    if (pattern.test(content)) {
      content = content.replace(pattern, 'return (\n    <div role="main" aria-label="Overview content">\n      <OverviewTemplateOrganism')
      
      // Add closing div before the closing parenthesis
      content = content.replace(/\n  \)\n}/, '\n      </OverviewTemplateOrganism>\n    </div>\n  )\n}')
      modified = true
    }
  }

  // Pattern 2: Add role and aria-label to SpotlightTemplateOrganism
  if (content.includes('SpotlightTemplateOrganism') && !content.includes('role="main"')) {
    const pattern = /return \(\s*<SpotlightTemplateOrganism/
    if (pattern.test(content)) {
      content = content.replace(pattern, 'return (\n    <div role="main" aria-label="Spotlight content">\n      <SpotlightTemplateOrganism')
      
      // Add closing div before the closing parenthesis
      content = content.replace(/\n  \)\n}/, '\n      </SpotlightTemplateOrganism>\n    </div>\n  )\n}')
      modified = true
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`✅ Fixed: ${path.basename(filePath)}`)
    return 1
  }

  return 0
}

console.log('🔧 Adding ARIA attributes to specific files...\n')

let fixedCount = 0
const baseDir = path.join(__dirname, '..')

filesToFix.forEach(file => {
  const filePath = path.join(baseDir, file)
  if (fs.existsSync(filePath)) {
    fixedCount += addAria(filePath)
  } else {
    console.log(`⚠️  File not found: ${file}`)
  }
})

console.log(`\n✅ Fixed ${fixedCount} files`)
