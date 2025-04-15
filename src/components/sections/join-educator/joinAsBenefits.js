"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  Globe, Award, Clock, Brain, Users, 
  Laptop, GraduationCap, BarChart, Sparkles,
  ArrowRight, Star, Zap, CheckCircle
} from "lucide-react";

const benefitsData = [
  {
    icon: <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    title: "Global Impact",
    description: "Transform education across borders, reaching diverse students and creating lasting change worldwide.",
    gradient: "from-blue-500 to-indigo-500",
    darkGradient: "dark:from-blue-600/80 dark:to-indigo-700/80",
    hoverColor: "text-blue-600 dark:text-blue-400"
  },
  {
    icon: <Award className="w-6 h-6 text-violet-600 dark:text-violet-400" />,
    title: "Cutting-Edge EdTech",
    description: "Access AI-driven adaptive learning tools, interactive content platforms, and personalized teaching resources.",
    gradient: "from-violet-500 to-purple-500",
    darkGradient: "dark:from-violet-600/80 dark:to-purple-700/80",
    hoverColor: "text-violet-600 dark:text-violet-400"
  },
  {
    icon: <Clock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
    title: "Work-Life Autonomy",
    description: "Design your ideal schedule with flexible remote work options that prioritize your wellbeing and productivity.",
    gradient: "from-emerald-500 to-teal-500",
    darkGradient: "dark:from-emerald-600/80 dark:to-teal-700/80",
    hoverColor: "text-emerald-600 dark:text-emerald-400"
  },
  {
    icon: <Brain className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
    title: "Subject Diversity",
    description: "Teach topics you're passionate about to learners from various backgrounds, ages, and skill levels.",
    gradient: "from-amber-500 to-orange-500",
    darkGradient: "dark:from-amber-600/80 dark:to-orange-700/80",
    hoverColor: "text-amber-600 dark:text-amber-400"
  },
  {
    icon: <Users className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
    title: "Professional Growth",
    description: "Access continuous learning opportunities, specialized certifications, and advanced teaching methodologies.",
    gradient: "from-rose-500 to-pink-500",
    darkGradient: "dark:from-rose-600/80 dark:to-pink-700/80",
    hoverColor: "text-rose-600 dark:text-rose-400"
  },
  {
    icon: <Laptop className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
    title: "Borderless Classroom",
    description: "Connect with students across continents, creating truly diverse and culturally rich learning environments.",
    gradient: "from-sky-500 to-blue-500",
    darkGradient: "dark:from-sky-600/80 dark:to-blue-700/80",
    hoverColor: "text-sky-600 dark:text-sky-400"
  },
  {
    icon: <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
    title: "Educator Community",
    description: "Collaborate with innovative teaching professionals and build your network in a supportive environment.",
    gradient: "from-indigo-500 to-violet-500",
    darkGradient: "dark:from-indigo-600/80 dark:to-violet-700/80",
    hoverColor: "text-indigo-600 dark:text-indigo-400"
  },
  {
    icon: <BarChart className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
    title: "Analytics-Driven Teaching",
    description: "Leverage advanced learning analytics to personalize instruction and optimize student outcomes.",
    gradient: "from-teal-500 to-emerald-500",
    darkGradient: "dark:from-teal-600/80 dark:to-emerald-700/80",
    hoverColor: "text-teal-600 dark:text-teal-400"
  },
  {
    icon: <Sparkles className="w-6 h-6 text-fuchsia-600 dark:text-fuchsia-400" />,
    title: "Creative Freedom",
    description: "Experiment with innovative teaching approaches, multimedia content, and engaging learning experiences.",
    gradient: "from-fuchsia-500 to-violet-500",
    darkGradient: "dark:from-fuchsia-600/80 dark:to-violet-700/80",
    hoverColor: "text-fuchsia-600 dark:text-fuchsia-400"
  },
];

// Earning Potential Data
const earningPotentialData = [
  {
    icon: <Star className="w-6 h-6 text-yellow-500 dark:text-yellow-300" fill="currentColor" />,
    title: "Exceptional Compensation",
    description: "Enjoy competitive pay rates with performance-based incentives that recognize your unique expertise and teaching excellence.",
    gradient: "from-yellow-500 to-amber-500",
    darkGradient: "dark:from-yellow-600/80 dark:to-amber-700/80",
    hoverColor: "text-yellow-600 dark:text-yellow-400",
    points: [
      "Industry-leading base rates for qualified educators",
      "Performance bonuses tied to student success metrics",
      "Special incentives for developing original curriculum"
    ]
  },
  {
    icon: <Zap className="w-6 h-6 text-lime-600 dark:text-lime-400" />,
    title: "Career Advancement",
    description: "Build long-term growth with access to leadership opportunities, specialized certifications, and professional development resources.",
    gradient: "from-lime-500 to-green-500",
    darkGradient: "dark:from-lime-600/80 dark:to-green-700/80",
    hoverColor: "text-lime-600 dark:text-lime-400",
    points: [
      "Pathways to leadership and specialized teaching roles",
      "Fully-funded professional certification programs",
      "Mentorship from education industry leaders"
    ]
  },
];

const Benefits = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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

  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-gray-900 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-40 right-10 w-80 h-80 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 left-1/4 w-72 h-72 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-10 w-72 h-72 bg-purple-500/10 dark:bg-violet-600/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50/80 dark:bg-blue-900/40 backdrop-blur-sm rounded-full mb-6 border border-blue-100 dark:border-blue-800/40 shadow-sm">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Career Opportunities</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6 leading-tight tracking-tight">
              Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">passionate educators</span> thrive at Medh
            </h2>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
              Join our innovative platform where your teaching expertise is valued, your creativity is encouraged, and your professional growth is prioritized.
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {benefitsData.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="relative h-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/80 dark:border-slate-700/80 overflow-hidden">
                  <div className={`absolute -right-20 -top-20 w-40 h-40 rounded-full bg-gradient-to-br ${benefit.gradient} ${benefit.darkGradient} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.gradient} ${benefit.darkGradient} p-0.5 transform group-hover:scale-110 transition-transform duration-300 mb-6 shadow-md`}>
                      <div className="w-full h-full rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center">
                        {benefit.icon}
                      </div>
                    </div>
                    
                    <h3 className={`text-xl font-bold text-slate-800 dark:text-white mb-3 group-hover:${benefit.hoverColor} transition-colors duration-300`}>
                      {benefit.title}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                  
                  {/* Decorative line */}
                  <div className={`absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r ${benefit.gradient} ${benefit.darkGradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-xl opacity-80`} />
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Earning Potential Section */}
          <motion.div variants={itemVariants} className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-amber-50/80 dark:bg-amber-900/40 backdrop-blur-sm rounded-full mb-6 border border-amber-100 dark:border-amber-800/40 shadow-sm">
                <Star className="w-4 h-4 text-amber-600 dark:text-amber-400 mr-2" fill="currentColor" />
                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Growth & Rewards</span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
                Rewarding <span className="text-gradient-reward relative z-10 text-yellow-600 dark:text-yellow-400">Career Growth</span> Opportunities
              </h3>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Beyond the fulfillment of teaching, Medh offers competitive compensation and clear advancement paths that recognize your expertise and dedication
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {earningPotentialData.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <div className="relative bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/80 dark:border-slate-700/80 overflow-hidden">
                    <div className={`absolute -right-20 -bottom-20 w-40 h-40 rounded-full bg-gradient-to-br ${item.gradient} ${item.darkGradient} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500`} />
                    
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} ${item.darkGradient} p-0.5 transform group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                        <div className="w-full h-full rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center">
                          {item.icon}
                        </div>
                      </div>
                      
                      <div className="flex-grow">
                        <h4 className={`text-2xl font-bold text-slate-800 dark:text-white mb-3 group-hover:${item.hoverColor} transition-colors duration-300`}>
                          {item.title}
                        </h4>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                          {item.description}
                        </p>
                        
                        {/* Key Points */}
                        <ul className="space-y-2">
                          {item.points.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className={`flex-shrink-0 w-5 h-5 rounded-full ${item.hoverColor} flex items-center justify-center mt-0.5`}>
                                <CheckCircle className="w-4 h-4" />
                              </div>
                              <span className="text-slate-700 dark:text-slate-300">
                                {point}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${item.gradient} ${item.darkGradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-xl opacity-80`} />
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Testimonial
            <motion.div 
              variants={itemVariants} 
              className="mt-10 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/10 rounded-2xl p-8 border border-amber-100/50 dark:border-amber-800/30 shadow-lg"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 dark:from-yellow-400 dark:to-amber-400 p-0.5 mb-4">
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <p className="text-xl italic text-slate-700 dark:text-slate-200 leading-relaxed mb-4">
                  "Joining Medh has transformed my teaching career. The professional development opportunities and competitive compensation have allowed me to grow in ways I never imagined."
                </p>
              </div>
            </motion.div> */}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;
