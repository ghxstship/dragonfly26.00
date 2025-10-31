#!/usr/bin/env node

/**
 * SYNC MARKETING TRANSLATION KEYS
 * Syncs all marketing translation keys from en.json to all other language files
 * Preserves existing translations, only adds missing keys with English placeholders
 */

const fs = require('fs')
const path = require('path')

const MESSAGES_DIR = path.join(__dirname, '../src/i18n/messages')
const LOCALES = ['es', 'fr', 'zh', 'hi', 'ar', 'ko', 'vi', 'pt', 'de', 'ja', 'ru', 'id', 'ur', 'bn', 'ta', 'te', 'mr', 'tr', 'sw']

// Read English translations as source
const enPath = path.join(MESSAGES_DIR, 'en.json')
const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf-8'))
const enMarketing = enTranslations.marketing || {}

console.log('🔄 Syncing marketing translation keys to all languages...\n')

// Deep merge function that preserves existing translations
function deepMerge(target, source) {
  const result = { ...target }
  
  for (const key in source) {
    if (typeof source[key] === 'object' && !Array.isArray(source[key]) && source[key] !== null) {
      result[key] = deepMerge(result[key] || {}, source[key])
    } else {
      // Only add if key doesn't exist (preserve existing translations)
      if (!(key in result)) {
        result[key] = source[key]
      }
    }
  }
  
  return result
}

let updatedCount = 0
let totalKeysAdded = 0

LOCALES.forEach(locale => {
  const localePath = path.join(MESSAGES_DIR, `${locale}.json`)
  
  // Read existing translations
  let translations = {}
  if (fs.existsSync(localePath)) {
    translations = JSON.parse(fs.readFileSync(localePath, 'utf-8'))
  }
  
  const beforeMarketing = translations.marketing || {}
  
  // Count keys before
  function countKeys(obj) {
    let count = 0
    for (const key in obj) {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        count += countKeys(obj[key])
      } else {
        count++
      }
    }
    return count
  }
  
  const keysBefore = countKeys(beforeMarketing)
  
  // Merge marketing section
  translations.marketing = deepMerge(beforeMarketing, enMarketing)
  
  const keysAfter = countKeys(translations.marketing)
  const keysAdded = keysAfter - keysBefore
  
  // Write back with proper formatting
  fs.writeFileSync(localePath, JSON.stringify(translations, null, 2) + '\n')
  
  if (keysAdded > 0) {
    console.log(`✅ ${locale}.json - Added ${keysAdded} missing keys (${keysBefore} → ${keysAfter})`)
    updatedCount++
    totalKeysAdded += keysAdded
  } else {
    console.log(`⏭️  ${locale}.json - Already up to date (${keysAfter} keys)`)
  }
})

console.log('\n' + '='.repeat(80))
console.log(`\n📊 SUMMARY:`)
console.log(`  Languages updated: ${updatedCount}/${LOCALES.length}`)
console.log(`  Total keys added: ${totalKeysAdded}`)
console.log(`\n✅ All language files now have complete marketing key structure`)
console.log(`⚠️  NOTE: New keys contain English placeholders - professional translation needed`)

process.exit(0)
