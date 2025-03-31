'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

interface GoogleAnalyticsProps {
  GA_MEASUREMENT_ID: string;
}

const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ GA_MEASUREMENT_ID }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Safely use the cookie consent hook with error handling
  let cookieSettings = { analytics: false };
  try {
    const cookieContext = useCookieConsent();
    cookieSettings = cookieContext?.cookieSettings || { analytics: false };
  } catch (error) {
    console.warn("Cookie consent context not available, analytics disabled by default");
    // If context isn't available, default to not using analytics
    return null;
  }

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !window.gtag || !cookieSettings.analytics) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    // Send pageview with the new URL
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }, [pathname, searchParams, GA_MEASUREMENT_ID, cookieSettings.analytics]);

  // If analytics cookies are not accepted, don't render the scripts
  if (!cookieSettings.analytics) return null;

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics; 