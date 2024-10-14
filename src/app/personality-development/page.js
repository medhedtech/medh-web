import PersonalityBanner from "@/components/sections/personality-development/personalityBanner";
import PersonalityFaq from "@/components/sections/personality-development/personalityFaq";
import PersonalityOvereveiw from "@/components/sections/personality-development/personality-overview";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import PersonalityCourse from "@/components/sections/personality-development/personalityCourse";
import Registration from "@/components/sections/registrations/Registration";
import RelatedCourses from "@/components/sections/personality-development/relatedCourses";
import PersonalityCourseBanner from "@/components/sections/personality-development/personalityCourseBanner";

function PersonalityDevelopment() {
  return (
    <PageWrapper>
      <PersonalityBanner />
      <PersonalityOvereveiw />
      <PersonalityCourse />
      <Registration />
      <PersonalityFaq />
      <PersonalityCourseBanner />
      <RelatedCourses />
    </PageWrapper>
  );
}

export default PersonalityDevelopment;
