import { Metadata, Viewport } from 'next';
import Providers from './Providers';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import '@/components/sidebar/sidebar-styles.css';
import 'quill/dist/quill.snow.css';
import '@/styles/vendor.scss';
import 'intl-tel-input/build/css/intlTelInput.css';
import ThemeController from '@/components/shared/others/ThemeController';
import GoogleAnalytics from '@/components/shared/analytics/GoogleAnalytics';
import CookieConsent from '@/components/shared/gdpr/CookieConsent';
import { Suspense } from 'react';
import localFont from 'next/font/local';
import { Toaster } from 'react-hot-toast';

// Use local fonts instead of Google Fonts to avoid timeout issues
const montserrat = localFont({
  src: [
    {
      path: '../assets/fonts/montserrat/Montserrat-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/montserrat/Montserrat-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/montserrat/Montserrat-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/fonts/montserrat/Montserrat-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-montserrat',
  fallback: ['system-ui', 'arial'],
});

// Local Poppins font
const poppins = localFont({
  src: [
    {
      path: '../assets/fonts/poppins/Poppins-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/poppins/Poppins-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/poppins/Poppins-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/poppins/Poppins-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/fonts/poppins/Poppins-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-poppins',
  fallback: ['system-ui', 'arial'],
});

// Local Hind font
const hind = localFont({
  src: [
    {
      path: '../assets/fonts/hind/Hind-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/hind/Hind-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/hind/Hind-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/fonts/hind/Hind-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-hind',
  fallback: ['system-ui', 'arial'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  title: 'Medh - Learn from the Best',
  description: 'Learn from the best instructors and get certified in various courses.',
  metadataBase: new URL('https://medh.live'),
  openGraph: {
    title: 'Medh - Learn from the Best',
    description: 'Learn from the best instructors and get certified in various courses.',
    url: 'https://medh.live',
    siteName: 'Medh',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medh - Learn from the Best',
    description: 'Learn from the best instructors and get certified in various courses.',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  // Get Google Analytics measurement ID from environment variable
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
  
  return (
    <html lang="en" className={`${montserrat.variable} ${poppins.variable} ${hind.variable} h-full scroll-smooth`} suppressHydrationWarning>
      <head>
        {/* Updated viewport meta tag with proper settings */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        
        {/* Google One Tap styles moved to CSS file to prevent hydration issues */}
      </head>
      <body className={`${poppins.className} antialiased min-h-screen overflow-x-hidden overflow-y-visible`} suppressHydrationWarning={true}>
        <Suspense fallback={<div>Loading...</div>}>
          <Providers>
            <ThemeController className="hidden sm:block" />
            {/* Google Analytics - now inside Providers to access CookieConsentProvider */}
            {GA_MEASUREMENT_ID && <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />}
            {children}
            <Analytics />
            <SpeedInsights />
            <CookieConsent />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </Providers>
        </Suspense>
      </body>
    </html>
  );
} 