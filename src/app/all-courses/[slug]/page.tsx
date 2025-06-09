'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

interface CourseMapping {
  slug: string;
  courseId?: string;
  redirectPath?: string;
  courseName: string;
  category: string;
}

// Course mappings for different URL patterns
const COURSE_MAPPINGS: CourseMapping[] = [
  {
    slug: 'personality-development-course-ug-graduate-professionals-duration-9months',
    courseId: '67c0597b8a56e7688ddc1496', // The specific course ID you mentioned
    courseName: 'Personality Development Course',
    category: 'Personality Development'
  },
  {
    slug: 'personality-development-course',
    redirectPath: '/personality-development-course',
    courseName: 'Personality Development Course',
    category: 'Personality Development'
  },
  {
    slug: 'ai-and-data-science-course',
    redirectPath: '/ai-and-data-science-course',
    courseName: 'AI and Data Science Course',
    category: 'AI & Data Science'
  },
  {
    slug: 'vedic-mathematics-course',
    redirectPath: '/vedic-mathematics-course',
    courseName: 'Vedic Mathematics Course',
    category: 'Vedic Mathematics'
  },
  {
    slug: 'digital-marketing-with-data-analytics-course',
    redirectPath: '/digital-marketing-with-data-analytics-course',
    courseName: 'Digital Marketing with Data Analytics',
    category: 'Digital Marketing'
  }
];

const CourseSlugPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseMapping, setCourseMapping] = useState<CourseMapping | null>(null);

  useEffect(() => {
    const slug = params?.slug as string;
    
    if (!slug) {
      setError('Invalid course URL');
      setLoading(false);
      return;
    }

    // Find matching course mapping
    const mapping = COURSE_MAPPINGS.find(
      course => course.slug === slug || course.slug.includes(slug.split('-').slice(0, 3).join('-'))
    );

    if (mapping) {
      setCourseMapping(mapping);
      
      // Redirect based on mapping type
      setTimeout(() => {
        if (mapping.courseId) {
          // Redirect to course details with specific ID
          router.push(`/course-details/${mapping.courseId}`);
        } else if (mapping.redirectPath) {
          // Redirect to course landing page
          router.push(mapping.redirectPath);
        } else {
          // Fallback to all courses
          router.push('/courses');
        }
      }, 1500); // Show loading for better UX
    } else {
      // Try to extract course type from slug and redirect to appropriate page
      const slugParts = slug.split('-');
      
      if (slugParts.includes('personality') || slugParts.includes('development')) {
        setCourseMapping({
          slug,
          redirectPath: '/personality-development-course',
          courseName: 'Personality Development Course',
          category: 'Personality Development'
        });
        setTimeout(() => router.push('/personality-development-course'), 1500);
      } else if (slugParts.includes('ai') || slugParts.includes('data') || slugParts.includes('science')) {
        setCourseMapping({
          slug,
          redirectPath: '/ai-and-data-science-course',
          courseName: 'AI and Data Science Course',
          category: 'AI & Data Science'
        });
        setTimeout(() => router.push('/ai-and-data-science-course'), 1500);
      } else if (slugParts.includes('vedic') || slugParts.includes('mathematics')) {
        setCourseMapping({
          slug,
          redirectPath: '/vedic-mathematics-course',
          courseName: 'Vedic Mathematics Course',
          category: 'Vedic Mathematics'
        });
        setTimeout(() => router.push('/vedic-mathematics-course'), 1500);
      } else if (slugParts.includes('digital') || slugParts.includes('marketing')) {
        setCourseMapping({
          slug,
          redirectPath: '/digital-marketing-with-data-analytics-course',
          courseName: 'Digital Marketing with Data Analytics',
          category: 'Digital Marketing'
        });
        setTimeout(() => router.push('/digital-marketing-with-data-analytics-course'), 1500);
      } else {
        setError('Course not found');
      }
    }
    
    setLoading(false);
  }, [params?.slug, router]);

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md mx-auto"
            >
              <div className="flex items-center justify-center mb-6">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Loading Course...
              </h2>
              
              {courseMapping && (
                <div className="space-y-3">
                  <p className="text-gray-600 dark:text-gray-400">
                    Found: <span className="font-semibold text-primary-600 dark:text-primary-400">{courseMapping.courseName}</span>
                  </p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium">
                    {courseMapping.category}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Redirecting you to the course page...
                  </p>
                </div>
              )}
              
              <div className="mt-6 flex items-center justify-center">
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex items-center text-primary-600 dark:text-primary-400"
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-center p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md mx-auto"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Course Not Found
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error}. The course you're looking for might have been moved or doesn't exist.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/courses')}
                  className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  Browse All Courses
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => router.back()}
                  className="w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Go Back
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // This shouldn't be reached due to redirects, but just in case
  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Redirecting...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we redirect you to the course page.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CourseSlugPage; 