#!/usr/bin/env node

/**
 * Verify Production Configuration
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔍 Verifying Production Configuration...\n');

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

console.log('\n🎉 Configuration verification completed!');
