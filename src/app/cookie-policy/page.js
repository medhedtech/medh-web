import CookiePolicyPage from '@/components/shared/gdpr/CookiePolicyPage';

export const metadata = {
  title: 'Cookie Policy - MEDH',
  description: 'Learn about how MEDH uses cookies and similar technologies on our website. Understand your choices regarding cookie usage.',
  keywords: 'cookie policy, cookies, privacy, MEDH, data protection, website cookies',
  openGraph: {
    title: 'Cookie Policy - MEDH',
    description: 'Learn about how MEDH uses cookies and similar technologies on our website.',
    type: 'website',
  },
};

export default function CookiePolicyPageRoute() {
  return <CookiePolicyPage />;
}

