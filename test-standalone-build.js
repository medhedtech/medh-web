#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🧪 ========== STANDALONE BUILD TEST ==========');

try {
  // Clean previous build
  console.log('🧹 Cleaning previous build...');
  if (fs.existsSync('.next')) {
    execSync('rm -rf .next', { stdio: 'inherit' });
  }
  
  // Set environment variables for build
  process.env.NEXT_TELEMETRY_DISABLED = '1';
  process.env.GENERATE_SOURCEMAP = 'false';
  
  console.log('🔨 Building Next.js application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Check if standalone folder exists
  const standalonePath = '.next/standalone';
  if (!fs.existsSync(standalonePath)) {
    console.error('❌ .next/standalone folder not found!');
    console.log('💡 Make sure output: "standalone" is set in next.config.js');
    process.exit(1);
  }
  
  console.log('✅ .next/standalone folder found!');
  
  // Get folder sizes
  function getFolderSize(folderPath) {
    let totalSize = 0;
    
    function calculateSize(currentPath) {
      const stats = fs.statSync(currentPath);
      
      if (stats.isFile()) {
        totalSize += stats.size;
      } else if (stats.isDirectory()) {
        const files = fs.readdirSync(currentPath);
        files.forEach(file => {
          calculateSize(path.join(currentPath, file));
        });
      }
    }
    
    calculateSize(folderPath);
    return totalSize;
  }
  
  // Calculate sizes
  const standaloneSize = getFolderSize(standalonePath);
  const totalNextSize = getFolderSize('.next');
  
  console.log('\n📊 ========== BUILD SIZE ANALYSIS ==========');
  console.log(`📁 .next/standalone size: ${(standaloneSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📁 Total .next size: ${(totalNextSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📊 Size reduction: ${(((totalNextSize - standaloneSize) / totalNextSize) * 100).toFixed(1)}%`);
  
  // Amplify size limit check
  const amplifyLimit = 230686720; // bytes
  console.log(`\n🔍 Amplify size limit: ${(amplifyLimit / 1024 / 1024).toFixed(2)} MB`);
  
  if (standaloneSize <= amplifyLimit) {
    console.log('✅ Standalone build is within Amplify size limit!');
    console.log(`📊 Available space: ${((amplifyLimit - standaloneSize) / 1024 / 1024).toFixed(2)} MB`);
  } else {
    console.log('❌ Standalone build exceeds Amplify size limit!');
    console.log(`📊 Excess size: ${((standaloneSize - amplifyLimit) / 1024 / 1024).toFixed(2)} MB`);
  }
  
  // List contents of standalone folder
  console.log('\n📂 Standalone folder contents:');
  const standaloneContents = fs.readdirSync(standalonePath);
  standaloneContents.forEach(item => {
    const itemPath = path.join(standalonePath, item);
    const stats = fs.statSync(itemPath);
    const size = stats.isDirectory() ? 'DIR' : `${(stats.size / 1024).toFixed(1)}KB`;
    console.log(`   ${stats.isDirectory() ? '📁' : '📄'} ${item} (${size})`);
  });
  
  console.log('\n🎉 ========== TEST COMPLETE ==========');
  console.log('✅ Standalone build generated successfully!');
  console.log('💡 You can now deploy to Amplify with the updated amplify.yml');
  
} catch (error) {
  console.error('❌ Build test failed:', error.message);
  process.exit(1);
}
