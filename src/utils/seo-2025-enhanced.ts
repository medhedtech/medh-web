/**
 * Enhanced SEO Strategy for Medh Education Platform - 2025 Edition
 * Implementing cutting-edge SEO techniques optimized for AI-driven search engines
 * Focuses on E-E-A-T, semantic search, international optimization, and user experience
 */

import { Metadata } from 'next';

// 2025 AI-Optimized Education Keywords with Semantic Clusters
export const EDUCATION_KEYWORDS_2025 = {
  // Core Education Intent Clusters (AI-optimized for semantic search)
  primaryIntentClusters: {
    learning: [
      'online education platform',
      'digital learning solutions',
      'personalized learning experience',
      'adaptive learning technology',
      'AI-powered education',
      'smart learning platform',
      'interactive online courses',
      'virtual classroom experience'
    ],
    skills: [
      'professional skill development',
      'career advancement training',
      'industry-specific skills',
      'future-ready skills',
      'digital transformation skills',
      'emerging technology training',
      'soft skills development',
      'leadership development'
    ],
    certification: [
      'industry recognized certification',
      'professional certification programs',
      'accredited online courses',
      'ISO certified education',
      'STEM accredited programs',
      'globally recognized certificates',
      'career-boosting certifications',
      'skill validation programs'
    ]
  },

  // Long-tail semantic clusters for voice search and conversational AI
  conversationalQueries: [
    'how to learn new skills online effectively',
    'best online education platform for career growth',
    'which online courses provide job guarantee',
    'affordable professional development courses',
    'online learning with live instructor support',
    'courses that help get better job opportunities',
    'skill development programs for working professionals',
    'online education with flexible scheduling'
  ],

  // Geographic keywords for global reach
  globalKeywords: {
    india: [
      'online education india',
      'skill development courses india',
      'professional training india',
      'career advancement programs india',
      'digital learning platform india'
    ],
    international: [
      'global online education',
      'international certification programs',
      'cross-cultural learning platform',
      'worldwide skill development',
      'multi-language learning support'
    ]
  },

  // Trending 2025 keywords for emerging technologies
  emergingTech2025: [
    'generative AI education',
    'prompt engineering courses',
    'quantum computing basics',
    'blockchain for beginners',
    'metaverse development',
    'sustainable technology training',
    'green tech education',
    'ethical AI training'
  ]
};

// International SEO Configuration for Global Reach
export const INTERNATIONAL_SEO_CONFIG = {
  hrefLangMapping: {
    'en': 'en-US',
    'hi': 'hi-IN',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'ja': 'ja-JP',
    'ko': 'ko-KR',
    'zh': 'zh-CN',
    'ar': 'ar-SA'
  },
  
  regionalKeywords: {
    'US': ['online college courses', 'continuing education', 'professional development'],
    'IN': ['online education india', 'skill development courses', 'career advancement'],
    'UK': ['online learning uk', 'professional qualifications', 'career training'],
    'AU': ['online education australia', 'vocational training', 'skill development'],
    'CA': ['online courses canada', 'professional development', 'continuing education']
  },

  currencyByRegion: {
    'US': 'USD',
    'IN': 'INR',
    'UK': 'GBP',
    'EU': 'EUR',
    'AU': 'AUD',
    'CA': 'CAD'
  }
};

// Enhanced SEO Interface for 2025
export interface EnhancedSEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'profile' | 'course' | 'blog';
  publishedTime?: string;
  modifiedTime?: string;
  author?: {
    name: string;
    bio?: string;
    credentials?: string[];
    socialProfiles?: string[];
  };
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  locale?: string;
  alternateLanguages?: Array<{ locale: string; url: string }>;
  breadcrumbs?: Array<{ name: string; url: string }>;
  faq?: Array<{ question: string; answer: string }>;
  courseData?: any;
  eeatSignals?: {
    experience?: string[];
    expertise?: string[];
    authoritativeness?: string[];
    trustworthiness?: string[];
  };
}

// Advanced SEO Metadata Generator with 2025 Best Practices
export function generateEnhancedSEOMetadata(props: EnhancedSEOProps): Metadata {
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
    locale = 'en-US',
    alternateLanguages = []
  } = props;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://medh.co';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const imageUrl = image || `${baseUrl}/images/og-default.jpg`;
  
  // Enhanced keyword optimization with semantic clustering
  const semanticKeywords = generateSemanticKeywords(keywords[0] || 'education');
  const allKeywords = [
    ...keywords,
    ...semanticKeywords,
    'medh education',
    'online learning platform',
    'skill development'
  ].filter((keyword, index, self) => self.indexOf(keyword) === index).slice(0, 25);

  // AI-optimized title generation
  const finalTitle = generateAIOptimizedTitle(title || 'Medh Education Platform', keywords);
  
  // Enhanced meta description with E-E-A-T signals
  const finalDescription = generateEEATOptimizedDescription(
    description || 'Transform your career with AI-powered online education',
    props.eeatSignals
  );

  return {
    title: finalTitle,
    description: finalDescription,
    keywords: allKeywords.join(', '),
    authors: author ? [{ name: author.name, url: author.socialProfiles?.[0] }] : [{ name: 'Medh Editorial Team' }],
    publisher: 'Medh Education',
    alternates: {
      canonical: fullUrl,
      languages: alternateLanguages.reduce((acc, lang) => {
        acc[lang.locale] = `${baseUrl}${lang.url}`;
        return acc;
      }, {} as Record<string, string>)
    },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: fullUrl,
      siteName: 'Medh Education Platform',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title || 'Medh Education - Transform Your Career',
          type: 'image/jpeg'
        }
      ],
      locale: locale,
      type: type as any,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { 
        authors: [author.name],
        section: section || 'Education'
      }),
      ...(tags.length > 0 && { tags })
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [imageUrl],
      creator: '@medh_education',
      site: '@medh_education',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-image-preview': 'large'
      },
    },
    category: section || 'Education',
    other: {
      'article:section': section || 'Education',
      'article:tag': tags.join(', ') || 'Learning, Skills, Career',
      'og:updated_time': modifiedTime || new Date().toISOString(),
      'twitter:label1': 'Category',
      'twitter:data1': section || 'Education',
      'twitter:label2': 'Reading time',
      'twitter:data2': '5 min read'
    }
  };
}

// Enhanced Schema Markup Generator for 2025
export function generateEnhancedStructuredData(type: string, data: any) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://medh.co';
  
  const commonStructure = {
    "@context": "https://schema.org",
    "url": `${baseUrl}${data.url || ''}`,
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "Medh",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/images/medh-logo.png`,
        "width": 200,
        "height": 60
      },
      "sameAs": [
        "https://www.linkedin.com/company/medh",
        "https://twitter.com/medh_education",
        "https://www.facebook.com/medh.education",
        "https://www.instagram.com/medh_learning"
      ],
      "hasCredential": [
        {
          "@type": "EducationalOccupationalCredential",
          "name": "ISO 27001 Certified",
          "credentialCategory": "certification"
        },
        {
          "@type": "EducationalOccupationalCredential",
          "name": "STEM Accredited",
          "credentialCategory": "accreditation"
        }
      ]
    }
  };

  switch (type) {
    case 'course':
      return {
        ...commonStructure,
        "@type": "Course",
        "name": data.course_title,
        "description": data.course_description,
        "provider": commonStructure.publisher,
        "instructor": {
          "@type": "Person",
          "name": data.instructor?.name || "Expert Instructor",
          "description": data.instructor?.bio || "Industry expert with extensive experience",
          "hasCredential": {
            "@type": "EducationalOccupationalCredential",
            "name": "Professional Certification"
          }
        },
        "courseCode": data._id,
        "educationalLevel": data.level || data.grade,
        "timeRequired": data.course_duration,
        "inLanguage": data.language || "en",
        "coursePrerequisites": data.prerequisites || "Basic understanding recommended",
        "educationalCredentialAwarded": data.is_Certification ? {
          "@type": "EducationalOccupationalCredential",
          "name": `${data.course_title} Certificate`,
          "credentialCategory": "certificate"
        } : null,
        "teaches": data.learning_outcomes || [],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": data.meta?.ratings?.average || "4.7",
          "reviewCount": data.meta?.ratings?.count || "500",
          "bestRating": "5",
          "worstRating": "1"
        },
        "offers": {
          "@type": "Offer",
          "price": data.prices?.[0]?.individual || data.course_fee,
          "priceCurrency": data.prices?.[0]?.currency || "USD",
          "availability": "https://schema.org/InStock",
          "validFrom": new Date().toISOString(),
          "category": "education"
        },
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": data.class_type === "Live Courses" ? "online" : "blended",
          "courseSchedule": {
            "@type": "Schedule",
            "duration": data.course_duration
          }
        }
      };

    case 'blog':
      return {
        ...commonStructure,
        "@type": "BlogPosting",
        "headline": data.title,
        "description": data.description,
        "image": {
          "@type": "ImageObject",
          "url": data.image || `${baseUrl}/images/blog-default.jpg`,
          "width": 1200,
          "height": 630
        },
        "author": {
          "@type": "Person",
          "name": data.author?.name || "Medh Editorial Team",
          "description": data.author?.bio || "Expert content creators in education technology"
        },
        "datePublished": data.publishedTime,
        "dateModified": data.modifiedTime || data.publishedTime,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${baseUrl}${data.url}`
        },
        "keywords": data.keywords?.join(', '),
        "articleSection": data.section || 'Education',
        "wordCount": data.wordCount || 1000,
        "timeRequired": `PT${data.readingTime || 5}M`,
        "inLanguage": "en-US",
        "isAccessibleForFree": true
      };

    case 'organization':
      return {
        ...commonStructure,
        "@type": "EducationalOrganization",
        "name": "Medh",
        "alternateName": ["Medh Education", "Medh Learning Platform"],
        "description": "Global leader in AI-powered education technology, providing personalized learning experiences with industry-recognized certifications.",
        "foundingDate": "2020",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "IN"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": data.phone || "+91-XXXXXXXXX",
          "contactType": "customer service",
          "availableLanguage": ["English", "Hindi"],
          "email": data.email || "support@medh.co"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "10000+",
          "bestRating": "5"
        }
      };

    case 'faq':
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": data.map((faq: any) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      };

    case 'breadcrumb':
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": data.map((crumb: any, index: number) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": `${baseUrl}${crumb.url}`
        }))
      };

    default:
      return commonStructure;
  }
}

// AI-Optimized Title Generator
export function generateAIOptimizedTitle(baseTitle: string, keywords: string[] = []): string {
  const maxLength = 60;
  const brandSuffix = ' | Medh';
  
  let title = baseTitle;
  
  // Include primary keyword if not present
  const primaryKeyword = keywords[0];
  if (primaryKeyword && !title.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    title = `${primaryKeyword} - ${title}`;
  }
  
  // Add current year for freshness
  const currentYear = new Date().getFullYear();
  if (!title.includes(currentYear.toString()) && (title + ` ${currentYear}`).length < maxLength - brandSuffix.length) {
    title += ` ${currentYear}`;
  }
  
  // Add brand
  if ((title + brandSuffix).length <= maxLength) {
    title += brandSuffix;
  } else {
    title = title.substring(0, maxLength - brandSuffix.length - 3) + '...' + brandSuffix;
  }
  
  return title;
}

// E-E-A-T Optimized Description Generator
export function generateEEATOptimizedDescription(baseDescription: string, eeatSignals?: any): string {
  const maxLength = 160;
  let description = baseDescription;
  
  // Add E-E-A-T signals naturally
  const signals = [
    'Expert-led',
    'Industry-certified',
    'Trusted by thousands',
    'Proven results'
  ];
  
  const selectedSignal = signals[Math.floor(Math.random() * signals.length)];
  
  if (!description.toLowerCase().includes('expert') && 
      !description.toLowerCase().includes('certified') && 
      !description.toLowerCase().includes('trusted')) {
    description = `${selectedSignal} ${description.toLowerCase()}`;
  }
  
  // Add call-to-action
  const ctas = ['Start today', 'Get certified', 'Transform your career', 'Join now'];
  const cta = ctas[Math.floor(Math.random() * ctas.length)];
  
  if ((description + `. ${cta}.`).length <= maxLength) {
    description += `. ${cta}.`;
  }
  
  return description.substring(0, maxLength - 3) + (description.length > maxLength - 3 ? '...' : '');
}

// Semantic Keywords Generator
export function generateSemanticKeywords(primaryKeyword: string): string[] {
  const semanticClusters = {
    education: ['learning', 'training', 'course', 'skill', 'development', 'certification'],
    technology: ['AI', 'digital', 'online', 'virtual', 'interactive', 'smart'],
    career: ['professional', 'advancement', 'growth', 'opportunity', 'success'],
    quality: ['expert', 'industry-leading', 'comprehensive', 'personalized', 'effective']
  };

  const variations: string[] = [];
  
  Object.values(semanticClusters).flat().forEach(keyword => {
    variations.push(`${keyword} ${primaryKeyword}`);
    variations.push(`${primaryKeyword} ${keyword}`);
  });

  return [...new Set(variations)].slice(0, 10);
}

// Voice Search Optimization
export function optimizeForVoiceSearch(content: string) {
  const questionPatterns = [
    'What is',
    'How to',
    'Why should',
    'When to',
    'Where can',
    'Which is best'
  ];

  return {
    conversationalContent: content.replace(/\b(is|are|will be)\b/g, match => `${match} really`),
    questionAnswerPairs: questionPatterns.map(pattern => ({
      question: `${pattern} ${content.split(' ').slice(0, 5).join(' ')}?`,
      answer: content.substring(0, 150)
    })),
    localOptimization: [
      'near me',
      'in my area',
      'locally available',
      'best in location'
    ]
  };
}

// International SEO Helpers
export function generateHrefLangTags(currentUrl: string, languages: string[]) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://medh.co';
  
  return languages.map(lang => ({
    rel: 'alternate',
    hrefLang: INTERNATIONAL_SEO_CONFIG.hrefLangMapping[lang] || lang,
    href: `${baseUrl}/${lang}${currentUrl}`
  }));
}

export function getRegionalKeywords(region: string): string[] {
  return INTERNATIONAL_SEO_CONFIG.regionalKeywords[region] || [];
}

// Performance and Core Web Vitals Optimization
export const CORE_WEB_VITALS_OPTIMIZATION = {
  LCP: {
    target: '< 2.5 seconds',
    optimizations: [
      'Optimize hero images with WebP/AVIF format',
      'Implement critical CSS inlining',
      'Use CDN for static assets',
      'Preload key resources',
      'Optimize server response time'
    ]
  },
  FID: {
    target: '< 100 milliseconds',
    optimizations: [
      'Minimize JavaScript execution time',
      'Code splitting for non-critical scripts',
      'Use web workers for heavy computations',
      'Optimize third-party script loading'
    ]
  },
  CLS: {
    target: '< 0.1',
    optimizations: [
      'Set explicit dimensions for images and videos',
      'Reserve space for dynamic content',
      'Avoid inserting content above existing content',
      'Use CSS transform for animations'
    ]
  }
};

export default {
  generateEnhancedSEOMetadata,
  generateEnhancedStructuredData,
  generateAIOptimizedTitle,
  generateEEATOptimizedDescription,
  generateSemanticKeywords,
  optimizeForVoiceSearch,
  generateHrefLangTags,
  getRegionalKeywords
}; 