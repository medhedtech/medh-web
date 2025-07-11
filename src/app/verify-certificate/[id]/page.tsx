5import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';
import { generateSEOMetadata } from '@/utils/seo';

// Dynamically import the certificate verification component
const CertificateDirectVerify = dynamic(
  () => import('@/components/sections/certificate-verify/CertificateDirectVerify'),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Verifying certificate...</p>
        </div>
      </div>
    ),
  }
);

interface PageProps {
  params: {
    id: string;
  };
}

// Generate dynamic metadata based on certificate ID
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = params;
  
  // Validate certificate ID format
  const isValidFormat = /^[A-Z0-9-]{8,}$/i.test(id);
  
  if (!isValidFormat) {
    return generateSEOMetadata({
      title: 'Invalid Certificate ID - Medh Certificate Verification',
      description: 'The certificate ID provided is not in a valid format. Please check the ID and try again.',
      url: `/verify-certificate/${id}`,
      type: 'website'
    });
  }

  return generateSEOMetadata({
    title: `Verify Certificate ${id} - Medh Certificate Verification`,
    description: `Verify the authenticity of Medh certificate ${id}. Instant verification of educational credentials and professional certifications.`,
    keywords: [
      'certificate verification',
      `certificate ${id}`,
      'medh certificate',
      'educational credentials',
      'professional certification',
      'certificate authenticity',
      'credential verification',
      'certificate validation'
    ],
    url: `/verify-certificate/${id}`,
    type: 'website',
    structuredDataType: 'educationalCredential',
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
}

export default function VerifyCertificatePage({ params }: PageProps) {
  const { id } = params;
  
  // Basic validation - more detailed validation will be done in the component
  if (!id || id.length < 8) {
    notFound();
  }

  // Decode the certificate ID (in case it's URL encoded)
  const decodedId = decodeURIComponent(id);

  return (
    <PageWrapper>
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <CertificateDirectVerify certificateId={decodedId} />
      </main>
    </PageWrapper>
  );
}

// Generate static params for common certificate patterns (optional optimization)
export async function generateStaticParams() {
  // Return empty array to enable ISR (Incremental Static Regeneration)
  // This allows dynamic generation while caching successful verifications
  return [];
} 