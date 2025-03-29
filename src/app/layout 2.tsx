import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import Providers from '@/app/Providers';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import ThemeController from '@/components/shared/others/ThemeController';

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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
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