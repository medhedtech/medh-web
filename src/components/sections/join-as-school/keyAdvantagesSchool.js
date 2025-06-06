"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Logo1 from "@/assets/images/join-as-school/logo-1.svg";
import Logo2 from "@/assets/images/join-as-school/logo-2.svg";
import Logo3 from "@/assets/images/join-as-school/logo-3.svg";
import Logo4 from "@/assets/images/join-as-school/logo-4.svg";
import Logo5 from "@/assets/images/join-as-school/logo-5.svg";
import Logo6 from "@/assets/images/join-as-school/logo-6.svg";
import Logo7 from "@/assets/images/join-as-school/logo-7.svg";
import Logo8 from "@/assets/images/join-as-school/logo-8.svg";
import Logo9 from "@/assets/images/join-as-school/logo-9.svg";
import Logo10 from "@/assets/images/join-as-school/logo-10.svg";
import Logo11 from "@/assets/images/join-as-school/logo-11.svg";

const advantagesData = [
  {
    id: 1,
    icon: Logo1,
    title: "Diversification of Skill Sets",
    description:
      "Introducing skill development program allows to diversify the skill sets of the students. This diversification prepares students for a rapidly evolving job market and equips them with a broader range of competencies.",
  },
  {
    id: 2,
    icon: Logo2,
    title: "Data-Driven Insights for Educators",
    description:
      "We provide data analytics and insights to educators, enabling them to track students' progress, identify areas for improvement, and personalize instruction based on individual learning patterns.",
  },
  {
    id: 3,
    icon: Logo3,
    title: "Access to Specialized Expertise",
    description:
      "Our subject matter experts design and deliver specialized courses: Collaboration will allow to tap into this expertise, ensuring students receive high-quality education tailored to specific skills and industries.",
  },
  {
    id: 4,
    icon: Logo4,
    title: "Empowerment of Teachers",
    description:
      "Skill development collaboration empowers teachers by providing them with training and resources to implement modern teaching methodologies: This boosts their confidence and teaching abilities, ultimately benefiting the students.",
  },
  {
    id: 5,
    icon: Logo5,
    title: "Cost-Effective Solutions",
    description:
      "Collaborating will provide cost-effective alternatives compared to developing in-house skill development courses and offer a broader range of skill development opportunities without straining the budgets.",
  },
  {
    id: 6,
    icon: Logo6,
    title: "Scalability and Flexibility",
    description:
      "Solutions are scalable, making it easier to accommodate a larger number of students without compromising the quality of education: Additionally, these courses can be tailored to suit various academic schedules.",
  },
  {
    id: 7,
    icon: Logo7,
    title: "Preparation for Future Careers",
    description:
      "Prepare students for future careers by aligning the curriculum with industry demands. This ensures that students are equipped with the necessary skills and knowledge required to excel in their chosen professions.",
  },
  {
    id: 8,
    icon: Logo8,
    title: "Making Students Future-ready",
    description:
      "Collaboration empowers with modern, cost- effective, and engaging skill development solutions, enhancing student learning, diversifying skill sets, and preparing them for the future job market.",
  },
  {
    id: 9,
    icon: Logo9,
    title: "Integration of Technology",
    description:
      "Collaborate to integrate our state-of-the-art tools, platforms, and applications into their teaching methods, enhancing students' digital literacy and technological proficiency.",
  },
];

// Earning Potential Data
const advantagesPotentialData = [
  {
    id: 1,
    icon: Logo10,
    title: "Increased Student Engagement and Motivation",
    description:
      "Gamified learning, interactive quizzes, and real-time progress tracking make the learning process more enjoyable and encourage active participation and motivation.",
  },
  {
    id: 2,
    icon: Logo11,
    title: "Enhanced Curriculum and Learning Experience",
    description:
      "Enrich the existing curriculum by integrating cutting-edge technologies and innovative teaching methods to make learning more engaging, interactive, and effective for students.",
  },
];

const KeyAdvantages = () => {
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

  return (
    <section className="py-20 w-full bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="container mx-auto px-4 max-w-7xl"
      >
        {/* Header Section */}
        <motion.div 
          variants={itemVariants}
          className="text-center max-w-4xl mx-auto mb-16 space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            Collaborate with Medh and Empower your Students
            <span className="text-primary-600"> with cutting-edge skills.</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Equip your students for the future: upskill for confidence,
            job-readiness, and success. Let's work together to bring innovative
            and effective education solutions to your institution.
          </p>
        </motion.div>

        {/* Key Advantages Title */}
        <motion.div 
          variants={itemVariants}
          className="text-center mb-12"
        >
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
            Key advantages to Schools/Institutes
          </h3>
        </motion.div>

        {/* Main Advantages Grid */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {advantagesData.map((advantage, index) => (
            <motion.div
              key={advantage.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-xl p-3 flex items-center justify-center">
                    <Image
                      src={advantage.icon}
                      alt={advantage.title}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary-600 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                </div>
                
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {advantage.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {advantage.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Benefits Section */}
        <motion.div 
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-8"
        >
          {advantagesPotentialData.map((item, index) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="group bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-primary-100 dark:border-gray-700"
            >
              <div className="flex items-start space-x-6">
                <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-16"
        >
          <p className="text-primary-600 dark:text-primary-400 text-lg font-medium italic">
            Medh Hain Toh Mumkin Hai!
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default KeyAdvantages;
