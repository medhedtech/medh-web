import { Metadata } from 'next';

// Types
interface ICustomMetadata extends Partial<Metadata> {
  keywords?: string;
}

// Get the base URL from environment variables or use a default
const getBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // For development, use localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // For production, use a default domain if not specified
  return 'https://medh.co';
};

// Create the base URL
const baseUrl: string = getBaseUrl();

// Default metadata configuration
export const defaultMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Medh - Leading Education Platform for Career Growth',
    template: '%s | Medh - Education Platform'
  },
  description: 'Transform your career with Medh\'s industry-leading courses in AI, Data Science, Digital Marketing, and more. Learn from experts and get certified.',
  keywords: [
    'education platform',
    'online learning',
    'career development',
    'AI courses',
    'data science courses',
    'digital marketing courses',
    'skill development',
    'professional certification',
    'expert-led courses',
    'Medh education',
    'online certification',
    'career advancement',
    'industry training'
  ] as string[],
  authors: [{ name: 'Medh Team', url: baseUrl }],
  creator: 'Medh',
  publisher: 'Medh',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'Medh',
    title: 'Medh - Leading Education Platform for Career Growth',
    description: 'Transform your career with Medh\'s industry-leading courses in AI, Data Science, Digital Marketing, and more. Learn from experts and get certified.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Medh - Education Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medh - Leading Education Platform for Career Growth',
    description: 'Transform your career with Medh\'s industry-leading courses in AI, Data Science, Digital Marketing, and more.',
    images: ['/images/twitter-image.jpg'],
    creator: '@medh',
    site: '@medh',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'education',
  classification: 'Business',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    bing: process.env.NEXT_PUBLIC_BING_VERIFICATION,
  },
  other: {
    'google-site-verification': process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

// Helper function to merge custom metadata with default metadata
export const mergeMetadata = (customMetadata: ICustomMetadata): Metadata => {
  const keywordsArray = defaultMetadata.keywords as string[];
  
  return {
    ...defaultMetadata,
    ...customMetadata,
    // Ensure metadataBase is always set
    metadataBase: defaultMetadata.metadataBase,
    // Merge keywords arrays if they exist
    keywords: customMetadata.keywords 
      ? [...keywordsArray, ...customMetadata.keywords.split(', ')]
      : keywordsArray,
  };
}; 