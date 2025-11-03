#!/usr/bin/env node

/**
 * Generate a globe emoji favicon
 * This script creates a simple PNG favicon with a globe emoji
 */

const fs = require('fs');
const path = require('path');

// Simple approach: Download a globe icon from an emoji CDN
const https = require('https');

const emojiUrl = 'https://em-content.zobj.net/source/apple/391/globe-showing-americas_1f30e.png';
const outputPath = path.join(__dirname, '../public/favicon.png');

console.log('Downloading globe emoji favicon...');

https.get(emojiUrl, (response) => {
  if (response.statusCode === 200) {
    const fileStream = fs.createWriteStream(outputPath);
    response.pipe(fileStream);
    
    fileStream.on('finish', () => {
      fileStream.close();
      console.log('✅ Globe favicon created successfully at:', outputPath);
    });
  } else {
    console.error('❌ Failed to download emoji. Status code:', response.statusCode);
    console.log('Please manually download a globe emoji PNG and save it as public/favicon.png');
  }
}).on('error', (err) => {
  console.error('❌ Error downloading emoji:', err.message);
  console.log('Please manually download a globe emoji PNG and save it as public/favicon.png');
});
