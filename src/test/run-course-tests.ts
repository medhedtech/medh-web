#!/usr/bin/env ts-node

import { runAllCourseAPITests, testCategories, usageExamples } from './courses.api.test.js';

/**
 * Course API Test Runner
 * Execute this file to run comprehensive tests for all course APIs
 */

async function main() {
  console.log('🎯 Course API Test Runner');
  console.log('========================\n');

  // Check if specific test category is requested
  const args = process.argv.slice(2);
  const testCategory = args[0];

  if (testCategory && testCategories[testCategory as keyof typeof testCategories]) {
    console.log(`🔍 Running specific test category: ${testCategory}`);
    testCategories[testCategory as keyof typeof testCategories]();
    return;
  }

  // Show usage examples first
  console.log('📚 API Usage Examples:');
  console.log('======================\n');

  console.log('1. Basic Collaborative Fetch:');
  console.log('   courseTypesAPI.fetchCollaborative({ source: "both", merge_strategy: "unified" })');

  console.log('\n2. Advanced Search:');
  console.log('   courseTypesAPI.advancedSearch({ search: "React", certification: "Yes" })');

  console.log('\n3. Migration Analysis:');
  console.log('   courseTypesAPI.migration.getAnalysis({ comparison_mode: "detailed" })');

  console.log('\n4. Performance Monitoring:');
  console.log('   courseTypesAPI.performance.getMetrics({ include_breakdown: true })');

  console.log('\n5. Curriculum Management:');
  console.log('   courseTypesAPI.curriculum.getCurriculum("blended", courseId)');

  console.log('\n6. Pricing Utilities:');
  console.log('   courseTypesAPI.pricing.createPrice("USD", 299, 249)');

  console.log('\n' + '='.repeat(60) + '\n');

  // Run all tests
  try {
    const result = await runAllCourseAPITests();
    
    if (result.success) {
      console.log('\n🎉 All tests completed successfully!');
      console.log(`📊 Results: ${result.totalTests} tests in ${result.duration}ms`);
    } else {
      console.log('\n💥 Tests failed:', result.error);
    }
  } catch (error) {
    console.error('\n❌ Test runner error:', error);
  }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Course API Test Runner Help
===========================

Usage:
  npm run test:courses                    # Run all tests
  npm run test:courses legacy            # Run legacy API tests only
  npm run test:courses newAPI            # Run new API tests only
  npm run test:courses curriculum        # Run curriculum tests only
  npm run test:courses specialized       # Run specialized method tests
  npm run test:courses pricing           # Run pricing utility tests
  npm run test:courses migration         # Run migration tool tests
  npm run test:courses performance       # Run performance monitoring tests
  npm run test:courses utils             # Run utility method tests
  npm run test:courses errorHandling     # Run error handling tests

Available test categories:
- legacy: Legacy Course API tests
- newAPI: New Course Types API tests
- curriculum: Curriculum Management tests
- specialized: Specialized course type methods
- pricing: Pricing utility tests
- migration: Migration and analysis tools
- performance: Performance monitoring tests
- utils: Utility method tests
- errorHandling: Error handling tests

Examples:
  ts-node src/test/run-course-tests.ts
  ts-node src/test/run-course-tests.ts legacy
  ts-node src/test/run-course-tests.ts --help
`);
  process.exit(0);
}

// Run the main function
main().catch(console.error); 