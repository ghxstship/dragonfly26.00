const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const publicDir = path.join(__dirname, '..', 'public');
const svgPath = path.join(publicDir, 'icon.svg');

async function generateIcons() {
  console.log('Generating icons from SVG...');
  
  // Read the SVG file
  const svgBuffer = fs.readFileSync(svgPath);
  
  // Generate each size
  for (const size of sizes) {
    const outputPath = path.join(publicDir, `icon-${size}.png`);
    
    try {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Generated icon-${size}.png`);
    } catch (error) {
      console.error(`✗ Failed to generate icon-${size}.png:`, error.message);
    }
  }
  
  // Also generate a favicon.ico (using 32x32)
  try {
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon.png'));
    
    console.log('✓ Generated favicon.png');
  } catch (error) {
    console.error('✗ Failed to generate favicon.png:', error.message);
  }
  
  // Create screenshots directory and placeholder screenshots
  const screenshotsDir = path.join(publicDir, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }
  
  // Generate placeholder screenshots
  const desktopSvg = `
    <svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
      <rect width="1920" height="1080" fill="#0f172a"/>
      <text x="960" y="540" font-family="Arial" font-size="48" fill="#fff" text-anchor="middle">
        Dragonfly Dashboard
      </text>
    </svg>
  `;
  
  const mobileSvg = `
    <svg width="750" height="1334" xmlns="http://www.w3.org/2000/svg">
      <rect width="750" height="1334" fill="#0f172a"/>
      <text x="375" y="667" font-family="Arial" font-size="32" fill="#fff" text-anchor="middle">
        Dragonfly Mobile
      </text>
    </svg>
  `;
  
  try {
    await sharp(Buffer.from(desktopSvg))
      .png()
      .toFile(path.join(screenshotsDir, 'desktop-1.png'));
    console.log('✓ Generated screenshots/desktop-1.png');
  } catch (error) {
    console.error('✗ Failed to generate desktop screenshot:', error.message);
  }
  
  try {
    await sharp(Buffer.from(mobileSvg))
      .png()
      .toFile(path.join(screenshotsDir, 'mobile-1.png'));
    console.log('✓ Generated screenshots/mobile-1.png');
  } catch (error) {
    console.error('✗ Failed to generate mobile screenshot:', error.message);
  }
  
  console.log('\\n✓ All icons and screenshots generated successfully!');
}

generateIcons().catch(console.error);
