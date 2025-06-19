"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Star,
  Zap,
  Target,
  Lightbulb,
  Users,
  BookOpen,
  MessageCircle
} from "lucide-react";

interface IEducationFeature {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  gradientFrom: string;
  gradientTo: string;
}

const educationFeature: IEducationFeature[] = [
  {
    id: 1,
    icon: Zap,
    title: "Make students think on their feet",
    description:
      "In today's fast-paced world, rapid thinking and adaptability are crucial skills. Students should be equipped to handle emergencies effectively through prompt thinking and adaptability.",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    gradientFrom: "from-blue-600",
    gradientTo: "to-indigo-600"
  },
  {
    id: 2,
    icon: Target,
    title: "Inspire students to take calculated risks",
    description:
      "In today's fast-paced world, rapid thinking and adaptability are crucial skills. Students should be equipped to handle emergencies effectively through prompt thinking and adaptability.",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    gradientFrom: "from-emerald-600",
    gradientTo: "to-teal-600"
  },
  {
    id: 3,
    icon: Lightbulb,
    title: "Encourage students to be more creative",
    description:
      "Encouraging students to step beyond comfort zones fosters creativity, inspiring novel ideas and collaboration in discussing and sharing interests.",
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-100 dark:bg-violet-900/30",
    gradientFrom: "from-violet-600",
    gradientTo: "to-purple-600"
  },
  {
    id: 4,
    icon: Users,
    title: "Identify specific future-ready skills in children",
    description:
      "To meet future workforce demands, education should adapt and equip students with essential skills for seamless integration. Teachers play a vital role in identifying and tailoring students' educational requirements.",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    gradientFrom: "from-amber-600",
    gradientTo: "to-orange-600"
  },
  {
    id: 5,
    icon: BookOpen,
    title: "Introduce a student-led learning approach",
    description:
      "To adopt an efficient student-led learning approach, schools should prioritize students, involving them in decision-making for future- ready classrooms and technology integration.",
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-100 dark:bg-rose-900/30",
    gradientFrom: "from-rose-600",
    gradientTo: "to-pink-600"
  },
  {
    id: 6,
    icon: MessageCircle,
    title: "Make communication an essential part of their journey",
    description:
      "Modern education involves introducing and exploring new concepts. It's crucial to teach children effective communication for their future. Teachers should motivate clear and confident expression of thoughts and ideas.",
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    gradientFrom: "from-cyan-600",
    gradientTo: "to-sky-600"
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
    transition: { duration: 0.5 }
  }
};

const EducationalFeatureCard: React.FC = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

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
          {/* Grid Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {educationFeature.map((feature, index) => (
              <motion.div
                key={feature.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
                className="relative"
              >
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-lg sm:rounded-xl md:rounded-2xl border border-white/50 dark:border-slate-600/50 p-4 sm:p-5 md:p-6 lg:p-8 shadow-lg hover:shadow-xl shadow-slate-200/20 dark:shadow-slate-900/30 transition-all duration-300 h-full">
                  <div className="relative z-10">
                    {/* Icon container */}
                    <div className="mb-4 md:mb-6 relative">
                      <motion.div
                        animate={{
                          scale: hoveredFeature === index ? 1.1 : 1,
                          rotate: hoveredFeature === index ? 5 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 ${feature.bgColor} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm relative overflow-hidden`}
                      >
                        {/* Background glow effect */}
                        <motion.div
                          animate={{
                            opacity: hoveredFeature === index ? 0.6 : 0,
                            scale: hoveredFeature === index ? 1.2 : 1
                          }}
                          transition={{ duration: 0.3 }}
                          className={`absolute inset-0 bg-gradient-to-br ${feature.gradientFrom} ${feature.gradientTo} opacity-0 blur-md`}
                        />
                        <feature.icon 
                          className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 ${feature.color} relative z-10 transition-all duration-300`}
                        />
                      </motion.div>
                    </div>

                    {/* Content */}
                    <h3 className={`text-lg sm:text-xl md:text-2xl font-bold mb-3 md:mb-4 bg-gradient-to-r ${feature.gradientFrom} ${feature.gradientTo} bg-clip-text text-transparent leading-tight`}>
                      {feature.title}
                    </h3>
                    
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Bottom decoration line */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: hoveredFeature === index ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${feature.gradientFrom} ${feature.gradientTo} rounded-b-lg sm:rounded-b-xl md:rounded-b-2xl origin-left`}
                    />
                  </div>
                  
                  {/* Hover effect indicator */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: hoveredFeature === index ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`absolute top-2 right-2 w-8 h-8 bg-gradient-to-br ${feature.gradientFrom} ${feature.gradientTo} rounded-full flex items-center justify-center`}
                  >
                    <Star className="w-4 h-4 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EducationalFeatureCard;
