import type { NextPage } from 'next';
import { DigitalMarketingHero } from '@/components/sections/hero-banners';
import DigiMarketingOverview from '@/components/sections/digital-marketing/digiMarketingOverview';
import DigiMarketingCourse from '@/components/sections/digital-marketing/digiMarketingCourse';
import DigiMarketingFaq from '@/components/sections/digital-marketing/digiMarketingFaq';
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

const Page: NextPage = () => {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <PageWrapper>
      <DigitalMarketingHero />
      <DigiMarketingCourse />
      <DigiMarketingOverview />
      <DigiMarketingFaq />
      </PageWrapper>
    </main>
  );
};

export default Page; 