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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#121212' },
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
  manifest: '/manifest.json',
  verification: {
    google: 'google-site-verification-code', // Replace with your verification code
    yandex: 'yandex-verification-code', // Replace with your verification code if needed
  },
};

export default function RootLayout({ children }) {
  return <ClientLayout>{children}</ClientLayout>;
}
