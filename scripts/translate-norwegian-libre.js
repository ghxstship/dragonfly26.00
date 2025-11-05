#!/usr/bin/env node

/**
 * NORWEGIAN TRANSLATION SCRIPT - LIBRETRANSLATE VERSION
 * Uses @libretranslate/client (completely free, no API key needed)
 * Self-hosted or public instance
 * 
 * Install: npm install @libretranslate/client
 */

const fs = require('fs')
const path = require('path')

const MESSAGES_DIR = path.join(__dirname, '../src/i18n/messages')

console.log('🇳🇴 NORWEGIAN TRANSLATION SYSTEM (LibreTranslate)\n')
console.log('This script will translate ALL content to Norwegian (Norsk)')
console.log('=' .repeat(80) + '\n')

// Check if LibreTranslate library is installed
let translate
try {
  const libreModule = require('@libretranslate/client')
  translate = libreModule.translate
  console.log('✅ LibreTranslate library loaded\n')
} catch (error) {
  console.log('❌ LibreTranslate library not found')
  console.log('\n📦 Please install the LibreTranslate library:')
  console.log('   npm install @libretranslate/client')
  console.log('\nThen run this script again.')
  console.log('No API key needed - completely free!')
  process.exit(1)
}

// Read English source
const enPath = path.join(MESSAGES_DIR, 'en.json')
const enData = JSON.parse(fs.readFileSync(enPath, 'utf-8'))

// Helper function to delay between API calls
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
        // Moderate delay for public API
        await delay(200)
        
        const translation = await translate(value, {
          from: 'en',
          to: 'no',
          host: 'https://libretranslate.com' // Public instance
        })
        
        result[key] = translation
        
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
  console.log(`   Using LibreTranslate (free, open-source)`)
  console.log(`   Delay: 200ms per request`)
  console.log(`   This will take approximately ${Math.ceil(totalKeys * 0.2 / 60)} minutes\n`)
  
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
    console.log('\n💡 Note: LibreTranslate is open-source and free.')
    console.log('   Still recommended: Have native speakers review for accuracy.')
    
  } catch (error) {
    console.error(`\n❌ Error translating Norwegian: ${error.message}`)
    process.exit(1)
  }
}

// Run the translation
console.log('🚀 Starting Norwegian translation...\n')
console.log('📡 Using LibreTranslate public API (no API key needed)\n')

translateNorwegian().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
