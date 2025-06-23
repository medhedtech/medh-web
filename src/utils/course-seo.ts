import { Metadata } from 'next';
import { generateSemanticKeywords, generateAIOptimizedTitle, generateEEATOptimizedDescription } from './enhanced-seo-2025';

export interface CourseData {
  _id: string;
  course_title: string;
  course_subtitle?: string;
  course_description: string;
  long_description?: string;
  category: string;
  subcategory?: string;
  grade: string;
  level?: string;
  language?: string;
  thumbnail: string | null;
  course_duration: string;
  session_duration?: string;
  course_fee: number;
  enrolled_students: number;
  is_Certification: boolean;
  is_Assignments: boolean;
  is_Projects: boolean;
  is_Quizes: boolean;
  curriculum: any[];
  highlights: any[];
  learning_outcomes: any[];
  prerequisites: any[];
  faqs: any[];
  no_of_Sessions: number;
  status: string;
  isFree: boolean;
  classType?: string;
  course_type?: string;
  delivery_format?: string;
  delivery_type?: string;
  tools_technologies?: any[];
  meta?: {
    ratings?: {
      average: number;
      count: number;
    };
    views?: number;
    enrollments?: number;
  };
  prices?: Array<{
    currency: string;
    individual: number;
    batch: number;
    min_batch_size: number;
    max_batch_size: number;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export class CourseSEO {
  private course: CourseData;
  private baseUrl: string;

  constructor(course: CourseData, baseUrl: string = 'https://medh.co') {
    this.course = course;
    this.baseUrl = baseUrl;
  }

  /**
   * Generate AI-optimized title with 2025 best practices
   */
  generateTitle(): string {
    const title = this.course.course_title;
    const category = this.course.category;
    const level = this.course.level || this.course.grade;
    const keywords = this.extractKeywords();
    
    // Create enhanced title with category and level context
    let enhancedTitle = title;
    if (category && !title.toLowerCase().includes(category.toLowerCase())) {
      enhancedTitle = `${title} - ${category} Course`;
    }
    
    if (level && !enhancedTitle.toLowerCase().includes(level.toLowerCase())) {
      enhancedTitle = `${enhancedTitle} (${level} Level)`;
    }
    
    // Use AI-optimized title generation
    return generateAIOptimizedTitle(enhancedTitle, keywords);
  }

  /**
   * Generate E-E-A-T optimized description with 2025 best practices
   */
  generateDescription(): string {
    const description = this.course.course_description || this.course.long_description || '';
    const category = this.course.category;
    const duration = this.course.course_duration;
    const features = this.getKeyFeatures().slice(0, 3);
    
    // Create compelling description with E-E-A-T signals
    let desc = '';
    
    if (description.length > 0) {
      // Extract first meaningful sentence
      const firstSentence = description.split('.')[0];
      desc = firstSentence.length > 30 ? firstSentence : description.substring(0, 80);
    } else {
      desc = `Master ${this.course.course_title} with expert-led ${category.toLowerCase()} training`;
    }
    
    // Add key features with authority signals
    const additionalInfo = [];
    if (duration) additionalInfo.push(`${duration} comprehensive training`);
    if (this.course.is_Certification) additionalInfo.push('industry-recognized certificate');
    if (features.length > 0) additionalInfo.push(features.join(', '));
    
    if (additionalInfo.length > 0) {
      desc += `. ${additionalInfo.join(', ')}.`;
    }
    
    // Use E-E-A-T optimized description generation
    return generateEEATOptimizedDescription(desc);
  }

  /**
   * Extract keywords from course content
   */
  extractKeywords(): string[] {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'
    ]);
    
    const keywords = new Set<string>();
    
    // Add course title words
    this.course.course_title.toLowerCase().split(/\s+/).forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length > 2 && !stopWords.has(cleanWord)) {
        keywords.add(cleanWord);
      }
    });
    
    // Add category and level
    if (this.course.category) keywords.add(this.course.category.toLowerCase());
    if (this.course.level) keywords.add(this.course.level.toLowerCase());
    if (this.course.grade) keywords.add(this.course.grade.toLowerCase());
    
    // Add technologies and tools
    this.course.tools_technologies?.forEach(tech => {
      if (typeof tech === 'string') keywords.add(tech.toLowerCase());
      if (tech.name) keywords.add(tech.name.toLowerCase());
    });
    
    // Add features
    const features = this.getKeyFeatures();
    features.forEach(feature => {
      feature.toLowerCase().split(/\s+/).forEach(word => {
        const cleanWord = word.replace(/[^\w]/g, '');
        if (cleanWord.length > 2 && !stopWords.has(cleanWord)) {
          keywords.add(cleanWord);
        }
      });
    });
    
    // Add 2025 AI-optimized educational keywords
    const educationalKeywords = [
      'online course',
      'online learning',
      'skill development',
      'professional training',
      'AI-powered education',
      'personalized learning',
      'career advancement',
      'industry certification',
      'expert instruction',
      'hands-on training'
    ];
    
    educationalKeywords.forEach(keyword => keywords.add(keyword));
    
    // Generate semantic keywords for course title
    const semanticKeywords = generateSemanticKeywords(this.course.course_title);
    semanticKeywords.forEach(keyword => keywords.add(keyword));
    
    return Array.from(keywords).slice(0, 25); // Increased for better coverage
  }

  /**
   * Get key course features
   */
  private getKeyFeatures(): string[] {
    const features = [];
    
    if (this.course.is_Certification) features.push('certification');
    if (this.course.is_Assignments) features.push('assignments');
    if (this.course.is_Projects) features.push('projects');
    if (this.course.is_Quizes) features.push('quizzes');
    if (this.course.classType === 'Live' || this.course.course_type === 'live') features.push('live classes');
    if (this.course.delivery_format === 'online') features.push('online learning');
    
    // Add from highlights
    this.course.highlights?.forEach(highlight => {
      if (typeof highlight === 'string') features.push(highlight);
      if (highlight.title) features.push(highlight.title);
    });
    
    return features;
  }

  /**
   * Generate course metadata
   */
  generateMetadata(): Metadata {
    const title = this.generateTitle();
    const description = this.generateDescription();
    const keywords = this.extractKeywords();
    const courseUrl = `${this.baseUrl}/course-details/${this.course._id}`;
    const imageUrl = this.course.thumbnail || `${this.baseUrl}/images/default-course.jpg`;
    
    return {
      title,
      description,
      keywords: keywords.join(', '),
      authors: [{ name: 'Medh Education Team' }],
      creator: 'Medh',
      publisher: 'Medh',
      robots: {
        index: this.course.status === 'Published',
        follow: true,
        googleBot: {
          index: this.course.status === 'Published',
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: courseUrl,
        title,
        description,
        siteName: 'Medh - Online Learning Platform',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${this.course.course_title} - Course Thumbnail`,
            type: 'image/jpeg',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        site: '@MedhEducation',
        creator: '@MedhEducation',
        title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: courseUrl,
      },
      other: {
        'course:price': this.course.isFree ? '0' : this.course.course_fee.toString(),
        'course:currency': 'INR',
        'course:duration': this.course.course_duration,
        'course:level': this.course.level || this.course.grade,
        'course:language': this.course.language || 'English',
        'course:instructor': 'Medh Expert Instructors',
        'course:category': this.course.category,
      },
    };
  }

  /**
   * Generate Course structured data
   */
  generateCourseStructuredData(): object {
    const courseUrl = `${this.baseUrl}/course-details/${this.course._id}`;
    const imageUrl = this.course.thumbnail || `${this.baseUrl}/images/default-course.jpg`;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: this.course.course_title,
      description: this.course.course_description || this.course.long_description,
      url: courseUrl,
      image: imageUrl,
      provider: {
        '@type': 'EducationalOrganization',
        name: 'Medh',
        url: this.baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/images/logo.png`,
        },
      },
      offers: this.generateOfferStructuredData(),
      educationalLevel: this.course.level || this.course.grade,
      about: this.course.category,
      teaches: this.course.learning_outcomes?.map(outcome => 
        typeof outcome === 'string' ? outcome : outcome.title || outcome.description
      ) || [],
      coursePrerequisites: this.course.prerequisites?.map(prereq => 
        typeof prereq === 'string' ? prereq : prereq.title || prereq.description
      ) || [],
      timeRequired: this.course.course_duration,
      numberOfCredits: this.course.no_of_Sessions,
      educationalCredentialAwarded: this.course.is_Certification ? 'Certificate of Completion' : undefined,
      courseMode: this.getCourseMode(),
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: this.getCourseMode(),
        duration: this.course.course_duration,
        instructor: {
          '@type': 'Person',
          name: 'Expert Instructor',
          affiliation: {
            '@type': 'EducationalOrganization',
            name: 'Medh',
          },
        },
      },
      aggregateRating: this.course.meta?.ratings ? {
        '@type': 'AggregateRating',
        ratingValue: this.course.meta.ratings.average,
        ratingCount: this.course.meta.ratings.count,
        bestRating: 5,
        worstRating: 1,
      } : undefined,
    };
  }

  /**
   * Generate offer structured data for pricing
   */
  private generateOfferStructuredData(): object | object[] {
    if (this.course.isFree) {
      return {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        validFrom: new Date().toISOString(),
      };
    }

    if (this.course.prices && this.course.prices.length > 0) {
      return this.course.prices.map(price => ({
        '@type': 'Offer',
        price: price.batch || price.individual || this.course.course_fee,
        priceCurrency: price.currency,
        availability: 'https://schema.org/InStock',
        validFrom: new Date().toISOString(),
        category: price.batch ? 'Batch Enrollment' : 'Individual Enrollment',
      }));
    }

    return {
      '@type': 'Offer',
      price: this.course.course_fee,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
    };
  }

  /**
   * Get course delivery mode
   */
  private getCourseMode(): string {
    if (this.course.delivery_format === 'online' || this.course.delivery_type === 'online') {
      return 'https://schema.org/OnlineEventAttendanceMode';
    }
    if (this.course.delivery_format === 'offline' || this.course.delivery_type === 'offline') {
      return 'https://schema.org/OfflineEventAttendanceMode';
    }
    if (this.course.classType === 'Blended' || this.course.course_type === 'blended') {
      return 'https://schema.org/MixedEventAttendanceMode';
    }
    return 'https://schema.org/OnlineEventAttendanceMode'; // Default
  }

  /**
   * Generate FAQ structured data from course FAQs
   */
  generateFAQStructuredData(): object | null {
    if (!this.course.faqs || this.course.faqs.length === 0) {
      return null;
    }

    const faqItems = this.course.faqs
      .filter(faq => faq.question && faq.answer)
      .map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      }));

    if (faqItems.length === 0) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems,
    };
  }

  /**
   * Generate breadcrumb structured data
   */
  generateBreadcrumbStructuredData(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: this.baseUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Courses',
          item: `${this.baseUrl}/courses`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: this.course.category,
          item: `${this.baseUrl}/courses?category=${encodeURIComponent(this.course.category.toLowerCase())}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: this.course.course_title,
          item: `${this.baseUrl}/course-details/${this.course._id}`,
        },
      ],
    };
  }

  /**
   * Generate educational organization structured data
   */
  generateEducationalOrganizationStructuredData(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: 'Medh',
      url: this.baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${this.baseUrl}/images/logo.png`,
      },
      description: 'Leading online education platform providing professional courses and skill development programs',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'support@medh.co',
      },
      sameAs: [
        'https://www.linkedin.com/company/medh-education',
        'https://twitter.com/MedhEducation',
        'https://www.youtube.com/c/MedhEducation',
      ],
    };
  }

  /**
   * Generate complete structured data for the course page
   */
  generateCompleteStructuredData(): object[] {
    const structuredData = [
      this.generateCourseStructuredData(),
      this.generateBreadcrumbStructuredData(),
      this.generateEducationalOrganizationStructuredData(),
    ];

    const faqData = this.generateFAQStructuredData();
    if (faqData) {
      structuredData.push(faqData);
    }

    return structuredData;
  }
}

/**
 * Generate course SEO metadata
 */
export function generateCourseSEO(course: CourseData): Metadata {
  const courseSEO = new CourseSEO(course);
  return courseSEO.generateMetadata();
}

/**
 * Generate course structured data
 */
export function generateCourseStructuredData(course: CourseData): object[] {
  const courseSEO = new CourseSEO(course);
  return courseSEO.generateCompleteStructuredData();
} 