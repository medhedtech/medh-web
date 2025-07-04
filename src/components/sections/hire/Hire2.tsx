"use client";
import React, { useState, useEffect, useMemo, memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { 
  Briefcase, 
  Users, 
  ArrowUpRight, 
  Target, 
  Clock, 
  Award, 
  TrendingUp, 
  Building,
  BookOpen,
  BarChart
} from "lucide-react";

// PERFORMANCE OPTIMIZATION: Move interfaces and constants outside component
interface IHireFeature {
  icon: React.ComponentType<any>;
  text: string;
}

// PERFORMANCE OPTIMIZATION: Frozen feature data to prevent mutations
const HIRE_FEATURES: readonly IHireFeature[] = Object.freeze([
  Object.freeze({ icon: Clock, text: "Reduce hiring time by up to 60% with our pre-qualified job-ready professionals." }),
  Object.freeze({ icon: Award, text: "Industry-certified candidates with verified technical and soft skills." }),
  Object.freeze({ icon: Target, text: "Specialized talent pools across in-demand domains." }),
  Object.freeze({ icon: Building, text: "Seamless integration with your existing team and processes." })
]);

const TRAINING_FEATURES: readonly IHireFeature[] = Object.freeze([
  Object.freeze({ icon: BarChart, text: "Data-driven skill gap analysis to identify high-impact training areas." }),
  Object.freeze({ icon: Award, text: "Industry practitioners delivering practical, application-focused training." }),
  Object.freeze({ icon: BookOpen, text: "Blended learning - live sessions and self-paced modules." }),
  Object.freeze({ icon: TrendingUp, text: "Performance tracking and ROI measurement." })
]);

// PERFORMANCE OPTIMIZATION: Memoized FeatureList component
const FeatureList = memo<{
  features: readonly IHireFeature[];
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

// PERFORMANCE OPTIMIZATION: Memoized HireCard component
const HireCard = memo<{
  title: string;
  subtitle: string;
  features: readonly IHireFeature[];
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

HireCard.displayName = 'HireCard';

// PERFORMANCE OPTIMIZATION: Main component with comprehensive memoization
const Hire = memo(() => {
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
  const handleHireNavigate = useCallback(() => {
    router.push("/hire-from-medh");
  }, [router]);

  const handleTrainingNavigate = useCallback(() => {
    router.push("/corporate-training-courses");
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
  const hireIcon = useMemo(() => <Users className="w-8 h-8 text-white" />, []);
  const trainingIcon = useMemo(() => <Building className="w-8 h-8 text-white" />, []);
  
  const hireColorClass = useMemo(() => "bg-gradient-to-br from-blue-500 to-indigo-600", []);
  const trainingColorClass = useMemo(() => "bg-gradient-to-br from-purple-500 to-purple-600", []);
  
  const hireButtonColorClass = useMemo(() => "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700", []);
  const trainingButtonColorClass = useMemo(() => "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700", []);

  const hireFeatureColorClass = useMemo(() => "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400", []);
  const trainingFeatureColorClass = useMemo(() => "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400", []);

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
                Corporate Solutions
              </span>
            </div>
            <h2 className={titleClasses}>
              ELEVATE YOUR WORKFORCE
            </h2>
            <p className={descriptionClasses}>
              Complete Corporate Solutions from MEDH
            </p>
          </div>

          {/* Cards Grid */}
          <div className={gridClasses}>
            
            {/* Corporate Training Card (now first) */}
            <HireCard
              title="Corporate Training"
              subtitle="Custom Training Solutions for Measurable Growth"
              features={TRAINING_FEATURES}
              buttonText="Explore Training Programs"
              onClick={handleTrainingNavigate}
              icon={trainingIcon}
              colorClass={trainingColorClass}
              buttonColorClass={trainingButtonColorClass}
              isDark={isDark}
              index={1}
              isVisible={isVisible}
            />

            {/* Hire from Medh Card (now second) */}
            <HireCard
              title="Hire from MEDH"
              subtitle="Access Pre-Vetted Talent, Ready to Contribute"
              features={HIRE_FEATURES}
              buttonText="Start Hiring Process"
              onClick={handleHireNavigate}
              icon={hireIcon}
              colorClass={hireColorClass}
              buttonColorClass={hireButtonColorClass}
              isDark={isDark}
              index={0}
              isVisible={isVisible}
            />
          </div>

          {/* Bottom CTA Section */}
          <div className={bottomCtaClasses}>
            <p className={bottomDescriptionClasses}>
              MEDH - Your complete workforce development partner – from talent acquisition to continuous upskilling
            </p>
            <div className={bottomButtonsClasses}>
              <button
                onClick={handleTrainingNavigate}
                className="group inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-all duration-300 border border-purple-200 dark:border-purple-800"
              >
                <Building className="mr-2 w-4 h-4" />
                Corporate Training
              </button>
              <button
                onClick={handleHireNavigate}
                className="group inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-300 border border-blue-200 dark:border-blue-800"
              >
                <Users className="mr-2 w-4 h-4" />
                Hire Talent
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

Hire.displayName = 'Hire';

export default Hire; 