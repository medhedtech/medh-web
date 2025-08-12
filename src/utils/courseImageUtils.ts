// Simple course image utilities
export const getSafeCourseImageUrl = (
  courseImage?: string | null,
  courseId?: string,
  courseTitle?: string
): string => {
  // If no image provided, use fallback
  if (!courseImage) {
    return '/fallback-course-image.jpg';
  }

  // Handle known problematic URLs
  if (courseImage.includes('undefined') || courseImage.includes('null')) {


    
    return '/fallback-course-image.jpg';
  }

  return courseImage;
};

// Simple fallback images
export const FALLBACK_IMAGES = {
  course: '/fallback-course-image.jpg',
  general: '/images/placeholder.jpg',
  error: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIFVuYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=='
};

// Get course image with fallback
export const getCourseImage = (course: {
  course_image?: string;
  thumbnail?: string;
  _id?: string;
  course_title?: string;
}): string => {
  return getSafeCourseImageUrl(
    course.course_image || course.thumbnail,
    course._id,
    course.course_title
  );
};

export default {
  getSafeCourseImageUrl,
  getCourseImage,
  FALLBACK_IMAGES
}; 