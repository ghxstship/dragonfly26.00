#!/usr/bin/env node

/**
 * Create ATLVS "A" logo favicon
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

const { createCanvas } = Canvas;

// Create a 512x512 canvas for high quality, then we'll resize
const size = 512;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');

// Black background
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, size, size);

// White "A" letter
ctx.fillStyle = '#FFFFFF';
ctx.strokeStyle = '#FFFFFF';

// Draw the "A" shape
ctx.lineWidth = 60;
ctx.lineCap = 'square';
ctx.lineJoin = 'miter';

// Start drawing the "A"
ctx.beginPath();

// Left leg of A
ctx.moveTo(size * 0.2, size * 0.8);  // Bottom left
ctx.lineTo(size * 0.5, size * 0.2);  // Top center

// Right leg of A
ctx.lineTo(size * 0.8, size * 0.8);  // Bottom right

ctx.stroke();

// Horizontal bar in the middle
ctx.beginPath();
ctx.moveTo(size * 0.32, size * 0.55);
ctx.lineTo(size * 0.68, size * 0.55);
ctx.lineWidth = 50;
ctx.stroke();

// Save as PNG at different sizes
const outputPath32 = path.join(__dirname, '../public/favicon.png');
const outputPath16 = path.join(__dirname, '../public/favicon-16x16.png');

// Create 32x32 version
const canvas32 = createCanvas(32, 32);
const ctx32 = canvas32.getContext('2d');
ctx32.drawImage(canvas, 0, 0, 32, 32);
const buffer32 = canvas32.toBuffer('image/png');
fs.writeFileSync(outputPath32, buffer32);
console.log('✅ 32x32 favicon created at:', outputPath32);

// Create 16x16 version
const canvas16 = createCanvas(16, 16);
const ctx16 = canvas16.getContext('2d');
ctx16.drawImage(canvas, 0, 0, 16, 16);
const buffer16 = canvas16.toBuffer('image/png');
fs.writeFileSync(outputPath16, buffer16);
console.log('✅ 16x16 favicon created at:', outputPath16);

// Also save the high-res version for apple-touch-icon
const outputPathApple = path.join(__dirname, '../public/apple-touch-icon.png');
const canvas180 = createCanvas(180, 180);
const ctx180 = canvas180.getContext('2d');
ctx180.drawImage(canvas, 0, 0, 180, 180);
const buffer180 = canvas180.toBuffer('image/png');
fs.writeFileSync(outputPathApple, buffer180);
console.log('✅ 180x180 apple-touch-icon created at:', outputPathApple);

console.log('\n✅ All ATLVS "A" logo favicons created successfully!');
