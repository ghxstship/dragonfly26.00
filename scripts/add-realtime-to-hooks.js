#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const hooksToFix = [
  'use-analytics-data.ts',
  'use-assets-data.ts',
  'use-insights-data.ts',
  'use-reports-data.ts',
]

function addRealtime(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  
  // Check if already has realtime
  if (content.includes('.channel(') && content.includes('.subscribe(')) {
    return 0
  }

  // Find the main hook function
  const hookNameMatch = content.match(/export function (use\w+)\(\)/)
  if (!hookNameMatch) {
    console.log(`⚠️  Could not find hook function in ${path.basename(filePath)}`)
    return 0
  }

  const hookName = hookNameMatch[1]

  // Find the return statement
  const returnMatch = content.match(/return \{[\s\S]*?\}/)
  if (!returnMatch) {
    console.log(`⚠️  Could not find return statement in ${path.basename(filePath)}`)
    return 0
  }

  // Add realtime subscription before the return statement
  const realtimeCode = `
  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('${hookName.replace('use', '').toLowerCase()}_changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        refresh()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
`

  // Insert realtime code before the return statement
  content = content.replace(returnMatch[0], realtimeCode + '\n  ' + returnMatch[0])

  fs.writeFileSync(filePath, content, 'utf8')
  console.log(`✅ Fixed: ${path.basename(filePath)}`)
  return 1
}

console.log('🔧 Adding realtime to hooks...\n')

let fixedCount = 0
const hooksDir = path.join(__dirname, '..', 'src', 'hooks')

hooksToFix.forEach(file => {
  const filePath = path.join(hooksDir, file)
  if (fs.existsSync(filePath)) {
    fixedCount += addRealtime(filePath)
  } else {
    console.log(`⚠️  File not found: ${file}`)
  }
})

console.log(`\n✅ Fixed ${fixedCount} hooks`)
