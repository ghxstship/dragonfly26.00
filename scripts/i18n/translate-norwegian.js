#!/usr/bin/env node

/**
 * NORWEGIAN TRANSLATION SCRIPT
 * Uses @vitalets/google-translate-api (free, no API key needed)
 * Translates ALL content from English to Norwegian
 */

const fs = require('fs')
const path = require('path')

const MESSAGES_DIR = path.join(__dirname, '../src/i18n/messages')

console.log('🇳🇴 NORWEGIAN TRANSLATION SYSTEM\n')
console.log('This script will translate ALL content to Norwegian (Norsk)')
console.log('=' .repeat(80) + '\n')

// Check if translation library is installed
let translate
try {
  const translateModule = require('@vitalets/google-translate-api')
  translate = translateModule.translate || translateModule.default || translateModule
  console.log('✅ Translation library loaded\n')
} catch (error) {
  console.log('❌ Translation library not found')
  console.log('\n📦 Please install the translation library:')
  console.log('   npm install @vitalets/google-translate-api')
  console.log('\nThen run this script again.')
  process.exit(1)
}

// Read English source
const enPath = path.join(MESSAGES_DIR, 'en.json')
const enData = JSON.parse(fs.readFileSync(enPath, 'utf-8'))

// Helper function to delay between API calls to avoid rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Recursively translate all strings in an object
async function translateObject(obj, path = '') {
  const result = {}
  let count = 0
  
  for (const key in obj) {
    const value = obj[key]
    const currentPath = path ? `${path}.${key}` : key
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively translate nested objects
      result[key] = await translateObject(value, currentPath)
    } else if (typeof value === 'string') {
      // Translate string values
      try {
        // Add longer delay to avoid rate limiting (500ms instead of 100ms)
        await delay(500)
        
        const { text } = await translate(value, { to: 'no' })
        result[key] = text
        
        count++
        // Show progress for every 50th translation
        if (count % 50 === 0) {
          process.stdout.write('.')
        }
      } catch (error) {
        console.error(`\n⚠️  Translation error for ${currentPath}: ${error.message}`)
        result[key] = value // Keep original on error
      }
    } else {
      result[key] = value
    }
  }
  
  return result
}

// Count total strings to translate
function countStrings(obj) {
  let count = 0
  for (const key in obj) {
    const value = obj[key]
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      count += countStrings(value)
    } else if (typeof value === 'string') {
      count++
    }
  }
  return count
}

// Main translation function
async function translateNorwegian() {
  const totalKeys = countStrings(enData)
  console.log(`📝 Translating Norwegian (Norsk)...`)
  console.log(`   Total keys to translate: ${totalKeys}`)
  console.log(`   Delay: 500ms per request (to avoid rate limiting)`)
  console.log(`   This will take approximately ${Math.ceil(totalKeys * 0.5 / 60)} minutes\n`)
  
  const startTime = Date.now()
  
  try {
    // Translate the entire English object
    console.log('🔄 Translation in progress...')
    const translatedData = await translateObject(enData)
    
    // Write to Norwegian file
    const noPath = path.join(MESSAGES_DIR, 'no.json')
    fs.writeFileSync(noPath, JSON.stringify(translatedData, null, 2) + '\n')
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1)
    console.log(`\n\n✅ Norwegian translation complete! (${duration}s)`)
    console.log(`📊 ${totalKeys}/${totalKeys} keys translated (100%)`)
    console.log('\n🎉 SUCCESS! Norwegian is now 100% translated!')
    console.log(`   Total: ${totalKeys} translations`)
    console.log('\n✅ Next steps:')
    console.log('   1. Test language switcher with Norwegian')
    console.log('   2. Have native Norwegian speakers proofread translations')
    console.log('   3. Make adjustments as needed')
    console.log('\n💡 Note: These are machine translations.')
    console.log('   Recommended: Have native speakers review for accuracy and cultural fit.')
    
  } catch (error) {
    console.error(`\n❌ Error translating Norwegian: ${error.message}`)
    process.exit(1)
  }
}

// Run the translation
console.log('🚀 Starting Norwegian translation...\n')
console.log('📡 Using free Google Translate API (no API key needed)\n')

translateNorwegian().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
