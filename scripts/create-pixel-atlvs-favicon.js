#!/usr/bin/env node

/**
 * Create pixelated ATLVS "A" logo favicon
 * White blocky "A" on black background (pixel art style)
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

const { createCanvas } = Canvas;

// Create a 320x320 canvas for pixel art (10x scale of 32x32)
const scale = 10;
const size = 32 * scale;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');

// Black background
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, size, size);

// White pixel blocks for the "A"
ctx.fillStyle = '#FFFFFF';

// Define the pixel grid for the "A" (32x32 grid)
// 1 = white pixel, 0 = black pixel
const pixelGrid = [
  '00000000000000000000000000000000',
  '00000000000000000000000000000000',
  '00000000000000000000000000000000',
  '00000000000000000000000000000000',
  '00000000000111111111000000000000',
  '00000000001111111111100000000000',
  '00000000011111111111110000000000',
  '00000000111100000001111000000000',
  '00000001111000000000111100000000',
  '00000011110000000000011110000000',
  '00000111100000000000001111000000',
  '00001111000000000000000111100000',
  '00011110000000000000000011110000',
  '00111100000000000000000001111000',
  '00111100000000000000000001111000',
  '01111111111111111111111111111100',
  '01111111111111111111111111111100',
  '01111111111111111111111111111100',
  '11110000000000000000000000111110',
  '11110000000000000000000000111110',
  '11110000000000000000000000111110',
  '11110000000000000000000000111110',
  '11110000000000000000000000111110',
  '11110000000000000000000000111110',
  '11110000000000000000000000111110',
  '11110000000000000000000000111110',
  '00000000000000000000000000000000',
  '00000000000000000000000000000000',
  '00000000000000000000000000000000',
  '00000000000000000000000000000000',
  '00000000000000000000000000000000',
  '00000000000000000000000000000000',
];

// Draw each pixel
const blockSize = scale;
for (let y = 0; y < 32; y++) {
  for (let x = 0; x < 32; x++) {
    if (pixelGrid[y] && pixelGrid[y][x] === '1') {
      ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
    }
  }
}

// Save as PNG at different sizes
const outputPath32 = path.join(__dirname, '../public/favicon.png');
const outputPath16 = path.join(__dirname, '../public/favicon-16x16.png');

// Create 32x32 version
const canvas32 = createCanvas(32, 32);
const ctx32 = canvas32.getContext('2d');
ctx32.imageSmoothingEnabled = false; // Keep it pixelated
ctx32.drawImage(canvas, 0, 0, 32, 32);
const buffer32 = canvas32.toBuffer('image/png');
fs.writeFileSync(outputPath32, buffer32);
console.log('✅ 32x32 pixelated favicon created at:', outputPath32);

// Create 16x16 version
const canvas16 = createCanvas(16, 16);
const ctx16 = canvas16.getContext('2d');
ctx16.imageSmoothingEnabled = false; // Keep it pixelated
ctx16.drawImage(canvas, 0, 0, 16, 16);
const buffer16 = canvas16.toBuffer('image/png');
fs.writeFileSync(outputPath16, buffer16);
console.log('✅ 16x16 pixelated favicon created at:', outputPath16);

// Also save the high-res version for apple-touch-icon (keeping pixel art style)
const outputPathApple = path.join(__dirname, '../public/apple-touch-icon.png');
const canvas180 = createCanvas(180, 180);
const ctx180 = canvas180.getContext('2d');
ctx180.imageSmoothingEnabled = false; // Keep it pixelated
ctx180.drawImage(canvas, 0, 0, 180, 180);
const buffer180 = canvas180.toBuffer('image/png');
fs.writeFileSync(outputPathApple, buffer180);
console.log('✅ 180x180 pixelated apple-touch-icon created at:', outputPathApple);

console.log('\n✅ All pixelated ATLVS "A" logo favicons created successfully!');
