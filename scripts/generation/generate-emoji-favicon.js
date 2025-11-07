#!/usr/bin/env node

/**
 * Generate a favicon from the 🌐 emoji
 * Uses canvas to render the emoji as a PNG
 */

const fs = require('fs');
const path = require('path');

// Check if canvas is installed
let Canvas;
try {
  Canvas = require('canvas');
} catch (e) {
  console.log('Installing canvas package...');
  require('child_process').execSync('npm install canvas --no-save', { stdio: 'inherit' });
  Canvas = require('canvas');
}

const { createCanvas } = Canvas;

// Create a 32x32 canvas (standard favicon size)
const size = 32;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');

// Set transparent background
ctx.clearRect(0, 0, size, size);

// Set font and draw emoji
ctx.font = '24px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// Draw the 🌐 emoji
ctx.fillText('🌐', size / 2, size / 2);

// Save as PNG
const outputPath = path.join(__dirname, '../public/favicon.png');
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(outputPath, buffer);

console.log('✅ Globe emoji (🌐) favicon created successfully at:', outputPath);
