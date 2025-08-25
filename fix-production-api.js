#!/usr/bin/env node

/**
 * Fix Production API URL Script
 * 
 * This script fixes the production API URL configuration
 * to ensure the frontend uses the correct production API
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔧 Fixing Production API URL Configuration...\n');

// Check current environment files
const envFiles = [
  '.env',
  '.env.production',
  '.env.local',
  '.env.development'
];

console.log('📋 Checking environment files...');

envFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ Found: ${file}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Check for localhost API URL
    const localhostIndex = lines.findIndex(line => 
      line.includes('NEXT_PUBLIC_API_URL') && line.includes('localhost')
    );
    
    if (localhostIndex !== -1) {
      console.log(`⚠️  Found localhost URL in ${file}: ${lines[localhostIndex]}`);
      
      // Replace with production URL
      lines[localhostIndex] = 'NEXT_PUBLIC_API_URL=https://api.medh.co';
      
      // Write back the file
      const updatedContent = lines.join('\n');
      fs.writeFileSync(filePath, updatedContent);
      
      console.log(`✅ Fixed ${file}: Updated to production URL`);
    } else {
      console.log(`✅ ${file}: No localhost URL found`);
    }
  } else {
    console.log(`❌ Not found: ${file}`);
  }
});

// Create a production-specific environment file
console.log('\n📦 Creating production environment file...');

const productionEnvContent = `# Production Environment Configuration
# This file ensures production API URL is used

# API Configuration
NEXT_PUBLIC_API_URL=https://api.medh.co

# Environment
NODE_ENV=production

# Force production mode
NEXT_PUBLIC_FORCE_PRODUCTION=true

# Disable development features
NEXT_PUBLIC_ENABLE_DEV_TOOLS=false
NEXT_PUBLIC_ENABLE_DEBUG=false

# Performance optimizations
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_TRACKING=true

# Security
NEXT_PUBLIC_ENABLE_HTTPS=true
NEXT_PUBLIC_ENABLE_CSP=true
`;

const productionEnvPath = path.join(__dirname, '.env.production');
fs.writeFileSync(productionEnvPath, productionEnvContent);
console.log('✅ Created .env.production with correct configuration');

// Update the main .env file to use production URL
console.log('\n🔧 Updating main .env file...');

const mainEnvPath = path.join(__dirname, '.env');
if (fs.existsSync(mainEnvPath)) {
  let content = fs.readFileSync(mainEnvPath, 'utf8');
  
  // Replace any localhost API URLs
  content = content.replace(
    /NEXT_PUBLIC_API_URL=http:\/\/localhost:\d+\/api\/v1/g,
    'NEXT_PUBLIC_API_URL=https://api.medh.co'
  );
  
  // Ensure NODE_ENV is set to production
  if (!content.includes('NODE_ENV=production')) {
    content += '\n# Force production environment\nNODE_ENV=production\n';
  }
  
  fs.writeFileSync(mainEnvPath, content);
  console.log('✅ Updated main .env file');
}

// Create a build script that ensures production configuration
console.log('\n📝 Creating production build script...');

const buildScriptContent = `#!/bin/bash

# Production Build Script
echo "🚀 Building for production..."

# Ensure production environment
export NODE_ENV=production
export NEXT_PUBLIC_API_URL=https://api.medh.co

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf .next
rm -rf out

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the application
echo "🔨 Building application..."
npm run build

# Verify the build
echo "✅ Build completed!"
echo "📊 Build size:"
du -sh .next

echo "🌐 API URL configured: https://api.medh.co"
echo "🚀 Ready for deployment!"
`;

const buildScriptPath = path.join(__dirname, 'build-production.sh');
fs.writeFileSync(buildScriptPath, buildScriptContent);
fs.chmodSync(buildScriptPath, '755');
console.log('✅ Created build-production.sh script');

// Create a verification script
console.log('\n🧪 Creating verification script...');

const verifyScriptContent = `#!/usr/bin/env node

/**
 * Verify Production Configuration
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔍 Verifying Production Configuration...\\n');

// Check environment variables
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  
  // Check API URL
  const apiUrlMatch = content.match(/NEXT_PUBLIC_API_URL=(.+)/);
  if (apiUrlMatch) {
    const apiUrl = apiUrlMatch[1];
    console.log('🌐 API URL:', apiUrl);
    
    if (apiUrl.includes('localhost')) {
      console.log('❌ ERROR: Still using localhost URL!');
      console.log('💡 Run: node fix-production-api.js');
      process.exit(1);
    } else {
      console.log('✅ API URL is correct (production)');
    }
  }
  
  // Check NODE_ENV
  const nodeEnvMatch = content.match(/NODE_ENV=(.+)/);
  if (nodeEnvMatch) {
    console.log('🔧 NODE_ENV:', nodeEnvMatch[1]);
  }
}

// Check if .env.production exists
const prodEnvPath = path.join(__dirname, '.env.production');
if (fs.existsSync(prodEnvPath)) {
  console.log('✅ .env.production file exists');
} else {
  console.log('❌ .env.production file missing');
}

console.log('\\n🎉 Configuration verification completed!');
`;

const verifyScriptPath = path.join(__dirname, 'verify-production.js');
fs.writeFileSync(verifyScriptPath, verifyScriptContent);
console.log('✅ Created verify-production.js script');

console.log('\n✅ Production API URL fix completed!');
console.log(`
📋 Summary of changes:

1. ✅ Updated .env files to use production API URL
2. ✅ Created .env.production with correct configuration
3. ✅ Created build-production.sh script
4. ✅ Created verify-production.js script

🚀 Next Steps:

1. Build for production:
   chmod +x build-production.sh
   ./build-production.sh

2. Verify configuration:
   node verify-production.js

3. Deploy the application

💡 The frontend will now use https://api.medh.co instead of localhost
`);
