#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const mainConfig = path.join(rootDir, 'next.config.js');
const marketingConfig = path.join(rootDir, 'next.config.marketing.js');
const backupConfig = path.join(rootDir, 'next.config.js.backup');
const srcDir = path.join(rootDir, 'src');
const appDir = path.join(srcDir, 'app');
const marketingAppDir = path.join(srcDir, 'marketing', 'app');
const appBackup = path.join(srcDir, 'app.backup');

console.log('🚀 Building marketing site...');

try {
  // Backup main config
  console.log('📦 Backing up main config...');
  fs.copyFileSync(mainConfig, backupConfig);
  
  // Backup main app directory
  console.log('📦 Backing up main app directory...');
  fs.renameSync(appDir, appBackup);
  
  // Move marketing app to main app location
  console.log('🔄 Switching to marketing app...');
  fs.renameSync(marketingAppDir, appDir);
  
  // Copy marketing config to main config
  console.log('🔄 Switching to marketing config...');
  fs.copyFileSync(marketingConfig, mainConfig);
  
  // Set placeholder env vars for build
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://placeholder.supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'placeholder-key';
  
  // Run build
  console.log('🔨 Running Next.js build...');
  execSync('next build', { 
    stdio: 'inherit',
    cwd: rootDir,
    env: { ...process.env }
  });
  
  console.log('✅ Marketing site built successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} finally {
  // Restore marketing app
  console.log('🔄 Restoring directories...');
  if (fs.existsSync(appDir)) {
    fs.renameSync(appDir, marketingAppDir);
  }
  
  // Restore main app
  if (fs.existsSync(appBackup)) {
    fs.renameSync(appBackup, appDir);
  }
  
  // Restore main config
  console.log('🔄 Restoring main config...');
  if (fs.existsSync(backupConfig)) {
    fs.copyFileSync(backupConfig, mainConfig);
    fs.unlinkSync(backupConfig);
  }
}
