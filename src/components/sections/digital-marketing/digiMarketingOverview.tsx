'use client';

import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  BarChart2, LineChart, Users, TrendingUp, Lightbulb, Award, ClipboardList, MessageSquare, UserCheck, Code, Globe, Zap, Layers, BookOpen, Clock, Activity, UserPlus, Heart, Brain, Briefcase
} from 'lucide-react';
import { getEnhancedSemanticColor } from '@/utils/designSystem';

/**
 * Interface for a feature card (overview, course features, benefits)
 */
interface IFeatureCard {
  title: string;
  description: string;
  Icon: React.ElementType;
}

/**
 * Interface for industry data for the doughnut chart
 */
interface IIndustryData {
  name: string;
  value: number;
  color: string;
  keyApplications: string;
}

/**
 * Interface for career stats
 */
interface ICareerStat {
  label: string;
  value: string;
  description: string;
  colorClass: string;
}

const featureIcons: { [key: string]: React.ReactNode } = {
  "Age-Appropriate Content": <Lightbulb className="w-8 h-8 text-primaryColor" />, 
  "Interactive Learning": <BookOpen className="w-8 h-8 text-primaryColor" />, 
  "Expert Instructors": <Users className="w-8 h-8 text-primaryColor" />, 
  "Enhanced Confidence": <Heart className="w-8 h-8 text-primaryColor" />, 
  "Improved Communication Skills": <Brain className="w-8 h-8 text-primaryColor" />, 
  "Leadership Development": <Briefcase className="w-8 h-8 text-primaryColor" />
};

const personalityFeatures = [
  {
    title: "Age-Appropriate Content",
    data: [
      { label: "What it means", content: "Tailored for every life stage, from preschool to professionals." },
      { label: "How it helps", content: "Ensures relevant and effective training for all ages." }
    ]
  },
  {
    title: "Interactive Learning",
    data: [
      { label: "Format", content: "Engaging online sessions, hands-on activities, role-plays, and practical assessments." },
      { label: "Benefit", content: "Makes learning enjoyable and effective." }
    ]
  },
  {
    title: "Expert Instructors",
    data: [
      { label: "Who", content: "Experienced educators deliver multimedia-rich content." },
      { label: "Why", content: "Keeps learners motivated and maximizes value." }
    ]
  },
  {
    title: "Enhanced Confidence",
    data: [
      { label: "Focus", content: "Build self-assurance to tackle life's challenges." },
      { label: "Method", content: "Proven techniques eliminate self-doubt and foster authentic confidence." }
    ]
  },
  {
    title: "Improved Communication Skills",
    data: [
      { label: "Skills", content: "Articulate thoughts clearly, develop active listening, public speaking, and interpersonal communication." }
    ]
  },
  {
    title: "Leadership Development",
    data: [
      { label: "Goal", content: "Cultivate leadership qualities, discover your style, and learn to inspire and motivate others." }
    ]
  }
];

// Add prop types for Section
interface SectionProps {
  title: string;
  data: { label: string; content: string }[];
}

const Section = memo(({ title, data }: SectionProps) => {
  const icon = featureIcons[title] || <Lightbulb className="w-8 h-8 text-primaryColor" />;
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mt-6 md:mt-8"
    >
      <div className="group relative flex flex-col h-[320px] md:h-[340px] lg:h-[360px] xl:h-[380px] w-full max-w-full mx-auto rounded-lg md:rounded-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/60 dark:hover:border-gray-600/60 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl hover:shadow-gray-200/25 dark:hover:shadow-gray-800/25 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.01] cursor-pointer transform-gpu will-change-transform">
        {/* Header Section */}
        <div className="relative h-[110px] md:h-[130px] flex flex-col justify-center items-center bg-gradient-to-br from-primaryColor/10 to-transparent dark:from-primaryColor/20 dark:to-transparent/0 border-b border-gray-200 dark:border-gray-700">
          <div className="mb-2 md:mb-3 bg-white dark:bg-gray-900 p-2 md:p-3 rounded-full shadow-md group-hover:shadow-lg transition-all duration-300">
            {icon}
          </div>
          <h2 className="text-base md:text-lg lg:text-xl font-bold tracking-wide text-primaryColor dark:text-gray-50 text-center px-2">
            {title}
          </h2>
        </div>
        {/* Content Section */}
        <div className="flex flex-col flex-grow p-3 md:p-4 lg:p-4 space-y-2 md:space-y-2.5 overflow-y-auto">
          <div className="flex flex-col space-y-1">
            {data.map((item: { label: string; content: string }, index: number) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="py-1.5 md:py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-md border-l-2 border-transparent hover:border-primaryColor dark:hover:border-primaryColor"
              >
                <div className="flex flex-col">
                  <strong className="text-xs md:text-sm font-bold tracking-wide text-primaryColor dark:text-blue-400 mb-1">
                    {item.label}:
                  </strong>
                  <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{item.content}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
});
Section.displayName = "Section";

const overviewFeatures: IFeatureCard[] = [
  {
    title: 'Marketing Meets Measurement',
    description: 'Unlock the synergy of digital marketing and analytics. Drive smarter campaigns and measurable results with integrated skills.',
    Icon: BarChart2,
  },
  {
    title: 'Impact Across Every Channel',
    description: 'Apply your knowledge in real businesses—e-commerce, startups, agencies, and global brands. Every lesson is hands-on and job-focused.',
    Icon: Globe,
  },
  {
    title: 'Unified Digital Skillset',
    description: 'Master the full journey: campaign strategy, creative, and analytics dashboards. Everything you need, all in one course.',
    Icon: Layers,
  },
  {
    title: 'Learn Fast, Apply Faster',
    description: 'Cut the fluff—get only the most relevant, up-to-date skills. Learn efficiently and get job-ready faster.',
    Icon: Zap,
  },
  {
    title: 'Creative + Analytical Advantage',
    description: 'Combine creativity, analytics, and business sense. Become the versatile “unicorn” every marketing team needs.',
    Icon: Lightbulb,
  },
];

const courseFeatures: IFeatureCard[] = [
  {
    title: 'Industry-Driven Curriculum',
    description: 'Stay ahead with content shaped by top marketing professionals and real-world trends.',
    Icon: Award,
  },
  {
    title: 'Real Campaign Experience',
    description: 'Work on live digital marketing projects and real datasets to build practical expertise.',
    Icon: ClipboardList,
  },
  {
    title: 'Collaborative Learning',
    description: 'Engage with a vibrant community of learners, mentors, and industry experts.',
    Icon: MessageSquare,
  },
  {
    title: 'Career Launchpad',
    description: 'Access personalized career guidance, resume reviews, and interview preparation.',
    Icon: UserCheck,
  },
  {
    title: 'Modern Marketing Stack',
    description: 'Master the latest tools—Google Analytics, Meta Ads, Data Studio, and more.',
    Icon: Code,
  },
];

const benefits: IFeatureCard[] = [
  {
    title: 'End-to-End Digital Mastery',
    description: 'Build expertise across the full digital marketing spectrum—from SEO to paid ads to analytics.',
    Icon: BookOpen,
  },
  {
    title: 'Learn On Your Schedule',
    description: 'Access bite-sized lessons and projects anytime, anywhere—perfect for busy professionals.',
    Icon: Clock,
  },
  {
    title: 'Portfolio-Ready Projects',
    description: 'Complete real-world marketing challenges and showcase your results to employers.',
    Icon: Activity,
  },
  {
    title: 'Expert Mentorship',
    description: 'Get actionable feedback and guidance from marketing veterans and campaign specialists.',
    Icon: UserPlus,
  },
  {
    title: 'Accelerated Career Pathways',
    description: 'Unlock new roles, promotions, and freelance opportunities in the digital economy.',
    Icon: TrendingUp,
  },
  {
    title: 'Community Connections',
    description: 'Grow your network with peers, alumni, and industry insiders through events and forums.',
    Icon: Users,
  },
];

// Updated industry data for U.S. Digital-Ad Spend
const industryData: IIndustryData[] = [
  {
    name: 'Retail & E-commerce',
    value: 48.1,
    color: getEnhancedSemanticColor('courses', 'light'),
    keyApplications: 'Omnichannel personalization & recommendation engines; Loyalty-program analytics & customer segmentation',
  },
  {
    name: 'Consumer Packaged Goods',
    value: 19.0,
    color: getEnhancedSemanticColor('pricing', 'light'),
    keyApplications: 'Targeted social-media campaigns & influencer ROI analytics; Demand-forecasting & price-optimization models',
  },
  {
    name: 'Financial Services',
    value: 13.9,
    color: getEnhancedSemanticColor('certification', 'light'),
    keyApplications: 'Customer-journey analytics & propensity scoring; Real-time offer engines & fraud-detection dashboards',
  },
  {
    name: 'Computing Products & Electronics',
    value: 10.1,
    color: getEnhancedSemanticColor('support', 'light'),
    keyApplications: 'Product-launch targeting & usage-based segmentation; In-app behavior analytics & lifecycle marketing',
  },
  {
    name: 'Healthcare & Pharma',
    value: 8.9,
    color: getEnhancedSemanticColor('enrollment', 'light'),
    keyApplications: 'Patient-engagement campaigns & outcome analysis; Marketing-ROI tracking & channel-mix optimization',
  },
];

const careerStats: ICareerStat[] = [
  { label: 'Growth Rate', value: '11%', description: 'Annual growth in digital marketing sector', colorClass: 'text-blue-600 dark:text-blue-400' },
  { label: 'Open Analytics Jobs', value: '100K+', description: 'Digital marketing & analytics jobs globally', colorClass: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'Global Digital-Ad Spend', value: '$790B', description: 'Expected global digital ad spend by 2025', colorClass: 'text-amber-600 dark:text-amber-400' },
  { label: 'Skills Gap', value: '64–87%', description: 'Companies reporting digital skills shortage (varies by study)', colorClass: 'text-violet-600 dark:text-violet-400' },
];

const accentColors = [
  { border: 'border-blue-500', bg: 'from-blue-50/80 to-white/90 dark:from-blue-900/40 dark:to-gray-900/80', icon: 'text-blue-500' },
  { border: 'border-emerald-500', bg: 'from-emerald-50/80 to-white/90 dark:from-emerald-900/40 dark:to-gray-900/80', icon: 'text-emerald-500' },
  { border: 'border-amber-500', bg: 'from-amber-50/80 to-white/90 dark:from-amber-900/40 dark:to-gray-900/80', icon: 'text-amber-500' },
  { border: 'border-violet-500', bg: 'from-violet-50/80 to-white/90 dark:from-violet-900/40 dark:to-gray-900/80', icon: 'text-violet-500' },
  { border: 'border-pink-500', bg: 'from-pink-50/80 to-white/90 dark:from-pink-900/40 dark:to-gray-900/80', icon: 'text-pink-500' },
  { border: 'border-indigo-500', bg: 'from-indigo-50/80 to-white/90 dark:from-indigo-900/40 dark:to-gray-900/80', icon: 'text-indigo-500' }
];

const TABS = [
  { id: 0, label: 'Overview' },
  { id: 1, label: 'Course Features' },
  { id: 2, label: 'Benefits' },
];

const TAB_CONTENT = [
  // Overview
  (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full px-6 md:px-16">
      {overviewFeatures.map((item, idx) => {
        const accent = accentColors[idx % accentColors.length];
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08, duration: 0.5, type: 'spring' }}
            className={`relative bg-gradient-to-br ${accent.bg} ${accent.border} border-l-4 shadow-lg rounded-xl p-6 flex flex-col items-start text-left transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl`}
          >
            <div className="flex items-center mb-2">
              <motion.div
                whileHover={{ scale: 1.15, rotate: -8 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="mr-2"
              >
                <item.Icon className={`w-6 h-6 ${accent.icon}`} />
              </motion.div>
              <span className="font-bold text-lg text-primaryColor">{item.title}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-200 text-base">
              {item.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  ),
  // Course Features
  (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full px-6 md:px-16">
      {courseFeatures.map((item, idx) => {
        const accent = accentColors[(idx + 2) % accentColors.length];
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08, duration: 0.5, type: 'spring' }}
            className={`relative bg-gradient-to-br ${accent.bg} ${accent.border} border-l-4 shadow-lg rounded-xl p-6 flex flex-col items-start text-left transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl`}
          >
            <div className="flex items-center mb-2">
              <motion.div
                whileHover={{ scale: 1.15, rotate: -8 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="mr-2"
              >
                <item.Icon className={`w-6 h-6 ${accent.icon}`} />
              </motion.div>
              <span className="font-bold text-lg text-primaryColor">{item.title}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-200 text-base">
              {item.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  ),
  // Benefits
  (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full px-6 md:px-16">
      {benefits.map((item, idx) => {
        const accent = accentColors[(idx + 3) % accentColors.length];
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08, duration: 0.5, type: 'spring' }}
            className={`relative bg-gradient-to-br ${accent.bg} ${accent.border} border-l-4 shadow-lg rounded-xl p-6 flex flex-col items-start text-left transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl`}
          >
            <div className="flex items-center mb-2">
              <motion.div
                whileHover={{ scale: 1.15, rotate: -8 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="mr-2"
              >
                <item.Icon className={`w-6 h-6 ${accent.icon}`} />
              </motion.div>
              <span className="font-bold text-lg text-primaryColor">{item.title}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-200 text-base">
              {item.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  ),
];

/**
 * Digital Marketing Overview Section (matches AI course overview structure)
 */
export const DigiMarketingOverview: React.FC = memo(() => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-[50vh] w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/10 to-violet-500/15 dark:from-blue-500/10 dark:via-indigo-500/15 dark:to-violet-500/20 pointer-events-none" />
      <div className="relative w-full px-0 py-8 md:py-16">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-10 md:mb-14 w-full"
        >
          <h1 className="text-[clamp(1.5rem,4vw+1rem,2.5rem)] font-bold bg-clip-text text-transparent bg-gradient-to-r from-primaryColor via-purple-600 to-blue-600 mb-3 text-center">
            Why Digital Marketing with Data Analytics?
          </h1>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-medium">
            <span>
              Build the skills top employers want.
            </span>
            <span className="inline md:block">
              {' '}Master digital marketing and analytics for a future-ready career.
            </span>
          </p>
        </motion.div>

        {/* Tab Bar */}
        <div className="flex justify-center mb-8">
          <nav className="inline-flex rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-semibold text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primaryColor/50
                  ${activeTab === tab.id
                    ? 'bg-primaryColor text-white dark:bg-primaryColor dark:text-white shadow'
                    : 'bg-transparent text-primaryColor dark:text-primaryColor hover:bg-primaryColor/10 dark:hover:bg-primaryColor/20'}
                `}
                aria-selected={activeTab === tab.id}
                aria-controls={`tab-panel-${tab.id}`}
                role="tab"
                tabIndex={activeTab === tab.id ? 0 : -1}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div id={`tab-panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`}
          className="transition-all duration-300">
          {TAB_CONTENT[activeTab]}
        </div>

        {/* Top Industries Doughnut Chart */}
        <div className="mb-12 w-full pt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-primaryColor mb-4 text-center">Top Industries Hiring Digital Marketing & Analytics Professionals</h2>
          {/* Top Industries List - All left, chart right */}
          <div className="flex flex-col md:flex-row items-center gap-6 w-full justify-center mb-6">
            {/* Left side: all industries */}
            <div className="flex-1 w-full md:w-[480px] lg:w-[560px] xl:w-[640px] md:pl-16 md:pr-6">
              <table className="min-w-full text-left border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden text-xs md:text-sm">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="py-2 px-3 font-semibold text-gray-700 dark:text-gray-200">Industry</th>
                    <th className="py-2 px-3 font-semibold text-gray-700 dark:text-gray-200">Share(%)</th>
                    <th className="py-2 px-3 font-semibold text-gray-700 dark:text-gray-200">Key Applications</th>
                  </tr>
                </thead>
                <tbody>
                  {industryData.map((industry) => (
                    <tr key={industry.name} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800">
                      <td className="py-2 px-3 font-medium" style={{ color: industry.color }}>{industry.name}</td>
                      <td className="py-2 px-3 font-bold">{industry.value}%</td>
                      <td className="py-2 px-3 text-gray-600 dark:text-gray-300 text-sm">{industry.keyApplications}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Right side: Doughnut Chart */}
            <div className="w-full md:w-1/2 flex justify-center my-6 md:my-0">
              <div className="block md:hidden w-full" style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={industryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={2}
                      label={false} // Hide labels on mobile
                    >
                      {industryData.map((entry, idx) => (
                        <Cell key={`cell-m-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Mobile legend */}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3">
                  {industryData.map((entry, idx) => (
                    <div key={`legend-m-${idx}`} className="flex items-center text-xs">
                      <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                      <span className="font-medium mr-1">{entry.name}</span>
                      <span className="text-gray-500">{Math.round(entry.value)}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden md:block w-full" style={{ height: 256 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={industryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {industryData.map((entry, idx) => (
                        <Cell key={`cell-d-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          {/* Short note below the chart */}
          <div className="flex items-center justify-center mt-4 md:mt-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md px-3 py-1 text-blue-800 dark:text-blue-200 text-xs flex items-center gap-2 md:whitespace-nowrap mt-24 md:mt-0">
              <svg xmlns='http://www.w3.org/2000/svg' className='w-3 h-3 text-blue-500 dark:text-blue-300' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z' /></svg>
              <span>Each segment shows the share of digital marketing & analytics job opportunities by industry.</span>
            </div>
          </div>
        </div>

        {/* Career Prospects Section Intro (UX-optimized) */}
        <div className="w-full text-center mb-10 md:mb-14 pt-0 px-16">
          <h1 className="text-2xl md:text-3xl font-bold text-primaryColor mb-4">Unlock Limitless Opportunities in Digital Marketing & Analytics</h1>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-5 font-medium">
            Digital marketing and analytics are changing every industry. Turn data into opportunity—at any career stage.
          </p>
          {/* Industry Growth Metrics as Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6 w-full">
            {careerStats.map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-3 flex flex-col items-center justify-center">
                <div className={`text-xl md:text-2xl font-bold mb-1 ${stat.colorClass}`}>{stat.value}</div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300 text-center">{stat.description}</div>
              </div>
            ))}
          </div>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-6 font-medium">
            Your skills are needed in every field—from e-commerce to tech. Discover high-impact roles with strong growth and great salaries.
          </p>
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center bg-gradient-to-r from-primaryColor/10 to-blue-600/10 dark:from-primaryColor/20 dark:to-blue-600/20 p-5 md:p-8 rounded-xl w-full"
        >
          <h2 className="text-xl md:text-2xl font-bold text-primaryColor dark:text-gray-200 mb-3 text-center">
            Ready to Launch Your Career in Digital Marketing & Analytics?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-5 md:mb-6 max-w-2xl mx-auto text-sm md:text-base">
            Join thousands of students who have transformed their careers with our industry-leading course. The future of digital marketing and analytics is waiting for you!
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open('http://localhost:3000/enrollment/digital-marketing/?course=67c18d6b8a56e7688ddce863', '_blank')}
            className="bg-gradient-to-r from-primaryColor to-blue-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base cursor-pointer"
          >
            Enroll Now
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
});

DigiMarketingOverview.displayName = 'DigiMarketingOverview';

export default DigiMarketingOverview; 