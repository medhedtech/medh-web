import PersonalityBanner from "@/components/sections/personality-development/personalityBanner";
import PersonalityFaq from "@/components/sections/personality-development/personalityFaq";
import PersonalityOvereveiw from "@/components/sections/personality-development/personality-overview";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import PersonalityCourse from "@/components/sections/personality-development/personalityCourse";

function PersonalityDevelopment() {
  return (
    <PageWrapper>
      <PersonalityBanner />
      <PersonalityOvereveiw />
      <PersonalityCourse />
      <PersonalityFaq />
    </PageWrapper>
  );
}

export default PersonalityDevelopment;
