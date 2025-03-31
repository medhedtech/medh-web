import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import Providers from '@/app/Providers';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import ThemeController from '@/components/shared/others/ThemeController';
import GoogleAnalytics from '@/components/shared/analytics/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Medh - Education Platform',
  description: 'A modern education platform for online learning',
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#121212' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  // Get Google Analytics measurement ID from environment variable
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />}
        <Providers>
          <ThemeController />
          <CurrencyProvider>
              {children}
          </CurrencyProvider>
        </Providers>
      </body>
    </html>
  );
} 