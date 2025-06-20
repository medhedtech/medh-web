import { MetadataRoute } from 'next';
import { IBlog } from '@/types/blog.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://medh.co';

// Fetch all published blogs for sitemap
async function fetchBlogsForSitemap(): Promise<IBlog[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs?status=published&limit=1000&sitemap=true`, {
      next: { revalidate: 3600 }, // Revalidate every hour
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.error('Failed to fetch blogs for sitemap');
      return [];
    }
    
    const result = await response.json();
    return result.data || result || [];
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error);
    return [];
  }
}

// Fetch all published courses for sitemap
async function fetchCoursesForSitemap(): Promise<any[]> {
  try {
    // Try multiple endpoints to get all courses
    const endpoints = [
      `${API_BASE_URL}/courses/get?status=Published&limit=1000&sitemap=true`,
      `${API_BASE_URL}/courses/search?status=Published&limit=1000&page=1`,
      `${API_BASE_URL}/courses?status=Published&limit=1000`
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          next: { revalidate: 3600 }, // Revalidate every hour
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          const courses = result.data?.courses || result.data || result.courses || result || [];
          
          if (Array.isArray(courses) && courses.length > 0) {
            console.log(`✅ Fetched ${courses.length} courses from ${endpoint}`);
            return courses.filter(course => 
              course && 
              (course._id || course.id) && 
              course.course_title &&
              (course.status === 'Published' || course.status === 'published')
            );
          }
        }
      } catch (endpointError) {
        console.warn(`Failed to fetch from ${endpoint}:`, endpointError);
        continue;
      }
    }
    
    console.warn('No courses found from any endpoint');
    return [];
  } catch (error) {
    console.error('Error fetching courses for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages with high priority
  const staticPages = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/courses`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/all-courses`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/medh-membership`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/hire-from-medh`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/placement-guaranteed-courses`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/corporate-training-courses`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }
  ];

  // Fetch dynamic blog pages
  const blogs = await fetchBlogsForSitemap();
  const blogPages = blogs.map((blog) => ({
    url: `${SITE_URL}/blogs/${blog.slug || blog._id}`,
    lastModified: new Date(blog.updatedAt || blog.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Fetch dynamic course pages
  const courses = await fetchCoursesForSitemap();
  const coursePages = courses.map((course) => ({
    url: `${SITE_URL}/course-details/${course._id || course.id}`,
    lastModified: new Date(course.updatedAt || course.createdAt || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Add enrollment pages for each course
  const enrollmentPages = courses.map((course) => ({
    url: `${SITE_URL}/enrollment/course/${course._id || course.id}`,
    lastModified: new Date(course.updatedAt || course.createdAt || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Course category pages
  const courseCategories = [
    'ai-and-data-science-course',
    'digital-marketing-with-data-analytics-course',
    'personality-development-course',
    'vedic-mathematics-course'
  ];

  const courseCategoryPages = courseCategories.map(category => ({
    url: `${SITE_URL}/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Blog category pages
  const blogCategories = [
    'technology',
    'career-development',
    'education',
    'data-science',
    'ai',
    'digital-marketing',
    'personality-development'
  ];

  const blogCategoryPages = blogCategories.map(category => ({
    url: `${SITE_URL}/blogs?category=${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...blogPages,
    ...coursePages,
    ...enrollmentPages,
    ...courseCategoryPages,
    ...blogCategoryPages
  ];
} 