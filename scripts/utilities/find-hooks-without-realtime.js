#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const hooksDir = path.join(__dirname, '..', 'src', 'hooks')
const hooks = fs.readdirSync(hooksDir)
  .filter(f => f.startsWith('use-') && f.endsWith('-data.ts'))

console.log('\n📊 Checking hooks for realtime...\n')

const withoutRealtime = []

hooks.forEach(file => {
  const filePath = path.join(hooksDir, file)
  const content = fs.readFileSync(filePath, 'utf8')
  
  const hasRealtime = content.includes('.channel(') && content.includes('.subscribe(')
  
  if (!hasRealtime) {
    withoutRealtime.push(file)
    console.log(`❌ ${file}`)
  } else {
    console.log(`✅ ${file}`)
  }
})

console.log(`\n📊 Summary: ${withoutRealtime.length} hooks without realtime\n`)
withoutRealtime.forEach(file => console.log(`  - ${file}`))
