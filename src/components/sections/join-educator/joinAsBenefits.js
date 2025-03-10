"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  Globe, Award, Clock, Brain, Users, 
  Laptop, GraduationCap, BarChart, Sparkles 
} from "lucide-react";

const benefitsData = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Impactful Work",
    description: "Make a significant impact on students worldwide, transcending geographical boundaries.",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Leveraging Technology",
    description:
      "Join us to leverage advanced technologies for an enhanced learning experience. Stay at the forefront of educational innovation, with interactive content, AI-driven adaptive learning, and personalized teaching.",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Flexibility & Remote Work",
    description:
      "We offer flexible work arrangements, including the option to work remotely. This can provide you with a better work-life balance and the freedom to manage your schedule.",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Diverse Audience and Subjects",
    description:
      "We cater to a wide range of subjects and learners of all ages. This diversity allows you to teach a subject you are passionate about and connect with learners from various cultural backgrounds.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Continuous Learning and Growth",
    description:
      "Working in EdTech exposes you to a dynamic and evolving industry. You'll have opportunities for professional development, training, and gaining new skills to improve your teaching abilities.",
  },
  {
    icon: <Laptop className="w-6 h-6" />,
    title: "Global Reach",
    description:
      "As part of Medh EdTech, you can reach students from different parts of the world, creating a truly global classroom. This international exposure can broaden your perspective and enrich your teaching methods.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Community and Collaboration",
    description:
      "We foster a supportive community of educators. Collaborating with like-minded professionals can be inspiring, and you can share ideas and best practices with colleagues from diverse backgrounds.",
  },
  {
    icon: <BarChart className="w-6 h-6" />,
    title: "Data-Driven Insights",
    description:
      "We use data analytics to track student progress and performance. This data-driven approach can help you identify individual learning needs and tailor your teaching to optimize learning outcomes.",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Innovation and Creativity",
    description:
      "We encourage creativity in teaching. You can experiment with different teaching strategies, create interactive content, and use multimedia to make learning engaging and enjoyable.",
  },
];

// Earning Potential Data
const earningPotentialData = [
  {
    title: "Excellent Earning Potential",
    description:
      "Depending on your expertise, you will have the opportunity to earn a very good income as well as incentives to recognize and appreciate your contributions to the growth of our educational community.",
  },
  {
    title: "Job Stability and Growth",
    description:
      "With the increasing adoption of remote learning, joining us offers job stability and potential career growth with access to a wide range of professional development opportunities, workshops, and training sessions.",
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
    <section className="relative py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          {/* Adjusted header padding */}
          <motion.div variants={itemVariants} className="text-center mb-16 px-4 md:px-0">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Why Join Medh as an Educator?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover the advantages of being part of our innovative teaching platform
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefitsData.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
              >
                <div className="relative bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                      {benefit.icon}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary-600 transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;
