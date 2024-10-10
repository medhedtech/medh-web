import PersonalityBanner from '@/components/sections/personality-development/personalityBanner';
import PersonalityFaq from '@/components/sections/personality-development/personalityFaq';
import PersonalityOvereveiw from '@/components/sections/personality-development/personality-overview';
import PageWrapper from '@/components/shared/wrappers/PageWrapper';

function PersonalityDevelopment() {
  return (
    <PageWrapper>
      <PersonalityBanner />
      <PersonalityOvereveiw />
      <PersonalityFaq />
    </PageWrapper>
  );
}

export default PersonalityDevelopment;
