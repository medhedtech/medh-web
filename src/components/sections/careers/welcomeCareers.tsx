"use client";

import React, { useState, useEffect, memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Users, 
  Rocket, 
  GraduationCap, 
  Award,
  Target,
  Heart,
  Briefcase,
  Star,
  ArrowRight,
  Shield,
  Brain
} from "lucide-react";
import { useTheme } from "next-themes";
import medhLogo from "@/assets/images/logo/medh.png";
// Import SVG logos instead of images for better performance
import Logo1 from "@/assets/images/career/logo-1.svg";
import Logo2 from "@/assets/images/career/logo-2.svg";

interface IWelcomeCard {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
}

interface IInfoCard {
  image: any;
  title: string;
  description: string;
  className?: string;
}

interface IWelcomeCardProps extends IWelcomeCard {
  index: number;
}

interface IInfoCardProps extends IInfoCard {
  index: number;
}

interface IBenefit {
  id: number;
  icon: React.ReactElement;
  title: string;
  description: string;
  stats?: string;
  category: 'core' | 'growth' | 'wellness';
}

interface IBenefitCardProps extends IBenefit {
  index: number;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
      mass: 1
    }
  }
};

const getSemanticColor = (index: number): { bg: string; text: string; border: string } => {
  const colorMap = [
    { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
    { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
    { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' }
  ];
  return colorMap[index % colorMap.length];
};
const WelcomeCard: React.FC<IWelcomeCardProps> = memo(({ icon: Icon, title, description, color, index }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <motion.div
      variants={itemVariants}
      className="relative overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-lg sm:rounded-xl md:rounded-2xl border border-white/50 dark:border-slate-600/50 p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl shadow-slate-200/20 dark:shadow-slate-900/30 transition-all duration-300 h-full">
        <div className="flex flex-col items-center text-center">
          <motion.div
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0
            }}
            transition={{ duration: 0.3 }}
            className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-sm relative overflow-hidden`}
          >
            <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white relative z-10" />
          </motion.div>
          <h3 className="text-lg sm:text-xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {description}
          </p>
        </div>
        

      </div>
    </motion.div>
  );
});

WelcomeCard.displayName = "WelcomeCard";

const InfoCard: React.FC<IInfoCardProps> = memo(({ image, title, description, className = "", index }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <motion.div
      variants={itemVariants}
      className={`w-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-lg sm:rounded-xl md:rounded-2xl border border-white/50 dark:border-slate-600/50 p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl shadow-slate-200/20 dark:shadow-slate-900/30 transition-all duration-300 group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col items-center text-center">
        <motion.div 
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mb-4 sm:mb-6 relative"
          animate={{
            scale: isHovered ? 1.05 : 1,
            rotate: isHovered ? 2 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={image}
            alt={title}
            width={112}
            height={112}
            className="object-contain w-full h-full"
          />
        </motion.div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
});

InfoCard.displayName = "InfoCard";

// Benefits data
const advantagesData: IBenefit[] = [
  {
    id: 1,
    icon: <Shield className="w-8 h-8" />,
    title: "Competitive Compensation",
    description: "Industry-leading salary packages with performance bonuses, equity options, and comprehensive benefits designed to reward excellence.",
    stats: "₹8-25 LPA",
    category: 'core'
  },
  {
    id: 2,
    icon: <Brain className="w-8 h-8" />,
    title: "Professional Development",
    description: "Comprehensive learning programs, skill development workshops, and career advancement opportunities to accelerate your professional journey.",
    stats: "100+ Courses",
    category: 'growth'
  },
  {
    id: 3,
    icon: <Users className="w-8 h-8" />,
    title: "Collaborative Excellence",
    description: "Join a diverse, inclusive team where innovation thrives, ideas are valued, and collaborative success is celebrated.",
    stats: "95% Team Satisfaction",
    category: 'core'
  },
];

// Benefit Card Component
const BenefitCard: React.FC<IBenefitCardProps> = memo(({ icon, title, description, stats, category, index }) => {
  const getSemanticColor = (category: IBenefit['category']): { bg: string; text: string; border: string } => {
    const colorMap = {
      core: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
      growth: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
      wellness: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' }
    };
    return colorMap[category] || { bg: 'bg-gray-50 dark:bg-gray-900/20', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-200 dark:border-gray-800' };
  };

  const colors = getSemanticColor(category);

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center`}>
            {icon}
          </div>
          
          {stats && (
            <div className={`px-2 py-1 rounded-md text-xs font-medium ${colors.bg} ${colors.text}`}>
              {stats}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white leading-tight">
              {title}
            </h3>
          </div>

          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

BenefitCard.displayName = "BenefitCard";

const WelcomeCareers: React.FC = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const isDark = mounted ? theme === 'dark' : true;

  useEffect(() => {
    setMounted(true);
    setIsVisible(true);
  }, []);

  const features: IWelcomeCard[] = [
    {
      icon: Sparkles,
      title: "Innovation First",
      description: "We're redefining education through cutting-edge technology and innovative approaches that shape the future of learning.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Inclusive Culture",
      description: "Foster a diverse and collaborative environment where every voice matters and unique perspectives drive our success.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: GraduationCap,
      title: "Continuous Learning",
      description: "Opportunities for continuous professional development and skill enhancement that grow with your career aspirations.",
      color: "from-purple-500 to-indigo-500"
    }
  ];

  const infoCards: IInfoCard[] = [
    {
      image: Logo1,
      title: "Rewarding Work Environment",
      description: "We believe in fostering a rewarding and fulfilling work environment that nurtures growth and job satisfaction. Our team is our greatest asset, and we are dedicated to creating a culture of collaboration, inclusivity, and excellence."
    },
    {
      image: Logo2,
      title: "Diverse Opportunities",
      description: "We offer a diverse range of career opportunities that cater to various skill sets and professional backgrounds. Whether you are a seasoned professional or just starting your career, we have a role for you. Join us and be a part of a dynamic team."
    }
  ];

  if (!mounted) {
    return (
      <div className="mb-16 md:mb-20">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mx-auto mb-6"></div>
          <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mx-auto mb-4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto mb-8"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero + Info Cards Container */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 mb-12 mx-4 md:mx-16">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-gradient-to-r from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold rounded-full mb-4 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50">
            <Rocket className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Join Our Mission</span>
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-4 md:mb-6 tracking-tight text-slate-900 dark:text-white flex flex-col items-center gap-2 md:gap-3">
            <span className="block text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-slate-900 dark:text-white">Welcome to</span>
            <div className="flex items-center justify-center">
              <Image
                src={medhLogo}
                alt="MEDH Logo"
                width={58}
                height={22}
                className="h-5 sm:h-7 md:h-9 lg:h-11 xl:h-12 w-auto object-contain"
                priority
              />
            </div>
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed text-slate-600 dark:text-slate-300 max-w-4xl mx-auto">
            Where we are redefining the future of education through innovation and technology. 
            As a leading EdTech company, we are committed to providing cutting-edge skill 
            development courses that empower learners of all ages.
          </p>
          <div className="mt-6 md:mt-8">
            <button 
              onClick={() => {
                let targetSection: HTMLElement | null = document.getElementById('job-openings');
                if (!targetSection) {
                  const headings = document.querySelectorAll('h2, h3');
                  for (const heading of headings) {
                    if (heading.textContent?.includes('Current Openings')) {
                      targetSection = heading as HTMLElement;
                      break;
                    }
                  }
                }
                if (!targetSection) {
                  const element = document.querySelector('[class*="JobPositions"], [class*="job-positions"]');
                  targetSection = element as HTMLElement;
                }
                if (targetSection) {
                  targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                  window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg shadow-blue-500/25"
            >
              <span>Explore Opportunities</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {infoCards.map((card, index) => (
            <InfoCard
              key={index}
              {...card}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Our Values Section + Benefits Container */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-0 mb-12 mx-4 md:mx-16">
        <div className="text-center mb-8 md:mb-12 pt-6">
          <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-semibold rounded-full mb-4 backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-700/50">
            <Award className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Our Values</span>
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Why Choose <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">MEDH</span>?
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
          {features.map((feature, index) => (
            <WelcomeCard key={index} {...feature} index={index} />
          ))}
        </div>

        {/* Competitive Benefits Package Section */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Competitive Benefits Package
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            We invest in our team's growth, well-being, and success with comprehensive benefits designed for professionals.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {advantagesData.map((advantage, index) => (
            <BenefitCard key={advantage.id} {...advantage} index={index} />
          ))}
        </div>
      </div>
    </>
  );
};

export default WelcomeCareers;
