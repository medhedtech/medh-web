"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Star,
  BookOpen,
  BarChart3,
  Users,
  GraduationCap,
  DollarSign,
  Zap,
  Target,
  Sparkles,
  Monitor,
  TrendingUp
} from "lucide-react";
import medhLogo from "@/assets/images/logo/medh.png";
interface IAdvantage {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  gradientFrom: string;
  gradientTo: string;
}

interface IAdditionalBenefit {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const advantagesData: IAdvantage[] = [
  {
    id: 1,
    icon: BookOpen,
    title: "Diversification of Skill Sets",
    description:
      "Introducing skill development program allows to diversify the skill sets of the students. This diversification prepares students for a rapidly evolving job market and equips them with a broader range of competencies.",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    gradientFrom: "from-blue-600",
    gradientTo: "to-indigo-600"
  },
  {
    id: 2,
    icon: BarChart3,
    title: "Data-Driven Insights for Educators",
    description:
      "We provide data analytics and insights to educators, enabling them to track students' progress, identify areas for improvement, and personalize instruction based on individual learning patterns.",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    gradientFrom: "from-emerald-600",
    gradientTo: "to-teal-600"
  },
  {
    id: 3,
    icon: Users,
    title: "Access to Specialized Expertise",
    description:
      "Our subject matter experts design and deliver specialized courses: Collaboration will allow to tap into this expertise, ensuring students receive high-quality education tailored to specific skills and industries.",
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-100 dark:bg-violet-900/30",
    gradientFrom: "from-violet-600",
    gradientTo: "to-purple-600"
  },
  {
    id: 4,
    icon: GraduationCap,
    title: "Empowerment of Teachers",
    description:
      "Skill development collaboration empowers teachers by providing them with training and resources to implement modern teaching methodologies: This boosts their confidence and teaching abilities, ultimately benefiting the students.",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    gradientFrom: "from-amber-600",
    gradientTo: "to-orange-600"
  },
  {
    id: 5,
    icon: DollarSign,
    title: "Cost-Effective Solutions",
    description:
      "Collaborating will provide cost-effective alternatives compared to developing in-house skill development courses and offer a broader range of skill development opportunities without straining the budgets.",
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-100 dark:bg-rose-900/30",
    gradientFrom: "from-rose-600",
    gradientTo: "to-pink-600"
  },
  {
    id: 6,
    icon: Zap,
    title: "Scalability and Flexibility",
    description:
      "Solutions are scalable, making it easier to accommodate a larger number of students without compromising the quality of education: Additionally, these courses can be tailored to suit various academic schedules.",
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    gradientFrom: "from-cyan-600",
    gradientTo: "to-sky-600"
  },
  {
    id: 7,
    icon: Target,
    title: "Preparation for Future Careers",
    description:
      "Prepare students for future careers by aligning the curriculum with industry demands. This ensures that students are equipped with the necessary skills and knowledge required to excel in their chosen professions.",
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    gradientFrom: "from-indigo-600",
    gradientTo: "to-blue-600"
  },
  {
    id: 8,
    icon: Sparkles,
    title: "Making Students Future-ready",
    description:
      "Collaboration empowers with modern, cost- effective, and engaging skill development solutions, enhancing student learning, diversifying skill sets, and preparing them for the future job market.",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    gradientFrom: "from-green-600",
    gradientTo: "to-emerald-600"
  },
  {
    id: 9,
    icon: Monitor,
    title: "Integration of Technology",
    description:
      "Collaborate to integrate our state-of-the-art tools, platforms, and applications into their teaching methods, enhancing students' digital literacy and technological proficiency.",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    gradientFrom: "from-purple-600",
    gradientTo: "to-violet-600"
  },
];

const advantagesPotentialData: IAdditionalBenefit[] = [
  {
    id: 1,
    icon: TrendingUp,
    title: "Increased Student Engagement and Motivation",
    description:
      "Gamified learning, interactive quizzes, and real-time progress tracking make the learning process more enjoyable and encourage active participation and motivation.",
  },
  {
    id: 2,
    icon: BookOpen,
    title: "Enhanced Curriculum and Learning Experience",
    description:
      "Enrich the existing curriculum by integrating cutting-edge technologies and innovative teaching methods to make learning more engaging, interactive, and effective for students.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const KeyAdvantages: React.FC = () => {
  const [hoveredAdvantage, setHoveredAdvantage] = useState<number | null>(null);

  return (
    <section className="bg-slate-50 dark:bg-slate-900 min-h-screen overflow-hidden w-full">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-violet-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-violet-950/20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-40 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-violet-200/20 dark:bg-violet-800/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-28 h-28 sm:w-36 sm:h-36 bg-emerald-200/20 dark:bg-emerald-800/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {/* Header Section */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-4 sm:p-6 md:p-8 shadow-sm shadow-slate-200/50 dark:shadow-slate-800/50 mb-6 md:mb-8 text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-4 md:mb-6 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              Collaborate with{" "}
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-slate-600 dark:text-slate-400">
                  with
                </span>
                <Image
                  src={medhLogo}
                  alt="MEDH Logo"
                  width={80}
                  height={28}
                  className="h-6 sm:h-7 md:h-8 lg:h-9 w-auto object-contain ml-1 transition-transform duration-300 hover:scale-105"
                  priority
                />
              </div>
              and Empower your Students
              <span className="block text-[#3bac63] mt-2">with cutting-edge skills.</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Equip your students for the future: upskill for confidence,
              job-readiness, and success. Let's work together to bring innovative
              and effective education solutions to your institution.
            </p>
          </motion.div>

          {/* Key Advantages Title */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-600 p-3 sm:p-4 md:p-6 shadow-sm shadow-slate-200/50 dark:shadow-slate-800/50 mb-6 md:mb-8 text-center"
          >
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Key advantages to Schools/Institutes
            </h3>
          </motion.div>

          {/* Main Advantages Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8"
          >
            {advantagesData.map((advantage, index) => (
              <motion.div
                key={advantage.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => setHoveredAdvantage(index)}
                onHoverEnd={() => setHoveredAdvantage(null)}
                className="relative"
              >
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-lg sm:rounded-xl md:rounded-2xl border border-white/50 dark:border-slate-600/50 p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl shadow-slate-200/20 dark:shadow-slate-900/30 transition-all duration-300 h-full">
                  <div className="flex flex-col items-center text-center">
                    <motion.div
                      animate={{
                        scale: hoveredAdvantage === index ? 1.1 : 1,
                        rotate: hoveredAdvantage === index ? 5 : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className={`w-16 h-16 sm:w-20 sm:h-20 ${advantage.bgColor} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-sm relative overflow-hidden`}
                    >
                      {/* Background glow effect */}
                      <motion.div
                        animate={{
                          opacity: hoveredAdvantage === index ? 0.6 : 0,
                          scale: hoveredAdvantage === index ? 1.2 : 1
                        }}
                        transition={{ duration: 0.3 }}
                        className={`absolute inset-0 bg-gradient-to-br ${advantage.gradientFrom} ${advantage.gradientTo} opacity-0 blur-md`}
                      />
                      <advantage.icon 
                        className={`w-8 h-8 sm:w-10 sm:h-10 ${advantage.color} relative z-10 transition-all duration-300`}
                      />
                    </motion.div>
                    
                    <h4 className={`text-lg sm:text-xl font-bold mb-2 md:mb-3 bg-gradient-to-r ${advantage.gradientFrom} ${advantage.gradientTo} bg-clip-text text-transparent`}>
                      {advantage.title}
                    </h4>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      {advantage.description}
                    </p>
                  </div>
                  
                  {/* Hover effect indicator */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: hoveredAdvantage === index ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`absolute top-2 right-2 w-8 h-8 bg-gradient-to-br ${advantage.gradientFrom} ${advantage.gradientTo} rounded-full flex items-center justify-center`}
                  >
                    <Star className="w-4 h-4 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Additional Benefits Section */}
          <motion.div 
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-4 md:gap-6"
          >
            {advantagesPotentialData.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-lg sm:rounded-xl md:rounded-2xl border border-white/50 dark:border-slate-600/50 p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl shadow-slate-200/20 dark:shadow-slate-900/30 transition-all duration-300"
              >
                <div className="flex items-start space-x-4 sm:space-x-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md flex-shrink-0 flex items-center justify-center">
                    <item.icon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 md:mb-3">
                      {item.title}
                    </h4>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default KeyAdvantages;
