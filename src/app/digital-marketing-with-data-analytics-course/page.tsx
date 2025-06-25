import type { NextPage } from 'next';
import DigiMarketingBanner from '@/components/sections/digital-marketing/digiMarketingBanner';
import DigiMarketingOverview from '@/components/sections/digital-marketing/digiMarketingOverview';
import DigiMarketingCourse from '@/components/sections/digital-marketing/digiMarketingCourse';
import DigiMarketingFaq from '@/components/sections/digital-marketing/digiMarketingFaq';
import DigiMarketingCourceBanner from '@/components/sections/digital-marketing/digiMarketingCourceBanner';
import DigiMarketingRalatedCource from '@/components/sections/digital-marketing/digiMarketingRalatedCource';

const Page: NextPage = () => {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <DigiMarketingBanner />
      <DigiMarketingOverview />
      <DigiMarketingCourse />
      <DigiMarketingFaq />
      <DigiMarketingCourceBanner />
      <DigiMarketingRalatedCource />
    </main>
  );
};

export default Page; 