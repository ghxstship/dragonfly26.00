#!/usr/bin/env node

/**
 * Create ATLVS "A" logo favicon using Press Start 2P font
 * White "A" on black background
 */

const fs = require('fs');
const path = require('path');

// Check if canvas is installed
let Canvas;
try {
  Canvas = require('canvas');
} catch (e) {
  console.log('Canvas already installed, using it...');
  Canvas = require('canvas');
}

const { createCanvas, registerFont } = Canvas;

// Register Press Start 2P font
const fontPath = path.join(__dirname, '../public/fonts/PressStart2P-Regular.ttf');
if (fs.existsSync(fontPath)) {
  registerFont(fontPath, { family: 'Press Start 2P' });
  console.log('✅ Press Start 2P font loaded');
} else {
  console.log('⚠️  Press Start 2P font not found at:', fontPath);
  console.log('Using system font as fallback...');
}

// Create a high-res canvas first
const size = 512;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');

// Black background
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, size, size);

// White "A" with Press Start 2P font
ctx.fillStyle = '#FFFFFF';
ctx.font = '400px "Press Start 2P", monospace';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// Disable smoothing for crisp pixel art
ctx.imageSmoothingEnabled = false;

// Draw the "A"
ctx.fillText('A', size / 2, size / 2);

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
