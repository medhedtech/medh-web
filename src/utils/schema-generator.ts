/**
 * Comprehensive Schema Markup Generator for Medh Education Platform
 * Generates JSON-LD structured data for all content types
 */

interface SchemaConfig {
  baseUrl?: string;
  organizationName?: string;
  organizationLogo?: string;
  socialProfiles?: string[];
}

export class SchemaGenerator {
  private config: SchemaConfig;

  constructor(config: SchemaConfig = {}) {
    this.config = {
      baseUrl: 'https://medh.co',
      organizationName: 'Medh',
      organizationLogo: 'https://medh.co/images/medh-logo.png',
      socialProfiles: [
        'https://www.linkedin.com/company/medh',
        'https://twitter.com/medh_education',
        'https://www.facebook.com/medh.education',
        'https://www.instagram.com/medh_learning'
      ],
      ...config
    };
  }

  // Generate Organization Schema
  generateOrganizationSchema(): object {
    return {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": this.config.organizationName,
      "alternateName": ["Medh Education", "Medh Learning Platform"],
      "url": this.config.baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": this.config.organizationLogo,
        "width": 200,
        "height": 60
      },
      "description": "Global leader in AI-powered education technology, providing personalized learning experiences with industry-recognized certifications and job placement support.",
      "foundingDate": "2020",
      "legalName": "Medh",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
        "addressRegion": "Maharashtra",
        "addressLocality": "Mumbai",
        "postalCode": "400077"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+91-XXXXXXXXX",
          "contactType": "customer service",
          "availableLanguage": ["English", "Hindi"],
          "hoursAvailable": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "09:00",
            "closes": "18:00"
          }
        }
      ],
      "sameAs": this.config.socialProfiles,
      "hasCredential": [
        {
          "@type": "EducationalOccupationalCredential",
          "name": "ISO 27001 Information Security Certification",
          "credentialCategory": "certification"
        },
        {
          "@type": "EducationalOccupationalCredential",
          "name": "STEM Accreditation",
          "credentialCategory": "accreditation"
        }
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "10000+",
        "bestRating": "5",
        "worstRating": "1"
      },
      "award": [
        "Best EdTech Platform 2024",
        "Innovation in Online Learning 2024"
      ]
    };
  }

  // Generate Course Schema
  generateCourseSchema(courseData: any): object {
    return {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": courseData.course_title,
      "description": courseData.course_description || courseData.long_description,
      "provider": {
        "@type": "EducationalOrganization",
        "name": this.config.organizationName,
        "url": this.config.baseUrl
      },
      "instructor": {
        "@type": "Person",
        "name": courseData.instructor?.name || "Expert Instructor",
        "description": courseData.instructor?.bio || "Industry expert with extensive experience",
        "hasCredential": {
          "@type": "EducationalOccupationalCredential",
          "name": "Professional Certification"
        }
      },
      "courseCode": courseData._id,
      "educationalLevel": courseData.level || courseData.grade || courseData.course_grade,
      "timeRequired": courseData.course_duration,
      "inLanguage": courseData.language || "en",
      "availableLanguage": ["en", "hi"],
      "coursePrerequisites": courseData.prerequisites || "Basic understanding recommended",
      "educationalCredentialAwarded": courseData.is_Certification ? {
        "@type": "EducationalOccupationalCredential",
        "name": `${courseData.course_title} Certificate`,
        "credentialCategory": "certificate"
      } : null,
      "teaches": courseData.learning_outcomes || [],
      "courseWorkload": `${courseData.min_hours_per_week || 3}-${courseData.max_hours_per_week || 5} hours per week`,
      "numberOfCredits": courseData.no_of_Sessions || 0,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": courseData.meta?.ratings?.average || "4.7",
        "reviewCount": courseData.meta?.ratings?.count || "500",
        "bestRating": "5",
        "worstRating": "1"
      },
      "offers": this.generateOfferSchema(courseData),
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": courseData.class_type === "Live Courses" ? "online" : "blended",
        "courseSchedule": {
          "@type": "Schedule",
          "duration": courseData.course_duration,
          "repeatFrequency": "weekly"
        }
      },
      "about": {
        "@type": "Thing",
        "name": courseData.category
      },
      "isAccessibleForFree": courseData.isFree || false,
      "creativeWorkStatus": courseData.status,
      "dateCreated": courseData.createdAt,
      "dateModified": courseData.updatedAt,
      "image": courseData.course_image,
      "url": `${this.config.baseUrl}/courses/${this.generateSlug(courseData.course_title)}`
    };
  }

  // Generate Offer Schema for Courses
  generateOfferSchema(courseData: any): object | object[] {
    if (courseData.prices && Array.isArray(courseData.prices)) {
      return courseData.prices.map((price: any) => ({
        "@type": "Offer",
        "price": price.individual || price.batch,
        "priceCurrency": price.currency,
        "availability": "https://schema.org/InStock",
        "validFrom": new Date().toISOString(),
        "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        "category": "education",
        "seller": {
          "@type": "Organization",
          "name": this.config.organizationName
        }
      }));
    }

    return {
      "@type": "Offer",
      "price": courseData.course_fee || 0,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString(),
      "category": "education",
      "seller": {
        "@type": "Organization",
        "name": this.config.organizationName
      }
    };
  }

  // Generate Blog Post Schema
  generateBlogPostSchema(blogData: any): object {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blogData.title,
      "description": blogData.description || blogData.meta_description,
      "image": {
        "@type": "ImageObject",
        "url": blogData.upload_image || `${this.config.baseUrl}/images/blog-default.jpg`,
        "width": 1200,
        "height": 630
      },
      "author": {
        "@type": "Person",
        "name": blogData.author?.name || "Medh Editorial Team",
        "description": blogData.author?.bio || "Expert content creators in education technology"
      },
      "publisher": {
        "@type": "Organization",
        "name": this.config.organizationName,
        "url": this.config.baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": this.config.organizationLogo
        }
      },
      "datePublished": blogData.createdAt || blogData.publishedTime,
      "dateModified": blogData.updatedAt || blogData.modifiedTime || blogData.createdAt,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${this.config.baseUrl}/blogs/${blogData.slug || blogData._id}`
      },
      "url": `${this.config.baseUrl}/blogs/${blogData.slug || blogData._id}`,
      "keywords": blogData.tags?.join(', ') || blogData.keywords?.join(', '),
      "articleSection": this.getCategoryName(blogData.categories) || 'Education',
      "wordCount": this.getWordCount(blogData.content),
      "timeRequired": `PT${this.getReadingTime(blogData.content)}M`,
      "inLanguage": "en-US",
      "isAccessibleForFree": true,
      "creativeWorkStatus": "Published",
      "about": {
        "@type": "Thing",
        "name": this.getCategoryName(blogData.categories) || 'Education'
      }
    };
  }

  // Generate FAQ Schema
  generateFAQSchema(faqs: Array<{question: string, answer: string}>): object {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }

  // Generate Breadcrumb Schema
  generateBreadcrumbSchema(breadcrumbs: Array<{name: string, url: string}>): object {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": `${this.config.baseUrl}${crumb.url}`
      }))
    };
  }

  // Generate Website Schema
  generateWebsiteSchema(): object {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Medh - Global Education Platform",
      "alternateName": "Medh Education",
      "url": this.config.baseUrl,
      "description": "Transform your career with AI-powered online education. Industry-recognized certifications, live expert instruction, and job placement support.",
      "publisher": {
        "@type": "Organization",
        "name": this.config.organizationName
      },
      "potentialAction": [
        {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${this.config.baseUrl}/search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      ],
      "mainEntity": {
        "@type": "ItemList",
        "name": "Course Categories",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "AI & Data Science",
            "url": `${this.config.baseUrl}/courses/ai-data-science`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Digital Marketing",
            "url": `${this.config.baseUrl}/courses/digital-marketing`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Personality Development",
            "url": `${this.config.baseUrl}/courses/personality-development`
          }
        ]
      }
    };
  }

  // Generate Course Collection Schema
  generateCourseCollectionSchema(courses: any[], category?: string): object {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": category ? `${category} Courses` : "All Courses",
      "description": category ? 
        `Comprehensive ${category} courses for skill development and career advancement` :
        "Complete collection of professional development courses",
      "numberOfItems": courses.length,
      "itemListElement": courses.map((course, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Course",
          "name": course.course_title,
          "description": course.course_description,
          "url": `${this.config.baseUrl}/courses/${this.generateSlug(course.course_title)}`,
          "provider": {
            "@type": "Organization",
            "name": this.config.organizationName
          }
        }
      }))
    };
  }

  // Generate Video Schema
  generateVideoSchema(videoData: any, courseData?: any): object {
    return {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": videoData.title || `${courseData?.course_title} - Preview`,
      "description": videoData.description || courseData?.course_description,
      "thumbnailUrl": videoData.thumbnail || courseData?.course_image,
      "uploadDate": videoData.uploadDate || courseData?.createdAt,
      "duration": videoData.duration ? `PT${videoData.duration}S` : undefined,
      "contentUrl": videoData.url || videoData.video_url,
      "embedUrl": videoData.embedUrl,
      "publisher": {
        "@type": "Organization",
        "name": this.config.organizationName,
        "logo": {
          "@type": "ImageObject",
          "url": this.config.organizationLogo
        }
      },
      "isAccessibleForFree": courseData?.isFree || false,
      "learningResourceType": "Course Preview",
      "educationalLevel": courseData?.level || courseData?.grade,
      "inLanguage": "en"
    };
  }

  // Generate Review Schema
  generateReviewSchema(reviewData: any, itemData: any): object {
    return {
      "@context": "https://schema.org",
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": reviewData.rating,
        "bestRating": "5",
        "worstRating": "1"
      },
      "author": {
        "@type": "Person",
        "name": reviewData.author?.name || "Verified Student"
      },
      "datePublished": reviewData.createdAt,
      "reviewBody": reviewData.comment || reviewData.review,
      "itemReviewed": {
        "@type": "Course",
        "name": itemData.course_title || itemData.title,
        "description": itemData.course_description || itemData.description
      },
      "publisher": {
        "@type": "Organization",
        "name": this.config.organizationName
      }
    };
  }

  // Generate Event Schema (for webinars, workshops)
  generateEventSchema(eventData: any): object {
    return {
      "@context": "https://schema.org",
      "@type": "EducationEvent",
      "name": eventData.title,
      "description": eventData.description,
      "startDate": eventData.startDate,
      "endDate": eventData.endDate,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
      "location": {
        "@type": "VirtualLocation",
        "url": eventData.meetingUrl || `${this.config.baseUrl}/events/${eventData.slug}`
      },
      "organizer": {
        "@type": "Organization",
        "name": this.config.organizationName,
        "url": this.config.baseUrl
      },
      "offers": {
        "@type": "Offer",
        "price": eventData.price || 0,
        "priceCurrency": eventData.currency || "USD",
        "availability": "https://schema.org/InStock",
        "url": `${this.config.baseUrl}/events/${eventData.slug}`
      },
      "performer": {
        "@type": "Person",
        "name": eventData.instructor?.name || "Expert Instructor"
      },
      "audience": {
        "@type": "EducationalAudience",
        "educationalRole": "student"
      }
    };
  }

  // Utility functions
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private getCategoryName(categories: any): string {
    if (!categories) return '';
    if (Array.isArray(categories)) {
      const category = categories[0];
      return typeof category === 'string' ? category : category?.category_name || '';
    }
    return typeof categories === 'string' ? categories : categories?.category_name || '';
  }

  private getWordCount(content: string): number {
    if (!content) return 0;
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    return cleanContent.split(/\s+/).length;
  }

  private getReadingTime(content: string): number {
    const wordCount = this.getWordCount(content);
    return Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
  }
}

// Export utility functions
export function generateOrganizationSchema(): object {
  const generator = new SchemaGenerator();
  return generator.generateOrganizationSchema();
}

export function generateCourseSchema(courseData: any): object {
  const generator = new SchemaGenerator();
  return generator.generateCourseSchema(courseData);
}

export function generateBlogPostSchema(blogData: any): object {
  const generator = new SchemaGenerator();
  return generator.generateBlogPostSchema(blogData);
}

export function generateFAQSchema(faqs: Array<{question: string, answer: string}>): object {
  const generator = new SchemaGenerator();
  return generator.generateFAQSchema(faqs);
}

export function generateBreadcrumbSchema(breadcrumbs: Array<{name: string, url: string}>): object {
  const generator = new SchemaGenerator();
  return generator.generateBreadcrumbSchema(breadcrumbs);
}

export function generateWebsiteSchema(): object {
  const generator = new SchemaGenerator();
  return generator.generateWebsiteSchema();
}

export default SchemaGenerator; 