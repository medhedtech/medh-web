"use client";

import React, { useState, useCallback, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calculator, 
  Star, 
  GraduationCap, 
  BookOpen, 
  ArrowUp, 
  CheckCircle2, 
  Brain, 
  Sparkles, 
  Hourglass, 
  Shapes, 
  LucideCalculator, 
  Zap,
  Trophy
} from "lucide-react";
import Link from "next/link";

// Reusable components for better organization
const ListItem = ({ feature, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3, delay: 0.1 * index }}
    className="flex items-start space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-4 rounded-lg border border-blue-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-all"
  >
    <div className="flex-shrink-0 mt-1">
      {feature.icon}
    </div>
    <div>
      <h3 className="font-semibold text-[1rem] text-gray-800 dark:text-white mb-1">
        {feature.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        {feature.description}
      </p>
    </div>
  </motion.div>
);

const FeatureCard = ({ feature, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.1 * index }}
    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700"
  >
    <div className="p-5">
      <div className="flex items-center mb-3">
        <div className="p-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 mr-3">
          {feature.icon}
        </div>
        <h3 className="font-bold text-[1rem] text-gray-800 dark:text-white">
          {feature.title}
        </h3>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        {feature.description}
      </p>
    </div>
  </motion.div>
);

const BenefitCard = ({ feature, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.05 * index }}
    className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
  >
    <div className="flex-shrink-0 p-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600">
      {feature.icon}
    </div>
    <div>
      <h3 className="font-semibold text-[1rem] text-gray-800 dark:text-white mb-1">
        {feature.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        {feature.description}
      </p>
    </div>
  </motion.div>
);

const CareerCard = ({ title, description, growth, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700"
  >
    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/30 dark:to-purple-900/30 p-4 flex justify-between items-center">
      <h3 className="font-bold text-lg text-gray-800 dark:text-white">
        {title}
      </h3>
      <div className="flex items-center">
        <div className="text-green-500 font-semibold mr-1">{growth}</div>
        <div className="text-gray-500 dark:text-gray-400 text-xs">Growth</div>
      </div>
    </div>
    <div className="p-5">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>
    </div>
  </motion.div>
);

const data = {
  tabs: [
    {
      id: 1,
      name: "Overview",
      content: (
        <React.Fragment>
          {/* Benefits/Value Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full px-4 md:px-16 mb-10">
            {[
              {
                title: "Simplifies Complex Calculations",
                description: "Unique techniques make even the toughest math problems easy to solve, boosting your confidence and enjoyment of mathematics.",
                icon: <Calculator className="w-6 h-6 text-blue-500" />,
                accent: "border-blue-500 from-blue-50/80 to-white/90 dark:from-blue-900/40 dark:to-gray-900/80 text-blue-500"
              },
              {
                title: "Enhances Mental Agility",
                description: "Sharpens your mind, improves your ability to think quickly and accurately, and helps you overcome math anxiety.",
                icon: <Brain className="w-6 h-6 text-green-500" />,
                accent: "border-emerald-500 from-emerald-50/80 to-white/90 dark:from-emerald-900/40 dark:to-gray-900/80 text-emerald-500"
              },
              {
                title: "Versatile Across Branches",
                description: "Applicable to arithmetic, algebra, trigonometry, calculus, and more—making math useful in every field.",
                icon: <Shapes className="w-6 h-6 text-purple-500" />,
                accent: "border-violet-500 from-violet-50/80 to-white/90 dark:from-violet-900/40 dark:to-gray-900/80 text-violet-500"
              },
              {
                title: "Essential for Exam Preparation",
                description: "A valuable tool for students preparing for competitive exams, helping you solve problems faster and more accurately.",
                icon: <Trophy className="w-6 h-6 text-amber-500" />,
                accent: "border-amber-500 from-amber-50/80 to-white/90 dark:from-amber-900/40 dark:to-gray-900/80 text-amber-500"
              },
              {
                title: "Transforms Math Perception",
                description: "Changes the way you see and engage with mathematics, making it enjoyable and accessible for everyone.",
                icon: <Sparkles className="w-6 h-6 text-pink-500" />,
                accent: "border-indigo-500 from-indigo-50/80 to-white/90 dark:from-indigo-900/40 dark:to-gray-900/80 text-indigo-500"
              },
              {
                title: "Promotes Personal & Professional Growth",
                description: "Develops skills that benefit you in academics, your career, and daily life, supporting lifelong learning and success.",
                icon: <ArrowUp className="w-6 h-6 text-cyan-500" />,
                accent: "border-blue-500 from-blue-50/80 to-white/90 dark:from-blue-900/40 dark:to-gray-900/80 text-blue-500"
              },
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5, type: 'spring' }}
                className={`relative bg-gradient-to-br ${feature.accent.split(' ').slice(1).join(' ')} ${feature.accent.split(' ')[0]} border-l-4 shadow-lg rounded-xl p-6 flex flex-col items-start text-left transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl`}
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
                    {feature.icon}
                  </motion.div>
                  <span className="font-bold text-lg text-primaryColor">{feature.title}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-200 text-base">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Key Features Section */}
          <div className="w-full flex flex-col items-center mb-0 px-4 md:px-16 pb-0">
            <h2 className="text-xl md:text-2xl font-bold text-primaryColor mb-4 text-center">Key Features of Vedic Mathematics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {[
              {
                title: "Simplicity",
                description: "Aims to simplify complex mathematical calculations through its unique techniques.",
                icon: <Shapes className="w-6 h-6 text-blue-500" />,
                accent: "border-blue-500 from-blue-50/80 to-white/90 dark:from-blue-900/40 dark:to-gray-900/80 text-blue-500"
              },
              {
                title: "Speed",
                description: "Methods are designed to expedite calculations, making them helpful for mental math and quick problem-solving.",
                icon: <Hourglass className="w-6 h-6 text-green-500" />,
                accent: "border-emerald-500 from-emerald-50/80 to-white/90 dark:from-emerald-900/40 dark:to-gray-900/80 text-emerald-500"
              },
              {
                title: "Versatility",
                description: "Offers multiple approaches to solve a single problem, allowing users to choose the method that suits them best.",
                icon: <Sparkles className="w-6 h-6 text-purple-500" />,
                accent: "border-violet-500 from-violet-50/80 to-white/90 dark:from-violet-900/40 dark:to-gray-900/80 text-violet-500"
              },
              {
                title: "Universality",
                description: "Applicable to various branches of mathematics, such as arithmetic, algebra, trigonometry, calculus, and more.",
                icon: <Brain className="w-6 h-6 text-amber-500" />,
                accent: "border-amber-500 from-amber-50/80 to-white/90 dark:from-amber-900/40 dark:to-gray-900/80 text-amber-500"
              },
              ].map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.5, type: 'spring' }}
                  className={`relative bg-gradient-to-br ${feature.accent.split(' ').slice(1).join(' ')} ${feature.accent.split(' ')[0]} border-l-4 shadow-lg rounded-xl p-6 flex flex-col items-start text-left transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl`}
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
                      {feature.icon}
                    </motion.div>
                    <span className="font-bold text-lg text-primaryColor">{feature.title}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 text-base">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Section for Vedic Mathematics */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center bg-gradient-to-r from-primaryColor/10 to-blue-600/10 dark:from-primaryColor/20 dark:to-blue-600/20 p-5 md:p-8 rounded-xl w-full mt-8 mb-0"
          >
            <h2 className="text-xl md:text-2xl font-bold text-primaryColor dark:text-gray-200 mb-3 text-center">
              Ready to Unlock Your Potential with Vedic Mathematics?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-5 md:mb-6 max-w-2xl mx-auto text-sm md:text-base">
              Join thousands of students who have transformed their confidence and skills with our industry-leading Vedic Mathematics course. The future of math mastery is waiting for you!
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open('/enrollment/vedic-mathematics?course=vedic-mathematics', '_blank')}
              className="bg-gradient-to-r from-primaryColor to-blue-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base cursor-pointer"
            >
              Enroll Now
            </motion.button>
          </motion.div>
        </React.Fragment>
      ),
    },
    {
      id: 5,
      name: "Course Features",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full px-4 md:px-16 mb-10">
          {[
            {
              title: "Applicable Across Careers",
              description: "Gain a competitive edge in engineering, finance, data analysis, teaching, research, entrepreneurship, and more.",
              icon: <GraduationCap className="w-6 h-6 text-blue-500" />,
              accent: "border-blue-500 from-blue-50/80 to-white/90 dark:from-blue-900/40 dark:to-gray-900/80 text-blue-500"
            },
            {
              title: "Enhances Problem-Solving & Analytical Thinking",
              description: "Sharpen your ability to solve problems quickly and accurately, and develop logical reasoning for academic and professional success.",
              icon: <Brain className="w-6 h-6 text-green-500" />,
              accent: "border-emerald-500 from-emerald-50/80 to-white/90 dark:from-emerald-900/40 dark:to-gray-900/80 text-emerald-500"
            },
            {
              title: "Boosts Academic Performance",
              description: "Improve speed and accuracy in exams, helping you excel in both competitive and academic assessments.",
              icon: <Trophy className="w-6 h-6 text-amber-500" />,
              accent: "border-amber-500 from-amber-50/80 to-white/90 dark:from-amber-900/40 dark:to-gray-900/80 text-amber-500"
            },
            {
              title: "Promotes Analytical & Data Skills",
              description: "Develop essential skills for research, technology, and data-driven roles in the modern world.",
              icon: <Shapes className="w-6 h-6 text-purple-500" />,
              accent: "border-violet-500 from-violet-50/80 to-white/90 dark:from-violet-900/40 dark:to-gray-900/80 text-violet-500"
            },
            {
              title: "Supports Lifelong Learning",
              description: "Benefit from mental agility and confidence throughout your academic, professional, and personal journey.",
              icon: <ArrowUp className="w-6 h-6 text-cyan-500" />,
              accent: "border-indigo-500 from-indigo-50/80 to-white/90 dark:from-indigo-900/40 dark:to-gray-900/80 text-indigo-500"
            },
            {
              title: "Empowers Versatility & Growth",
              description: "Adapt to diverse challenges and opportunities, fostering growth in every stage of life and career.",
              icon: <Star className="w-6 h-6 text-yellow-500" />,
              accent: "border-pink-500 from-pink-50/80 to-white/90 dark:from-pink-900/40 dark:to-gray-900/80 text-pink-500"
            },
          ].map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5, type: 'spring' }}
              className={`relative bg-gradient-to-br ${feature.accent.split(' ').slice(1).join(' ')} ${feature.accent.split(' ')[0]} border-l-4 shadow-lg rounded-xl p-6 flex flex-col items-start text-left transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl`}
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
                  {feature.icon}
                </motion.div>
                <span className="font-bold text-lg text-primaryColor">{feature.title}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-200 text-base">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      id: 2,
      name: "Benefits",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full px-4 md:px-16 mb-10">
          {[
            {
              title: "Speed & Efficiency",
              description: "Master rapid mental calculation techniques for complex problems—ideal for competitive exams and real-world challenges.",
              icon: <Hourglass className="w-6 h-6 text-blue-500" />,
              accent: "border-blue-500 from-blue-50/80 to-white/90 dark:from-blue-900/40 dark:to-gray-900/80 text-blue-500"
            },
            {
              title: "Flexibility & Versatility",
              description: "Solve problems in multiple ways, making math adaptable and engaging for all ages and backgrounds.",
              icon: <Shapes className="w-6 h-6 text-green-500" />,
              accent: "border-emerald-500 from-emerald-50/80 to-white/90 dark:from-emerald-900/40 dark:to-gray-900/80 text-emerald-500"
            },
            {
              title: "Simplicity & Ease of Learning",
              description: "Learn concise, easy-to-remember methods that make mathematics accessible and enjoyable.",
              icon: <BookOpen className="w-6 h-6 text-purple-500" />,
              accent: "border-violet-500 from-violet-50/80 to-white/90 dark:from-violet-900/40 dark:to-gray-900/80 text-violet-500"
            },
            {
              title: "Cognitive & Analytical Benefits",
              description: "Sharpen memory, concentration, and analytical thinking—nurturing both sides of the brain and boosting problem-solving skills.",
              icon: <Brain className="w-6 h-6 text-amber-500" />,
              accent: "border-amber-500 from-amber-50/80 to-white/90 dark:from-amber-900/40 dark:to-gray-900/80 text-amber-500"
            },
            {
              title: "Cultural & Historical Value",
              description: "Connect with India’s rich mathematical heritage and discover the timeless wisdom of Vedic traditions.",
              icon: <BookOpen className="w-6 h-6 text-orange-500" />,
              accent: "border-pink-500 from-pink-50/80 to-white/90 dark:from-pink-900/40 dark:to-gray-900/80 text-pink-500"
            },
            {
              title: "Fun, Engagement & Competitive Edge",
              description: "Enjoy learning math, develop critical thinking, and gain a competitive advantage in academics and beyond.",
              icon: <Trophy className="w-6 h-6 text-yellow-500" />,
              accent: "border-indigo-500 from-indigo-50/80 to-white/90 dark:from-indigo-900/40 dark:to-gray-900/80 text-indigo-500"
            },
          ].map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5, type: 'spring' }}
              className={`relative bg-gradient-to-br ${feature.accent.split(' ').slice(1).join(' ')} ${feature.accent.split(' ')[0]} border-l-4 shadow-lg rounded-xl p-6 flex flex-col items-start text-left transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl`}
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
                  {feature.icon}
                </motion.div>
                <span className="font-bold text-lg text-primaryColor">{feature.title}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-200 text-base">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      id: 4,
      name: "Sutras and Sub-sutras",
      content: (
        <div className="px-4 md:px-16">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300 leading-relaxed"
          >
            Vedic Mathematics is based on a set of 16 main sutras (aphorisms)
            and 12 sub-sutras (corollaries). These sutras and sub-sutras are
            short and concise rules or principles that serve as the foundation
            for various mathematical operations. They provide a systematic and
            efficient way to perform calculations mentally.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-6"
          >
            {/* Main Sutras Table */}
            <div>
              <h3 className="text-lg font-bold text-center mb-4 text-primaryColor">Main Sutras (Aphorisms)</h3>
              <table className="table-auto border-collapse w-full text-center text-[#41454F] dark:text-gray50 my-0">
                <thead className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/30 dark:to-purple-900/30">
                  <tr>
                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 font-bold text-xs md:text-sm">
                      Sutra Name
                    </th>
                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 font-bold text-xs md:text-sm">
                      Meaning
                    </th>
                  </tr>
                </thead>
                <tbody>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="font-bold text-sm md:text-base">Ekādhikena Purvena</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="text-[#727695] dark:text-gray300">
                          By one more than the previous one.
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="font-bold text-sm md:text-base">Shunyam Saamyasamuccaye</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="text-[#727695] dark:text-gray300">
                          When the sum is the same, that sum is zero.
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="font-bold text-sm md:text-base">Nikhilam Navataścaramam Daśataḥ</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="text-[#727695] dark:text-gray300">
                          All from 9 and the last from 10.
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="font-bold text-sm md:text-base">Urdhva-tiryagbhyam</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="text-[#727695] dark:text-gray300">
                          Vertically and crosswise.
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="font-bold text-sm md:text-base">Parāvartya Yojayet</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="text-[#727695] dark:text-gray300">
                          Transpose and apply.
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="font-bold text-sm md:text-base">Sankalana-vyavakalanābhyām</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="text-[#727695] dark:text-gray300">
                          By addition and by subtraction.
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="font-bold text-sm md:text-base">Pūranāpūranābhyām</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="text-[#727695] dark:text-gray300">
                          By the completion or non-completion.
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="font-bold text-sm md:text-base">Chalana-kalanābhyām</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="text-[#727695] dark:text-gray300">
                          By the movement and by the motion.
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="font-bold text-sm md:text-base">Yāvadūnam</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="text-[#727695] dark:text-gray300">
                          Whatever the extent of its deficiency.
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="font-bold text-sm md:text-base">Vyashtiṣamashtiḥ</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="text-[#727695] dark:text-gray300">
                          The whole is equal to the sum of its parts.
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="font-bold text-sm md:text-base">Sheshānyankena Charamena</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="text-[#727695] dark:text-gray300">
                          The remainders by the last digit.
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="font-bold text-sm md:text-base">Gunitasamuccayah Samuccayagunitah</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="text-[#727695] dark:text-gray300">
                          The product of the sum is the sum of the products.
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="font-bold text-sm md:text-base">Antyayordashake'pi</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="text-[#727695] dark:text-gray300">
                          The last digits are the same.
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="font-bold text-sm md:text-base">Antyayoreva</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="text-[#727695] dark:text-gray300">
                          Only the last terms.
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="font-bold text-sm md:text-base">Lopanasthāpanābhyām</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="text-[#727695] dark:text-gray300">
                          By alternate elimination and retention.
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="font-bold text-sm md:text-base">Vilokanam</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm">
                        <div className="text-[#727695] dark:text-gray300">
                          By mere observation.
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-6"
          >
            {/* Sub-Sutras Table */}
            <div>
              <h3 className="text-lg font-bold text-center mb-4 text-primaryColor">Sub-Sutras (Corollaries)</h3>
              <table className="table-auto border-collapse w-full text-center text-[#41454F] dark:text-gray50 my-0">
                <thead className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-900/30 dark:to-emerald-900/30">
                  <tr>
                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 font-bold text-xs md:text-sm w-1/2 text-center">
                      Sub-Sutra Name
                    </th>
                    <th className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 font-bold text-xs md:text-sm w-1/2 text-center">
                      Meaning
                    </th>
                  </tr>
                </thead>
                <tbody>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm w-1/2 text-center">
                        <div className="font-bold text-sm md:text-base">Yāvadūnena Vargānām</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm w-1/2 text-center">
                        <div className="text-[#727695] dark:text-gray300">
                          Whatever the extent of the square.
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm w-1/2 text-center">
                        <div className="font-bold text-sm md:text-base">Lopanasthāpanabhyām</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm w-1/2 text-center">
                        <div className="text-[#727695] dark:text-gray300">
                          By alternately less and more.
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm w-1/2 text-center">
                        <div className="font-bold text-sm md:text-base">Anurupyena</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm w-1/2 text-center">
                        <div className="text-[#727695] dark:text-gray300">
                          Proportionally.
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm w-1/2 text-center">
                        <div className="font-bold text-sm md:text-base">Adyamadyenantyamantyena</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm w-1/2 text-center">
                        <div className="text-[#727695] dark:text-gray300">
                          The first by the first and the last by the last.
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm w-1/2 text-center">
                        <div className="font-bold text-sm md:text-base">Kevalaih Saptakam Gunyat</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm w-1/2 text-center">
                        <div className="text-[#727695] dark:text-gray300">
                          By 7 only multiply.
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm w-1/2 text-center">
                        <div className="font-bold text-sm md:text-base">Sesānyankena Caramena</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm w-1/2 text-center">
                        <div className="text-[#727695] dark:text-gray300">
                          The remainders by the last digit.
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm w-1/2 text-center">
                        <div className="font-bold text-sm md:text-base">Sopantyadvayamantyam</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm w-1/2 text-center">
                        <div className="text-[#727695] dark:text-gray300">
                          The ultimate and twice the penultimate.
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm w-1/2 text-center">
                        <div className="font-bold text-sm md:text-base">Ekanyūnena Pūrvena</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm w-1/2 text-center">
                        <div className="text-[#727695] dark:text-gray300">
                          By one less than the previous one.
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm w-1/2 text-center">
                        <div className="font-bold text-sm md:text-base">Gunitasamuccayah</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm w-1/2 text-center">
                        <div className="text-[#727695] dark:text-gray300">
                          The product of the sum is equal to the sum of the products.
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm w-1/2 text-center">
                        <div className="font-bold text-sm md:text-base">Gunakasamuccayah</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm w-1/2 text-center">
                        <div className="text-[#727695] dark:text-gray300">
                          The factors of the sum is equal to the sum of the factors.
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm w-1/2 text-center">
                        <div className="font-bold text-sm md:text-base">Vilokanam</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm w-1/2 text-center">
                        <div className="text-[#727695] dark:text-gray300">
                          By mere observation.
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm w-1/2 text-center">
                        <div className="font-bold text-sm md:text-base">Dhvajanka</div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm w-1/2 text-center">
                        <div className="text-[#727695] dark:text-gray300">
                          On the flag.
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lightGrey14 mb-0 md:text-[15px] text-[14px] dark:text-gray300 leading-relaxed"
          >
            Vedic Mathematics core principles, represented by these sutras and
            sub-sutras, enable fast and efficient mental calculations for
            various mathematical operations such as addition, subtraction,
            multiplication, division, squaring, square roots, cube roots, and
            more. Mastering these enhances mental calculation skills and offers
            efficient methods for problem-solving.
          </motion.p>
        </div>
      ),
    },
  ],
};

const VedicOverview = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  // Handle scroll to top visibility with debounce
  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setShowScrollTop(window.scrollY > 400);
      }, 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const activeContent = data.tabs.find((tab) => tab.id === activeTab);

  const tabIcons = {
    1: <Calculator className="w-5 h-5" />,
    2: <Star className="w-5 h-5" />,
    3: <GraduationCap className="w-5 h-5" />,
    4: <BookOpen className="w-5 h-5" />
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primaryColor border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading Vedic Mathematics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-[50vh]">
      {/* Background gradient overlay with enhanced effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20" />
      <div className="absolute inset-0 bg-[url('/images/pattern-light.svg')] dark:bg-[url('/images/pattern-dark.svg')] opacity-10 bg-repeat" />
      
      <div className="relative w-full px-0 py-16">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
          className="flex items-center flex-col w-full mb-16"
        >
          <h1 className="text-[24px] text-center leading-7 md:text-4xl font-bold md:mb-3 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primaryColor to-blue-600">
            Why Choose Medh’s Vedic Mathematics Course?
          </h1>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-5 font-medium text-center max-w-2xl mx-auto">
            Rooted in the ancient Vedas, meaning "knowledge," Vedic Mathematics at MEDH transforms math learning. This course helps overcome math anxiety and unlock your inner mathematician through a simple, holistic approach.
          </p>
          
        </motion.div>

        {/* Tabs with enhanced styling - match AI/Data Science Overview */}
        <div className="flex justify-center mb-8">
          <nav className="inline-block rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            {data.tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
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
                {/* Removed icon: {tabIcons[tab.id]} */}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Rendering with improved styling */}
        <AnimatePresence mode="wait">
          <div
            key={activeTab}
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            <div className="mt-4">{activeContent.content}</div>
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default memo(VedicOverview);
