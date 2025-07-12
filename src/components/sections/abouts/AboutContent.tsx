"use client";
import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  ArrowDown, 
  CheckCircle, 
  Lightbulb, 
  Target, 
  Users, 
  ArrowUp,
  Sparkles,
  Rocket,
  Shield,
  Award,
  BookOpen,
  TrendingUp,
  ArrowRight,
  Star,
  Globe,
  Zap,
  Heart,
  Briefcase
} from "lucide-react";
import { buildAdvancedComponent, mobilePatterns } from "@/utils/designSystem";
import { useRouter } from "next/navigation";

interface IStatCard {
  number: string;
  label: string;
  icon: React.ReactElement;
}

interface IPillar {
  title: string;
  description: string;
  icon: React.ReactElement;
  color: string;
  bgColor: string;
}

interface IDifferentiator {
  title: string;
  description: string;
  icon: React.ReactElement;
  color: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const stats: IStatCard[] = [
  {
    number: "50K+",
    label: "Learners Empowered",
    icon: <Users className="w-6 h-6" />
  },
  {
    number: "200+",
    label: "Expert Mentors",
    icon: <Star className="w-6 h-6" />
  },
  {
    number: "15+",
    label: "Countries Reached",
    icon: <Globe className="w-6 h-6" />
  }
];

const pillars: IPillar[] = [
  {
    title: "Innovation First",
    description: "Cutting-edge technology meets proven pedagogy for transformative learning experiences",
    icon: <Lightbulb className="w-8 h-8" />,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20"
  },
  {
    title: "Quality Assured",
    description: "Industry-standard content crafted by experts, always current and outcome-driven",
    icon: <Shield className="w-8 h-8" />,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20"
  },
  {
    title: "Lifelong Growth",
    description: "From student to professional to expert - we support your entire learning journey",
    icon: <TrendingUp className="w-8 h-8" />,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
  }
];

const differentiators: IDifferentiator[] = [
  {
    title: "Personalized Learning",
    description: "AI-powered paths that adapt to your pace, style, and goals",
    icon: <Target className="w-6 h-6" />,
    color: "text-rose-600 dark:text-rose-400"
  },
  {
    title: "Industry-Relevant",
    description: "Real-world skills that employers actually want and value",
    icon: <Briefcase className="w-6 h-6" />,
    color: "text-indigo-600 dark:text-indigo-400"
  },
  {
    title: "Future-Focused",
    description: "Stay ahead with emerging technologies and market trends",
    icon: <Zap className="w-6 h-6" />,
    color: "text-green-600 dark:text-green-400"
  }
];

const AboutContent: React.FC = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950/30 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-amber-200/20 dark:bg-amber-800/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>

      {/* Hero Section */}
        <motion.div
          initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative z-10 pt-8 pb-8 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4" />
            About MEDH
          </motion.div>
          
          <motion.h1
          variants={fadeInUp}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
          >
            <span className="text-slate-900 dark:text-white">
                Pioneering Skill Development
              </span>
              <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                for every stage of life
              </span>
          </motion.h1>

            <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto mb-8"
          >
            Transform your potential into expertise with our AI-powered learning platform. 
            <br className="hidden sm:block" />
            From curious beginner to industry leader - we're with you every step.
          </motion.p>
          
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {/* CTA buttons removed */}
          </motion.div>
        </div>
      </motion.div>

      {/* Impact Stats removed */}

      {/* Core Pillars */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerChildren}
        className="relative z-10 py-8 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Built on Three Pillars
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Our foundation rests on innovation, quality, and growth - ensuring every learner gets the best experience possible.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`p-8 ${pillar.bgColor} rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:scale-105 transition-all duration-300 text-center`}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 ${pillar.color} mb-6 mx-auto`}>
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{pillar.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{pillar.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Why Choose MEDH */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerChildren}
        className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-800/50"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-2">
              Why Choose
              <span className="ml-2 font-extrabold" style={{ color: '#3bac63', letterSpacing: '0.04em' }}>MEDH</span>
              <span className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white ml-1">?</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              We're not just another learning platform. We're your partners in transformation.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {differentiators.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 ${item.color} bg-slate-100 dark:bg-slate-700 rounded-lg mb-4 mx-auto`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Vision & Mission */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerChildren}
        className="relative z-10 py-8 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Our Purpose
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              variants={fadeInUp}
              className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50 text-center"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Vision</h3>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                To lead the EdTech revolution, empowering individuals at every life stage from childhood to career advancement.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50 text-center"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-lg flex items-center justify-center">
                  <Rocket className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Mission</h3>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Delivering AI-powered learning experiences with industry certifications and expert mentorship for measurable professional growth.
              </p>
            </motion.div>
          </div>
          </div>
        </motion.div>

      {/* CTA Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Future?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already building the skills that matter for tomorrow's world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 hover:scale-105"
              onClick={() => router.push('/courses')}
            >
              Explore All Courses
            </button>
            <button
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
              onClick={() => router.push('/contact-us')}
            >
              Talk to an Expert
            </button>
          </div>
      </div>
      </motion.div>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all z-50 hover:shadow-xl"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
};

export default memo(AboutContent);
