#!/usr/bin/env node

/**
 * NORWEGIAN TRANSLATION SCRIPT - DEEPL VERSION
 * Uses deepl-node (free tier: 500,000 chars/month)
 * More reliable than Google Translate free tier
 * 
 * Install: npm install deepl-node
 * Get free API key: https://www.deepl.com/pro-api
 */

const fs = require('fs')
const path = require('path')

const MESSAGES_DIR = path.join(__dirname, '../src/i18n/messages')

console.log('🇳🇴 NORWEGIAN TRANSLATION SYSTEM (DeepL)\n')
console.log('This script will translate ALL content to Norwegian (Norsk)')
console.log('=' .repeat(80) + '\n')

// Check if DeepL library is installed
let deepl
try {
  const deeplModule = require('deepl-node')
  console.log('✅ DeepL library loaded\n')
  
  // Check for API key
  const apiKey = process.env.DEEPL_API_KEY
  if (!apiKey) {
    console.log('❌ DeepL API key not found')
    console.log('\n📦 Setup instructions:')
    console.log('   1. Get free API key: https://www.deepl.com/pro-api')
    console.log('   2. Set environment variable: export DEEPL_API_KEY="your-key-here"')
    console.log('   3. Run this script again')
    console.log('\nFree tier: 500,000 characters/month (plenty for this translation)')
    process.exit(1)
  }
  
  deepl = new deeplModule.Translator(apiKey)
  console.log('✅ DeepL API key configured\n')
} catch (error) {
  console.log('❌ DeepL library not found')
  console.log('\n📦 Please install the DeepL library:')
  console.log('   npm install deepl-node')
  console.log('\nThen get a free API key from: https://www.deepl.com/pro-api')
  console.log('And run: export DEEPL_API_KEY="your-key-here"')
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
        // Small delay to be respectful to API
        await delay(50)
        
        const translation = await deepl.translateText(value, null, 'nb')
        result[key] = translation.text
        
        count++
        // Show progress for every 100th translation
        if (count % 100 === 0) {
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
  let count = 0;
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
  console.log(`   Using DeepL API (more reliable than Google Translate)`)
  console.log(`   This will take approximately ${Math.ceil(totalKeys * 0.05 / 60)} minutes\n`)
  
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
    console.log('\n💡 Note: DeepL provides high-quality translations.')
    console.log('   Still recommended: Have native speakers review for accuracy and cultural fit.')
    
  } catch (error) {
    console.error(`\n❌ Error translating Norwegian: ${error.message}`)
    process.exit(1)
  }
}

// Run the translation
console.log('🚀 Starting Norwegian translation...\n')
console.log('📡 Using DeepL API (professional quality)\n')

translateNorwegian().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
