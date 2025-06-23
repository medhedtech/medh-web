/**
 * Local SEO Utilities for Medh Education Platform
 * Handles regional targeting, multi-location optimization, and local search
 */

interface LocalBusinessData {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  phone: string;
  website: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  hours?: {
    [day: string]: { open: string; close: string; closed?: boolean };
  };
  services: string[];
}

interface RegionalContent {
  region: string;
  language: string;
  currency: string;
  keywords: string[];
  localizedContent: {
    title: string;
    description: string;
    features: string[];
  };
}

export class LocalSEOOptimizer {
  private supportedRegions = {
    'US': { language: 'en-US', currency: 'USD', timezone: 'America/New_York' },
    'UK': { language: 'en-GB', currency: 'GBP', timezone: 'Europe/London' },
    'IN': { language: 'en-IN', currency: 'INR', timezone: 'Asia/Kolkata' },
    'AU': { language: 'en-AU', currency: 'AUD', timezone: 'Australia/Sydney' },
    'CA': { language: 'en-CA', currency: 'CAD', timezone: 'America/Toronto' },
    'SG': { language: 'en-SG', currency: 'SGD', timezone: 'Asia/Singapore' },
    'AE': { language: 'en-AE', currency: 'AED', timezone: 'Asia/Dubai' },
    'DE': { language: 'de-DE', currency: 'EUR', timezone: 'Europe/Berlin' },
    'FR': { language: 'fr-FR', currency: 'EUR', timezone: 'Europe/Paris' }
  };

  // Generate local business schema
  generateLocalBusinessSchema(businessData: LocalBusinessData): object {
    return {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": businessData.name,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": businessData.address.street,
        "addressLocality": businessData.address.city,
        "addressRegion": businessData.address.state,
        "postalCode": businessData.address.postalCode,
        "addressCountry": businessData.address.country
      },
      "telephone": businessData.phone,
      "url": businessData.website,
      "geo": businessData.coordinates ? {
        "@type": "GeoCoordinates",
        "latitude": businessData.coordinates.latitude,
        "longitude": businessData.coordinates.longitude
      } : undefined,
      "openingHoursSpecification": businessData.hours ? 
        Object.entries(businessData.hours).map(([day, hours]) => ({
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": this.formatDayOfWeek(day),
          "opens": hours.closed ? undefined : hours.open,
          "closes": hours.closed ? undefined : hours.close
        })).filter(spec => spec.opens) : undefined,
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Education Services",
        "itemListElement": businessData.services.map((service, index) => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": service
          }
        }))
      },
      "areaServed": {
        "@type": "Place",
        "name": `${businessData.address.city}, ${businessData.address.state}`
      }
    };
  }

  // Generate region-specific content
  generateRegionalContent(baseContent: any, targetRegion: string): RegionalContent {
    const regionConfig = this.supportedRegions[targetRegion as keyof typeof this.supportedRegions];
    if (!regionConfig) {
      throw new Error(`Unsupported region: ${targetRegion}`);
    }

    const localKeywords = this.getLocalKeywords(baseContent.keywords, targetRegion);
    const localizedContent = this.localizeContent(baseContent, targetRegion);

    return {
      region: targetRegion,
      language: regionConfig.language,
      currency: regionConfig.currency,
      keywords: localKeywords,
      localizedContent
    };
  }

  // Generate hreflang tags for international SEO
  generateHreflangTags(baseUrl: string, availableRegions: string[]): string[] {
    const hreflangTags: string[] = [];

    availableRegions.forEach(region => {
      const regionConfig = this.supportedRegions[region as keyof typeof this.supportedRegions];
      if (regionConfig) {
        const regionUrl = region === 'US' ? baseUrl : `${baseUrl}/${region.toLowerCase()}`;
        hreflangTags.push(
          `<link rel="alternate" hreflang="${regionConfig.language}" href="${regionUrl}" />`
        );
      }
    });

    // Add x-default for international users
    hreflangTags.push(
      `<link rel="alternate" hreflang="x-default" href="${baseUrl}" />`
    );

    return hreflangTags;
  }

  // Generate local landing page content
  generateLocalLandingPage(region: string, courseCategory?: string): object {
    const regionConfig = this.supportedRegions[region as keyof typeof this.supportedRegions];
    const regionName = this.getRegionDisplayName(region);
    
    const localizedContent = {
      title: courseCategory 
        ? `${courseCategory} Courses in ${regionName} | Medh Education`
        : `Online Education Platform in ${regionName} | Medh`,
      
      description: courseCategory
        ? `Master ${courseCategory} with expert-led online courses designed for ${regionName} professionals. Industry-recognized certifications, live instruction, and career support.`
        : `Transform your career with Medh's online education platform. Serving students and professionals in ${regionName} with live courses, certifications, and job placement support.`,
      
      h1: courseCategory
        ? `${courseCategory} Training Programs in ${regionName}`
        : `Professional Online Education in ${regionName}`,
      
      localFeatures: this.getLocalFeatures(region),
      
      localTestimonials: this.getLocalTestimonials(region),
      
      localPartners: this.getLocalPartners(region),
      
      localPricing: this.getLocalPricing(region),
      
      contactInfo: this.getLocalContactInfo(region)
    };

    return {
      region,
      language: regionConfig?.language || 'en-US',
      currency: regionConfig?.currency || 'USD',
      content: localizedContent,
      schema: this.generateLocalPageSchema(localizedContent, region)
    };
  }

  // Generate city-specific keywords
  generateCityKeywords(baseKeywords: string[], cities: string[]): string[] {
    const cityKeywords: string[] = [];

    baseKeywords.forEach(keyword => {
      cities.forEach(city => {
        cityKeywords.push(`${keyword} in ${city}`);
        cityKeywords.push(`${keyword} ${city}`);
        cityKeywords.push(`${city} ${keyword}`);
        cityKeywords.push(`best ${keyword} ${city}`);
        cityKeywords.push(`${keyword} training ${city}`);
        cityKeywords.push(`${keyword} courses ${city}`);
      });
    });

    return cityKeywords;
  }

  // Generate local FAQ content
  generateLocalFAQ(region: string): Array<{question: string, answer: string}> {
    const regionName = this.getRegionDisplayName(region);
    const regionConfig = this.supportedRegions[region as keyof typeof this.supportedRegions];
    const currency = regionConfig?.currency || 'USD';

    return [
      {
        question: `Are Medh courses available in ${regionName}?`,
        answer: `Yes, Medh offers online courses globally, including ${regionName}. All courses are delivered online with live instruction and are accessible from anywhere with an internet connection.`
      },
      {
        question: `What currency are course prices displayed in for ${regionName}?`,
        answer: `Course prices for ${regionName} students are displayed in ${currency}. We also offer flexible payment plans and regional pricing where applicable.`
      },
      {
        question: `Do you provide job placement support in ${regionName}?`,
        answer: `Yes, we provide career support and job placement assistance for ${regionName} students, including resume optimization, interview preparation, and connections with local employers.`
      },
      {
        question: `Are the certifications recognized in ${regionName}?`,
        answer: `Our certifications are industry-recognized globally, including in ${regionName}. They are accepted by leading employers and educational institutions worldwide.`
      },
      {
        question: `What are the class timings for ${regionName} students?`,
        answer: `We offer flexible class timings to accommodate students in ${regionName}, including evening and weekend sessions. Live sessions are recorded for your convenience.`
      }
    ];
  }

  // Private helper methods
  private getLocalKeywords(baseKeywords: string[], region: string): string[] {
    const regionName = this.getRegionDisplayName(region);
    const localKeywords = [...baseKeywords];

    baseKeywords.forEach(keyword => {
      localKeywords.push(`${keyword} ${regionName}`);
      localKeywords.push(`${keyword} in ${regionName}`);
      localKeywords.push(`best ${keyword} ${regionName}`);
    });

    // Add region-specific education keywords
    const regionSpecificKeywords = this.getRegionSpecificKeywords(region);
    localKeywords.push(...regionSpecificKeywords);

    return localKeywords;
  }

  private localizeContent(baseContent: any, region: string): any {
    const regionName = this.getRegionDisplayName(region);
    
    return {
      title: `${baseContent.title} - ${regionName}`,
      description: `${baseContent.description} Serving students and professionals in ${regionName}.`,
      features: [
        ...baseContent.features,
        `Optimized for ${regionName} time zones`,
        `Local career support in ${regionName}`,
        `Regional pricing in local currency`
      ]
    };
  }

  private formatDayOfWeek(day: string): string {
    const dayMap: Record<string, string> = {
      'monday': 'Monday',
      'tuesday': 'Tuesday',
      'wednesday': 'Wednesday',
      'thursday': 'Thursday',
      'friday': 'Friday',
      'saturday': 'Saturday',
      'sunday': 'Sunday'
    };
    return dayMap[day.toLowerCase()] || day;
  }

  private getRegionDisplayName(region: string): string {
    const regionNames: Record<string, string> = {
      'US': 'United States',
      'UK': 'United Kingdom',
      'IN': 'India',
      'AU': 'Australia',
      'CA': 'Canada',
      'SG': 'Singapore',
      'AE': 'United Arab Emirates',
      'DE': 'Germany',
      'FR': 'France'
    };
    return regionNames[region] || region;
  }

  private getLocalFeatures(region: string): string[] {
    const commonFeatures = [
      'Live online classes with expert instructors',
      'Industry-recognized certifications',
      'Career support and job placement assistance',
      'Flexible scheduling and recorded sessions'
    ];

    const regionSpecificFeatures: Record<string, string[]> = {
      'IN': [
        'Courses designed for Indian industry standards',
        'Local company partnerships and internships',
        'Support for competitive exam preparation'
      ],
      'US': [
        'Aligned with US industry requirements',
        'Networking opportunities with US professionals',
        'Preparation for US tech certifications'
      ],
      'UK': [
        'UK industry-focused curriculum',
        'Connections with UK employers',
        'Support for UK visa and work permits'
      ]
    };

    return [...commonFeatures, ...(regionSpecificFeatures[region] || [])];
  }

  private getLocalTestimonials(region: string): any[] {
    // This would typically fetch real testimonials from the database
    return [
      {
        name: `Student from ${this.getRegionDisplayName(region)}`,
        text: `Medh's courses helped me advance my career right here in ${this.getRegionDisplayName(region)}. The local support made all the difference.`,
        rating: 5
      }
    ];
  }

  private getLocalPartners(region: string): string[] {
    const partnerMap: Record<string, string[]> = {
      'IN': ['TCS', 'Infosys', 'Wipro', 'HCL Technologies'],
      'US': ['Google', 'Microsoft', 'Amazon', 'IBM'],
      'UK': ['Accenture UK', 'BT Group', 'Sage', 'ARM Holdings']
    };
    return partnerMap[region] || ['Leading tech companies', 'Fortune 500 corporations'];
  }

  private getLocalPricing(region: string): any {
    const regionConfig = this.supportedRegions[region as keyof typeof this.supportedRegions];
    return {
      currency: regionConfig?.currency || 'USD',
      symbol: this.getCurrencySymbol(regionConfig?.currency || 'USD'),
      hasRegionalDiscount: ['IN', 'PH', 'BD'].includes(region)
    };
  }

  private getLocalContactInfo(region: string): any {
    return {
      email: `support-${region.toLowerCase()}@medh.co`,
      phone: this.getLocalPhoneNumber(region),
      timezone: this.supportedRegions[region as keyof typeof this.supportedRegions]?.timezone
    };
  }

  private getRegionSpecificKeywords(region: string): string[] {
    const keywordMap: Record<string, string[]> = {
      'IN': ['upskilling India', 'online education India', 'skill development India'],
      'US': ['professional development USA', 'online training America', 'career advancement US'],
      'UK': ['professional courses UK', 'online learning Britain', 'skill training England']
    };
    return keywordMap[region] || [];
  }

  private generateLocalPageSchema(content: any, region: string): object {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": content.title,
      "description": content.description,
      "inLanguage": this.supportedRegions[region as keyof typeof this.supportedRegions]?.language || 'en',
      "about": {
        "@type": "Thing",
        "name": `Online Education in ${this.getRegionDisplayName(region)}`
      },
      "audience": {
        "@type": "Audience",
        "geographicArea": {
          "@type": "Country",
          "name": this.getRegionDisplayName(region)
        }
      }
    };
  }

  private getCurrencySymbol(currency: string): string {
    const symbolMap: Record<string, string> = {
      'USD': '$', 'EUR': '€', 'GBP': '£', 'INR': '₹', 
      'AUD': 'A$', 'CAD': 'C$', 'SGD': 'S$', 'AED': 'د.إ'
    };
    return symbolMap[currency] || currency;
  }

  private getLocalPhoneNumber(region: string): string {
    const phoneMap: Record<string, string> = {
      'US': '+1-800-MEDH-EDU',
      'UK': '+44-800-MEDH-EDU', 
      'IN': '+91-800-MEDH-EDU',
      'AU': '+61-800-MEDH-EDU'
    };
    return phoneMap[region] || '+1-800-MEDH-EDU';
  }
}

// Export utility functions
export function generateLocalBusinessSchema(businessData: LocalBusinessData): object {
  const optimizer = new LocalSEOOptimizer();
  return optimizer.generateLocalBusinessSchema(businessData);
}

export function generateRegionalContent(baseContent: any, region: string): RegionalContent {
  const optimizer = new LocalSEOOptimizer();
  return optimizer.generateRegionalContent(baseContent, region);
}

export function generateHreflangTags(baseUrl: string, regions: string[]): string[] {
  const optimizer = new LocalSEOOptimizer();
  return optimizer.generateHreflangTags(baseUrl, regions);
}

export function generateLocalLandingPage(region: string, category?: string): object {
  const optimizer = new LocalSEOOptimizer();
  return optimizer.generateLocalLandingPage(region, category);
}

export function generateCityKeywords(baseKeywords: string[], cities: string[]): string[] {
  const optimizer = new LocalSEOOptimizer();
  return optimizer.generateCityKeywords(baseKeywords, cities);
}

export default LocalSEOOptimizer; 