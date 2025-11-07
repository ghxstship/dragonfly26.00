#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'src', 'hooks', 'use-dashboard-data.ts')
let content = fs.readFileSync(filePath, 'utf8')

// Pattern to find and fix each hook
const fixes = [
  { name: 'fetchMyTasks', line: 175 },
  { name: 'fetchMyExpenses', line: 233 },
  { name: 'fetchMyJobs', line: 290 },
  { name: 'fetchMyAssets', line: 345 },
  { name: 'fetchMyOrders', line: 401 },
  { name: 'fetchMyAdvances', line: 460 },
  { name: 'fetchMyReports', line: 512 },
  { name: 'fetchMyFiles', line: 567 },
  { name: 'fetchMyTravel', line: 623 },
]

// For each function, move it outside useEffect
fixes.forEach(({ name }) => {
  // Pattern: useEffect with nested async function
  const pattern = new RegExp(
    `useEffect\\(\\(\\) => \\{\\s*async function ${name}\\(\\) \\{([\\s\\S]*?)\\}\\s*${name}\\(\\)`,
    'g'
  )
  
  content = content.replace(pattern, (match, funcBody) => {
    return `const ${name} = async () => {${funcBody}}\n\n  useEffect(() => {\n    ${name}()`
  })
  
  // Fix the refresh function to reference the moved function
  const refreshPattern = new RegExp(`const refresh = async \\(\\) => \\{\\s*await ${name}\\(\\)\\s*\\}`, 'g')
  content = content.replace(refreshPattern, `const refresh = ${name}`)
})

fs.writeFileSync(filePath, content, 'utf8')
console.log('✅ Fixed all 9 dashboard refresh functions')
