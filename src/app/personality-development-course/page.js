import PersonalityBanner from "@/components/sections/personality-development/personalityBanner";
import PersonalityFaq from "@/components/sections/personality-development/personalityFaq";
import PersonalityOvereveiw from "@/components/sections/personality-development/personality-overview";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import PersonalityCourse from "@/components/sections/personality-development/personalityCourse";
import RelatedCourses from "@/components/sections/personality-development/relatedCourses";
import ThemeController from "@/components/shared/others/ThemeController";
import PersonalityCourseBanner from "@/components/sections/personality-development/personalityCourseBanner";
import ExploreJourney from "@/components/sections/explore-journey/Enroll-Form";

function PersonalityDevelopment() {
  return (
    <PageWrapper>
      <PersonalityBanner />
      <PersonalityOvereveiw />
      <PersonalityCourse />
      <ExploreJourney
        mainText="Discover Your Potential. Empower Yourself. Elevate Your Self-Image."
        subText="Enroll Today!"
      />
      <PersonalityFaq />
      <PersonalityCourseBanner />
      <RelatedCourses />
      <ThemeController />
    </PageWrapper>
  );
}

export default PersonalityDevelopment;
