#!/usr/bin/env node

/**
 * Create ATLVS "A" logo favicon using Press Start 2P font
 * Downloads font if needed, then creates white "A" on black background
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Check if canvas is installed
let Canvas;
try {
  Canvas = require('canvas');
} catch (e) {
  console.log('Canvas already installed, using it...');
  Canvas = require('canvas');
}

const { createCanvas, registerFont } = Canvas;

async function downloadFont() {
  const fontPath = path.join(__dirname, '../public/fonts/PressStart2P-Regular.ttf');
  
  if (fs.existsSync(fontPath)) {
    console.log('✅ Press Start 2P font already exists');
    return fontPath;
  }

  console.log('📥 Downloading Press Start 2P font...');
  
  // Google Fonts API URL for Press Start 2P
  const fontUrl = 'https://github.com/google/fonts/raw/main/ofl/pressstart2p/PressStart2P-Regular.ttf';
  
  return new Promise((resolve, reject) => {
    https.get(fontUrl, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        https.get(response.headers.location, (redirectResponse) => {
          const fileStream = fs.createWriteStream(fontPath);
          redirectResponse.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            console.log('✅ Press Start 2P font downloaded');
            resolve(fontPath);
          });
        }).on('error', reject);
      } else {
        const fileStream = fs.createWriteStream(fontPath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log('✅ Press Start 2P font downloaded');
          resolve(fontPath);
        });
      }
    }).on('error', reject);
  });
}

async function createFavicon() {
  try {
    const fontPath = await downloadFont();
    
    // Register Press Start 2P font
    registerFont(fontPath, { family: 'Press Start 2P' });
    console.log('✅ Press Start 2P font registered');

    // Create a high-res canvas first
    const size = 512;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Disable smoothing for crisp pixel art
    ctx.imageSmoothingEnabled = false;

    // First, render the "A" to measure its bounds
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '380px "Press Start 2P"';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    // Measure the text
    const metrics = ctx.measureText('A');
    const textWidth = metrics.width;
    const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    
    // Clear and set black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, size, size);
    
    // Calculate centered position
    const x = (size - textWidth) / 2;
    const y = (size - textHeight) / 2;
    
    // Draw the "A" centered
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('A', x, y);

    // Save as PNG at different sizes
    const outputPath32 = path.join(__dirname, '../public/favicon.png');
    const outputPath16 = path.join(__dirname, '../public/favicon-16x16.png');

    // Create 32x32 version
    const canvas32 = createCanvas(32, 32);
    const ctx32 = canvas32.getContext('2d');
    ctx32.imageSmoothingEnabled = false;
    ctx32.drawImage(canvas, 0, 0, 32, 32);
    const buffer32 = canvas32.toBuffer('image/png');
    fs.writeFileSync(outputPath32, buffer32);
    console.log('✅ 32x32 favicon created at:', outputPath32);

    // Create 16x16 version
    const canvas16 = createCanvas(16, 16);
    const ctx16 = canvas16.getContext('2d');
    ctx16.imageSmoothingEnabled = false;
    ctx16.drawImage(canvas, 0, 0, 16, 16);
    const buffer16 = canvas16.toBuffer('image/png');
    fs.writeFileSync(outputPath16, buffer16);
    console.log('✅ 16x16 favicon created at:', outputPath16);

    // Create 180x180 apple-touch-icon
    const outputPathApple = path.join(__dirname, '../public/apple-touch-icon.png');
    const canvas180 = createCanvas(180, 180);
    const ctx180 = canvas180.getContext('2d');
    ctx180.imageSmoothingEnabled = false;
    ctx180.drawImage(canvas, 0, 0, 180, 180);
    const buffer180 = canvas180.toBuffer('image/png');
    fs.writeFileSync(outputPathApple, buffer180);
    console.log('✅ 180x180 apple-touch-icon created at:', outputPathApple);

    console.log('\n✅ All Press Start 2P "A" favicons created successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createFavicon();
