#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const hooksToFix = [
  'use-analytics-data.ts',
  'use-insights-data.ts',
  'use-reports-data.ts',
]

function removeBadRealtime(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  
  // Remove the bad realtime code block
  const pattern = /\n\s*\/\/ Realtime subscription\s*\n\s*useEffect\(\(\) => \{[\s\S]*?refresh\(\)[\s\S]*?\}, \[\]\)\n/g
  content = content.replace(pattern, '\n')
  
  fs.writeFileSync(filePath, content, 'utf8')
  console.log(`✅ Fixed: ${path.basename(filePath)}`)
  return 1
}

console.log('🔧 Removing bad realtime code...\n')

let fixedCount = 0
const hooksDir = path.join(__dirname, '..', 'src', 'hooks')

hooksToFix.forEach(file => {
  const filePath = path.join(hooksDir, file)
  if (fs.existsSync(filePath)) {
    fixedCount += removeBadRealtime(filePath)
  }
})

console.log(`\n✅ Fixed ${fixedCount} hooks`)
