import React from "react";
import Image from "next/image";
import { Building, Target, Users, BookOpen, Star, TrendingUp } from "lucide-react";
import Banner from "@/assets/Header-Images/Corporate/ai-with-data-science.png";
import Cource from "@/assets/Header-Images/Corporate/close-up-people-learning-job.jpg";
import Iso from "@/assets/images/vedic-mathematics/vedic-logo.svg";
import CourseBanner from "@/components/shared/banners/CourseBanner";

interface IFeature {
  icon: React.ReactElement;
  title: string;
  description: string;
}

interface IStat {
  icon: React.ReactElement;
  value: string;
  label: string;
}

interface IThemeClasses {
  badge: string;
  badgeContainer: string;
  title: string;
  button: string;
  secondaryButton: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  backgroundPrimary: string;
  backgroundSecondary: string;
}

const CorporateBanner: React.FC = () => {
  // Theme classes for corporate styling
  const themeClasses: IThemeClasses = {
    badge: "bg-primary-500",
    badgeContainer: "bg-primary-500/10",
    title: "text-primary-500",
    button: "bg-primary-500 hover:bg-primary-600 shadow-primary-500/25",
    secondaryButton: "text-primary-500 border-primary-500 hover:bg-primary-50",
    gradientFrom: "from-primary-500/20",
    gradientVia: "via-secondary-500/10",
    gradientTo: "to-transparent",
    backgroundPrimary: "bg-primary-500/10",
    backgroundSecondary: "bg-secondary-500/10"
  };

  // Features for corporate training
  const features: IFeature[] = [
    {
      icon: <Target className="w-6 h-6 text-primary-500" />,
      title: "Customized Training",
      description: "Tailored programs for your specific business needs"
    },
    {
      icon: <Users className="w-6 h-6 text-primary-500" />,
      title: "Expert Trainers",
      description: "Industry professionals with proven expertise"
    },
    {
      icon: <BookOpen className="w-6 h-6 text-primary-500" />,
      title: "Flexible Learning",
      description: "Online, offline, or hybrid training options"
    }
  ];

  // Define the badge with ISO certification
  const badge = (
    <div className="inline-flex items-center gap-2">
      <span className="bg-primary-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
        ISO Certified
      </span>
      <Image src={Iso} alt="ISO Certification" className="h-6 w-auto" />
    </div>
  );

  // Stats could be used in the description or elsewhere
  const stats: IStat[] = [
    {
      icon: <Building className="w-5 h-5 text-primary-500" />,
      value: "250+",
      label: "Corporate Partners"
    },
    {
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      value: "4.8/5",
      label: "Training Rating"
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-primary-500" />,
      value: "95%",
      label: "ROI Satisfaction"
    }
  ];

  // Compose stats into a portion of the description for display
  const statsInfo = (
    <div className="grid grid-cols-3 gap-4 md:gap-6 mt-6 max-w-lg mx-auto lg:mx-0">
      {stats.map((stat, index) => (
        <div key={index} className="text-center bg-white/90 dark:bg-gray-800/90 rounded-xl p-3 shadow-md">
          <div className="flex justify-center mb-2">{stat.icon}</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );

  // Handle scroll to form
  const handleScrollToForm = (): void => {
    const formElement = document.getElementById('enroll-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <CourseBanner
      badge={badge}
      title="Medh's Dynamic"
      titleHighlight="Corporate Training"
      description="Elevate your workforce's skills, motivation, and engagement to drive business growth and achieve exceptional results."
      features={features}
      mainImage={Banner}
      studentImage={Cource}
      enrollmentPath="#enroll-form"
      onEnrollClick={handleScrollToForm}
      themeClasses={themeClasses}
    />
  );
};

export default CorporateBanner; 