#!/usr/bin/env node

/**
 * Create perfectly centered ATLVS "A" logo favicon
 * Equal padding on all 4 sides
 */

const fs = require('fs');
const path = require('path');

const Canvas = require('canvas');
const { createCanvas, registerFont } = Canvas;

async function createFavicon() {
  try {
    const fontPath = path.join(__dirname, '../public/fonts/PressStart2P-Regular.ttf');
    
    if (!fs.existsSync(fontPath)) {
      console.error('❌ Press Start 2P font not found');
      process.exit(1);
    }

    // Register Press Start 2P font
    registerFont(fontPath, { family: 'Press Start 2P' });
    console.log('✅ Press Start 2P font registered');

    // Create a temporary large canvas to render and measure the text
    const tempSize = 1000;
    const tempCanvas = createCanvas(tempSize, tempSize);
    const tempCtx = tempCanvas.getContext('2d');
    
    tempCtx.imageSmoothingEnabled = false;
    tempCtx.fillStyle = '#FFFFFF';
    tempCtx.font = '500px "Press Start 2P"';
    tempCtx.textAlign = 'left';
    tempCtx.textBaseline = 'top';
    
    // Draw the "A" to get pixel data
    tempCtx.fillText('A', 0, 0);
    
    // Get image data to find actual bounds
    const imageData = tempCtx.getImageData(0, 0, tempSize, tempSize);
    const pixels = imageData.data;
    
    let minX = tempSize, maxX = 0, minY = tempSize, maxY = 0;
    
    // Find the bounding box of non-transparent pixels
    for (let y = 0; y < tempSize; y++) {
      for (let x = 0; x < tempSize; x++) {
        const i = (y * tempSize + x) * 4;
        const alpha = pixels[i + 3];
        
        if (alpha > 0) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    
    const textWidth = maxX - minX + 1;
    const textHeight = maxY - minY + 1;
    
    console.log(`Text bounds: ${textWidth}x${textHeight}`);
    
    // Create final canvas with equal padding
    const padding = 60; // Equal padding on all sides
    const finalSize = Math.max(textWidth, textHeight) + (padding * 2);
    const finalCanvas = createCanvas(finalSize, finalSize);
    const finalCtx = finalCanvas.getContext('2d');
    
    finalCtx.imageSmoothingEnabled = false;
    
    // Black background
    finalCtx.fillStyle = '#000000';
    finalCtx.fillRect(0, 0, finalSize, finalSize);
    
    // Calculate centered position with equal padding
    const offsetX = (finalSize - textWidth) / 2;
    const offsetY = (finalSize - textHeight) / 2;
    
    // Draw the cropped text centered
    finalCtx.drawImage(
      tempCanvas,
      minX, minY, textWidth, textHeight,  // Source
      offsetX, offsetY, textWidth, textHeight  // Destination
    );
    
    console.log(`Final canvas: ${finalSize}x${finalSize}, padding: ${padding}px on all sides`);

    // Save as PNG at different sizes
    const outputPath32 = path.join(__dirname, '../public/favicon.png');
    const outputPath16 = path.join(__dirname, '../public/favicon-16x16.png');

    // Create 32x32 version
    const canvas32 = createCanvas(32, 32);
    const ctx32 = canvas32.getContext('2d');
    ctx32.imageSmoothingEnabled = false;
    ctx32.drawImage(finalCanvas, 0, 0, 32, 32);
    const buffer32 = canvas32.toBuffer('image/png');
    fs.writeFileSync(outputPath32, buffer32);
    console.log('✅ 32x32 favicon created at:', outputPath32);

    // Create 16x16 version
    const canvas16 = createCanvas(16, 16);
    const ctx16 = canvas16.getContext('2d');
    ctx16.imageSmoothingEnabled = false;
    ctx16.drawImage(finalCanvas, 0, 0, 16, 16);
    const buffer16 = canvas16.toBuffer('image/png');
    fs.writeFileSync(outputPath16, buffer16);
    console.log('✅ 16x16 favicon created at:', outputPath16);

    // Create 180x180 apple-touch-icon
    const outputPathApple = path.join(__dirname, '../public/apple-touch-icon.png');
    const canvas180 = createCanvas(180, 180);
    const ctx180 = canvas180.getContext('2d');
    ctx180.imageSmoothingEnabled = false;
    ctx180.drawImage(finalCanvas, 0, 0, 180, 180);
    const buffer180 = canvas180.toBuffer('image/png');
    fs.writeFileSync(outputPathApple, buffer180);
    console.log('✅ 180x180 apple-touch-icon created at:', outputPathApple);

    console.log('\n✅ All perfectly centered favicons created successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createFavicon();
