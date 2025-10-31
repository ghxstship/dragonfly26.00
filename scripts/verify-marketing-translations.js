#!/usr/bin/env node

/**
 * Verify Marketing Translation Keys
 * 
 * This script checks that all marketing translation keys used in components
 * actually exist in the en.json file.
 */

const fs = require('fs');
const path = require('path');

// Load the English translations
const enJsonPath = path.join(__dirname, '../src/i18n/messages/en.json');
const translations = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));

// Keys that should exist in marketing section
const requiredKeys = [
  // Integrations
  'marketing.integrations.title',
  'marketing.integrations.subtitle',
  
  // Hero
  'marketing.hero.headline',
  'marketing.hero.headlineHighlight',
  'marketing.hero.subheadline',
  'marketing.hero.supportingCopy',
  'marketing.hero.ctaPrimary',
  'marketing.hero.ctaSecondary',
  'marketing.hero.trustIndicators',
  'marketing.hero.platformScreenshot',
  
  // Features
  'marketing.features.title',
  'marketing.features.subtitle',
  'marketing.features.production.title',
  'marketing.features.production.description',
  'marketing.features.business.title',
  'marketing.features.business.description',
  'marketing.features.network.title',
  'marketing.features.network.description',
  'marketing.features.automations.title',
  'marketing.features.automations.description',
  'marketing.features.intelligence.title',
  'marketing.features.intelligence.description',
  'marketing.features.system.title',
  'marketing.features.system.description',
  
  // Roles
  'marketing.roles.phantom.name',
  'marketing.roles.phantom.description',
  'marketing.roles.aviator.name',
  'marketing.roles.aviator.description',
  'marketing.roles.gladiator.name',
  'marketing.roles.gladiator.description',
  'marketing.roles.navigator.name',
  'marketing.roles.navigator.description',
  'marketing.roles.deviator.name',
  'marketing.roles.deviator.description',
  'marketing.roles.raider.name',
  'marketing.roles.raider.description',
  'marketing.roles.vendor.name',
  'marketing.roles.vendor.description',
  'marketing.roles.visitor.name',
  'marketing.roles.visitor.description',
  'marketing.roles.partner.name',
  'marketing.roles.partner.description',
  'marketing.roles.ambassador.name',
  'marketing.roles.ambassador.description',
  
  // Testimonials
  'marketing.testimonials.longJohnSilverQuote',
  'marketing.testimonials.longJohnSilverAuthor',
  'marketing.testimonials.longJohnSilverRole',
  'marketing.testimonials.horatioHornblowerQuote',
  'marketing.testimonials.horatioHornblowerAuthor',
  'marketing.testimonials.horatioHornblowerRole',
  'marketing.testimonials.captainNemoQuote',
  'marketing.testimonials.captainNemoAuthor',
  'marketing.testimonials.captainNemoRole',
];

// Helper function to get nested value
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Check each required key
let missingKeys = [];
let foundKeys = [];

console.log('🔍 Verifying marketing translation keys...\n');

requiredKeys.forEach(key => {
  const value = getNestedValue(translations, key);
  if (value === undefined) {
    missingKeys.push(key);
    console.log(`❌ MISSING: ${key}`);
  } else {
    foundKeys.push(key);
    console.log(`✅ FOUND: ${key}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`\n📊 Results:`);
console.log(`   ✅ Found: ${foundKeys.length}/${requiredKeys.length}`);
console.log(`   ❌ Missing: ${missingKeys.length}/${requiredKeys.length}`);

if (missingKeys.length > 0) {
  console.log('\n⚠️  Missing keys:');
  missingKeys.forEach(key => console.log(`   - ${key}`));
  process.exit(1);
} else {
  console.log('\n✨ All required translation keys exist!');
  process.exit(0);
}
