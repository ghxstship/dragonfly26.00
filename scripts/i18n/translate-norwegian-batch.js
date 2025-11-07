#!/usr/bin/env node

/**
 * NORWEGIAN BATCH TRANSLATION SCRIPT
 * Translates in batches with retry logic and progress saving
 * More resilient to network issues
 */

const fs = require('fs')
const path = require('path')
const translate = require('@iamtraction/google-translate')

const MESSAGES_DIR = path.join(__dirname, '../src/i18n/messages')
const BATCH_SIZE = 100 // Translate 100 keys at a time
const DELAY_MS = 800 // 800ms delay between requests
const RETRY_DELAY_MS = 5000 // 5 seconds delay on error
const MAX_RETRIES = 3

console.log('🇳🇴 NORWEGIAN BATCH TRANSLATION SYSTEM\n')
console.log('Translates in batches with automatic retry and progress saving')
console.log('=' .repeat(80) + '\n')

// Read English source
const enPath = path.join(MESSAGES_DIR, 'en.json')
const noPath = path.join(MESSAGES_DIR, 'no.json')
const enData = JSON.parse(fs.readFileSync(enPath, 'utf-8'))
let noData = JSON.parse(fs.readFileSync(noPath, 'utf-8'))

// Helper function to delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Flatten nested object to array of paths and values
function flattenObject(obj, prefix = '') {
  const result = []
  
  for (const key in obj) {
    const value = obj[key]
    const path = prefix ? `${prefix}.${key}` : key
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result.push(...flattenObject(value, path))
    } else if (typeof value === 'string') {
      result.push({ path, value })
    }
  }
  
  return result
}

// Set value in nested object by path
function setByPath(obj, path, value) {
  const keys = path.split('.')
  let current = obj
  
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {}
    }
    current = current[keys[i]]
  }
  
  current[keys[keys.length - 1]] = value
}

// Get value from nested object by path
function getByPath(obj, path) {
  const keys = path.split('.')
  let current = obj
  
  for (const key of keys) {
    if (!current || typeof current !== 'object') return undefined
    current = current[key]
  }
  
  return current
}

// Translate a single string with retry logic
async function translateWithRetry(text, path, retries = 0) {
  try {
    await delay(DELAY_MS)
    const res = await translate(text, { to: 'no' })
    return res.text
  } catch (error) {
    if (retries < MAX_RETRIES) {
      console.log(`\n⚠️  Retry ${retries + 1}/${MAX_RETRIES} for ${path}: ${error.message}`)
      await delay(RETRY_DELAY_MS)
      return translateWithRetry(text, path, retries + 1)
    } else {
      console.log(`\n❌ Failed after ${MAX_RETRIES} retries for ${path}: ${error.message}`)
      return text // Keep original on failure
    }
  }
}

// Save progress to file
function saveProgress() {
  fs.writeFileSync(noPath, JSON.stringify(noData, null, 2) + '\n')
}

// Main translation function
async function translateNorwegian() {
  // Get all English strings
  const allStrings = flattenObject(enData)
  
  // Filter out already translated strings
  const toTranslate = allStrings.filter(item => {
    const existing = getByPath(noData, item.path)
    return !existing || existing === item.value // Not translated or still English
  })
  
  const totalKeys = allStrings.length
  const alreadyTranslated = totalKeys - toTranslate.length
  const remaining = toTranslate.length
  
  console.log(`📊 Translation Status:`)
  console.log(`   Total keys: ${totalKeys}`)
  console.log(`   Already translated: ${alreadyTranslated} (${((alreadyTranslated/totalKeys)*100).toFixed(1)}%)`)
  console.log(`   Remaining: ${remaining}`)
  console.log(`   Batch size: ${BATCH_SIZE}`)
  console.log(`   Estimated time: ${Math.ceil(remaining * DELAY_MS / 1000 / 60)} minutes\n`)
  
  if (remaining === 0) {
    console.log('✅ All keys already translated!')
    return
  }
  
  const startTime = Date.now()
  let translated = 0
  let failed = 0
  
  // Process in batches
  for (let i = 0; i < toTranslate.length; i += BATCH_SIZE) {
    const batch = toTranslate.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(toTranslate.length / BATCH_SIZE)
    
    console.log(`\n📦 Batch ${batchNum}/${totalBatches} (${batch.length} keys)`)
    console.log('🔄 Translating...')
    
    for (const item of batch) {
      const translatedText = await translateWithRetry(item.value, item.path)
      setByPath(noData, item.path, translatedText)
      
      if (translatedText !== item.value) {
        translated++
      } else {
        failed++
      }
      
      // Show progress
      const current = i + batch.indexOf(item) + 1
      if (current % 10 === 0) {
        process.stdout.write('.')
      }
    }
    
    // Save progress after each batch
    saveProgress()
    console.log(`\n✅ Batch ${batchNum} complete - Progress saved`)
    console.log(`   Translated: ${translated}, Failed: ${failed}, Total: ${translated + failed}/${remaining}`)
  }
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(1)
  const minutes = (duration / 60).toFixed(1)
  const successRate = ((translated / (translated + failed)) * 100).toFixed(1)
  
  console.log(`\n\n${'='.repeat(80)}`)
  console.log('🎉 TRANSLATION COMPLETE!\n')
  console.log(`⏱️  Time: ${minutes} minutes`)
  console.log(`📊 Results:`)
  console.log(`   Successfully translated: ${translated}`)
  console.log(`   Failed (kept English): ${failed}`)
  console.log(`   Success rate: ${successRate}%`)
  console.log(`   Total keys: ${totalKeys}`)
  console.log(`   Completion: ${(((alreadyTranslated + translated) / totalKeys) * 100).toFixed(1)}%`)
  console.log(`\n✅ Norwegian translation file saved: ${noPath}`)
  console.log('\n📝 Next steps:')
  console.log('   1. Test language switcher with Norwegian')
  console.log('   2. Review failed translations (if any)')
  console.log('   3. Have native speakers proofread')
  console.log('\n💡 Note: You can re-run this script to retry failed translations')
}

// Run the translation
console.log('🚀 Starting batch translation...\n')
translateNorwegian().catch(error => {
  console.error('\n❌ Fatal error:', error)
  saveProgress()
  console.log('💾 Progress saved before exit')
  process.exit(1)
})
