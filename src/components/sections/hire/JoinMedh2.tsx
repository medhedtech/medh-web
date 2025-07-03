"use client";
import React, { useState, useEffect, useMemo, memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { 
  Globe, 
  Clock, 
  Award, 
  BookOpen, 
  Target, 
  Trophy,
  Building,
  ArrowUpRight,
  Users,
  Briefcase
} from "lucide-react";

// PERFORMANCE OPTIMIZATION: Move interfaces and constants outside component
interface IFeature {
  icon: React.ComponentType<any>;
  text: string;
}

// PERFORMANCE OPTIMIZATION: Frozen feature data to prevent mutations
const EDUCATOR_FEATURES: readonly IFeature[] = Object.freeze([
  Object.freeze({ icon: Globe, text: "Access to global teaching opportunities with flexible scheduling" }),
  Object.freeze({ icon: Clock, text: "Set your own hours and teach from anywhere in the world" }),
  Object.freeze({ icon: Award, text: "Competitive compensation with performance-based incentives" }),
  Object.freeze({ icon: BookOpen, text: "Access to comprehensive teaching resources and support" })
]);

const PARTNER_FEATURES: readonly IFeature[] = Object.freeze([
  Object.freeze({ icon: Target, text: "Customized training solutions tailored to your institution's needs" }),
  Object.freeze({ icon: Award, text: "Industry-aligned curriculum with cutting-edge content" }),
  Object.freeze({ icon: Trophy, text: "Access to advanced learning technologies and platforms" }),
  Object.freeze({ icon: Building, text: "Enhanced employability outcomes for your students" })
]);

// PERFORMANCE OPTIMIZATION: Memoized FeatureList component
const FeatureList = memo<{
  features: readonly IFeature[];
  colorClass: string;
}>(({ features, colorClass }) => {
  return (
    <div className="space-y-4 mb-8">
      {features.map((feature, index) => {
        const IconComponent = feature.icon;
        return (
          <div key={index} className="flex items-start gap-3 group/item">
            <div className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0 group-hover/item:scale-105 transition-transform duration-200`}>
              <IconComponent className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {feature.text}
            </p>
          </div>
        );
      })}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.features === nextProps.features &&
    prevProps.colorClass === nextProps.colorClass
  );
});

FeatureList.displayName = 'FeatureList';

// PERFORMANCE OPTIMIZATION: Memoized JoinCard component
const JoinCard = memo<{
  title: string;
  subtitle: string;
  features: readonly IFeature[];
  buttonText: string;
  onClick: () => void;
  icon: React.ReactNode;
  colorClass: string;
  buttonColorClass: string;
  isDark: boolean;
  index: number;
  isVisible: boolean;
}>(({ 
  title, 
  subtitle, 
  features, 
  buttonText, 
  onClick, 
  icon, 
  colorClass, 
  buttonColorClass,
  isDark, 
  index, 
  isVisible 
}) => {
  const cardClasses = useMemo(() => {
    return `group relative h-full transition-all duration-300 hover:-translate-y-1 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
    }`;
  }, [isVisible]);

  const contentClasses = useMemo(() => {
    return "relative h-full rounded-2xl bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 p-8";
  }, []);

  const headerClasses = useMemo(() => {
    return "flex items-center gap-4 mb-6";
  }, []);

  const iconContainerClasses = useMemo(() => {
    return `w-20 h-14 rounded-lg ${colorClass} flex items-center justify-center shadow-lg sm:w-16 sm:h-16 sm:rounded-xl`;
  }, [colorClass]);

  const titleClasses = useMemo(() => {
    return "text-xl font-bold text-gray-900 dark:text-white";
  }, []);

  const subtitleClasses = useMemo(() => {
    return "text-sm text-gray-700 dark:text-gray-300";
  }, []);

  const buttonClasses = useMemo(() => {
    return `w-full inline-flex items-center justify-center px-6 py-4 ${buttonColorClass} text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group`;
  }, [buttonColorClass]);

  return (
    <div 
      className={cardClasses}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      <div className={contentClasses + " flex flex-col h-full"}>
        {/* Card Header */}
        <div className={headerClasses}>
          <div className={iconContainerClasses}>
            {icon}
          </div>
          <div>
            <h3 className={titleClasses}>
              {title}
            </h3>
            <p className={subtitleClasses}>
              {subtitle}
            </p>
          </div>
        </div>

        {/* Features List */}
        <FeatureList features={features} colorClass={colorClass.replace('bg-gradient-to-br from-', 'bg-').replace(' to-indigo-600', '').replace(' to-purple-600', '')} />

        {/* CTA Button at the bottom */}
        <div className="mt-auto pt-4">
          <button
            onClick={onClick}
            className={buttonClasses}
          >
            <span>{buttonText}</span>
            <ArrowUpRight size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.subtitle === nextProps.subtitle &&
    prevProps.features === nextProps.features &&
    prevProps.buttonText === nextProps.buttonText &&
    prevProps.onClick === nextProps.onClick &&
    prevProps.icon === nextProps.icon &&
    prevProps.colorClass === nextProps.colorClass &&
    prevProps.buttonColorClass === nextProps.buttonColorClass &&
    prevProps.isDark === nextProps.isDark &&
    prevProps.index === nextProps.index &&
    prevProps.isVisible === nextProps.isVisible
  );
});

JoinCard.displayName = 'JoinCard';

// PERFORMANCE OPTIMIZATION: Main component with comprehensive memoization
const JoinMedh = memo(() => {
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
  const handleEducatorNavigate = useCallback(() => {
    router.push("/join-us-as-educator");
  }, [router]);

  const handlePartnerNavigate = useCallback(() => {
    router.push("/join-us-as-school-institute");
  }, [router]);

  // PERFORMANCE OPTIMIZATION: Memoized class names
  const containerClasses = useMemo(() => {
    return `w-full transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} py-8 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800/50`;
  }, [isVisible]);

  const sectionClasses = useMemo(() => {
    return "w-full py-8 relative";
  }, []);

  const headerContainerClasses = useMemo(() => {
    return "text-center mb-16 relative";
  }, []);

  const badgeClasses = useMemo(() => {
    return "inline-flex items-center gap-2 mb-6";
  }, []);

  const titleClasses = useMemo(() => {
    return "text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white";
  }, []);

  const descriptionClasses = useMemo(() => {
    return "text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed";
  }, []);

  const gridClasses = useMemo(() => {
    return "grid grid-cols-1 lg:grid-cols-2 gap-8 relative";
  }, []);

  const bottomCtaClasses = useMemo(() => {
    return "text-center mt-16 relative";
  }, []);

  const bottomDescriptionClasses = useMemo(() => {
    return "text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto";
  }, []);

  const bottomButtonsClasses = useMemo(() => {
    return "flex flex-col sm:flex-row gap-4 items-center justify-center";
  }, []);

  // PERFORMANCE OPTIMIZATION: Memoized icons and color classes
  const educatorIcon = useMemo(() => <Users className="w-8 h-8 text-white" />, []);
  const partnerIcon = useMemo(() => <Building className="w-8 h-8 text-white" />, []);
  
  const educatorColorClass = useMemo(() => "bg-gradient-to-br from-blue-500 to-indigo-600", []);
  const partnerColorClass = useMemo(() => "bg-gradient-to-br from-purple-500 to-purple-600", []);
  
  const educatorButtonColorClass = useMemo(() => "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700", []);
  const partnerButtonColorClass = useMemo(() => "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700", []);

  // Fast loading state
  if (!mounted) {
    return (
      <div className="py-8 opacity-0">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse w-64 mx-auto"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <section className={sectionClasses}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className={headerContainerClasses}>
            <div className={badgeClasses}>
              <Briefcase className="w-6 h-6 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Join MEDH
              </span>
            </div>
            <h2 className={titleClasses}>
              Transform Education Together
            </h2>
            <p className={descriptionClasses}>
              Join our mission to revolutionize education and empower learners worldwide
            </p>
          </div>

          {/* Cards Grid */}
          <div className={gridClasses}>
            {/* Educator Card */}
            <JoinCard
              title="Join as Educator"
              subtitle="Share Your Expertise"
              features={EDUCATOR_FEATURES}
              buttonText="Become an Educator"
              onClick={handleEducatorNavigate}
              icon={educatorIcon}
              colorClass={educatorColorClass}
              buttonColorClass={educatorButtonColorClass}
              isDark={isDark}
              index={0}
              isVisible={isVisible}
            />

            {/* Partner Card */}
            <JoinCard
              title="Partner with Us"
              subtitle="Institutional Excellence"
              features={PARTNER_FEATURES}
              buttonText="Become a Partner"
              onClick={handlePartnerNavigate}
              icon={partnerIcon}
              colorClass={partnerColorClass}
              buttonColorClass={partnerButtonColorClass}
              isDark={isDark}
              index={1}
              isVisible={isVisible}
            />
          </div>

          {/* Bottom CTA Section */}
          <div className={bottomCtaClasses}>
            <p className={bottomDescriptionClasses}>
              Join our growing community of educators and institutions making a global impact
            </p>
            <div className={bottomButtonsClasses}>
              <button
                onClick={handleEducatorNavigate}
                className="group inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-300 border border-blue-200 dark:border-blue-800"
              >
                <Users className="mr-2 w-4 h-4" />
                Join as Educator
              </button>
              <button
                onClick={handlePartnerNavigate}
                className="group inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-all duration-300 border border-purple-200 dark:border-purple-800"
              >
                <Building className="mr-2 w-4 h-4" />
                Become a Partner
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

JoinMedh.displayName = 'JoinMedh';

export default JoinMedh; 