"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Logo12 from "@/assets/images/join-as-school/logo-12.svg";
import Logo13 from "@/assets/images/join-as-school/logo-13.svg";
import Logo14 from "@/assets/images/join-as-school/logo-14.svg";
import Logo15 from "@/assets/images/join-as-school/logo-15.svg";
import Logo16 from "@/assets/images/join-as-school/logo-16.svg";
import Logo17 from "@/assets/images/join-as-school/logo-17.svg";

const educationFeature = [
  {
    id: 1,
    icon: Logo12,
    title: "Make students think on their feet",
    description:
      "In today's fast-paced world, rapid thinking and adaptability are crucial skills. Students should be equipped to handle emergencies effectively through prompt thinking and adaptability.",
  },
  {
    id: 2,
    icon: Logo13,
    title: "Inspire students to take calculated risks",
    description:
      "In today's fast-paced world, rapid thinking and adaptability are crucial skills. Students should be equipped to handle emergencies effectively through prompt thinking and adaptability.",
  },
  {
    id: 3,
    icon: Logo14,
    title: "Encourage students to be more creative",
    description:
      "Encouraging students to step beyond comfort zones fosters creativity, inspiring novel ideas and collaboration in discussing and sharing interests.",
  },
  {
    id: 4,
    icon: Logo15,
    title: "Identify specific future-ready skills in children",
    description:
      "To meet future workforce demands, education should adapt and equip students with essential skills for seamless integration. Teachers play a vital role in identifying and tailoring students' educational requirements.",
  },
  {
    id: 5,
    icon: Logo16,
    title: "Introduce a student-led learning approach",
    description:
      "To adopt an efficient student-led learning approach, schools should prioritize students, involving them in decision-making for future- ready classrooms and technology integration.",
  },
  {
    id: 6,
    icon: Logo17,
    title: "Make communication an essential part of their journey",
    description:
      "Modern education involves introducing and exploring new concepts. It's crucial to teach children effective communication for their future. Teachers should motivate clear and confident expression of thoughts and ideas.",
  },
];

const EducationalFeatureCard = () => {
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

  return (
    <section className="py-20 w-full bg-gradient-to-b from-primary-50/50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-200/20 dark:bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-200/20 dark:bg-secondary-500/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="container mx-auto px-4 relative z-10"
      >
        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {educationFeature.map((feature, index) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 dark:from-primary-500/10 dark:to-secondary-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                {/* Icon container */}
                <div className="mb-6 relative">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-xl p-3 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom decoration line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default EducationalFeatureCard;
