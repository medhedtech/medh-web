// Simple image preloader utility
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

// Preload multiple images
export const preloadImages = async (urls: string[]): Promise<void> => {
  try {
    await Promise.all(urls.map(url => preloadImage(url)));
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
};

// Simple course image preloader
export const preloadCourseImages = (courses: Array<{ course_image?: string }>): void => {
  const imageUrls = courses
    .map(course => course.course_image)
    .filter((url): url is string => Boolean(url))
    .slice(0, 6); // Only preload first 6 images

  if (imageUrls.length > 0) {
    preloadImages(imageUrls);
  }
}; 