import { Montserrat, Poppins, Hind } from 'next/font/google';
import { Metadata, Viewport } from 'next';
import Providers from './Providers';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import '@/components/sidebar/sidebar-styles.css';
import ThemeController from '@/components/shared/others/ThemeController';
import GoogleAnalytics from '@/components/shared/analytics/GoogleAnalytics';
import { Suspense } from 'react';
import { ToastProvider } from '@/components/shared/ui/ToastProvider';

// Optimize Montserrat font loading
const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-montserrat',
  fallback: ['system-ui', 'arial'],
  // Only load used weights
  weight: ['400', '500', '600', '700'],
});

// Optimize Poppins font loading - now the primary font
const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-poppins',
  fallback: ['system-ui', 'arial'],
  // Only load used weights
  weight: ['300', '400', '500', '600', '700'],
});

// Use Google Fonts for Hind instead of local font
const hind = Hind({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-hind',
  fallback: ['system-ui', 'arial'],
  // Only load used weights
  weight: ['400', '500', '600', '700'],
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
      </head>
      <body className={`${poppins.className} antialiased min-h-screen overflow-x-hidden`} suppressHydrationWarning>
        <ToastProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Providers>
              <ThemeController className="hidden sm:block" />
              {/* Google Analytics - now inside Providers to access CookieConsentProvider */}
              {GA_MEASUREMENT_ID && <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />}
              {children}
              <Toaster position="top-center" />
              <Analytics />
              <SpeedInsights />
            </Providers>
          </Suspense>
        </ToastProvider>
      </body>
    </html>
  );
} 