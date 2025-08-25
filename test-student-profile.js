#!/usr/bin/env node

/**
 * Test StudentProfilePage Syntax
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing StudentProfilePage syntax...');

try {
  const filePath = path.join(__dirname, 'src/components/sections/dashboards/StudentProfilePage.tsx');
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for basic syntax issues
  const issues = [];
  
  // Check for brace balance
  const openBraces = (content.match(/\{/g) || []).length;
  const closeBraces = (content.match(/\}/g) || []).length;
  
  console.log(`📊 Braces: ${openBraces} open, ${closeBraces} close`);
  
  if (openBraces !== closeBraces) {
    issues.push(`Brace mismatch: ${openBraces} open, ${closeBraces} close`);
  }
  
  // Check for function declaration
  const functionMatch = content.match(/const StudentProfilePage.*=.*\(.*\)\s*=>\s*\{/);
  if (!functionMatch) {
    issues.push('Function declaration not found');
  } else {
    console.log('✅ Function declaration found');
  }
  
  // Check for export statement
  const exportMatch = content.match(/export default StudentProfilePage/);
  if (!exportMatch) {
    issues.push('Export statement not found');
  } else {
    console.log('✅ Export statement found');
  }
  
  // Check for extra semicolons
  const extraSemicolons = content.match(/;\s*;/g);
  if (extraSemicolons) {
    issues.push(`Extra semicolons found: ${extraSemicolons.length}`);
  }
  
  // Check the end of the file
  const lines = content.split('\n');
  const lastLines = lines.slice(-5);
  console.log('📝 Last 5 lines:');
  lastLines.forEach((line, index) => {
    console.log(`  ${lines.length - 5 + index + 1}: ${line.trim()}`);
  });
  
  if (issues.length > 0) {
    console.log('❌ Issues found:');
    issues.forEach(issue => console.log('  -', issue));
    process.exit(1);
  } else {
    console.log('✅ No syntax issues detected');
  }
  
} catch (error) {
  console.log('❌ Error testing file:', error.message);
  process.exit(1);
}
