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
  Briefcase,
  GraduationCap
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
        className="relative z-10 pt-0 pb-8 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          
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
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto whitespace-nowrap">
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

      {/* Who We Are Section */}
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
              Who We Are
            </h2>
            <div className="max-w-5xl mx-auto">
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                MEDH is a global EdTech leader delivering skill development through advanced technology and personalized mentorship. Our team of technologists, entrepreneurs, and visionaries creates a dynamic learning ecosystem by combining diverse expertise, empowering individuals from early childhood to professional life and homemakers.
              </p>
              <p className="text-lg text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                We firmly believe technology-powered education builds the foundation for a brighter future for learners of all backgrounds.
              </p>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              variants={fadeInUp}
              className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Our Vision</h3>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                To lead the global EdTech revolution by providing transformative skill development solutions that empower individuals at every life stage—from early childhood to career advancement—enabling professional opportunities and personal enrichment for all learners, including homemakers seeking growth beyond traditional roles.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-lg flex items-center justify-center">
                  <Rocket className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Our Mission</h3>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                To transform learning through personalized skill development that meets today's evolving needs, combining innovative curriculum, AI-driven technology, and industry certifications. We collaborate with seasoned educators, corporates, and industry experts to nurture career readiness for diverse learners, supporting pathways to financial independence, digital literacy, entrepreneurship, and personal fulfillment for professionals and homemakers alike.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Our Unique Point of Difference */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerChildren}
        className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-800/50"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Our Unique Point of Difference
            </h2>
          </motion.div>
          <motion.div variants={fadeInUp} className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-indigo-200/50 dark:border-indigo-700/50">
            <ul className="space-y-6 text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                <span className="text-lg leading-relaxed">
                  MEDH stands apart by offering seamless skill development across all life stages.
                </span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                <span className="text-lg leading-relaxed">
                  We create customized learning journeys from childhood to professional advancement, including pathways for homemakers' personal growth and empowerment.
                </span>
              </li>
                             <li className="flex items-start gap-4">
                 <CheckCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                 <span className="text-lg leading-relaxed">
                   Our approach ensures every individual—student, professional, or homemaker—develops the exact skills needed to thrive in their unique life context.
                 </span>
               </li>
            </ul>
          </motion.div>
        </div>
      </motion.div>

      {/* Our Services */}
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
              Our Services
            </h2>
          </motion.div>

          <div className="space-y-12">
            {/* For Individual Learners */}
            <motion.div variants={fadeInUp} className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-200/50 dark:border-blue-700/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">For Individual Learners</h3>
              </div>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                From early childhood development to professional upskilling, MEDH offers personalized learning pathways for individuals at every life stage:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Early Schoolers (Ages 5-8):</span>
                    <span className="block text-sm mt-1">Foundation-building courses in literacy, numeracy, creativity, and digital discovery</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Pre-Teens (Ages 9-12):</span>
                    <span className="block text-sm mt-1">Bridge courses developing critical thinking, digital literacy, and exploration across diverse domains</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Teenagers (Ages 13-19):</span>
                    <span className="block text-sm mt-1">Identity-shaping courses for career exploration, advanced academics, and leadership development</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Young Adults (Ages 20-21):</span>
                    <span className="block text-sm mt-1">Direction-setting courses for career launch, university success, and independent living</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Working Professionals (Ages 22-35):</span>
                    <span className="block text-sm mt-1">Career-building courses in technical mastery, leadership, and digital transformation</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Senior Professionals (Ages 36-45):</span>
                    <span className="block text-sm mt-1">Advanced courses in executive leadership, specialized expertise, and strategic communication</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Older Adults (Ages 46-55):</span>
                    <span className="block text-sm mt-1">Legacy-building courses for career reinvention, wealth optimization, and knowledge sharing</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Homemakers & Caregivers:</span>
                    <span className="block text-sm mt-1">Specialized courses for family management, digital literacy, and personal fulfillment</span>
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* For Corporate Partners */}
            <motion.div variants={fadeInUp} className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-8 border border-emerald-200/50 dark:border-emerald-700/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">For Corporate Partners</h3>
              </div>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                MEDH delivers comprehensive corporate training solutions designed to transform workforce capabilities and drive organizational success. Our corporate offerings include:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700 dark:text-slate-300 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Customized Training Courses:</span>
                    <span className="block text-sm mt-1">Tailored learning experiences aligned with organizational goals and specific workforce needs</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Enterprise Skill Development Platform:</span>
                    <span className="block text-sm mt-1">Scalable learning management system with customized learning paths and analytics</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Technical & Digital Upskilling:</span>
                    <span className="block text-sm mt-1">Specialized training in emerging technologies and digital transformation</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Talent Assessment & Development:</span>
                    <span className="block text-sm mt-1">Sophisticated tools to identify high-potential talent and create personalized development plans</span>
                  </div>
                </li>
                <li className="flex items-start gap-3 md:col-span-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Measuring Training Impact:</span>
                    <span className="block text-sm mt-1">Robust analytics framework to measure learning outcomes and business impact</span>
                  </div>
                </li>
              </ul>
              
              <div className="border-t border-emerald-200/50 dark:border-emerald-700/50 pt-6">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Benefits to Corporate Partners</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-3">
                    <Star className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Enhanced workforce capabilities and competitive advantage</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Improved employee retention and loyalty</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Accelerated innovation and seamless digital transformation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Leadership pipeline development and organizational continuity</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Measurable performance improvement through comprehensive analytics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Reduced recruitment costs through internal talent development</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* For Schools/Educational Institutions */}
            <motion.div variants={fadeInUp} className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-purple-200/50 dark:border-purple-700/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">For Schools/Educational Institutions</h3>
              </div>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                MEDH partners with schools and educational institutes to enhance their curriculum with essential future-ready skill development courses:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700 dark:text-slate-300 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Technology Infrastructure & Support:</span>
                    <span className="block text-sm mt-1">Consultation and implementation support for educational technology</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Student Assessment & Career Guidance:</span>
                    <span className="block text-sm mt-1">Comprehensive tools for personalized learning paths along with mentorship from professionals</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Co-branded Certification Courses:</span>
                    <span className="block text-sm mt-1">Industry-recognized certifications that enhance institutional value</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">STEM & Digital Literacy Initiatives:</span>
                    <span className="block text-sm mt-1">Specialized courses in coding, robotics, and data science</span>
                  </div>
                </li>
                <li className="flex items-start gap-3 md:col-span-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Entrepreneurship & Innovation Hubs:</span>
                    <span className="block text-sm mt-1">Centers that nurture creativity and business acumen</span>
                  </div>
                </li>
              </ul>
              
              <div className="border-t border-purple-200/50 dark:border-purple-700/50 pt-6">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Benefits to Educational Partners</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-3">
                    <Star className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Enhanced educational offerings and improved student outcomes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Competitive differentiation in the educational marketplace</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Teacher empowerment and effective technology integration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Strong industry connections bridging academic learning and workplace requirements</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Holistic student development addressing cognitive, social, emotional, and practical skills</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Community impact as leaders in preparing students for tomorrow's challenges</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Our Talent Pipeline */}
            <motion.div variants={fadeInUp} className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-8 border border-amber-200/50 dark:border-amber-700/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-amber-600 text-white rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Our Talent Pipeline: Connecting Education and Employment</h3>
              </div>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
                MEDH creates a seamless bridge between skill development and career opportunities through our innovative 'Hire-from-MEDH' program. This initiative connects our highest-achieving students with corporate partners seeking qualified talent, creating value for all stakeholders:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* For Students */}
                <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 border border-amber-200/30 dark:border-amber-700/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-amber-600 text-white rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">For Students</h4>
                  </div>
                  <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Direct pathway to internship and employment opportunities with leading organizations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Career readiness preparation including interview skills and portfolio development</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Mentorship from industry professionals during the transition to the workplace</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Confidence that their MEDH training directly aligns with employer requirements</span>
                    </li>
                  </ul>
                </div>

                {/* For Corporate Partners */}
                <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 border border-amber-200/30 dark:border-amber-700/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-amber-600 text-white rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">For Corporate Partners</h4>
                  </div>
                  <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Access to a pre-qualified talent pool with verified skills and certifications</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Reduced recruitment costs and onboarding time</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Ability to influence training content to ensure job-readiness</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Opportunity to observe potential hires through projects and internships before making hiring decisions</span>
                    </li>
                  </ul>
                </div>

                {/* For Educational Partners */}
                <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 border border-amber-200/30 dark:border-amber-700/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-amber-600 text-white rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">For Educational Partners</h4>
                  </div>
                  <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Enhanced value proposition demonstrating concrete employment outcomes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Stronger industry connections informing curriculum relevance</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Graduate placement success metrics for institutional marketing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Continuous feedback loop for program improvement based on employment outcomes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Our Commitment to Quality */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerChildren}
        className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-800/50"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Our Commitment to Quality
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                         <motion.div variants={fadeInUp} className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
               <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                 <Shield className="w-6 h-6" />
               </div>
               <p className="text-sm text-slate-600 dark:text-slate-300">Excellence as our foundation in all educational content</p>
             </motion.div>

             <motion.div variants={fadeInUp} className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
               <div className="w-12 h-12 bg-emerald-600 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                 <TrendingUp className="w-6 h-6" />
               </div>
               <p className="text-sm text-slate-600 dark:text-slate-300">Cutting-edge, industry-aligned curriculum that evolves with market demands</p>
             </motion.div>

             <motion.div variants={fadeInUp} className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
               <div className="w-12 h-12 bg-purple-600 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                 <Star className="w-6 h-6" />
               </div>
               <p className="text-sm text-slate-600 dark:text-slate-300">Subject matter experts ensuring engaging and effective learning materials</p>
             </motion.div>

             <motion.div variants={fadeInUp} className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
               <div className="w-12 h-12 bg-amber-600 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                 <Award className="w-6 h-6" />
               </div>
               <p className="text-sm text-slate-600 dark:text-slate-300">Rigorous quality standards providing reliable educational experiences</p>
             </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Join Our Ecosystem of Growth */}
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
              Join Our Ecosystem of Growth
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                         <motion.div variants={fadeInUp} className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50 hover:scale-105 transition-all duration-300">
               <div className="w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center mx-auto mb-6">
                 <Heart className="w-7 h-7" />
               </div>
               <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Personalized pathways for individual learners at every life stage</p>
             </motion.div>

             <motion.div variants={fadeInUp} className="text-center p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50 hover:scale-105 transition-all duration-300">
               <div className="w-14 h-14 bg-emerald-600 text-white rounded-xl flex items-center justify-center mx-auto mb-6">
                 <Briefcase className="w-7 h-7" />
               </div>
               <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Transformative workforce solutions for corporate partners</p>
             </motion.div>

             <motion.div variants={fadeInUp} className="text-center p-8 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-200/50 dark:border-purple-700/50 hover:scale-105 transition-all duration-300">
               <div className="w-14 h-14 bg-purple-600 text-white rounded-xl flex items-center justify-center mx-auto mb-6">
                 <BookOpen className="w-7 h-7" />
               </div>
               <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Curriculum enhancement opportunities for educational institutions</p>
             </motion.div>

             <motion.div variants={fadeInUp} className="text-center p-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200/50 dark:border-amber-700/50 hover:scale-105 transition-all duration-300">
               <div className="w-14 h-14 bg-amber-600 text-white rounded-xl flex items-center justify-center mx-auto mb-6">
                 <Globe className="w-7 h-7" />
               </div>
               <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Collaborative journey toward unlocking human potential worldwide</p>
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
        className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          Join the MEDH Community Today
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-4xl mx-auto">
          At MEDH, we don't just offer courses—we build futures. Start your journey with us 
          <br />
          and discover what's possible when quality education meets real-world opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
            <button
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
              onClick={() => router.push('/contact-us')}
            >
              Contact Us
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
