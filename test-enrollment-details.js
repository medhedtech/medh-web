#!/usr/bin/env node

// Simple test to check if the EnrollmentDetails component has any obvious infinite loop patterns
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/sections/course-detailed/EnrollmentDetails.tsx');
const content = fs.readFileSync(filePath, 'utf8');

// Check for potential infinite loop patterns
const patterns = [
  // useEffect with function dependencies
  /useEffect\([^}]*\), \[[^\]]*(?:getQuery|refetch|toggleWishlist|handleEnrollClick)[^\]]*\]/g,
  // useCallback with changing dependencies
  /useCallback\([^}]*\), \[[^\]]*(?:getFinalPrice|calculateCouponDiscount)[^\]]*\]/g,
  // Missing dependency arrays
  /useEffect\([^}]*\)\s*;\s*$/gm,
  // Circular dependencies
  /const\s+(\w+)\s*=.*useCallback.*\[.*\1.*\]/g
];

let hasIssues = false;

patterns.forEach((pattern, index) => {
  const matches = content.match(pattern);
  if (matches) {
    console.log(`❌ Pattern ${index + 1} found potential issues:`, matches.length);
    matches.forEach(match => {
      console.log(`  - ${match.substring(0, 100)}...`);
    });
    hasIssues = true;
  }
});

// Check for proper cleanup
const hasAbortController = content.includes('AbortController');
const hasCleanupEffect = content.includes('return () => {');

console.log('\n🔍 Cleanup Analysis:');
console.log(`- AbortController present: ${hasAbortController ? '✅' : '❌'}`);
console.log(`- Cleanup effects present: ${hasCleanupEffect ? '✅' : '❌'}`);

// Check for stable memoization
const hasMemoization = content.includes('useMemo(');
const hasStableQueryKey = content.includes('wishlistQueryKey');

console.log('\n🔍 Memoization Analysis:');
console.log(`- useMemo present: ${hasMemoization ? '✅' : '❌'}`);
console.log(`- Stable query key: ${hasStableQueryKey ? '✅' : '❌'}`);

if (!hasIssues) {
  console.log('\n✅ No obvious infinite loop patterns detected!');
} else {
  console.log('\n❌ Potential infinite loop patterns found. Please review the code.');
}

// Clean up test file
fs.unlinkSync(__filename);