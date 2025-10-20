#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'src', 'hooks', 'use-dashboard-data.ts')
let content = fs.readFileSync(filePath, 'utf8')

// Pattern: Move async function outside useEffect and update refresh
const pattern = /useEffect\(\(\) => \{\s*async function (fetch\w+)\(\) \{([\s\S]*?)\}\s*(fetch\w+)\(\)([\s\S]*?)\}, \[[\s\S]*?\]\)\s*const refresh = async \(\) => \{\s*await \1\(\)\s*\}/g

content = content.replace(pattern, (match, funcName, funcBody, callName, restOfEffect) => {
  return `const ${funcName} = async () => {${funcBody}}\n\n  useEffect(() => {\n    ${funcName}()${restOfEffect}}, [workspaceId, userId])\n\n  const refresh = ${funcName}`
})

// Fix the return statements to use the function directly
content = content.replace(/return \{ ([\w, ]+), refresh \}/g, 'return { $1, refresh }')

fs.writeFileSync(filePath, content, 'utf8')
console.log('✅ Fixed all dashboard hooks')
