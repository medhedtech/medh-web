import ClientLayout from './ClientLayout';

export const metadata = {
  metadataBase: new URL('https://www.medh.co'),
  title: "MEDH - Upskill Your Career with Expert-Led Courses",
  description: "MEDH offers professional courses in AI, Data Science, Digital Marketing, and more. Join our expert-led programs to advance your career with personalized learning experiences.",
  keywords: "online courses, professional development, upskilling, data science, AI, digital marketing, career advancement, medh, education, learning platform, skills development",
  authors: [{ name: "MEDH", url: "https://www.medh.co" }],
  creator: "MEDH Team",
  publisher: "MEDH",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  openGraph: {
    title: "MEDH - Upskill Your Career with Expert-Led Courses",
    description: "Join MEDH's expert-led programs to advance your career with personalized learning experiences.",
    url: "https://www.medh.co",
    siteName: "MEDH",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: 'https://www.medh.co/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MEDH - Upskill Your Career',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "MEDH - Upskill Your Career with Expert-Led Courses",
    description: "Join MEDH's expert-led programs to advance your career with personalized learning experiences.",
    images: ['https://www.medh.co/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    shortcut: '/icons/icon-192x192.png',
    apple: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/icons/icon-192x192.png'
      }
    ]
  },
  manifest: '/manifest.json',
  verification: {
    google: 'google-site-verification-code', // Replace with your verification code
    yandex: 'yandex-verification-code', // Replace with your verification code if needed
  },
};

// Add viewport export with themeColor
export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#121212' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return <ClientLayout>{children}</ClientLayout>;
}