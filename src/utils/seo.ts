import { Metadata } from 'next';
import { defaultMetadata } from '@/app/metadata';
import { generateSemanticKeywords, generateAIOptimizedTitle, generateEEATOptimizedDescription, EDUCATION_KEYWORDS_2025 } from './enhanced-seo-2025';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  courseData?: any;
  eeatSignals?: {
    experience?: string[];
    expertise?: string[];
    authoritativeness?: string[];
    trustworthiness?: string[];
  };
  structuredDataType?: 'course' | 'blog' | 'organization' | 'faq' | 'breadcrumb';
  voiceSearchOptimized?: boolean;
}

// Generate AI-optimized metadata for any page with 2025 best practices
export function generateSEOMetadata(props: SEOProps): Metadata {
  const {
    title,
    description,
    keywords = [],
    image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = [],
    noIndex = false,
    eeatSignals,
    voiceSearchOptimized = false
  } = props;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://medh.co';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const imageUrl = image || `${baseUrl}/images/og-default.jpg`;
  
  // Enhanced keyword optimization with semantic clustering and 2025 trends
  const semanticKeywords = generateSemanticKeywords(keywords[0] || 'education');
  const trendingKeywords = EDUCATION_KEYWORDS_2025.emergingTech2025.slice(0, 3);
  const conversationalKeywords = voiceSearchOptimized ? 
    EDUCATION_KEYWORDS_2025.conversationalQueries.slice(0, 2) : [];
  
  const allKeywords = [
    ...keywords,
    ...semanticKeywords,
    ...trendingKeywords,
    ...conversationalKeywords,
    ...(defaultMetadata.keywords as string[] || []),
    'AI-powered education',
    'personalized learning',
    'industry certification'
  ].filter((keyword, index, self) => self.indexOf(keyword) === index).slice(0, 30);

  // Use AI-optimized title and description generation
  const finalTitle = generateAIOptimizedTitle(title || 'Medh Education Platform', keywords);
  const finalDescription = generateEEATOptimizedDescription(
    description || 'Transform your career with AI-powered online education'
  );

  return {
    title: finalTitle,
    description: finalDescription,
    keywords: allKeywords.join(', '),
    authors: author ? [{ name: author }] : defaultMetadata.authors,
    publisher: 'Medh',
    alternates: {
      canonical: url || '/',
    },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: fullUrl,
      siteName: 'Medh',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title || 'Medh - Educational Platform',
        }
      ],
      locale: 'en_US',
      type: type as any,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
      ...(section && { section }),
      ...(tags.length > 0 && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [imageUrl],
      creator: '@medh',
      site: '@medh',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    category: section || 'education',
    other: {
      'article:section': section || 'Education',
      'article:tag': tags.join(', ') || 'Learning, Skills, Career',
      'og:updated_time': modifiedTime || new Date().toISOString(),
      'twitter:label1': 'Category',
      'twitter:data1': section || 'Education',
      'twitter:label2': 'Reading time',
      'twitter:data2': '5 min read',
      'format-detection': 'telephone=no',
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'application-name': 'Medh Education',
      'apple-mobile-web-app-title': 'Medh Education',
      'theme-color': '#3bac63',
      'msapplication-navbutton-color': '#3bac63',
      'apple-mobile-web-app-status-bar-style': 'default'
    }
  };
}

// Generate structured data for different content types
export function generateStructuredData(type: string, data: any) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://medh.co';
  
  const commonStructure = {
    "@context": "https://schema.org",
    "url": `${baseUrl}${data.url || ''}`,
    "publisher": {
      "@type": "Organization",
      "name": "Medh",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/images/medh-logo.png`
      }
    }
  };

  switch (type) {
    case 'blog':
      return {
        ...commonStructure,
        "@type": "BlogPosting",
        "headline": data.title,
        "description": data.description,
        "image": data.image,
        "author": {
          "@type": "Person",
          "name": data.author || "Medh Team"
        },
        "datePublished": data.publishedTime,
        "dateModified": data.modifiedTime || data.publishedTime,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${baseUrl}${data.url}`
        },
        "keywords": data.keywords?.join(', '),
        "articleSection": data.section || 'Education',
        "wordCount": data.wordCount || 0,
        "timeRequired": `PT${data.readingTime || 5}M`
      };

    case 'course':
      return {
        ...commonStructure,
        "@type": "Course",
        "name": data.title,
        "description": data.description,
        "image": data.image,
        "provider": {
          "@type": "Organization",
          "name": "Medh"
        },
        "instructor": {
          "@type": "Person",
          "name": data.instructor || "Medh Team"
        },
        "courseCode": data.courseCode,
        "educationalLevel": data.level || "Beginner",
        "timeRequired": data.duration,
        "teaches": data.skills || [],
        "aggregateRating": data.rating ? {
          "@type": "AggregateRating",
          "ratingValue": data.rating,
          "reviewCount": data.reviewCount || 0
        } : undefined
      };

    case 'organization':
      return {
        ...commonStructure,
        "@type": "EducationalOrganization",
        "name": "Medh",
        "description": "Leading education platform for career growth and skill development",
        "url": baseUrl,
        "logo": `${baseUrl}/images/medh-logo.png`,
        "sameAs": data.socialMedia || [],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": data.phone,
          "contactType": "customer service",
          "email": data.email
        }
      };

    case 'website':
      return {
        ...commonStructure,
        "@type": "WebSite",
        "name": "Medh",
        "description": data.description,
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${baseUrl}/search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      };

    default:
      return commonStructure;
  }
}

// Generate breadcrumb structured data
export function generateBreadcrumbData(breadcrumbs: Array<{ name: string; url: string }>) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://medh.co';
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${baseUrl}${item.url}`
    }))
  };
}

// Generate FAQ structured data
export function generateFAQData(faqs: Array<{ question: string; answer: string }>) {
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

// Page-specific SEO data
export const pagesSEO = {
  home: {
    title: "Medh - Leading Education Platform for Career Growth",
    description: "Transform your career with Medh's industry-leading courses in AI, Data Science, Digital Marketing, and more. Learn from experts and get certified.",
    keywords: ["education platform", "online learning", "career development", "AI courses", "data science", "digital marketing"],
    type: "website" as const
  },
  
  blogs: {
    title: "Educational Blogs & Articles",
    description: "Explore our comprehensive collection of educational insights, career guidance, and industry expertise.",
    keywords: ["education blogs", "career guidance", "learning resources", "industry insights"],
    type: "website" as const
  },
  
  courses: {
    title: "Professional Courses & Certifications",
    description: "Discover our expert-led courses designed to accelerate your career growth and skill development.",
    keywords: ["professional courses", "online certification", "skill development", "career training"],
    type: "website" as const
  },
  
  about: {
    title: "About Medh - Our Mission & Vision",
    description: "Learn about Medh's mission to democratize quality education and empower learners worldwide.",
    keywords: ["about medh", "education mission", "learning platform", "company vision"],
    type: "website" as const
  }
};

// SEO utilities for common operations
export const seoUtils = {
  // Optimize title length (50-60 characters)
  optimizeTitle: (title: string, suffix: string = " | Medh"): string => {
    const maxLength = 60 - suffix.length;
    if (title.length <= maxLength) {
      return title + suffix;
    }
    return title.substring(0, maxLength - 3) + "..." + suffix;
  },

  // Optimize description length (150-160 characters)
  optimizeDescription: (description: string): string => {
    const maxLength = 160;
    if (description.length <= maxLength) {
      return description;
    }
    return description.substring(0, maxLength - 3) + "...";
  },

  // Extract keywords from content
  extractKeywords: (content: string, limit: number = 10): string[] => {
    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const frequency: Record<string, number> = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([word]) => word);
  },

  // Generate slug from title
  generateSlug: (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  },

  // Calculate reading time
  calculateReadingTime: (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}; 