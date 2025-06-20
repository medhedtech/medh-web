#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Performance check script
class PerformanceChecker {
  constructor() {
    this.bundleThreshold = 250 * 1024; // 250KB warning threshold
    this.criticalThreshold = 500 * 1024; // 500KB critical threshold
    this.issues = [];
  }

  checkBundleSizes() {
    const buildDir = path.join(process.cwd(), '.next/static/chunks');
    
    if (!fs.existsSync(buildDir)) {
      console.log('❌ Build directory not found. Run "npm run build" first.');
      return false;
    }

    const chunks = fs.readdirSync(buildDir)
      .filter(file => file.endsWith('.js'))
      .map(file => {
        const filePath = path.join(buildDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          path: filePath
        };
      })
      .sort((a, b) => b.size - a.size);

    console.log('\n📊 Bundle Size Analysis:');
    console.log('='.repeat(50));

    chunks.forEach(chunk => {
      const sizeKB = (chunk.size / 1024).toFixed(2);
      let status = '✅';
      
      if (chunk.size > this.criticalThreshold) {
        status = '🔴';
        this.issues.push(`CRITICAL: ${chunk.name} is ${sizeKB}KB (over 500KB limit)`);
      } else if (chunk.size > this.bundleThreshold) {
        status = '⚠️';
        this.issues.push(`WARNING: ${chunk.name} is ${sizeKB}KB (over 250KB threshold)`);
      }
      
      console.log(`${status} ${chunk.name}: ${sizeKB}KB`);
    });

    return chunks;
  }

  checkFramerMotionUsage() {
    const componentDirs = [
      'src/components',
      'src/app'
    ];

    let framerMotionCount = 0;
    const framerFiles = [];

    const searchInDir = (dir) => {
      if (!fs.existsSync(dir)) return;
      
      const files = fs.readdirSync(dir, { withFileTypes: true });
      
      files.forEach(file => {
        const fullPath = path.join(dir, file.name);
        
        if (file.isDirectory()) {
          searchInDir(fullPath);
        } else if (file.name.match(/\.(tsx?|jsx?)$/)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          
          if (content.includes('framer-motion')) {
            framerMotionCount++;
            framerFiles.push(fullPath);
          }
        }
      });
    };

    componentDirs.forEach(searchInDir);

    console.log('\n🎬 Framer Motion Usage Analysis:');
    console.log('='.repeat(50));
    console.log(`Total files using Framer Motion: ${framerMotionCount}`);
    
    if (framerMotionCount > 20) {
      this.issues.push(`HIGH: ${framerMotionCount} files use Framer Motion (consider reducing for better performance)`);
      console.log('⚠️  High usage detected - consider optimizing animations');
    }

    return { count: framerMotionCount, files: framerFiles };
  }

  checkImageOptimization() {
    const publicDir = path.join(process.cwd(), 'public');
    let totalSize = 0;
    let largeImages = [];

    const checkImagesInDir = (dir) => {
      if (!fs.existsSync(dir)) return;
      
      const files = fs.readdirSync(dir, { withFileTypes: true });
      
      files.forEach(file => {
        const fullPath = path.join(dir, file.name);
        
        if (file.isDirectory()) {
          checkImagesInDir(fullPath);
        } else if (file.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
          const stats = fs.statSync(fullPath);
          totalSize += stats.size;
          
          if (stats.size > 100 * 1024) { // 100KB threshold
            largeImages.push({
              name: file.name,
              size: (stats.size / 1024).toFixed(2),
              path: fullPath
            });
          }
        }
      });
    };

    checkImagesInDir(publicDir);

    console.log('\n🖼️  Image Optimization Analysis:');
    console.log('='.repeat(50));
    console.log(`Total image size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Large images (>100KB): ${largeImages.length}`);
    
    if (largeImages.length > 0) {
      this.issues.push(`${largeImages.length} large images found that could be optimized`);
      largeImages.slice(0, 5).forEach(img => {
        console.log(`  ⚠️  ${img.name}: ${img.size}KB`);
      });
    }

    return { totalSize, largeImages };
  }

  generateReport() {
    console.log('\n📈 Performance Report Summary:');
    console.log('='.repeat(50));
    
    if (this.issues.length === 0) {
      console.log('✅ No major performance issues detected!');
    } else {
      console.log('⚠️  Issues found:');
      this.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
      });
    }

    console.log('\n💡 Recommendations:');
    console.log('- Use dynamic imports for large components');
    console.log('- Optimize images with next/image');
    console.log('- Reduce Framer Motion usage where possible');
    console.log('- Enable gzip compression');
    console.log('- Use React.memo for expensive components');
    
    return this.issues;
  }

  run() {
    console.log('🚀 Running Performance Check...\n');
    
    this.checkBundleSizes();
    this.checkFramerMotionUsage();
    this.checkImageOptimization();
    this.generateReport();
    
    return this.issues.length === 0;
  }
}

// Run the checker
const checker = new PerformanceChecker();
const success = checker.run();

process.exit(success ? 0 : 1); 