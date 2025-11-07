#!/usr/bin/env node

/**
 * Script to generate PNG versions of the ATLVS logo from SVG
 * This can be run whenever logo updates are needed
 * 
 * Usage: node scripts/generate-logo-pngs.js
 * 
 * Requirements:
 * - Install sharp: npm install sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const logoSvg = path.join(publicDir, 'logo.svg');
const logoIconSvg = path.join(publicDir, 'logo-icon.svg');

// Logo sizes for different use cases
const logoSizes = [
  { name: 'logo-sm.png', width: 200 },
  { name: 'logo-md.png', width: 400 },
  { name: 'logo-lg.png', width: 800 },
  { name: 'logo-xl.png', width: 1200 },
];

// Icon sizes for PWA and favicons
const iconSizes = [
  { name: 'icon-32.png', size: 32 },
  { name: 'icon-72.png', size: 72 },
  { name: 'icon-96.png', size: 96 },
  { name: 'icon-128.png', size: 128 },
  { name: 'icon-144.png', size: 144 },
  { name: 'icon-152.png', size: 152 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-384.png', size: 384 },
  { name: 'icon-512.png', size: 512 },
  { name: 'favicon.png', size: 32 },
];

async function generateLogoPngs() {
  console.log('🎨 Generating ATLVS logo PNGs...\n');

  try {
    // Generate full logo PNGs
    for (const { name, width } of logoSizes) {
      const outputPath = path.join(publicDir, name);
      await sharp(logoSvg)
        .resize({ width, height: Math.floor(width / 4) }) // 4:1 aspect ratio
        .png()
        .toFile(outputPath);
      console.log(`✓ Created ${name}`);
    }

    console.log('\n📱 Generating icon PNGs...\n');

    // Generate icon PNGs
    for (const { name, size } of iconSizes) {
      const outputPath = path.join(publicDir, name);
      await sharp(logoIconSvg)
        .resize({ width: size, height: size })
        .png()
        .toFile(outputPath);
      console.log(`✓ Created ${name}`);
    }

    // Generate favicon.ico (requires multiple sizes)
    console.log('\n🔖 Note: For favicon.ico, use an online converter or imagemagick:');
    console.log('   convert icon-32.png icon-64.png icon-128.png favicon.ico');

    console.log('\n✅ Logo generation complete!');
  } catch (error) {
    console.error('❌ Error generating logos:', error);
    process.exit(1);
  }
}

// Check if sharp is installed
try {
  require.resolve('sharp');
  generateLogoPngs();
} catch (e) {
  console.error('❌ Error: sharp is not installed');
  console.log('\nPlease install it by running:');
  console.log('  npm install --save-dev sharp');
  console.log('\nThen run this script again.');
  process.exit(1);
}
