#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../src/i18n/messages');

// All 20 language files
const languages = [
  'en', 'zh', 'hi', 'es', 'fr', 'ar', 'bn', 'ru', 'pt', 'id',
  'ur', 'de', 'ja', 'sw', 'mr', 'te', 'tr', 'ta', 'vi', 'ko'
];

// Automations Hub content
const automationsHub = {
  "title": "Automations Hub",
  "description": "Automate workflows, triggers, and repetitive tasks",
  "feature1": "Custom workflow automation",
  "feature2": "Event-driven triggers",
  "feature3": "Scheduled task execution",
  "feature4": "Integration pipelines"
};

let successCount = 0;
let errorCount = 0;

languages.forEach(lang => {
  const filePath = path.join(messagesDir, `${lang}.json`);
  
  try {
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Check if marketing.features exists
    if (!data.marketing || !data.marketing.features) {
      console.log(`⚠️  ${lang}.json: marketing.features not found, skipping`);
      return;
    }
    
    // Check if automations already exists
    if (data.marketing.features.automations) {
      console.log(`ℹ️  ${lang}.json: automations already exists, skipping`);
      successCount++;
      return;
    }
    
    // Update subtitle from "Five" to "Six"
    if (data.marketing.features.subtitle) {
      data.marketing.features.subtitle = data.marketing.features.subtitle.replace(/Five/g, 'Six').replace(/five/g, 'six');
    }
    
    // Create new features object with automations inserted between network and intelligence
    const newFeatures = {};
    for (const [key, value] of Object.entries(data.marketing.features)) {
      newFeatures[key] = value;
      
      // Insert automations after network
      if (key === 'network') {
        newFeatures.automations = automationsHub;
      }
    }
    
    // Replace features with new ordered object
    data.marketing.features = newFeatures;
    
    // Write back to file with proper formatting
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    
    console.log(`✅ ${lang}.json: Successfully added automations hub`);
    successCount++;
    
  } catch (error) {
    console.error(`❌ ${lang}.json: Error - ${error.message}`);
    errorCount++;
  }
});

console.log('\n' + '='.repeat(60));
console.log(`SUMMARY: ${successCount} successful, ${errorCount} errors`);
console.log('='.repeat(60));

if (successCount === 20) {
  console.log('✅ ALL 20 LANGUAGE FILES UPDATED SUCCESSFULLY');
  process.exit(0);
} else {
  console.log(`⚠️  Only ${successCount}/20 files updated`);
  process.exit(1);
}
