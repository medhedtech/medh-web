import { siteConfig } from './site';

// Default metadata values and configuration
export const defaultMetadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    locale: 'en_US',
    alternateLocale: ['en_GB'],
    images: [{
      url: siteConfig.ogImage,
      width: 1200,
      height: 630,
      alt: siteConfig.name
    }]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@medh',
    creator: '@medh',
    images: [siteConfig.ogImage]
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
    bing: 'your-bing-verification'
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'hi-IN': '/hi-IN'
    }
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-icon.png', type: 'image/png' }
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png'
      }
    ]
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black',
    'apple-mobile-web-app-title': siteConfig.name
  }
};

// Helper function to generate metadata for pages
export const generatePageMetadata = ({
  title,
  description,
  keywords = [],
  images = [],
  noIndex = false,
  type = 'website',
  locale = 'en_US',
  category = '',
  publishedTime = '',
  modifiedTime = '',
  expirationTime = '',
  ...rest
}) => {
  const metadata = {
    ...defaultMetadata,
    title: title,
    description,
    keywords: [...defaultMetadata.keywords, ...keywords].join(', '),
    openGraph: {
      ...defaultMetadata.openGraph,
      title,
      description,
      type,
      locale,
      images: images.length > 0 ? images : defaultMetadata.openGraph.images,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(expirationTime && { expirationTime }),
      ...(category && { category })
    },
    twitter: {
      ...defaultMetadata.twitter,
      title,
      description,
      images: images.length > 0 ? images : defaultMetadata.twitter.images,
    },
    robots: noIndex ? {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      }
    } : defaultMetadata.robots,
    ...rest,
  };

  // Add breadcrumb schema if category is provided
  if (category) {
    metadata.schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteConfig.url
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: category,
          item: `${siteConfig.url}/${category.toLowerCase().replace(/\s+/g, '-')}`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: title
        }
      ]
    };
  }

  return metadata;
};

// Helper function to generate course metadata
export const generateCourseMetadata = ({
  title,
  description,
  instructor,
  category,
  price,
  image,
  duration,
  level,
  prerequisites = [],
  skills = [],
  certificationType = '',
  startDate,
  ...rest
}) => {
  const metadata = generatePageMetadata({
    title,
    description,
    type: 'article',
    category: 'Course',
    images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : [],
    ...rest
  });

  // Enhanced course schema
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: title,
    description: description,
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      sameAs: siteConfig.url
    },
    instructor: {
      '@type': 'Person',
      name: instructor
    },
    ...(category && { courseCategory: category }),
    ...(price && { 
      offers: {
        '@type': 'Offer',
        price: price,
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        validFrom: startDate
      }
    }),
    ...(duration && { timeRequired: duration }),
    ...(level && { educationalLevel: level }),
    ...(prerequisites.length > 0 && { prerequisites: prerequisites.join(', ') }),
    ...(skills.length > 0 && { teaches: skills.join(', ') }),
    ...(certificationType && { educationalCredentialAwarded: certificationType }),
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      sameAs: [
        siteConfig.links.twitter,
        siteConfig.links.linkedin,
        siteConfig.links.facebook
      ]
    }
  };

  return {
    ...metadata,
    schema: courseSchema
  };
};

// Helper function to generate blog metadata
export const generateBlogMetadata = ({
  title,
  description,
  author,
  date,
  tags = [],
  image,
  category = 'Blog',
  readingTime,
  ...rest
}) => {
  const metadata = generatePageMetadata({
    title,
    description,
    type: 'article',
    category,
    publishedTime: date,
    images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : [],
    ...rest
  });

  // Enhanced blog schema
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    author: {
      '@type': 'Person',
      name: author,
      url: `${siteConfig.url}/author/${author.toLowerCase().replace(/\s+/g, '-')}`
    },
    datePublished: date,
    dateModified: date,
    image: image || defaultMetadata.openGraph.images[0].url,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/images/logo.png`
      }
    },
    keywords: tags.join(', '),
    ...(readingTime && { timeRequired: `PT${readingTime}M` }),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/blogs/${title.toLowerCase().replace(/\s+/g, '-')}`
    }
  };

  return {
    ...metadata,
    schema: blogSchema
  };
}; 