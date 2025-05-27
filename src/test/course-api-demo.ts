import { courseAPI, courseTypesAPI } from '../apis/courses';
import type {
  ICollaborativeFetchParams,
  IAdvancedSearchParams,
  IBlendedCourse,
  ICurriculumWeek
} from '../apis/courses';

/**
 * Course API Demo - Practical Usage Examples
 * This file demonstrates how to use all the course APIs in real-world scenarios
 */

export class CourseAPIDemo {
  
  /**
   * Demo 1: Basic Course Fetching
   */
  static async basicCourseFetching() {
    console.log('\n🔍 Demo 1: Basic Course Fetching');
    console.log('================================\n');

    try {
      // Legacy API - Get all courses
      console.log('📚 Fetching courses using Legacy API...');
      const legacyCourses = await courseAPI.getAllCourses({
        page: 1,
        limit: 10,
        status: 'Published'
      });
      console.log('✅ Legacy courses fetched:', legacyCourses?.data?.courses?.length || 0);

      // New API - Collaborative fetch
      console.log('\n🤝 Fetching courses using Collaborative API...');
      const collaborativeCourses = await courseTypesAPI.fetchCollaborative({
        source: 'both',
        merge_strategy: 'unified',
        page: 1,
        limit: 10
      });
      console.log('✅ Collaborative courses fetched:', collaborativeCourses?.data?.data?.length || 0);

    } catch (error) {
      console.log('❌ Error in basic fetching:', error);
    }
  }

  /**
   * Demo 2: Advanced Search with Filters
   */
  static async advancedSearchDemo() {
    console.log('\n🔎 Demo 2: Advanced Search with Filters');
    console.log('=======================================\n');

    try {
      const searchParams: IAdvancedSearchParams = {
        search: 'React JavaScript',
        course_category: 'Technology',
        certification: 'Yes',
        has_assignments: 'Yes',
        price_range: '100-1000',
        sort_by: 'createdAt',
        sort_order: 'desc',
        group_by_type: true
      };

      console.log('🔍 Searching with parameters:', searchParams);
      
      const searchResults = await courseTypesAPI.advancedSearch(searchParams);
      
      console.log('✅ Search completed!');
      console.log('📊 Results:', {
        totalCourses: searchResults?.data?.data?.length || 0,
        hasFacets: !!searchResults?.data?.facets,
        categories: searchResults?.data?.facets?.categories?.length || 0,
        classTypes: searchResults?.data?.facets?.classTypes?.length || 0
      });

      // Parse facets for UI
      const parsedFacets = courseTypesAPI.utils.parseFacets(searchResults?.data?.facets);
      console.log('🏷️  Parsed facets for UI:', parsedFacets);

    } catch (error) {
      console.log('❌ Error in advanced search:', error);
    }
  }

  /**
   * Demo 3: Course Creation and Management
   */
  static async courseManagementDemo() {
    console.log('\n📝 Demo 3: Course Creation and Management');
    console.log('========================================\n');

    try {
      // Create pricing structure
      const pricing = courseTypesAPI.pricing.createMultiCurrencyPricing([
        { currency: 'USD', individual: 299, batch: 249 },
        { currency: 'EUR', individual: 259, batch: 219 },
        { currency: 'INR', individual: 19999, batch: 16999 }
      ]);

      console.log('💰 Created multi-currency pricing:', pricing);

      // Validate pricing
      const isValidPricing = courseTypesAPI.pricing.validatePricing(pricing);
      console.log('✅ Pricing validation:', isValidPricing);

      // Sample blended course
      const newCourse: Partial<IBlendedCourse> = {
        course_type: 'blended',
        course_category: 'Technology',
        course_title: 'Advanced React Development with TypeScript',
        course_level: 'Advanced',
        course_image: 'https://example.com/react-ts-course.jpg',
        course_description: {
          program_overview: 'Master React with TypeScript for enterprise applications',
          benefits: 'Learn advanced patterns, testing, and deployment strategies',
          learning_objectives: [
            'Advanced React patterns and hooks',
            'TypeScript integration',
            'Testing strategies',
            'Performance optimization'
          ],
          target_audience: ['Experienced React developers', 'Frontend engineers']
        },
        course_duration: '16 weeks',
        session_duration: '2.5 hours',
        prices: pricing,
        curriculum: [],
        tools_technologies: [
          { name: 'React', category: 'framework' },
          { name: 'TypeScript', category: 'programming_language' },
          { name: 'Jest', category: 'tool' }
        ]
      };

      console.log('📚 Creating new blended course...');
      const createdCourse = await courseTypesAPI.createCourse(newCourse as IBlendedCourse);
      console.log('✅ Course created successfully!');

      return createdCourse?.data?.data?._id;

    } catch (error) {
      console.log('❌ Error in course management:', error);
      return null;
    }
  }

  /**
   * Demo 4: Curriculum Management
   */
  static async curriculumManagementDemo(courseId: string) {
    console.log('\n📖 Demo 4: Curriculum Management');
    console.log('================================\n');

    if (!courseId) {
      console.log('⚠️  No course ID provided, skipping curriculum demo');
      return;
    }

    try {
      // Create curriculum week
      const week1: Omit<ICurriculumWeek, '_id'> = {
        title: 'Introduction to Advanced React Patterns',
        description: 'Learn compound components, render props, and higher-order components',
        order: 1,
        lessons: [
          {
            title: 'Compound Components Pattern',
            description: 'Building flexible and reusable component APIs',
            content_type: 'video',
            content_url: 'https://example.com/lesson1.mp4',
            duration: 45,
            order: 1,
            is_preview: true
          },
          {
            title: 'Render Props Pattern',
            description: 'Sharing code between components using render props',
            content_type: 'video',
            content_url: 'https://example.com/lesson2.mp4',
            duration: 40,
            order: 2,
            is_preview: false
          }
        ]
      };

      console.log('📝 Adding week to curriculum...');
      const addedWeek = await courseTypesAPI.curriculum.addWeek('blended', courseId, week1);
      console.log('✅ Week added successfully!');

      const weekId = addedWeek?.data?.week?._id;
      
      if (weekId) {
        // Add additional lesson
        console.log('📚 Adding additional lesson...');
        await courseTypesAPI.curriculum.addLesson('blended', courseId, weekId, {
          title: 'Higher-Order Components',
          description: 'Creating reusable logic with HOCs',
          content_type: 'video',
          content_url: 'https://example.com/lesson3.mp4',
          duration: 35,
          order: 3,
          is_preview: false
        });
        console.log('✅ Lesson added successfully!');

        // Get curriculum stats
        const stats = await courseTypesAPI.curriculum.getStats('blended', courseId);
        console.log('📊 Curriculum statistics:', stats?.data?.stats);
      }

    } catch (error) {
      console.log('❌ Error in curriculum management:', error);
    }
  }

  /**
   * Demo 5: Migration Analysis
   */
  static async migrationAnalysisDemo() {
    console.log('\n🔄 Demo 5: Migration Analysis');
    console.log('=============================\n');

    try {
      console.log('📊 Getting migration analysis...');
      const analysis = await courseTypesAPI.migration.getAnalysis({
        comparison_mode: 'detailed'
      });

      console.log('✅ Migration analysis completed!');
      
      if (analysis?.data?.comparison) {
        console.log('📈 Migration insights:', {
          newCoursesCount: analysis.data.comparison.summary?.new_courses_count || 0,
          legacyCoursesCount: analysis.data.comparison.summary?.legacy_courses_count || 0,
          totalCourses: analysis.data.comparison.summary?.total_courses || 0
        });

        if (analysis.data.comparison.detailed) {
          console.log('🔍 Schema differences:', {
            newOnlyFields: analysis.data.comparison.detailed.schema_differences.new_only_fields.length,
            legacyOnlyFields: analysis.data.comparison.detailed.schema_differences.legacy_only_fields.length,
            commonFields: analysis.data.comparison.detailed.schema_differences.common_fields.length
          });
        }
      }

      // Extract performance insights
      const insights = courseTypesAPI.utils.extractPerformanceInsights(analysis?.data?.metadata);
      console.log('⚡ Performance insights:', insights);

    } catch (error) {
      console.log('❌ Error in migration analysis:', error);
    }
  }

  /**
   * Demo 6: Performance Monitoring
   */
  static async performanceMonitoringDemo() {
    console.log('\n⚡ Demo 6: Performance Monitoring');
    console.log('=================================\n');

    try {
      console.log('📊 Getting performance metrics...');
      const metrics = await courseTypesAPI.performance.getMetrics({
        include_breakdown: true
      });

      console.log('✅ Performance metrics retrieved!');
      
      if (metrics?.data?.metadata?.performance) {
        const performance = metrics.data.metadata.performance;
        console.log('🚀 Performance breakdown:', {
          newModelTime: performance.new_model?.fetch_time_ms || 0,
          legacyModelTime: performance.legacy_model?.fetch_time_ms || 0,
          totalTime: (performance.new_model?.fetch_time_ms || 0) + (performance.legacy_model?.fetch_time_ms || 0)
        });
      }

      // Test deduplication performance
      console.log('\n🔍 Testing deduplication performance...');
      const deduplicationTest = await courseTypesAPI.performance.testDeduplication(0.85);
      
      if (deduplicationTest?.data?.metadata?.deduplication) {
        console.log('✅ Deduplication test completed:', {
          duplicatesRemoved: deduplicationTest.data.metadata.deduplication.duplicates_removed,
          processingTime: deduplicationTest.data.metadata.deduplication.processing_time_ms
        });
      }

    } catch (error) {
      console.log('❌ Error in performance monitoring:', error);
    }
  }

  /**
   * Demo 7: Specialized Course Type Methods
   */
  static async specializedMethodsDemo(courseId: string) {
    console.log('\n🎯 Demo 7: Specialized Course Type Methods');
    console.log('==========================================\n');

    if (!courseId) {
      console.log('⚠️  No course ID provided, skipping specialized methods demo');
      return;
    }

    try {
      // Blended course - Create doubt session
      console.log('❓ Creating doubt session for blended course...');
      await courseTypesAPI.blended.createDoubtSession(courseId, {
        title: 'React Patterns Q&A Session',
        scheduled_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        duration: 90
      });
      console.log('✅ Doubt session created!');

      // Update doubt schedule
      console.log('📅 Updating doubt session schedule...');
      await courseTypesAPI.blended.updateDoubtSchedule(courseId, {
        frequency: 'weekly',
        preferred_days: ['Saturday', 'Sunday'],
        preferred_time_slots: [{
          start_time: '10:00',
          end_time: '11:30',
          timezone: 'UTC'
        }]
      });
      console.log('✅ Doubt schedule updated!');

    } catch (error) {
      console.log('❌ Error in specialized methods:', error);
    }
  }

  /**
   * Demo 8: Error Handling
   */
  static async errorHandlingDemo() {
    console.log('\n🚨 Demo 8: Error Handling');
    console.log('=========================\n');

    // Test invalid course ID
    try {
      await courseAPI.getCourseById('');
    } catch (error) {
      console.log('✅ Correctly caught empty course ID error');
    }

    // Test invalid course type
    try {
      await courseTypesAPI.getCourseById('invalid_type' as any, 'some_id');
    } catch (error) {
      console.log('✅ Correctly caught invalid course type error');
    }

    // Test invalid pricing
    const invalidPricing = [{ invalid: 'data' }] as any[];
    const isValid = courseTypesAPI.pricing.validatePricing(invalidPricing);
    console.log('✅ Invalid pricing validation result:', isValid);

    console.log('✅ Error handling tests completed!');
  }

  /**
   * Run all demos
   */
  static async runAllDemos() {
    console.log('\n🎬 Starting Course API Comprehensive Demo');
    console.log('==========================================\n');

    const startTime = Date.now();

    try {
      // Run demos in sequence
      await this.basicCourseFetching();
      await this.advancedSearchDemo();
      
      const courseId = await this.courseManagementDemo();
      
      if (courseId) {
        await this.curriculumManagementDemo(courseId);
        await this.specializedMethodsDemo(courseId);
      }
      
      await this.migrationAnalysisDemo();
      await this.performanceMonitoringDemo();
      await this.errorHandlingDemo();

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log('\n🎉 All demos completed successfully!');
      console.log(`⏱️  Total duration: ${duration}ms`);
      console.log('==========================================\n');

      return {
        success: true,
        duration,
        courseId,
        message: 'All API demos completed successfully'
      };

    } catch (error) {
      console.log('\n❌ Demo failed:', error);
      return {
        success: false,
        error,
        message: 'Demo encountered errors'
      };
    }
  }
}

/**
 * Utility functions for testing
 */
export const testUtils = {
  // Generate mock course data
  generateMockCourse: (type: 'blended' | 'live' | 'free') => {
    const baseData = {
      course_category: 'Technology',
      course_title: `Mock ${type} Course`,
      course_level: 'Intermediate' as const,
      course_image: 'https://example.com/mock-course.jpg',
      course_description: {
        program_overview: `Mock ${type} course for testing`,
        benefits: 'Learn testing and development practices'
      }
    };

    switch (type) {
      case 'blended':
        return {
          ...baseData,
          course_type: 'blended' as const,
          course_duration: '8 weeks',
          session_duration: '2 hours',
          curriculum: []
        };
      case 'live':
        return {
          ...baseData,
          course_type: 'live' as const,
          course_schedule: {
            start_date: new Date(),
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            session_days: ['Monday', 'Wednesday'],
            session_time: '18:00',
            timezone: 'UTC'
          },
          total_sessions: 16,
          session_duration: 90,
          modules: [],
          max_students: 25
        };
      case 'free':
        return {
          ...baseData,
          course_type: 'free' as const,
          estimated_duration: '4 weeks',
          lessons: []
        };
    }
  },

  // Generate test parameters
  generateTestParams: (): ICollaborativeFetchParams => ({
    source: 'both',
    merge_strategy: 'unified',
    deduplicate: true,
    include_metadata: true,
    page: 1,
    limit: 10,
    sort_by: 'createdAt',
    sort_order: 'desc'
  }),

  // Log test results
  logTestResult: (testName: string, success: boolean, data?: any) => {
    const icon = success ? '✅' : '❌';
    console.log(`${icon} ${testName}:`, data || (success ? 'Success' : 'Failed'));
  }
};

// Export for use in other files
export default CourseAPIDemo; 