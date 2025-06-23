/**
 * Comprehensive Sitemap Generator for Medh Education Platform
 * Generates dynamic sitemaps for courses, blogs, and static pages
 */

interface SitemapEntry {
  url: string;
  lastModified?: string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  images?: Array<{
    url: string;
    caption?: string;
    title?: string;
  }>;
  videos?: Array<{
    url: string;
    title: string;
    description: string;
    thumbnailUrl?: string;
    duration?: number;
  }>;
}

export class SitemapGenerator {
  private baseUrl: string;
  
  constructor(baseUrl: string = 'https://medh.co') {
    this.baseUrl = baseUrl;
  }

  // Generate main sitemap index
  generateSitemapIndex(): string {
    const sitemaps = [
      { url: `${this.baseUrl}/sitemap-pages.xml`, lastmod: new Date().toISOString() },
      { url: `${this.baseUrl}/sitemap-courses.xml`, lastmod: new Date().toISOString() },
      { url: `${this.baseUrl}/sitemap-blogs.xml`, lastmod: new Date().toISOString() },
      { url: `${this.baseUrl}/sitemap-categories.xml`, lastmod: new Date().toISOString() },
      { url: `${this.baseUrl}/sitemap-images.xml`, lastmod: new Date().toISOString() },
      { url: `${this.baseUrl}/sitemap-videos.xml`, lastmod: new Date().toISOString() }
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(sitemap => `  <sitemap>
    <loc>${sitemap.url}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    return xml;
  }

  // Generate static pages sitemap
  generatePagesSitemap(): string {
    const staticPages: SitemapEntry[] = [
      {
        url: `${this.baseUrl}/`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1.0
      },
      {
        url: `${this.baseUrl}/about-us`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.8
      },
      {
        url: `${this.baseUrl}/courses`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.9
      },
      {
        url: `${this.baseUrl}/blogs`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.8
      },
      {
        url: `${this.baseUrl}/contact-us`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.7
      },
      {
        url: `${this.baseUrl}/hire-from-medh`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8
      },
      {
        url: `${this.baseUrl}/corporate-training-courses`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8
      },
      {
        url: `${this.baseUrl}/medh-membership`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.7
      },
      {
        url: `${this.baseUrl}/instructors`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.6
      },
      {
        url: `${this.baseUrl}/faq`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.6
      },
      {
        url: `${this.baseUrl}/privacy-policy`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'yearly',
        priority: 0.3
      },
      {
        url: `${this.baseUrl}/terms-of-service`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'yearly',
        priority: 0.3
      }
    ];

    return this.generateSitemapXML(staticPages);
  }

  // Generate courses sitemap
  generateCoursesSitemap(courses: any[]): string {
    const courseEntries: SitemapEntry[] = courses.map(course => ({
      url: `${this.baseUrl}/courses/${course.course_title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
      lastModified: course.updatedAt || course.createdAt || new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
      images: course.course_image ? [{
        url: course.course_image,
        caption: course.course_title,
        title: `${course.course_title} - ${course.category}`
      }] : undefined
    }));

    return this.generateSitemapXML(courseEntries);
  }

  // Generate course categories sitemap
  generateCategoriesSitemap(): string {
    const categories = [
      'AI & Data Science',
      'Digital Marketing',
      'Personality Development',
      'Business Analytics',
      'Web Development',
      'Mobile App Development',
      'Cybersecurity',
      'Cloud Computing',
      'DevOps',
      'UI/UX Design',
      'Project Management',
      'Leadership Development'
    ];

    const categoryEntries: SitemapEntry[] = categories.map(category => ({
      url: `${this.baseUrl}/courses/category/${category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.7
    }));

    return this.generateSitemapXML(categoryEntries);
  }

  // Generate blogs sitemap
  generateBlogsSitemap(blogs: any[]): string {
    const blogEntries: SitemapEntry[] = blogs.map(blog => ({
      url: `${this.baseUrl}/blogs/${blog.slug || blog._id}`,
      lastModified: blog.updatedAt || blog.createdAt || new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.6,
      images: blog.upload_image ? [{
        url: blog.upload_image,
        caption: blog.title,
        title: blog.title
      }] : undefined
    }));

    return this.generateSitemapXML(blogEntries);
  }

  // Generate images sitemap
  generateImagesSitemap(courses: any[], blogs: any[]): string {
    const images: Array<{
      url: string;
      caption?: string;
      title?: string;
      location?: string;
    }> = [];

    // Course images
    courses.forEach(course => {
      if (course.course_image) {
        images.push({
          url: course.course_image,
          caption: course.course_title,
          title: `${course.course_title} - ${course.category}`,
          location: `${this.baseUrl}/courses/${course.course_title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`
        });
      }
    });

    // Blog images
    blogs.forEach(blog => {
      if (blog.upload_image) {
        images.push({
          url: blog.upload_image,
          caption: blog.title,
          title: blog.title,
          location: `${this.baseUrl}/blogs/${blog.slug || blog._id}`
        });
      }
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${images.map(image => `  <url>
    <loc>${image.location}</loc>
    <image:image>
      <image:loc>${image.url}</image:loc>
      ${image.title ? `<image:title>${this.escapeXML(image.title)}</image:title>` : ''}
      ${image.caption ? `<image:caption>${this.escapeXML(image.caption)}</image:caption>` : ''}
    </image:image>
  </url>`).join('\n')}
</urlset>`;

    return xml;
  }

  // Generate videos sitemap
  generateVideosSitemap(courses: any[]): string {
    const videos: Array<{
      url: string;
      title: string;
      description: string;
      thumbnailUrl?: string;
      duration?: number;
      location: string;
    }> = [];

    courses.forEach(course => {
      if (course.course_videos && course.course_videos.length > 0) {
        course.course_videos.forEach((video: any) => {
          videos.push({
            url: video.url || video.video_url,
            title: video.title || `${course.course_title} - Preview`,
            description: video.description || course.course_description,
            thumbnailUrl: video.thumbnail || course.course_image,
            duration: video.duration,
            location: `${this.baseUrl}/courses/${course.course_title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`
          });
        });
      }
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${videos.map(video => `  <url>
    <loc>${video.location}</loc>
    <video:video>
      <video:content_loc>${video.url}</video:content_loc>
      <video:title>${this.escapeXML(video.title)}</video:title>
      <video:description>${this.escapeXML(video.description)}</video:description>
      ${video.thumbnailUrl ? `<video:thumbnail_loc>${video.thumbnailUrl}</video:thumbnail_loc>` : ''}
      ${video.duration ? `<video:duration>${video.duration}</video:duration>` : ''}
      <video:family_friendly>yes</video:family_friendly>
    </video:video>
  </url>`).join('\n')}
</urlset>`;

    return xml;
  }

  // Generate standard sitemap XML
  private generateSitemapXML(entries: SitemapEntry[]): string {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${entries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    ${entry.lastModified ? `<lastmod>${entry.lastModified}</lastmod>` : ''}
    ${entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : ''}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
    ${entry.images ? entry.images.map(image => `<image:image>
      <image:loc>${image.url}</image:loc>
      ${image.title ? `<image:title>${this.escapeXML(image.title)}</image:title>` : ''}
      ${image.caption ? `<image:caption>${this.escapeXML(image.caption)}</image:caption>` : ''}
    </image:image>`).join('\n    ') : ''}
    ${entry.videos ? entry.videos.map(video => `<video:video>
      <video:content_loc>${video.url}</video:content_loc>
      <video:title>${this.escapeXML(video.title)}</video:title>
      <video:description>${this.escapeXML(video.description)}</video:description>
      ${video.thumbnailUrl ? `<video:thumbnail_loc>${video.thumbnailUrl}</video:thumbnail_loc>` : ''}
      ${video.duration ? `<video:duration>${video.duration}</video:duration>` : ''}
    </video:video>`).join('\n    ') : ''}
  </url>`).join('\n')}
</urlset>`;

    return xml;
  }

  // Escape XML special characters
  private escapeXML(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
}

// Export utility functions
export function generateMainSitemap(): string {
  const generator = new SitemapGenerator();
  return generator.generateSitemapIndex();
}

export function generatePagesSitemap(): string {
  const generator = new SitemapGenerator();
  return generator.generatePagesSitemap();
}

export function generateCoursesSitemap(courses: any[]): string {
  const generator = new SitemapGenerator();
  return generator.generateCoursesSitemap(courses);
}

export function generateBlogsSitemap(blogs: any[]): string {
  const generator = new SitemapGenerator();
  return generator.generateBlogsSitemap(blogs);
}

export function generateCategoriesSitemap(): string {
  const generator = new SitemapGenerator();
  return generator.generateCategoriesSitemap();
}

export function generateImagesSitemap(courses: any[], blogs: any[]): string {
  const generator = new SitemapGenerator();
  return generator.generateImagesSitemap(courses, blogs);
}

export function generateVideosSitemap(courses: any[]): string {
  const generator = new SitemapGenerator();
  return generator.generateVideosSitemap(courses);
}

export default SitemapGenerator;