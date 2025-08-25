import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { generateCourseSEO, generateCourseStructuredData, CourseData } from '@/utils/course-seo';
import CourseViewClient from './CourseViewClient';

// Import the API base URL from our centralized config
import { apiBaseUrl as API_BASE_URL } from '../../../../apis/config';

interface CoursePageProps {
  params: {
    courseId: string;
  };
  searchParams: {
    currency?: string;
  };
}

// Server-side function to fetch course data
async function fetchCourseData(courseId: string, currency: string = 'INR'): Promise<CourseData | null> {
  try {
    const courseEndpoint = `${API_BASE_URL}/courses/${courseId}?currency=${currency.toLowerCase()}`;
    
    const response = await fetch(courseEndpoint, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch course: ${response.status}`);
    }

    const data = await response.json();
    const courseData = data.data || data.course || data;
              
              if (!courseData || !courseData._id) {
      return null;
              }
              
              // Process course description - handle both object and string formats
              let processedDescription = "";
              let longDescription = "";
              
              if (typeof courseData.course_description === 'object' && courseData.course_description) {
                processedDescription = courseData.course_description.program_overview || "";
                longDescription = [
                  courseData.course_description.program_overview,
                  courseData.course_description.benefits,
                  courseData.course_description.learning_objectives?.join('\n'),
                  courseData.course_description.course_requirements?.join('\n'),
                  courseData.course_description.target_audience?.join('\n')
                ].filter(Boolean).join('\n\n');
              } else if (typeof courseData.course_description === 'string') {
                processedDescription = courseData.course_description;
                longDescription = courseData.course_description;
              }
              
              // Process course data with new structure
    const processedCourse: CourseData = {
                _id: courseData._id,
                course_title: courseData.course_title || "Untitled Course",
                course_subtitle: courseData.course_subtitle,
                course_description: processedDescription,
                long_description: longDescription,
                category: courseData.course_category || "General",
                subcategory: courseData.course_subcategory,
                grade: courseData.course_grade || courseData.course_level || "All Levels",
                level: courseData.course_level,
                language: courseData.language || "English",
                thumbnail: courseData.course_image || null,
                course_duration: courseData.course_duration || "Not specified",
                session_duration: courseData.session_duration,
                course_fee: courseData.course_fee || 0,
                enrolled_students: courseData.enrolled_students || courseData.meta?.enrollments || 0,
                is_Certification: courseData.is_Certification === "Yes" || courseData.certification?.is_certified === true,
                is_Assignments: courseData.is_Assignments === "Yes",
                is_Projects: courseData.is_Projects === "Yes",
                is_Quizes: courseData.is_Quizes === "Yes",
                curriculum: courseData.curriculum || [],
                highlights: courseData.highlights || [],
                learning_outcomes: courseData.learning_outcomes || [],
                prerequisites: courseData.prerequisites || [],
                faqs: courseData.faqs || [],
                no_of_Sessions: courseData.no_of_Sessions || 0,
                status: courseData.status || "Draft",
                isFree: courseData.isFree || courseData.course_fee === 0,
                classType: courseData.course_type || "Live",
                course_type: courseData.course_type,
                delivery_format: courseData.delivery_format,
                delivery_type: courseData.delivery_type,
                tools_technologies: courseData.tools_technologies || [],
                meta: courseData.meta,
                prices: courseData.prices || [],
      createdAt: courseData.createdAt,
      updatedAt: courseData.updatedAt,
    };

    return processedCourse;
  } catch (error) {
    console.error('Error fetching course data:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params, searchParams }: CoursePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const { courseId } = resolvedParams;
  const currency = resolvedSearchParams.currency || 'INR';
  
  const course = await fetchCourseData(courseId, currency);
  
  if (!course) {
    return {
      title: 'Course Not Found | Medh',
      description: 'The requested course could not be found.',
      robots: { index: false, follow: false },
    };
  }

  return generateCourseSEO(course);
}

// Main page component
export default async function CourseDetailsPage({ params, searchParams }: CoursePageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const { courseId } = resolvedParams;
  const currency = resolvedSearchParams.currency || 'INR';
  
  // Fetch course data on the server
  const course = await fetchCourseData(courseId, currency);
  
  if (!course) {
    notFound();
  }

  // Generate structured data for SEO
  const structuredData = generateCourseStructuredData(course);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Edge-to-edge mobile container */}
      <div className="w-full">
        <CourseViewClient 
          initialCourse={course}
          structuredData={structuredData}
        />
      </div>
    </div>
  );
} 