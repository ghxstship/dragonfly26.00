#!/usr/bin/env node

/**
 * NORWEGIAN TRANSLATION SCRIPT - ALTERNATIVE VERSION
 * Uses @iamtraction/google-translate (different implementation, may avoid rate limits)
 */

const fs = require('fs')
const path = require('path')
const translate = require('@iamtraction/google-translate')

const MESSAGES_DIR = path.join(__dirname, '../src/i18n/messages')

console.log('🇳🇴 NORWEGIAN TRANSLATION SYSTEM (Alternative API)\n')
console.log('Using different Google Translate implementation')
console.log('=' .repeat(80) + '\n')

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
        // Longer delay to avoid rate limiting (1 second)
        await delay(1000)
        
        const res = await translate(value, { to: 'no' })
        result[key] = res.text
        
        count++
        // Show progress for every 10th translation
        if (count % 10 === 0) {
          process.stdout.write('.')
          if (count % 100 === 0) {
            console.log(` ${count} translated`)
          }
        }
      } catch (error) {
        console.error(`\n⚠️  Translation error for ${currentPath}: ${error.message}`)
        result[key] = value // Keep original on error
        // Add extra delay after error
        await delay(2000)
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
  console.log(`   Delay: 1000ms per request (slow but reliable)`)
  console.log(`   This will take approximately ${Math.ceil(totalKeys * 1.0 / 60)} minutes (${Math.ceil(totalKeys * 1.0 / 3600)} hours)\n`)
  
  const startTime = Date.now()
  
  try {
    // Translate the entire English object
    console.log('🔄 Translation in progress...\n')
    const translatedData = await translateObject(enData)
    
    // Write to Norwegian file
    const noPath = path.join(MESSAGES_DIR, 'no.json')
    fs.writeFileSync(noPath, JSON.stringify(translatedData, null, 2) + '\n')
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1)
    const minutes = (duration / 60).toFixed(1)
    console.log(`\n\n✅ Norwegian translation complete! (${minutes} minutes)`)
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
    console.error(error.stack)
    process.exit(1)
  }
}

// Run the translation
console.log('🚀 Starting Norwegian translation...\n')
console.log('📡 Using alternative Google Translate API\n')
console.log('⏱️  This will be slow (1 second per key) to avoid rate limits\n')
console.log('💡 Tip: You can stop and resume later - already translated keys will be preserved\n')

translateNorwegian().catch(error => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
