#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('Fixing courses.json file...');

const coursesPath = path.join(__dirname, '../public/fakedata/courses.json');
const backupPath = path.join(__dirname, '../public/fakedata/courses.json.backup');

try {
  // Read the malformed JSON file
  const content = fs.readFileSync(coursesPath, 'utf8');
  
  // Split by lines and reconstruct as array
  const lines = content.split('\n');
  let currentObject = '';
  let braceCount = 0;
  const objects = [];
  
  for (const line of lines) {
    currentObject += line + '\n';
    
    // Count braces to detect complete objects
    for (const char of line) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
    }
    
    // When braces are balanced, we have a complete object
    if (braceCount === 0 && currentObject.trim()) {
      try {
        const obj = JSON.parse(currentObject.trim());
        objects.push(obj);
        currentObject = '';
      } catch (parseError) {
        console.warn('Skipping malformed object:', parseError.message);
        currentObject = '';
      }
    }
  }
  
  console.log(`Found ${objects.length} course objects`);
  
  // Write as proper JSON array
  const validJson = JSON.stringify(objects, null, 2);
  fs.writeFileSync(coursesPath, validJson, 'utf8');
  
  console.log('✅ Successfully fixed courses.json file');
  console.log(`📁 Backup saved as: ${backupPath}`);
  
} catch (error) {
  console.error('❌ Error fixing courses.json:', error.message);
  process.exit(1);
} 