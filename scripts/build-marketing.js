#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const mainConfig = path.join(rootDir, 'next.config.js');
const marketingConfig = path.join(rootDir, 'next.config.marketing.js');
const backupConfig = path.join(rootDir, 'next.config.js.backup');

console.log('🚀 Building marketing site...');

try {
  // Backup main config
  console.log('📦 Backing up main config...');
  fs.copyFileSync(mainConfig, backupConfig);
  
  // Copy marketing config to main config
  console.log('🔄 Switching to marketing config...');
  fs.copyFileSync(marketingConfig, mainConfig);
  
  // Run build
  console.log('🔨 Running Next.js build...');
  execSync('next build', { 
    stdio: 'inherit',
    cwd: rootDir 
  });
  
  console.log('✅ Marketing site built successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} finally {
  // Restore main config
  console.log('🔄 Restoring main config...');
  if (fs.existsSync(backupConfig)) {
    fs.copyFileSync(backupConfig, mainConfig);
    fs.unlinkSync(backupConfig);
  }
}
