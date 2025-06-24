"use client";
import React, { useState, useEffect, useMemo, memo, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  Target, 
  Sparkles, 
  CheckCircle, 
  Trophy 
} from "lucide-react";
import medhLogo from "@/assets/images/logo/medh 2.png";

// Import certification images
import iso9001Emblem from "@/assets/images/certifications/ISO_9001-2015_Emblem.jpg";
import iso10002Emblem from "@/assets/images/certifications/ISO_10002-2018_Emblem.jpg";
import iso20000Emblem from "@/assets/images/certifications/ISO_20000-2018_Emblem.jpg";
import iso21001Emblem from "@/assets/images/certifications/ISO_22301-2019_Emblem.jpg";
import iso27001Emblem from "@/assets/images/certifications/ISO_27001-2022_Emblem.jpg";
import iso27701Emblem from "@/assets/images/certifications/ISO_27701-2019_Emblem.jpg";
import stemAccreditation from "@/assets/images/certifications/medh-stem-accreditation-logo (1).png";

// Simplified interfaces
interface IWhyMedhFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

// PERFORMANCE OPTIMIZATION: Frozen feature data to prevent mutations
const FEATURES: readonly IWhyMedhFeature[] = Object.freeze([
  Object.freeze({
    icon: <BookOpen className="w-8 h-8" />,
    title: "Quality Content",
    description: "Up-to-date, well-structured materials that drive real learning outcomes.",
    color: "blue"
  }),
  Object.freeze({
    icon: <Users className="w-8 h-8" />,
    title: "Learning Resources", 
    description: "Diverse materials tailored to learners of all backgrounds and skill levels.",
    color: "green"
  }),
  Object.freeze({
    icon: <GraduationCap className="w-8 h-8" />,
    title: "Expert Mentorship",
    description: "Learn from qualified instructors through practical projects.",
    color: "purple"
  }),
  Object.freeze({
    icon: <Target className="w-8 h-8" />,
    title: "Personalized Learning",
    description: "Customize your learning path with flexible modules.",
    color: "orange"
  })
]);

// PERFORMANCE OPTIMIZATION: Memoized color mapping
const COLOR_CLASSES = Object.freeze({
  blue: "text-white bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20",
  green: "text-white bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/20", 
  purple: "text-white bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/20",
  orange: "text-white bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20"
});

const getColorClasses = (color: string): string => {
  return COLOR_CLASSES[color as keyof typeof COLOR_CLASSES] || COLOR_CLASSES.blue;
};

// PERFORMANCE OPTIMIZATION: Memoized FeatureCard component
const FeatureCard = memo<{
  feature: IWhyMedhFeature;
  index: number;
  isDark: boolean;
}>(({ feature, index, isDark }) => {
  const cardClasses = useMemo(() => {
    return "group relative h-full transition-all duration-300 hover:-translate-y-1";
  }, []);

  const contentClasses = useMemo(() => {
    return "relative h-full rounded-xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-xl transition-all duration-300 p-6";
  }, []);

  const iconClasses = useMemo(() => {
    return `w-16 h-16 rounded-xl ${getColorClasses(feature.color)} flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300`;
  }, [feature.color]);

  const titleClasses = useMemo(() => {
    return "text-lg font-bold text-gray-800 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors";
  }, []);

  const descriptionClasses = useMemo(() => {
    return "text-sm text-gray-600 dark:text-gray-300 leading-relaxed";
  }, []);

  // Icons already have correct styling, no need to clone
  const iconWithClasses = useMemo(() => {
    return feature.icon;
  }, [feature.icon]);

  return (
    <div
      className={cardClasses}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className={contentClasses}>
        
        {/* Icon */}
        <div className={iconClasses}>
          {iconWithClasses}
        </div>
        
        {/* Content */}
        <h3 className={titleClasses}>
          {feature.title}
        </h3>
        <p className={descriptionClasses}>
          {feature.description}
        </p>
        
        {/* Hover indicator */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <CheckCircle className="w-5 h-5 text-primary-500" />
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.feature === nextProps.feature &&
    prevProps.index === nextProps.index &&
    prevProps.isDark === nextProps.isDark
  );
});

FeatureCard.displayName = 'FeatureCard';

// PERFORMANCE OPTIMIZATION: Memoized CertificationCard component
const CertificationCard = memo<{
  image: any;
  alt: string;
  title: string;
  description: string;
}>(({ image, alt, title, description }) => {
  const cardClasses = useMemo(() => {
    return "text-center";
  }, []);

  const imageContainerClasses = useMemo(() => {
    return "w-24 h-24 mx-auto mb-4 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg";
  }, []);

  const titleClasses = useMemo(() => {
    return "font-semibold text-gray-800 dark:text-white mb-2";
  }, []);

  const descriptionClasses = useMemo(() => {
    return "text-sm text-gray-600 dark:text-gray-300 max-w-xs";
  }, []);

  return (
    <div className={cardClasses}>
      <div className={imageContainerClasses}>
        <Image
          src={image}
          alt={alt}
          width={80}
          height={80}
          className="w-full h-full object-contain"
        />
      </div>
      <h4 className={titleClasses}>{title}</h4>
      <p className={descriptionClasses}>
        {description}
      </p>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.image === nextProps.image &&
    prevProps.alt === nextProps.alt &&
    prevProps.title === nextProps.title &&
    prevProps.description === nextProps.description
  );
});

CertificationCard.displayName = 'CertificationCard';

// PERFORMANCE OPTIMIZATION: Memoized CertificationGrid component
const CertificationGrid = memo<{
  title: string;
  certifications: Array<{ image: any; alt: string; label: string }>;
}>(({ title, certifications }) => {
  const gridClasses = useMemo(() => {
    return "bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700";
  }, []);

  const titleClasses = useMemo(() => {
    return "text-xl font-bold text-gray-800 dark:text-white mb-6 text-center";
  }, []);

  const itemClasses = useMemo(() => {
    return "text-center";
  }, []);

  const imageContainerClasses = useMemo(() => {
    return "w-20 h-20 mx-auto mb-3 bg-white dark:bg-gray-700 rounded-lg p-2 shadow-md";
  }, []);

  const labelClasses = useMemo(() => {
    return "text-sm font-medium text-gray-700 dark:text-gray-300";
  }, []);

  return (
    <div className={gridClasses}>
      <h3 className={titleClasses}>{title}</h3>
      <div className="flex flex-col gap-4">
        {certifications.map((cert, index) => (
          <div key={index} className={itemClasses}>
            <div className={imageContainerClasses}>
              <Image
                src={cert.image}
                alt={cert.alt}
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <div className={labelClasses}>{cert.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    JSON.stringify(prevProps.certifications) === JSON.stringify(nextProps.certifications)
  );
});

CertificationGrid.displayName = 'CertificationGrid';

// PERFORMANCE OPTIMIZATION: Main component with comprehensive memoization
const WhyMedh = memo(() => {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // PERFORMANCE OPTIMIZATION: Memoized computed values
  const isDark = useMemo(() => mounted ? theme === 'dark' : true, [mounted, theme]);
  
  // PERFORMANCE OPTIMIZATION: Single initialization effect
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // PERFORMANCE OPTIMIZATION: Memoized navigation handlers
  const handleGetStarted = useCallback(() => {
    router.push("/placement-guaranteed-courses");
  }, [router]);

  const handleLearnMore = useCallback(() => {
    router.push("/about");
  }, [router]);

  // PERFORMANCE OPTIMIZATION: Memoized class names
  const containerClasses = useMemo(() => {
    return `w-full transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} py-8 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800/50`;
  }, [isVisible]);

  const sectionClasses = useMemo(() => {
    return "w-full py-8 md:py-12";
  }, []);

  const headerContainerClasses = useMemo(() => {
    return "text-center max-w-3xl mx-auto mb-16";
  }, []);

  const badgeClasses = useMemo(() => {
    return "inline-flex items-center gap-2 mb-6";
  }, []);

  const badgeIconClasses = useMemo(() => {
    return "w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-lg";
  }, []);

  const badgeTextClasses = useMemo(() => {
    return "text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider";
  }, []);

  const headingClasses = useMemo(() => {
    return "text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white";
  }, []);

  const descriptionClasses = useMemo(() => {
    return "text-lg text-gray-700 dark:text-gray-300 leading-relaxed";
  }, []);

  const featuresGridClasses = useMemo(() => {
    return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16";
  }, []);

  const certificationsHeaderClasses = useMemo(() => {
    return "text-center mb-16";
  }, []);

  const certificationsBadgeClasses = useMemo(() => {
    return "inline-flex items-center gap-2 mb-8";
  }, []);

  const certificationsIconClasses = useMemo(() => {
    return `w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg`;
  }, []);

  const certificationsTitleClasses = useMemo(() => {
    return "text-2xl md:text-3xl font-bold text-gray-800 dark:text-white";
  }, []);

  const certificationsDescriptionClasses = useMemo(() => {
    return "text-lg text-gray-600 dark:text-gray-300 mb-10";
  }, []);

  const featuredCertificationsClasses = useMemo(() => {
    return "flex flex-col sm:flex-row items-center justify-center gap-8 mb-12";
  }, []);

  const certificationGridsClasses = useMemo(() => {
    return "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12";
  }, []);

  // PERFORMANCE OPTIMIZATION: Memoized logo styles
  const logoStyles = useMemo(() => ({
    filter: 'brightness(1.1) contrast(1.2)',
    verticalAlign: 'baseline'
  }), []);

  // PERFORMANCE OPTIMIZATION: Memoized certification data
  const learningQualityCerts = useMemo(() => [
    { image: iso9001Emblem, alt: "ISO 9001", label: "ISO 9001" },
    { image: iso10002Emblem, alt: "ISO 10002", label: "ISO 10002" }
  ], []);

  const dataProtectionCerts = useMemo(() => [
    { image: iso27001Emblem, alt: "ISO 27001", label: "ISO 27001" },
    { image: iso27701Emblem, alt: "ISO 27701", label: "ISO 27701" }
  ], []);

  const serviceReliabilityCerts = useMemo(() => [
    { image: iso20000Emblem, alt: "ISO 20000", label: "ISO 20000" },
    { image: iso21001Emblem, alt: "ISO 21001", label: "ISO 21001" }
  ], []);

  // Fast loading state
  if (!mounted) {
    return (
      <div className="w-full py-8 opacity-0">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse w-48 mx-auto"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {/* Why Choose MEDH Section */}
      <section className={sectionClasses}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Section Header */}
          <div className={headerContainerClasses}>
            <div className={badgeClasses}>
              <div className={badgeIconClasses}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className={badgeTextClasses}>
                Our Approach
              </span>
            </div>
            <h2 className={headingClasses}>
              Why Choose{" "}
              <span className="inline-flex items-baseline align-baseline">
                <Image 
                  src={medhLogo} 
                  alt="Medh Logo" 
                  width={128} 
                  height={128} 
                  unoptimized={true}
                  className="inline-block h-6 sm:h-7 md:h-8 w-auto align-baseline mx-1"
                  style={logoStyles}
                />
              </span>?
            </h2>
            <p className={descriptionClasses}>
              Empowering learners with the freedom to explore, we go beyond fundamentals, fostering critical thinking and creativity.
            </p>
          </div>

          {/* Features Grid */}
          <div className={featuresGridClasses}>
            {FEATURES.map((feature, index) => (
              <FeatureCard
                key={index}
                feature={feature}
                index={index}
                isDark={isDark}
              />
            ))}
          </div>

          {/* Our Quality Certifications Section */}
          <div className={certificationsHeaderClasses}>
            <div className={certificationsBadgeClasses}>
              <div className={certificationsIconClasses}>
                <Trophy className={`w-4 h-4 ${isDark ? 'text-white' : 'text-black'}`} />
              </div>
              <h3 className={certificationsTitleClasses}>
                Our Quality Certifications!
              </h3>
            </div>
            <p className={certificationsDescriptionClasses}>
              Certified Standards That Ensure Your Success
            </p>
            
            {/* Featured Certifications - Main Display */}
            <div className={featuredCertificationsClasses}>
              {/* STEM Certified */}
              <CertificationCard
                image={stemAccreditation}
                alt="STEM Certified"
                title="STEM Certified"
                description="Recognized excellence in Science, Technology, Engineering, and Mathematics education."
              />
              
              {/* ISO Certified */}
              <CertificationCard
                image={iso9001Emblem}
                alt="ISO Certified"
                title="ISO Certified"
                description="International standards for quality management and continuous improvement."
              />
            </div>
            
            <div className={certificationGridsClasses}>
              {/* Learning Quality */}
              <CertificationGrid
                title="Learning Quality"
                certifications={learningQualityCerts}
              />
              
              {/* Data Protection */}
              <CertificationGrid
                title="Data Protection"
                certifications={dataProtectionCerts}
              />
              
              {/* Service Reliability */}
              <CertificationGrid
                title="Service Reliability"
                certifications={serviceReliabilityCerts}
              />
            </div>


          </div>
        </div>
      </section>
    </div>
  );
});

WhyMedh.displayName = 'WhyMedh';

export default WhyMedh; 