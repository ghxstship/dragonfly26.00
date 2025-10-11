const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../src/i18n/messages');

// Read the English template
const enContent = JSON.parse(fs.readFileSync(path.join(messagesDir, 'en.json'), 'utf8'));

// For remaining languages where we haven't done comprehensive translations yet,
// we'll copy the structure from English and keep existing translations where they exist
const languages = ['es', 'fr', 'hi', 'ar', 'bn', 'ru', 'pt', 'id', 'ur', 'de', 'ja', 'sw', 'mr', 'te', 'tr', 'ta', 'vi', 'ko'];

languages.forEach(lang => {
  const filePath = path.join(messagesDir, `${lang}.json`);
  let existingContent = {};
  
  try {
    existingContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.log(`Creating new file for ${lang}`);
  }
  
  // Merge existing with English structure (keep existing translations, add missing keys from English)
  const merged = JSON.parse(JSON.stringify(enContent));
  
  // Deep merge function
  function deepMerge(target, source) {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        target[key] = target[key] || {};
        deepMerge(target[key], source[key]);
      } else if (source[key] !== undefined) {
        target[key] = source[key];
      }
    }
  }
  
  deepMerge(merged, existingContent);
  
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf8');
  console.log(`Updated ${lang}.json`);
});

console.log('\\nAll translation files updated with comprehensive structure!');
console.log('Note: English fallback text is used for missing translations.');
console.log('Consider using professional translation services for production.');
