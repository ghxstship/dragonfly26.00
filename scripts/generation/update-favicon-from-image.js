#!/usr/bin/env node

/**
 * Update favicon from uploaded image
 * Resizes and optimizes the image for favicon use
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is installed for image processing
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('Installing sharp package for image processing...');
  require('child_process').execSync('npm install sharp --no-save', { stdio: 'inherit' });
  sharp = require('sharp');
}

async function createFavicon() {
  // The image should be passed as an argument or we'll look for it in a temp location
  const inputPath = process.argv[2];
  
  if (!inputPath || !fs.existsSync(inputPath)) {
    console.error('❌ Error: Image file not found');
    console.log('Usage: node update-favicon-from-image.js <path-to-image>');
    process.exit(1);
  }

  const outputPath = path.join(__dirname, '../public/favicon.png');

  try {
    // Resize to 32x32 (standard favicon size) and save as PNG
    await sharp(inputPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath);

    console.log('✅ Favicon created successfully at:', outputPath);
    
    // Also create a 16x16 version for compatibility
    const favicon16Path = path.join(__dirname, '../public/favicon-16x16.png');
    await sharp(inputPath)
      .resize(16, 16, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(favicon16Path);
    
    console.log('✅ 16x16 favicon also created at:', favicon16Path);
  } catch (error) {
    console.error('❌ Error processing image:', error.message);
    process.exit(1);
  }
}

createFavicon();
