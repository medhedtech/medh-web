import type { NextPage } from 'next';
import DigiMarketingBanner from '@/components/sections/digital-marketing/digiMarketingBanner';
import DigiMarketingOverview from '@/components/sections/digital-marketing/digiMarketingOverview';
import DigiMarketingCourse from '@/components/sections/digital-marketing/digiMarketingCourse';
import DigiMarketingFaq from '@/components/sections/digital-marketing/digiMarketingFaq';
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

const Page: NextPage = () => {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <PageWrapper>
      <DigiMarketingBanner />
      <DigiMarketingCourse />
      <DigiMarketingOverview />
      <DigiMarketingFaq />
      </PageWrapper>
    </main>
  );
};

export default Page; 