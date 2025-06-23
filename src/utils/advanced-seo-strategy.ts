/**
 * Advanced SEO Strategy for Medh Education Platform - 2025 Edition
 * Implementing cutting-edge SEO techniques optimized for AI-driven search engines
 * Focuses on E-E-A-T, semantic search, international optimization, and user experience
 */

// 2025 AI-Optimized Education Keywords with Semantic Clusters
export const ADVANCED_EDUCATION_KEYWORDS_2025 = {
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

  // Geographic and cultural keywords for global reach
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

  // Industry-specific semantic clusters
  industryVerticals: {
    technology: [
      'AI and machine learning courses',
      'data science certification',
      'cybersecurity training programs',
      'cloud computing courses',
      'digital marketing certification',
      'software development bootcamp'
    ],
    business: [
      'business analytics training',
      'project management certification',
      'leadership development program',
      'entrepreneurship courses',
      'digital transformation training'
    ],
    creative: [
      'digital design courses',
      'content creation training',
      'creative writing programs',
      'multimedia production courses'
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

// Advanced E-E-A-T Optimized Schema Markup for 2025
export const ADVANCED_SCHEMA_2025 = {
  // Enhanced Organization Schema with E-E-A-T signals
  educationalOrganization: {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Medh",
    "alternateName": ["Medh Education", "Medh Learning Platform", "Medh EdTech"],
    "url": "https://medh.co",
    "logo": {
      "@type": "ImageObject",
      "url": "https://medh.co/images/medh-logo.png",
      "width": 200,
      "height": 60
    },
    "description": "Global leader in AI-powered education technology, providing personalized learning experiences with industry-recognized certifications and job placement support.",
    "foundingDate": "2020",
    "legalName": "Medh",
    "taxID": "{{TAX_ID}}",
    "duns": "{{DUNS_NUMBER}}",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN",
      "addressRegion": "Maharastra",
      "addressLocality": "Mumbai",
      "postalCode": "400077",
      "streetAddress": "{{STREET_ADDRESS}}"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "{{PHONE_NUMBER}}",
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
    "sameAs": [
      "https://www.linkedin.com/company/medh",
      "https://twitter.com/medh_education",
      "https://www.facebook.com/medh.education",
      "https://www.instagram.com/medh_learning",
      "https://www.youtube.com/c/medheducation"
    ],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "name": "ISO 27001 Information Security Certification",
        "credentialCategory": "certification",
        "recognizedBy": {
          "@type": "Organization",
          "name": "International Organization for Standardization"
        }
      },
      {
        "@type": "EducationalOccupationalCredential",
        "name": "STEM Accreditation",
        "credentialCategory": "accreditation",
        "recognizedBy": {
          "@type": "Organization",
          "name": "STEM Education Coalition"
        }
      }
    ],
    "accreditedBy": [
      {
        "@type": "Organization",
        "name": "International Accreditation Council for Education"
      }
    ],
    "memberOf": [
      {
        "@type": "Organization",
        "name": "Global Education Technology Association"
      }
    ],
    "award": [
      "Best EdTech Platform 2024",
      "Innovation in Online Learning 2024"
    ],
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": "500+"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "10000+",
      "bestRating": "5",
      "worstRating": "1"
    }
  },

  // Enhanced Course Schema with 2025 best practices
  courseSchema: (courseData: any) => ({
    "@context": "https://schema.org",
    "@type": "Course",
    "name": courseData.course_title,
    "description": courseData.course_description,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Medh",
      "url": "https://medh.co",
      "sameAs": ["https://www.linkedin.com/company/medh"]
    },
    "instructor": {
      "@type": "Person",
      "name": courseData.instructor?.name || "Expert Instructor",
      "description": courseData.instructor?.bio || "Industry expert with 10+ years experience",
      "knowsAbout": courseData.tools_technologies || [],
      "hasCredential": {
        "@type": "EducationalOccupationalCredential",
        "name": "Industry Certification"
      }
    },
    "courseCode": courseData._id,
    "educationalLevel": courseData.level || courseData.grade,
    "timeRequired": courseData.course_duration,
    "inLanguage": courseData.language || "en",
    "availableLanguage": ["en", "hi"],
    "coursePrerequisites": courseData.prerequisites || "Basic computer knowledge",
    "educationalCredentialAwarded": courseData.is_Certification ? {
      "@type": "EducationalOccupationalCredential",
      "name": `${courseData.course_title} Certificate`,
      "credentialCategory": "certificate",
      "recognizedBy": {
        "@type": "Organization",
        "name": "Medh"
      }
    } : null,
    "teaches": courseData.learning_outcomes || [],
    "courseWorkload": `${courseData.min_hours_per_week || 3}-${courseData.max_hours_per_week || 5} hours per week`,
    "numberOfCredits": courseData.no_of_Sessions || 0,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": courseData.meta?.ratings?.average || "4.5",
      "reviewCount": courseData.meta?.ratings?.count || "100",
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "Offer",
      "price": courseData.prices?.[0]?.individual || courseData.course_fee,
      "priceCurrency": courseData.prices?.[0]?.currency || "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString(),
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      "category": "education"
    },
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
    "teaches": courseData.learning_outcomes || [],
    "isAccessibleForFree": courseData.isFree || false,
    "creativeWorkStatus": courseData.status,
    "dateCreated": courseData.createdAt,
    "dateModified": courseData.updatedAt
  }),

  // FAQ Schema for enhanced SERP features
  faqSchema: (faqs: Array<{question: string, answer: string}>) => ({
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
  }),

  // Enhanced Website Schema with site search
  websiteSchema: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Medh - Global Education Platform",
    "alternateName": "Medh Education",
    "url": "https://medh.co",
    "description": "Transform your career with AI-powered online education. Industry-recognized certifications, live expert instruction, and job placement support.",
    "publisher": {
      "@type": "Organization",
      "name": "Medh"
    },
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://medh.co/search?q={search_term_string}"
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
          "url": "https://medh.co/courses/ai-data-science"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Digital Marketing",
          "url": "https://medh.co/courses/digital-marketing"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Personality Development",
          "url": "https://medh.co/courses/personality-development"
        }
      ]
    }
  },

  // Breadcrumb Schema for better navigation understanding
  breadcrumbSchema: (breadcrumbs: Array<{name: string, url: string}>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `https://medh.co${crumb.url}`
    }))
  })
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

// Advanced Technical SEO Utilities for 2025
export class AdvancedSEOOptimizer {
  private baseUrl: string;
  
  constructor(baseUrl: string = 'https://medh.co') {
    this.baseUrl = baseUrl;
  }

  // Generate semantic keyword clusters using AI-like approach
  generateSemanticKeywords(primaryKeyword: string, context: string = 'education'): string[] {
    const semanticClusters = {
      education: ['learning', 'training', 'course', 'skill', 'development', 'certification'],
      technology: ['AI', 'digital', 'online', 'virtual', 'interactive', 'smart'],
      career: ['professional', 'advancement', 'growth', 'opportunity', 'success'],
      quality: ['expert', 'industry-leading', 'comprehensive', 'personalized', 'effective']
    };

    const baseKeywords = semanticClusters[context as keyof typeof semanticClusters] || semanticClusters.education;
    const variations = [];

    baseKeywords.forEach(keyword => {
      variations.push(`${keyword} ${primaryKeyword}`);
      variations.push(`${primaryKeyword} ${keyword}`);
      variations.push(`best ${primaryKeyword} ${keyword}`);
      variations.push(`online ${primaryKeyword} ${keyword}`);
    });

    return [...new Set(variations)].slice(0, 15);
  }

  // Generate E-E-A-T optimized content structure
  generateEEATContent(topic: string, expertise: any) {
    return {
      experienceSignals: [
        `Real-world application of ${topic}`,
        `Hands-on projects and assignments`,
        `Industry case studies and examples`,
        `Practical skill development focus`
      ],
      expertiseSignals: [
        `Expert instructors with 10+ years experience`,
        `Industry-recognized curriculum`,
        `Up-to-date content aligned with industry standards`,
        `Comprehensive skill assessment and certification`
      ],
      authoritativenessSignals: [
        `ISO 27001 certified platform`,
        `STEM accredited programs`,
        `Partnerships with leading industry organizations`,
        `Thousands of successful graduates`
      ],
      trustSignals: [
        `Transparent pricing and policies`,
        `Verified student reviews and testimonials`,
        `Secure payment processing`,
        `Money-back guarantee`,
        `24/7 customer support`
      ]
    };
  }

  // Generate voice search optimized content
  generateVoiceSearchOptimization(content: string) {
    const questionPatterns = [
      'What is',
      'How to',
      'Why should',
      'When to',
      'Where can',
      'Which is best'
    ];

    const voiceOptimizedContent = {
      conversationalTone: content.replace(/\b(is|are|will be)\b/g, match => `${match} really`),
      questionAnswerPairs: questionPatterns.map(pattern => ({
        question: `${pattern} ${content.split(' ').slice(0, 5).join(' ')}?`,
        answer: content.substring(0, 150)
      })),
      localOptimization: [
        'near me',
        'in my area',
        'locally available',
        'best in [city]'
      ]
    };

    return voiceOptimizedContent;
  }

  // Generate Core Web Vitals optimization suggestions
  generatePerformanceOptimization() {
    return {
      LCP: {
        target: '< 2.5 seconds',
        optimizations: [
          'Optimize hero images with WebP format',
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
  }

  // Generate AI-optimized meta descriptions
  generateAIOptimizedMetaDescription(content: string, keywords: string[]): string {
    const maxLength = 160;
    const keywordDensity = 2; // Maximum 2 keywords per description
    const selectedKeywords = keywords.slice(0, keywordDensity);
    
    let description = content.substring(0, 120);
    
    // Ensure keywords are included naturally
    selectedKeywords.forEach(keyword => {
      if (!description.toLowerCase().includes(keyword.toLowerCase())) {
        description = `${keyword} - ${description}`;
      }
    });

    // Add call-to-action for better CTR
    const ctas = [
      'Start learning today',
      'Get certified now',
      'Transform your career',
      'Join thousands of learners'
    ];
    
    const cta = ctas[Math.floor(Math.random() * ctas.length)];
    
    if ((description + ` ${cta}.`).length <= maxLength) {
      description += ` ${cta}.`;
    }

    return description.substring(0, maxLength - 3) + '...';
  }

  // Generate structured data for different content types
  generateAdvancedStructuredData(type: string, data: any) {
    switch (type) {
      case 'course':
        return ADVANCED_SCHEMA_2025.courseSchema(data);
      case 'faq':
        return ADVANCED_SCHEMA_2025.faqSchema(data);
      case 'organization':
        return ADVANCED_SCHEMA_2025.educationalOrganization;
      case 'website':
        return ADVANCED_SCHEMA_2025.websiteSchema;
      case 'breadcrumb':
        return ADVANCED_SCHEMA_2025.breadcrumbSchema(data);
      default:
        return null;
    }
  }
}

// Export utility functions
export function generateOptimizedTitle(baseTitle: string, keywords: string[], year: number = 2025): string {
  const maxLength = 60;
  const yearSuffix = ` ${year}`;
  const brandSuffix = ' | Medh';
  
  let title = baseTitle;
  
  // Try to include primary keyword if not already present
  const primaryKeyword = keywords[0];
  if (primaryKeyword && !title.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    title = `${primaryKeyword} - ${title}`;
  }
  
  // Add year for freshness signal
  if ((title + yearSuffix + brandSuffix).length <= maxLength) {
    title += yearSuffix;
  }
  
  // Add brand
  if ((title + brandSuffix).length <= maxLength) {
    title += brandSuffix;
  } else {
    title = title.substring(0, maxLength - brandSuffix.length - 3) + '...' + brandSuffix;
  }
  
  return title;
}

export function calculateKeywordDensity(content: string, keyword: string): number {
  const words = content.toLowerCase().split(/\s+/);
  const keywordWords = keyword.toLowerCase().split(/\s+/);
  let count = 0;
  
  for (let i = 0; i <= words.length - keywordWords.length; i++) {
    if (keywordWords.every((word, index) => words[i + index] === word)) {
      count++;
    }
  }
  
  return (count / words.length) * 100;
}

export function generateSchemaMarkup(type: string, data: any): string {
  const optimizer = new AdvancedSEOOptimizer();
  const schema = optimizer.generateAdvancedStructuredData(type, data);
  return schema ? JSON.stringify(schema, null, 2) : '';
}

// Content Quality Analyzer for E-E-A-T compliance
export class ContentQualityAnalyzer {
  analyzeEEAT(content: string, metadata: any) {
    const analysis = {
      experience: this.analyzeExperience(content),
      expertise: this.analyzeExpertise(content, metadata),
      authoritativeness: this.analyzeAuthoritativeness(metadata),
      trustworthiness: this.analyzeTrustworthiness(content, metadata),
      overallScore: 0
    };
    
    analysis.overallScore = (
      analysis.experience.score +
      analysis.expertise.score +
      analysis.authoritativeness.score +
      analysis.trustworthiness.score
    ) / 4;
    
    return analysis;
  }
  
  private analyzeExperience(content: string) {
    const experienceSignals = [
      'real-world',
      'hands-on',
      'practical',
      'case study',
      'example',
      'experience',
      'application'
    ];
    
    const signalCount = experienceSignals.reduce((count, signal) => {
      return count + (content.toLowerCase().includes(signal) ? 1 : 0);
    }, 0);
    
    return {
      score: Math.min(signalCount * 10, 100),
      signals: experienceSignals.filter(signal => content.toLowerCase().includes(signal))
    };
  }
  
  private analyzeExpertise(content: string, metadata: any) {
    const expertiseSignals = [
      'expert',
      'professional',
      'certified',
      'qualified',
      'experienced',
      'specialist',
      'authority'
    ];
    
    const signalCount = expertiseSignals.reduce((count, signal) => {
      return count + (content.toLowerCase().includes(signal) ? 1 : 0);
    }, 0);
    
    const hasAuthorInfo = metadata.author && metadata.author.length > 0;
    const hasCertifications = metadata.certifications && metadata.certifications.length > 0;
    
    return {
      score: Math.min((signalCount * 10) + (hasAuthorInfo ? 20 : 0) + (hasCertifications ? 20 : 0), 100),
      signals: expertiseSignals.filter(signal => content.toLowerCase().includes(signal))
    };
  }
  
  private analyzeAuthoritativeness(metadata: any) {
    const authoritySignals = [
      metadata.backlinks || 0,
      metadata.socialShares || 0,
      metadata.citations || 0,
      metadata.awards || 0
    ];
    
    const score = Math.min(authoritySignals.reduce((sum, value) => sum + value, 0), 100);
    
    return {
      score,
      signals: authoritySignals
    };
  }
  
  private analyzeTrustworthiness(content: string, metadata: any) {
    const trustSignals = [
      'guarantee',
      'secure',
      'verified',
      'testimonial',
      'review',
      'transparent',
      'privacy'
    ];
    
    const signalCount = trustSignals.reduce((count, signal) => {
      return count + (content.toLowerCase().includes(signal) ? 1 : 0);
    }, 0);
    
    const hasContactInfo = metadata.contact && Object.keys(metadata.contact).length > 0;
    const hasPrivacyPolicy = metadata.privacyPolicy || false;
    const hasSSL = metadata.ssl || false;
    
    return {
      score: Math.min(
        (signalCount * 10) + 
        (hasContactInfo ? 15 : 0) + 
        (hasPrivacyPolicy ? 15 : 0) + 
        (hasSSL ? 10 : 0), 
        100
      ),
      signals: trustSignals.filter(signal => content.toLowerCase().includes(signal))
    };
  }
}

export default AdvancedSEOOptimizer; 