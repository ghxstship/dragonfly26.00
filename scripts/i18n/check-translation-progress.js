#!/usr/bin/env node

/**
 * CHECK TRANSLATION PROGRESS
 * Shows which languages have been translated and which are pending
 */

const fs = require('fs')
const path = require('path')

const MESSAGES_DIR = path.join(__dirname, '../src/i18n/messages')

const LANGUAGES = {
  es: 'Spanish',
  fr: 'French',
  zh: 'Chinese',
  hi: 'Hindi',
  ar: 'Arabic',
  ko: 'Korean',
  vi: 'Vietnamese',
  pt: 'Portuguese',
  de: 'German',
  ja: 'Japanese',
  ru: 'Russian',
  id: 'Indonesian',
  ur: 'Urdu',
  bn: 'Bengali',
  ta: 'Tamil',
  te: 'Telugu',
  mr: 'Marathi',
  tr: 'Turkish',
  sw: 'Swahili'
}

console.log('🌍 TRANSLATION PROGRESS CHECK\n')
console.log('=' .repeat(80) + '\n')

// Read English to get expected key count
const enPath = path.join(MESSAGES_DIR, 'en.json')
const enData = JSON.parse(fs.readFileSync(enPath, 'utf-8'))
const enMarketing = enData.marketing

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

const expectedKeys = countKeys(enMarketing)

// Check if a value is translated (not English placeholder)
function isTranslated(value, enValue) {
  if (typeof value !== 'string' || typeof enValue !== 'string') return true
  return value !== enValue
}

function checkTranslation(obj, enObj) {
  let total = 0
  let translated = 0
  
  for (const key in enObj) {
    if (typeof enObj[key] === 'object' && !Array.isArray(enObj[key])) {
      const result = checkTranslation(obj[key] || {}, enObj[key])
      total += result.total
      translated += result.translated
    } else {
      total++
      if (obj[key] && isTranslated(obj[key], enObj[key])) {
        translated++
      }
    }
  }
  
  return { total, translated }
}

let completed = 0
let pending = 0
const results = []

Object.entries(LANGUAGES).forEach(([locale, name]) => {
  const localePath = path.join(MESSAGES_DIR, `${locale}.json`)
  const localeData = JSON.parse(fs.readFileSync(localePath, 'utf-8'))
  const localeMarketing = localeData.marketing || {}
  
  const { total, translated } = checkTranslation(localeMarketing, enMarketing)
  const percent = Math.round((translated / total) * 100)
  
  const status = percent === 100 ? '✅' : percent > 50 ? '🔄' : '⏳'
  const statusText = percent === 100 ? 'COMPLETE' : percent > 50 ? 'IN PROGRESS' : 'PENDING'
  
  results.push({
    locale,
    name,
    percent,
    translated,
    total,
    status,
    statusText
  })
  
  if (percent === 100) completed++
  else pending++
})

// Sort by completion percentage
results.sort((a, b) => b.percent - a.percent)

// Display results
results.forEach(r => {
  const bar = '█'.repeat(Math.floor(r.percent / 5)) + '░'.repeat(20 - Math.floor(r.percent / 5))
  console.log(`${r.status} ${r.locale.toUpperCase()} - ${r.name.padEnd(20)} [${bar}] ${r.percent}% (${r.translated}/${r.total})`)
})

console.log('\n' + '='.repeat(80))
console.log(`\n📊 SUMMARY:`)
console.log(`   Total Languages: 19`)
console.log(`   ✅ Completed: ${completed} (${Math.round(completed/19*100)}%)`)
console.log(`   ⏳ Pending: ${pending} (${Math.round(pending/19*100)}%)`)
console.log(`   📈 Total Keys per Language: ${expectedKeys}`)
console.log(`   📈 Total Translations: ${completed * expectedKeys}`)

if (completed === 19) {
  console.log(`\n🎉 ALL LANGUAGES COMPLETE!`)
  console.log(`   Total: ${19 * expectedKeys} translations (${expectedKeys} keys × 19 languages)`)
} else {
  console.log(`\n💡 Next Steps:`)
  const nextLang = results.find(r => r.percent < 100)
  if (nextLang) {
    console.log(`   Run: ./scripts/translate-${nextLang.locale}.sh`)
    console.log(`   Or:  python3 scripts/translate-language.py ${nextLang.locale}`)
  }
}

console.log('')
