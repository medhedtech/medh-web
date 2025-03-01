import PersonalityFaq from "@/components/sections/personality-development/personalityFaq";
import PersonalityOvereveiw from "@/components/sections/personality-development/personality-overview";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import PersonalityCourse from "@/components/sections/personality-development/personalityCourse";
import RelatedCourses from "@/components/sections/personality-development/relatedCourses";

import PersonalityCourseBanner from "@/components/sections/personality-development/personalityCourseBanner";
import ExploreJourney from "@/components/sections/explore-journey/Enroll-Form";
import CourseBanner from "@/components/shared/banners/CourseBanner";
import { UserPlus, Target, Sparkles, Star, Users, Award, Presentation } from "lucide-react";
import Banner from "@/assets/Header-Images/Personality-Development/personality-development-course-age-18-plus-years.png";
import DevelopmentImg from "@/assets/Header-Images/Personality-Development/multiracial-teenage-high-school-students-looking-a-2023-11-27-05-15-38-utc.jpg";

function PersonalityDevelopment() {
  const bannerProps = {
    badge: "All Ages Welcome",
    title: "Comprehensive",
    titleHighlight: "Personality",
    description: "Uncover Your Untapped Potential. Perfect for Students, Professionals, and Homemakers. Unleash Your Best Self.",
    stats: [
      {
        icon: <Users className="w-5 h-5 text-primary-500" />,
        value: "5000+",
        label: "Transformed Lives"
      },
      {
        icon: <Star className="w-5 h-5 text-yellow-500" />,
        value: "4.9/5",
        label: "Student Rating"
      },
      {
        icon: <Award className="w-5 h-5 text-primary-500" />,
        value: "12+",
        label: "Years Experience"
      }
    ],
    features: [
      {
        icon: <UserPlus className="w-6 h-6 text-primary-500" />,
        title: "Self Development",
        description: "Build confidence & charisma"
      },
      {
        icon: <Target className="w-6 h-6 text-primary-500" />,
        title: "Goal Setting",
        description: "Achieve personal milestones"
      },
      {
        icon: <Presentation className="w-6 h-6 text-primary-500" />,
        title: "Communication",
        description: "Master public speaking"
      }
    ],
    mainImage: Banner,
    studentImage: DevelopmentImg,
    theme: {
      primary: 'purple',
      secondary: 'pink'
    }
  };

  return (
    <PageWrapper>
      <CourseBanner {...bannerProps} />
      <PersonalityOvereveiw />
      <PersonalityCourse />
      <ExploreJourney
        mainText="Discover Your Potential. Empower Yourself. Elevate Your Self-Image."
        subText="Enroll Today!"
      />
      <PersonalityFaq />
      <PersonalityCourseBanner />
      <RelatedCourses />
      
    </PageWrapper>
  );
}

export default PersonalityDevelopment;
