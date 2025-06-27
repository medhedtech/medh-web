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
  ArrowRight,
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
  Object.freeze({ icon: Globe, text: "Global teaching opportunities" }),
  Object.freeze({ icon: Clock, text: "Flexible scheduling" }),
  Object.freeze({ icon: Award, text: "Competitive compensation" }),
  Object.freeze({ icon: BookOpen, text: "Comprehensive teaching resources" })
]);

const PARTNER_FEATURES: readonly IFeature[] = Object.freeze([
  Object.freeze({ icon: Target, text: "Customized training solutions" }),
  Object.freeze({ icon: Award, text: "Industry-aligned curriculum" }),
  Object.freeze({ icon: Trophy, text: "Cutting-edge technologies" }),
  Object.freeze({ icon: Building, text: "Enhanced employability" })
]);

// PERFORMANCE OPTIMIZATION: Memoized FeatureList component
const FeatureList = memo<{
  features: readonly IFeature[];
  isDark: boolean;
}>(({ features, isDark }) => {
  const itemClasses = useMemo(() => {
    return `flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-white/10 ${
      isDark ? 'text-white/90' : 'text-gray-700'
    }`;
  }, [isDark]);

  return (
    <div className="space-y-3">
      {features.map((feature, index) => {
        const IconComponent = feature.icon;
        return (
          <div key={index} className={itemClasses}>
            <IconComponent className="w-5 h-5 text-primary-400 flex-shrink-0" />
            <span className="text-sm">{feature.text}</span>
          </div>
        );
      })}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.features === nextProps.features &&
    prevProps.isDark === nextProps.isDark
  );
});

FeatureList.displayName = 'FeatureList';

// PERFORMANCE OPTIMIZATION: Memoized JoinCard component
const JoinCard = memo<{
  title: string;
  subtitle: string;
  description: string;
  features: readonly IFeature[];
  buttonText: string;
  onClick: () => void;
  icon: React.ReactNode;
  isDark: boolean;
  index: number;
  isVisible: boolean;
}>(({ 
  title, 
  subtitle, 
  description, 
  features, 
  buttonText, 
  onClick, 
  icon, 
  isDark, 
  index, 
  isVisible 
}) => {
  const cardClasses = useMemo(() => {
    return `group relative h-full glass-card p-6 md:p-8 rounded-2xl border border-white/20 dark:border-gray-700/50 hover:border-primary-400/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl backdrop-blur-xl ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
    }`;
  }, [isVisible]);

  const iconContainerClasses = useMemo(() => {
    return "w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg";
  }, []);

  const titleClasses = useMemo(() => {
    return `text-2xl md:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`;
  }, [isDark]);

  const subtitleClasses = useMemo(() => {
    return `text-lg font-medium mb-4 ${isDark ? 'text-primary-300' : 'text-primary-600'}`;
  }, [isDark]);

  const descriptionClasses = useMemo(() => {
    return `text-sm leading-relaxed mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`;
  }, [isDark]);

  const buttonClasses = useMemo(() => {
    return "w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-500 to-blue-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl group/btn";
  }, []);

  return (
    <div 
      className={cardClasses}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      {/* Icon */}
      <div className={iconContainerClasses}>
        {icon}
      </div>
      
      {/* Content */}
      <h3 className={titleClasses}>{title}</h3>
      <p className={subtitleClasses}>{subtitle}</p>
      <p className={descriptionClasses}>{description}</p>
      
      {/* Features */}
      <FeatureList features={features} isDark={isDark} />
      
      {/* Button */}
      <button
        onClick={onClick}
        className={buttonClasses}
      >
        <span>{buttonText}</span>
        <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.subtitle === nextProps.subtitle &&
    prevProps.description === nextProps.description &&
    prevProps.features === nextProps.features &&
    prevProps.buttonText === nextProps.buttonText &&
    prevProps.onClick === nextProps.onClick &&
    prevProps.icon === nextProps.icon &&
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
  const sectionClasses = useMemo(() => {
    return "w-full py-20 md:py-20";
  }, []);

  const backgroundClasses = useMemo(() => {
    return "absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 gpu-accelerated";
  }, []);

  const containerClasses = useMemo(() => {
    return `relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
    }`;
  }, [isVisible]);

  const headerClasses = useMemo(() => {
    return "text-center mb-12 md:mb-16";
  }, []);

  const badgeClasses = useMemo(() => {
    return "inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium mb-6";
  }, []);

  const titleClasses = useMemo(() => {
    return `text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight ${
      isDark ? 'text-white' : 'text-gray-900'
    }`;
  }, [isDark]);

  const descriptionClasses = useMemo(() => {
    return `text-lg md:text-xl leading-relaxed max-w-3xl mx-auto ${
      isDark ? 'text-gray-300' : 'text-gray-600'
    }`;
  }, [isDark]);

  const gridClasses = useMemo(() => {
    return "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12";
  }, []);

  // PERFORMANCE OPTIMIZATION: Memoized icons
  const educatorIcon = useMemo(() => <Users className="w-8 h-8 text-white" />, []);
  const partnerIcon = useMemo(() => <Briefcase className="w-8 h-8 text-white" />, []);

  // Fast loading state
  if (!mounted) {
    return (
      <div className="py-16 opacity-0">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse w-64 mx-auto"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse w-96 mx-auto"></div>
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
    <section className={sectionClasses}>
      {/* Background grid pattern and overlays for glassmorphism */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-violet-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-violet-950/20"></div>
      {/* Floating blurred blobs */}
      <div className="absolute top-20 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-40 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-violet-200/20 dark:bg-violet-800/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-28 h-28 sm:w-36 sm:h-36 bg-amber-200/20 dark:bg-amber-800/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <div className={containerClasses}>
        {/* Header */}
        <div className={headerClasses}>
          <div className={badgeClasses}>
            <Users className="w-4 h-4" />
            <span>Transform Education Together with MEDH</span>
          </div>
          
          <h2 className={titleClasses}>
            Join the <span className="text-primary-600 dark:text-primary-400">MEDH</span> Community
          </h2>
          
          <p className={descriptionClasses}>
            Be part of our global movement transforming education through innovation and accessibility. Whether you're passionate about teaching or representing an institution, MEDH offers a pathway to create meaningful impact.
          </p>
        </div>

        {/* Cards Grid */}
        <div className={gridClasses + " relative w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm shadow-slate-200/50 dark:shadow-slate-800/50 overflow-hidden p-0 md:p-0"}>
          {/* Educator Card */}
          <JoinCard
            title="Join as Educator"
            subtitle="Share Your Expertise"
            description="Inspire the next generation. Bring your knowledge to eager learners worldwide and make a lasting difference in their educational journey."
            features={EDUCATOR_FEATURES}
            buttonText="Become an Educator →"
            onClick={handleEducatorNavigate}
            icon={educatorIcon}
            isDark={isDark}
            index={0}
            isVisible={isVisible}
          />

          {/* Partner Card */}
          <JoinCard
            title="Partner with Us"
            subtitle="Institutional Excellence"
            description="Elevate your institution's educational offerings through our collaborative programs designed to meet the evolving demands of today's learners."
            features={PARTNER_FEATURES}
            buttonText="Become a Partner →"
            onClick={handlePartnerNavigate}
            icon={partnerIcon}
            isDark={isDark}
            index={1}
            isVisible={isVisible}
          />
        </div>

        {/* Community CTA */}
        <div className="mt-12 text-center max-w-2xl mx-auto">
          <h3 className="text-lg md:text-xl font-semibold mb-2 text-primary-700 dark:text-primary-300">Join our growing community of educators and institutions making a global impact.</h3>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 whitespace-nowrap">
            Whether you teach or partner with us, together we're building the future of education.
          </p>
        </div>
      </div>
    </section>
  );
});

JoinMedh.displayName = 'JoinMedh';

export default JoinMedh; 