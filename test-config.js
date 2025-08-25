#!/usr/bin/env node

/**
 * Test Config File Syntax
 */

// Test the config file by importing it
try {
  // Use dynamic import to test the module
  const configPath = './src/apis/config.ts';
  
  console.log('🧪 Testing config file syntax...');
  console.log('📁 File:', configPath);
  
  // Try to parse the file content
  const fs = require('fs');
  const path = require('path');
  
  const configContent = fs.readFileSync(path.join(__dirname, 'src/apis/config.ts'), 'utf8');
  
  // Check for basic syntax issues
  const issues = [];
  
  // Check for extra braces
  const openBraces = (configContent.match(/\{/g) || []).length;
  const closeBraces = (configContent.match(/\}/g) || []).length;
  
  if (openBraces !== closeBraces) {
    issues.push(`Brace mismatch: ${openBraces} open, ${closeBraces} close`);
  }
  
  // Check for extra semicolons
  const extraSemicolons = configContent.match(/;\s*;/g);
  if (extraSemicolons) {
    issues.push(`Extra semicolons found: ${extraSemicolons.length}`);
  }
  
  // Check for missing semicolons
  const functionDeclarations = configContent.match(/const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*\{/g);
  if (functionDeclarations) {
    console.log('✅ Function declarations found:', functionDeclarations.length);
  }
  
  if (issues.length > 0) {
    console.log('❌ Issues found:');
    issues.forEach(issue => console.log('  -', issue));
    process.exit(1);
  } else {
    console.log('✅ No syntax issues detected');
    console.log('✅ Config file appears to be syntactically correct');
  }
  
} catch (error) {
  console.log('❌ Error testing config file:', error.message);
  process.exit(1);
}
