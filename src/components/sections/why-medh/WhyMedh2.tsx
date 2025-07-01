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
  Trophy,
  ArrowRight,
  Star
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
  highlight?: string;
}

// PERFORMANCE OPTIMIZATION: Frozen feature data to prevent mutations
const FEATURES: readonly IWhyMedhFeature[] = Object.freeze([
  Object.freeze({
    icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
    title: "Quality Content",
    description: "Up-to-date, well-structured materials that drive real learning outcomes.",
    color: "blue",
    highlight: "Industry-Relevant"
  }),
  Object.freeze({
    icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
    title: "Learning Resources", 
    description: "Diverse materials tailored to learners of all backgrounds and skill levels.",
    color: "green",
    highlight: "Personalized"
  }),
  Object.freeze({
    icon: <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
    title: "Expert Mentorship",
    description: "Learn from qualified instructors through practical projects.",
    color: "purple",
    highlight: "1-on-1 Support"
  }),
  Object.freeze({
    icon: <Target className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
    title: "Personalized Learning",
    description: "Customize your learning path with flexible modules.",
    color: "orange",
    highlight: "Flexible Path"
  })
]);

// PERFORMANCE OPTIMIZATION: Memoized color mapping
const COLOR_CLASSES = Object.freeze({
  blue: "text-white bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25",
  green: "text-white bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/25", 
  purple: "text-white bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/25",
  orange: "text-white bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25"
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
    return "group relative h-full transition-all duration-300 hover:-translate-y-2 active:scale-95 touch-manipulation";
  }, []);

  const contentClasses = useMemo(() => {
    return "relative h-full rounded-2xl bg-white/95 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 p-5 sm:p-6 md:p-7 min-h-[240px] sm:min-h-[260px] overflow-hidden";
  }, []);

  const iconClasses = useMemo(() => {
    return `w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${getColorClasses(feature.color)} flex items-center justify-center mb-4 sm:mb-5 mx-auto group-hover:scale-110 transition-all duration-300 shadow-xl`;
  }, [feature.color]);

  const titleClasses = useMemo(() => {
    return "text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 text-center group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight";
  }, []);

  const highlightClasses = useMemo(() => {
    return "inline-block text-xs sm:text-sm font-semibold px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 mb-3 border border-primary-200 dark:border-primary-800";
  }, []);

  const descriptionClasses = useMemo(() => {
    return "text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed text-center px-1 sm:px-2";
  }, []);

  return (
    <div
      className={cardClasses}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className={contentClasses}>
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/50 dark:to-gray-800/20 rounded-2xl"></div>
        
        {/* Icon */}
        <div className={iconClasses}>
          {feature.icon}
        </div>
        
        {/* Highlight Badge */}
        {feature.highlight && (
          <div className="text-center mb-3">
            <span className={highlightClasses}>
              {feature.highlight}
            </span>
          </div>
        )}
        
        {/* Content */}
        <h3 className={titleClasses}>
          {feature.title}
        </h3>
        <p className={descriptionClasses}>
          {feature.description}
        </p>
        
        {/* Hover indicator with arrow */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden sm:flex items-center gap-1">
          <span className="text-xs font-medium text-primary-600 dark:text-primary-400">Learn More</span>
          <ArrowRight className="w-3 h-3 text-primary-600 dark:text-primary-400" />
        </div>
        
        {/* Mobile touch indicator */}
        <div className="absolute bottom-3 right-3 sm:hidden">
          <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse"></div>
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
    return "group relative w-full max-w-sm mx-auto transform transition-all duration-300 hover:-translate-y-3 active:scale-95 touch-manipulation";
  }, []);

  const imageContainerClasses = useMemo(() => {
    return "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-4 sm:mb-5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-4 sm:p-5 shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 group-hover:scale-110 group-hover:shadow-3xl group-hover:border-primary-200 dark:group-hover:border-primary-800";
  }, []);

  const titleClasses = useMemo(() => {
    return "font-bold text-lg sm:text-xl md:text-2xl text-gray-900 dark:text-white mb-3 transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400 text-center leading-tight";
  }, []);

  const descriptionClasses = useMemo(() => {
    return "text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-sm text-center px-3 sm:px-4 opacity-90 group-hover:opacity-100 transition-opacity leading-relaxed";
  }, []);

  return (
    <div className={cardClasses}>
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-blue-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
      
      <div className={imageContainerClasses}>
        <Image
          src={image}
          alt={alt}
          width={128}
          height={128}
          className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110"
          priority={false}
          loading="lazy"
        />
      </div>
      <h4 className={titleClasses}>{title}</h4>
      <p className={descriptionClasses}>
        {description}
      </p>
      
      {/* Star rating for visual appeal */}
      <div className="flex justify-center mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
        ))}
      </div>
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
    return "bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl p-5 sm:p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 h-full group";
  }, []);

  const titleClasses = useMemo(() => {
    return "text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-5 sm:mb-6 md:mb-8 text-center leading-tight";
  }, []);

  const itemClasses = useMemo(() => {
    return "text-center group/item transform transition-all duration-300 hover:-translate-y-2 active:scale-95 touch-manipulation";
  }, []);

  const imageContainerClasses = useMemo(() => {
    return "w-18 h-18 sm:w-22 sm:h-22 md:w-28 md:h-28 mx-auto mb-3 sm:mb-4 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm rounded-2xl p-3 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-600 group-hover/item:scale-110 group-hover/item:shadow-xl group-hover/item:border-primary-200 dark:group-hover/item:border-primary-700 transition-all duration-300";
  }, []);

  const labelClasses = useMemo(() => {
    return "text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 group-hover/item:text-primary-600 dark:group-hover/item:text-primary-400 transition-colors leading-tight px-2";
  }, []);

  return (
    <div className={gridClasses}>
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary-50/20 to-blue-50/20 dark:from-transparent dark:via-primary-900/10 dark:to-blue-900/10 rounded-3xl"></div>
      
      <div className="relative z-10">
        <h3 className={titleClasses}>{title}</h3>
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {certifications.map((cert, index) => (
            <div key={index} className={itemClasses}>
              <div className={imageContainerClasses}>
                <Image
                  src={cert.image}
                  alt={cert.alt}
                  width={80}
                  height={80}
                  className="w-full h-full object-contain transition-all duration-300 group-hover/item:scale-110"
                  priority={false}
                  loading="lazy"
                />
              </div>
              <div className={labelClasses}>{cert.label}</div>
            </div>
          ))}
        </div>
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
    const timer = setTimeout(() => setIsVisible(true), 100);
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
    return `w-full transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-gray-50/70 via-white to-blue-50/30 dark:from-gray-900/70 dark:via-gray-800 dark:to-blue-900/20 relative overflow-hidden`;
  }, [isVisible]);

  const sectionClasses = useMemo(() => {
    return "w-full relative z-10";
  }, []);

  const headerContainerClasses = useMemo(() => {
    return "text-center max-w-5xl mx-auto mb-12 sm:mb-16 md:mb-20 px-4 sm:px-6";
  }, []);

  const badgeClasses = useMemo(() => {
    return "inline-flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-gray-200 dark:border-gray-700 shadow-lg";
  }, []);

  const badgeIconClasses = useMemo(() => {
    return "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-lg animate-pulse";
  }, []);

  const badgeTextClasses = useMemo(() => {
    return "text-sm sm:text-base font-semibold text-primary-700 dark:text-primary-300 uppercase tracking-wide";
  }, []);

  const headingClasses = useMemo(() => {
    return "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 text-gray-900 dark:text-white leading-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent";
  }, []);

  const descriptionClasses = useMemo(() => {
    return "text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto font-medium";
  }, []);

  const featuresGridClasses = useMemo(() => {
    return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16 sm:mb-20 md:mb-24 px-4 sm:px-6";
  }, []);

  const certificationsHeaderClasses = useMemo(() => {
    return "text-center mb-8 sm:mb-12 md:mb-16 px-4 sm:px-6";
  }, []);

  const certificationsBadgeClasses = useMemo(() => {
    return "inline-flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-yellow-200 dark:border-yellow-800 shadow-lg";
  }, []);

  const certificationsIconClasses = useMemo(() => {
    return `w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg animate-bounce`;
  }, []);

  const certificationsTitleClasses = useMemo(() => {
    return "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent";
  }, []);

  const certificationsDescriptionClasses = useMemo(() => {
    return "text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-4 px-4 opacity-90 max-w-3xl mx-auto leading-relaxed font-medium";
  }, []);

  const featuredCertificationsClasses = useMemo(() => {
    return "flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-10 md:gap-16 mb-12 sm:mb-16 md:mb-20 px-4 sm:px-6";
  }, []);

  const certificationGridsClasses = useMemo(() => {
    return "grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 max-w-7xl mx-auto mb-12 sm:mb-16 md:mb-20 px-4 sm:px-6";
  }, []);

  // PERFORMANCE OPTIMIZATION: Memoized logo styles
  const logoStyles = useMemo(() => ({
    filter: 'brightness(1.1) contrast(1.2) drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
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

  // Enhanced loading state with mobile-optimized skeleton
  if (!mounted) {
    return (
      <div className="w-full py-8 sm:py-12 opacity-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <div className="h-8 sm:h-10 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full mb-4 sm:mb-6 animate-pulse w-40 sm:w-56 mx-auto"></div>
            <div className="h-12 sm:h-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl mb-6 sm:mb-8 animate-pulse w-80 sm:w-96 mx-auto"></div>
            <div className="h-6 sm:h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-pulse w-64 sm:w-80 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-56 sm:h-64 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-200/20 dark:bg-primary-800/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 dark:bg-blue-800/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Why Choose MEDH Section */}
      <section className={sectionClasses}>
        <div className="max-w-8xl mx-auto">
          
          {/* Section Header */}
          <div className={headerContainerClasses}>
            <div className={badgeClasses}>
              <div className={badgeIconClasses}>
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
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
                  className="inline-block h-6 sm:h-8 md:h-10 lg:h-12 w-auto align-baseline mx-2"
                  style={logoStyles}
                  priority={true}
                />
              </span>?
            </h2>
            <p className={descriptionClasses}>
              Empowering learners with the freedom to explore, we go beyond fundamentals, fostering critical thinking and creativity through innovative learning experiences.
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
                <Trophy className={`w-3 h-3 sm:w-4 sm:h-4 ${isDark ? 'text-white' : 'text-black'}`} />
              </div>
              <h3 className={certificationsTitleClasses}>
                Our Quality Certifications!
              </h3>
            </div>
            <p className={certificationsDescriptionClasses}>
              Certified Standards That Ensure Your Success and Excellence in Learning
            </p>
            
            {/* Featured Certifications - Main Display */}
            <div className={featuredCertificationsClasses}>
              {/* STEM Certified */}
              <CertificationCard
                image={stemAccreditation}
                alt="STEM Certified"
                title="STEM Certified"
                description="Recognized excellence in Science, Technology, Engineering, and Mathematics education with global standards."
              />
              
              {/* ISO Certified */}
              <CertificationCard
                image={iso9001Emblem}
                alt="ISO Certified"
                title="ISO Certified"
                description="International standards for quality management and continuous improvement in educational services."
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

            {/* Additional CTA Text Section */}
            <div className="mt-12 sm:mt-16 text-center px-4 sm:px-6">
              <h3 className={certificationsTitleClasses}>Get Started Today</h3>
              <p className={certificationsDescriptionClasses}>
                These certifications ensure your learning journey is built on globally recognized standards of excellence.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
});

WhyMedh.displayName = 'WhyMedh';

export default WhyMedh; 