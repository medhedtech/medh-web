import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
import { generateSEOMetadata } from '@/utils/seo';

// Dynamically import the certificate verification component
const CertificateVerify = dynamic(
  () => import('@/components/sections/certificate-verify/CertificateVerify'),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    ),
  }
);

// SEO metadata for certificate verification page
export const metadata: Metadata = generateSEOMetadata({
  title: 'Certificate Verification - Verify Medh Certificates',
  description: 'Verify the authenticity of Medh certificates. Enter certificate ID or scan QR code to instantly verify educational credentials and professional certifications.',
  keywords: [
    'certificate verification',
    'verify certificate',
    'medh certificate',
    'educational credentials',
    'professional certification',
    'certificate authenticity',
    'credential verification',
    'certificate validation'
  ],
  url: '/certificate-verify',
  type: 'website',
  structuredDataType: 'organization',
  eeatSignals: {
    expertise: [
      'ISO 27001 certified verification system',
      'Blockchain-based certificate authentication',
      'Industry-standard security protocols'
    ],
    authoritativeness: [
      'Recognized by educational institutions',
      'Trusted by employers worldwide',
      'Compliant with international standards'
    ],
    trustworthiness: [
      'Secure verification process',
      'Transparent verification results',
      'Privacy-protected verification'
    ]
  }
});

export default function CertificateVerifyPage() {
  return (
    <PageWrapper>
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <CertificateVerify />
      </main>
    </PageWrapper>
  );
} 