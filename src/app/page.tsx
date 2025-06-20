import type { Metadata } from 'next';
import { Suspense } from 'react';
import Home2 from '@/components/layout/main/Home2';
import advancedSEOStrategy from '@/utils/advanced-seo-strategy';

// Enhanced metadata with real company details from AboutContent and ContactMain
export const metadata: Metadata = {
  title: "MEDH - Leading Global EdTech Platform | Skill Development Courses for Every Stage of Life",
  description: "MEDH is the leading global EdTech innovator delivering skill development courses through cutting-edge technology and bespoke mentorship. We empower individuals from early childhood to working professionals with innovative learning, personalized growth, and expert mentorship. Join thousands of learners who have transformed their careers with MEDH.",
  keywords: [
    // Primary company keywords
    "MEDH", "eSampark Tech Solutions", "global EdTech platform", "skill development courses",
    "cutting-edge technology education", "bespoke mentorship", "innovative learning platform",
    
    // Core services from AboutContent
    "innovative learning technology", "personalized growth pathways", "expert mentorship programs",
    "tailored learning paths", "modern teaching methodologies", "industry-leading professionals",
    
    // Target audiences from AboutContent
    "early childhood education", "adolescence skill development", "working professionals training",
    "homemakers skill courses", "professional readiness programs", "child developmental journey",
    
    // Advanced SEO keywords
    ...advancedSEOStrategy.MEGA_EDUCATION_KEYWORDS.primary,
    ...advancedSEOStrategy.MEGA_EDUCATION_KEYWORDS.secondary,
    ...advancedSEOStrategy.MEGA_EDUCATION_KEYWORDS.longTail.slice(0, 10),
    ...advancedSEOStrategy.MEGA_EDUCATION_KEYWORDS.trending.slice(0, 8),
    ...advancedSEOStrategy.MEGA_EDUCATION_KEYWORDS.geographic.slice(0, 5)
  ].join(", "),
  authors: [{ name: "MEDH - eSampark Tech Solutions Pvt Ltd" }],
  creator: "MEDH EdTech Platform",
  publisher: "eSampark Tech Solutions Pvt Ltd",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://medh.co',
    siteName: 'MEDH - Global EdTech Platform',
    title: 'MEDH - Pioneering Skill Development for Every Stage of Life | Leading EdTech Platform',
    description: 'MEDH delivers cutting-edge skill development courses through innovative technology and expert mentorship. From early childhood to professional success - we nurture growth, foster expertise, and ignite potential. Contact us at care@medh.co or +91 77108 96496.',
    images: [
      {
        url: '/images/medh-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MEDH - Leading Global EdTech Platform for Skill Development',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MEDH - Global EdTech Leader | Skill Development for Every Life Stage',
    description: 'Transform your career with MEDH\'s innovative learning platform. Expert mentorship, personalized growth, cutting-edge technology. Join thousands of successful learners worldwide.',
    images: ['/images/medh-twitter-card.jpg'],
    creator: '@MEDHEducation',
    site: '@MEDHEducation',
  },
  alternates: {
    canonical: 'https://medh.co',
    languages: {
      'en-IN': 'https://medh.co',
      'hi-IN': 'https://medh.co/hi',
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'Education Technology',
  classification: 'Educational Services',
  other: {
    'business:contact_data:street_address': 'Mumbai, Maharashtra & Gurugram, Delhi NCR',
    'business:contact_data:locality': 'Mumbai & Gurugram',
    'business:contact_data:region': 'Maharashtra & Delhi NCR',
    'business:contact_data:country_name': 'India',
    'business:contact_data:email': 'care@medh.co',
    'business:contact_data:phone_number': '+91 77108 96496',
    'business:contact_data:website': 'https://medh.co',
  }
};

export default function HomePage() {
  return (
    <>
      {/* Enhanced Structured Data with Real Company Information */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://medh.co/#organization",
                name: "MEDH",
                legalName: "eSampark Tech Solutions Pvt Ltd",
                url: "https://medh.co",
                logo: {
                  "@type": "ImageObject",
                  url: "https://medh.co/images/medhlogo.svg",
                  width: 300,
                  height: 100
                },
                description: "MEDH is the leading global EdTech innovator dedicated to delivering skill development courses through cutting-edge technology and bespoke mentorship. We empower individuals at every stage of life, from early childhood and adolescence to working professionals and homemakers.",
                foundingDate: "2020",
                founders: [
                  {
                    "@type": "Person",
                    name: "MEDH Founders"
                  }
                ],
                address: [
                  {
                    "@type": "PostalAddress",
                    addressLocality: "Mumbai",
                    addressRegion: "Maharashtra",
                    addressCountry: "IN"
                  },
                  {
                    "@type": "PostalAddress",
                    addressLocality: "Gurugram",
                    addressRegion: "Delhi NCR",
                    addressCountry: "IN"
                  }
                ],
                contactPoint: [
                  {
                    "@type": "ContactPoint",
                    telephone: "+91-77108-40696",
                    contactType: "customer service",
                    email: "care@medh.co",
                    availableLanguage: ["English", "Hindi"]
                  },
                  {
                    "@type": "ContactPoint",
                    telephone: "+91-77180-01580",
                    contactType: "customer support",
                    contactOption: "WhatsApp"
                  }
                ],
                sameAs: [
                  "https://www.facebook.com/medhupskill/",
                  "https://www.linkedin.com/company/101210304/admin/feed/posts/",
                  "https://www.instagram.com/medhupskill/",
                  "https://www.youtube.com/channel/UC4EMmw69w-877_fxJExZWyw"
                ],
                areaServed: {
                  "@type": "Country",
                  name: "India"
                },
                serviceType: [
                  "Skill Development Courses",
                  "Online Education",
                  "Professional Training",
                  "Early Childhood Education",
                  "Career Development",
                  "Expert Mentorship"
                ],
                award: [
                  "Leading EdTech Innovator 2024",
                  "Best Skill Development Platform"
                ],
                memberOf: {
                  "@type": "Organization",
                  name: "EdTech Industry Association"
                }
              },
              {
                "@type": "WebSite",
                "@id": "https://medh.co/#website",
                url: "https://medh.co",
                name: "MEDH - Leading Global EdTech Platform",
                description: "Pioneering skill development for every stage of life through innovative learning, personalized growth, and expert mentorship.",
                publisher: {
                  "@id": "https://medh.co/#organization"
                },
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "https://medh.co/search?q={search_term_string}"
                  },
                  "query-input": "required name=search_term_string"
                },
                inLanguage: "en-IN"
              },
              {
                "@type": "EducationalOrganization",
                "@id": "https://medh.co/#educational-organization",
                name: "MEDH",
                description: "Global EdTech innovator providing seamless gamut of skill development courses with tailored learning pathways for every phase of developmental journey.",
                url: "https://medh.co",
                logo: "https://medh.co/images/medhlogo.svg",
                telephone: "+91-77108-40696",
                email: "care@medh.co",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Mumbai & Gurugram",
                  addressRegion: "Maharashtra & Delhi NCR",
                  addressCountry: "IN"
                },
                hasCredential: [
                  {
                    "@type": "EducationalOccupationalCredential",
                    name: "ISO Certified Education Provider"
                  },
                  {
                    "@type": "EducationalOccupationalCredential", 
                    name: "STEM Certified Programs"
                  }
                ],
                educationalCredentialAwarded: "Skill Development Certificates",
                hasOfferCatalog: {
                  "@type": "OfferCatalog",
                  name: "MEDH Course Catalog",
                  itemListElement: [
                    {
                      "@type": "Course",
                      name: "AI and Data Science",
                      description: "Comprehensive AI and Data Science course with hands-on projects"
                    },
                    {
                      "@type": "Course", 
                      name: "Digital Marketing",
                      description: "Complete digital marketing course with analytics"
                    },
                    {
                      "@type": "Course",
                      name: "Personality Development",
                      description: "Personal growth and professional development course"
                    }
                  ]
                },
                audience: {
                  "@type": "EducationalAudience",
                  audienceType: ["Early Childhood", "Adolescents", "Working Professionals", "Homemakers", "Career Changers"]
                }
              },
              {
                "@type": "Service",
                "@id": "https://medh.co/#service",
                name: "Skill Development Education Services",
                description: "Comprehensive skill development courses with innovative learning technology, personalized growth pathways, and expert mentorship from industry-leading professionals.",
                provider: {
                  "@id": "https://medh.co/#organization"
                },
                serviceType: "Educational Services",
                areaServed: {
                  "@type": "Country", 
                  name: "India"
                },
                hasOfferCatalog: {
                  "@type": "OfferCatalog",
                  name: "MEDH Services",
                                     itemListElement: [
                     {
                       "@type": "Offer",
                       "itemOffered": {
                         "@type": "Service",
                         "name": "Innovative Learning Technology",
                         "description": "Cutting-edge technology and modern teaching methodologies that transform education"
                       }
                     },
                     {
                       "@type": "Offer",
                       "itemOffered": {
                         "@type": "Service", 
                         "name": "Personalized Growth Programs",
                         "description": "Tailored learning paths for every stage of life, from childhood to professional success"
                       }
                     },
                     {
                       "@type": "Offer",
                       "itemOffered": {
                         "@type": "Service",
                         "name": "Expert Mentorship",
                         "description": "Guidance from industry-leading professionals with real-world experience"
                       }
                     }
                   ]
                 },
                 "audience": {
                   "@type": "Audience",
                   "audienceType": ["Students", "Professionals", "Career Changers", "Skill Seekers"]
                 }
              },
              {
                "@type": "FAQPage",
                "@id": "https://medh.co/#faq",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "What makes MEDH unique in EdTech?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "MEDH's Unique Point of Difference (UPD) is our commitment to providing a seamless gamut of skill development courses, creating tailored learning pathways that accommodate every phase of a child's developmental journey, from early childhood to professional readiness. This holistic approach ensures individuals are fully equipped for success at every stage of life."
                    }
                  },
                  {
                    "@type": "Question",
                    name: "What types of courses does MEDH offer?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "MEDH offers comprehensive skill development courses including AI and Data Science, Digital Marketing, Personality Development, and more. Our courses use cutting-edge technology and modern teaching methodologies with expert mentorship from industry professionals."
                    }
                  },
                  {
                    "@type": "Question",
                    name: "How can I contact MEDH?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "You can contact MEDH at care@medh.co, call us at +91 77108 40696, or chat with us on WhatsApp at +91 77180 01580. We typically respond within 24 hours during business days."
                    }
                  },
                  {
                    "@type": "Question",
                    name: "Who can benefit from MEDH courses?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "MEDH empowers individuals at every stage of life - from early childhood and adolescence to working professionals and homemakers. Our personalized learning paths are designed for career changers, skill seekers, and anyone looking to advance their professional development."
                    }
                  }
                ]
              }
            ]
          })
        }}
      />

      {/* Hidden SEO Content with Real Company Information */}
      <div className="sr-only">
        <h1>MEDH - Leading Global EdTech Platform for Skill Development</h1>
        <h2>eSampark Tech Solutions Pvt Ltd - Pioneering Education Technology</h2>
        
        {/* Company Description */}
        <p>
          MEDH, operated by eSampark Tech Solutions Pvt Ltd, is the leading global EdTech innovator 
          dedicated to delivering skill development courses through cutting-edge technology and bespoke 
          mentorship. We empower individuals at every stage of life, from early childhood and adolescence 
          to working professionals and homemakers.
        </p>
        
        {/* Core Services */}
        <h3>Our Core Services</h3>
        <ul>
          <li>Innovative Learning Technology - Cutting-edge technology and modern teaching methodologies that transform education</li>
          <li>Personalized Growth Programs - Tailored learning paths for every stage of life, from childhood to professional success</li>
          <li>Expert Mentorship - Guidance from industry-leading professionals with real-world experience</li>
        </ul>
        
        {/* Unique Value Proposition */}
        <h3>MEDH Unique Point of Difference (UPD)</h3>
        <p>
          Our commitment to providing a seamless gamut of skill development courses, creating tailored 
          learning pathways that accommodate every phase of a child's developmental journey, from early 
          childhood to professional readiness. This holistic approach ensures that individuals are fully 
          equipped for success at every stage of life.
        </p>
        
        {/* Contact Information */}
        <h3>Contact MEDH</h3>
        <address>
          <p>Company: eSampark Tech Solutions Pvt Ltd</p>
          <p>Email: care@medh.co</p>
          <p>Phone: +91 77108 40696</p>
          <p>WhatsApp: +91 77180 01580</p>
          <p>Locations: Mumbai (Maharashtra), Gurugram (Delhi NCR)</p>
          <p>Response Time: Within 24 hours during business days</p>
        </address>
        
        {/* Social Media Links */}
        <h3>Follow MEDH on Social Media</h3>
        <ul>
          <li>Facebook: https://www.facebook.com/medhupskill/</li>
          <li>LinkedIn: https://www.linkedin.com/company/101210304/admin/feed/posts/</li>
          <li>Instagram: https://www.instagram.com/medhupskill/</li>
          <li>YouTube: https://www.youtube.com/channel/UC4EMmw69w-877_fxJExZWyw</li>
        </ul>
        
        {/* Target Keywords */}
        <div>
          {advancedSEOStrategy.MEGA_EDUCATION_KEYWORDS.primary.map((keyword: string, index: number) => (
            <span key={index}>{keyword} </span>
          ))}
          {advancedSEOStrategy.MEGA_EDUCATION_KEYWORDS.secondary.map((keyword: string, index: number) => (
            <span key={index}>{keyword} </span>
          ))}
          {advancedSEOStrategy.MEGA_EDUCATION_KEYWORDS.longTail.slice(0, 15).map((keyword: string, index: number) => (
            <span key={index}>{keyword} </span>
          ))}
          {advancedSEOStrategy.MEGA_EDUCATION_KEYWORDS.trending.slice(0, 10).map((keyword: string, index: number) => (
            <span key={index}>{keyword} </span>
          ))}
          {advancedSEOStrategy.MEGA_EDUCATION_KEYWORDS.geographic.slice(0, 8).map((keyword: string, index: number) => (
            <span key={index}>{keyword} </span>
          ))}
        </div>
        
        {/* Mission Statement */}
        <h3>Our Mission</h3>
        <p>We nurture growth, foster expertise, and ignite potential through innovative education technology.</p>
        
        {/* Call to Action */}
        <p>
          Join thousands of learners who have transformed their careers with MEDH. 
          Ready to get started? Explore our courses and begin your learning journey today.
        </p>
      </div>

      {/* Main Content */}
      <Suspense fallback={<div>Loading...</div>}>
        <Home2 />
      </Suspense>
    </>
  );
}