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
        <>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300 leading-relaxed"
          >
            Vedic Mathematics Course offers a wide array of benefits, from
            simplifying complex calculations to enhancing mental agility and
            boosting confidence. The system&#39;s versatility and applicability
            across various branches of mathematics make it a valuable tool for
            individuals preparing for competitive exams or seeking to improve
            their mathematical skills.
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300 leading-relaxed"
          >
            With its emphasis on simplicity, speed, and universality, Vedic
            Mathematics has the potential to transform the way individuals
            perceive and engage with mathematics, making it an essential skill
            for personal and professional growth.
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[1.3rem] font-bold mb-4 tracking-wide dark:text-gray50 bg-clip-text text-transparent bg-gradient-to-r from-primaryColor to-blue-600"
          >
            Transformative Learning Experience
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300 leading-relaxed"
          >
            In today&#39;s competitive world, the ability to solve problems
            quickly is crucial, and that&#39;s where Vedic Mathematics comes to
            your rescue. Through interactive and easy-to-follow lessons and
            practice exercises, you will learn powerful techniques that make
            math easy and enjoyable, including:
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4 mb-6"
          >
            {[
              {
                title: "Easy Tricks to Solve",
                description:
                  "Addition, Subtraction, Multiplication, and Division",
                icon: <Calculator className="w-6 h-6 text-primary-500" />
              },
              {
                title: "Fast & Accurate Calculations of",
                description:
                  "Square Root, Cube, Cube Root, HCF, LCM, and Algebra",
                icon: <Zap className="w-6 h-6 text-amber-500" />
              },
            ].map((feature, index) => (
              <ListItem key={index} feature={feature} index={index} />
            ))}
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300 leading-relaxed"
          >
            And lots of other lessons that help you fall in love with
            Mathematics.
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-[1.3rem] font-bold mb-4 tracking-wide dark:text-gray50 bg-clip-text text-transparent bg-gradient-to-r from-primaryColor to-blue-600"
          >
            Key Features of Vedic Mathematics
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          >
            {[
              {
                title: "Simplicity",
                description:
                  "Aims to simplify complex mathematical calculations through its unique techniques.",
                icon: <Shapes className="w-6 h-6 text-blue-500" />
              },
              {
                title: "Speed",
                description:
                  "Methods are designed to expedite calculations, making them helpful for mental math and quick problem-solving.",
                icon: <Hourglass className="w-6 h-6 text-green-500" />
              },
              {
                title: "Versatility",
                description:
                  "Offers multiple approaches to solve a single problem, allowing users to choose the method that suits them best.",
                icon: <Sparkles className="w-6 h-6 text-purple-500" />
              },
              {
                title: "Universality",
                description:
                  "Applicable to various branches of mathematics, such as arithmetic, algebra, trigonometry, calculus, and more.",
                icon: <Brain className="w-6 h-6 text-amber-500" />
              },
            ].map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </motion.div>
        </>
      ),
    },
    {
      id: 2,
      name: "Benefits",
      content: (
        <>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          >
            {[
              {
                title: "Speed and Efficiency",
                description:
                  "Provides mental calculation techniques for complex calculations, particularly useful in competitive exams.",
                icon: <Hourglass className="w-6 h-6 text-blue-500" />
              },
              {
                title: "Flexibility",
                description:
                  "Offers multiple approaches to solving a single problem, making it a versatile system.",
                icon: <Shapes className="w-6 h-6 text-green-500" />
              },
              {
                title: "Simplicity and Ease of Learning",
                description:
                  "Designed to be concise and easy to remember, making it accessible to learners of various ages and mathematical backgrounds.",
                icon: <BookOpen className="w-6 h-6 text-purple-500" />
              },
              {
                title: "Mental Calculation Skills",
                description:
                  "Emphasizes mental calculation techniques, which help improve overall mental math abilities.",
                icon: <Brain className="w-6 h-6 text-amber-500" />
              },
              {
                title: "Enhances Mathematical Aptitude",
                description:
                  "Leads to a deeper understanding of mathematical concepts and enhances problem-solving skills.",
                icon: <Calculator className="w-6 h-6 text-red-500" />
              },
              {
                title: "Universal Applicability",
                description:
                  "Principles can be applied across various mathematical disciplines.",
                icon: <GraduationCap className="w-6 h-6 text-cyan-500" />
              },
              {
                title: "Cognitive Benefits",
                description:
                  "Improves concentration, memory, and mental agility, as well as encourages creative thinking.",
                icon: <Brain className="w-6 h-6 text-pink-500" />
              },
              {
                title: "Fun and Engaging",
                description:
                  "Makes mathematics an enjoyable and engaging subject to learn.",
                icon: <Star className="w-6 h-6 text-yellow-500" />
              },
              {
                title: "Cultural and Historical Value",
                description:
                  "Provides a link to the rich cultural heritage of India.",
                icon: <BookOpen className="w-6 h-6 text-orange-500" />
              },
              {
                title: "Competitive Aptitude",
                description:
                  "Develops critical thinking, time management, and problem-solving abilities.",
                icon: <Trophy className="w-6 h-6 text-amber-500" />
              },
              {
                title: "Nurtures Both Sides of the Brain",
                description:
                  "Cultivates the development of both the left and right hemispheres of the brain.",
                icon: <Brain className="w-6 h-6 text-purple-500" />
              },
            ].map((feature, index) => (
              <BenefitCard key={index} feature={feature} index={index} />
            ))}
          </motion.div>
        </>
      ),
    },

    {
      id: 3,
      name: "Career Prospects",
      content: (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl shadow-md mb-6 border border-blue-100 dark:border-gray-600"
          >
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300 leading-relaxed"
            >
              While the Vedic Math course is not explicitly tailored for career
              purposes, enhancing your math skills through this course can prove
              beneficial in a wide range of fields, including engineering,
              finance, data analysis, teaching, research, and entrepreneurial
              ventures.
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300 leading-relaxed"
            >
              The speed, accuracy, and problem-solving abilities gained through
              Vedic Mathematics can provide a competitive edge in various career
              paths and academic pursuits.
            </motion.p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          >
            <CareerCard 
              title="Technology Fields" 
              description="Vedic Mathematics extends to fields like computer science, artificial intelligence, cryptography, and more, making it a valuable asset where rapid calculations and optimization are essential."
              growth="24%"
              icon={<Brain className="w-10 h-10 text-blue-500" />}
              delay={0.4}
            />
            <CareerCard 
              title="Academic Pursuits" 
              description="Whether it's gaining a competitive edge in exams or venturing into academia, the benefits of Vedic Mathematics transcend traditional boundaries."
              growth="18%"
              icon={<GraduationCap className="w-10 h-10 text-purple-500" />}
              delay={0.5}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl shadow-md border border-amber-100 dark:border-gray-600"
          >
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-lightGrey14 mb-0 md:text-[15px] text-[14px] dark:text-gray300 leading-relaxed"
            >
              Whether it&#39;s gaining a competitive edge in exams, venturing into
              academia, or exploring entrepreneurial endeavors, the benefits of
              Vedic Mathematics transcend traditional career boundaries,
              presenting an array of possibilities for individuals seeking to
              leverage their mathematical prowess.
            </motion.p>
          </motion.div>
        </>
      ),
    },
    {
      id: 4,
      name: "Sutras and Sub-sutras",
      content: (
        <>
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
          <table className="table-auto border-collapse w-full text-center text-[#41454F] dark:text-gray50 my-0">
            <thead className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/30 dark:to-purple-900/30">
              <tr>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-bold text-sm md:text-base">
                  Main Sutras (aphorisms)
                </th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-bold text-sm md:text-base">
                  Sub-Sutras (corollaries)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                  <div className="font-bold">Ekādhikena Purvena</div>
                  <div className="text-[#727695] dark:text-gray300">
                    By one more than the previous one.
                  </div>
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                  <div className="font-bold">Yāvadūnena Vargānām</div>
                  <div className="text-[#727695] dark:text-gray300">
                    Whatever the extent of the square.
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                  <div className="font-bold">Shunyam Saamyasamuccaye.</div>
                  <div className="text-[#727695] dark:text-gray300">
                    When the sum is the same, that sum is zero.
                  </div>
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                  <div className="font-bold">Lopanasthāpanabhyām.</div>
                  <div className="text-[#727695] dark:text-gray300">
                    By alternately less and more.
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                  <div className="font-bold">Nikhilam Navataścaramam Daśataḥ</div>
                  <div className="text-[#727695] dark:text-gray300">
                    All from 9 and the last from 10.
                  </div>
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                  <div className="font-bold">Anurupyena</div>
                  <div className="text-[#727695] dark:text-gray300">
                    Proportionally.
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                  <div className="font-bold">Urdhva-tiryagbhyam</div>
                  <div className="text-[#727695] dark:text-gray300">
                    Vertically and crosswise.
                  </div>
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">
                  <div className="font-bold">Adyamadyenantyamantyena</div>
                  <div className="text-[#727695] dark:text-gray300">
                    The first by the first and the last by the last.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
        </>
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
      
      <div className="relative container mx-auto px-4 py-16">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
          className="flex items-center flex-col w-full md:w-[80%] mx-auto mb-16"
        >
          <h1 className="text-[24px] text-center leading-7 md:text-4xl font-bold md:mb-3 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primaryColor to-blue-600">
            Unlock the Potential of Vedic Mathematics with Medh and Experience its Transformative Magic!
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-primaryColor to-blue-600 rounded-full mb-4"></div>
          <p className="text-center md:text-[18px] text-[14px] leading-6 md:leading-8 md:w-[90%] text-[#727695] dark:text-gray-300">
            An ancient system deeply rooted in the sacred texts of India known as the Vedas. The term "Veda," meaning knowledge, reflects the endless pursuit of learning and discovery.
          </p>
          <p className="text-center py-4 md:text-[18px] text-[14px] leading-6 md:leading-8 md:w-[80%] text-[#727695] dark:text-gray-300">
            At MEDH, the Vedic Mathematics course is tailored to revolutionize math problem-solving, aiming to unleash your inner mathematician. It offers a holistic approach to conquer math anxiety and embrace the beauty of mathematics.
          </p>
        </motion.div>

        {/* Tabs with enhanced styling */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex md:mx-0 mx-4 space-x-3 flex-wrap justify-center mb-8" 
          role="tablist"
        >
          {data.tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 md:px-6 py-3 transition-all duration-300 rounded-lg flex items-center gap-2 font-medium ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-primaryColor to-blue-600 text-white shadow-lg"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              onClick={() => handleTabChange(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
            >
              {tabIcons[tab.id]}
              {tab.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Content Rendering with improved styling */}
        <AnimatePresence mode="wait">
          <motion.section
            key={activeTab}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/90 backdrop-blur-sm mx-4 md:mx-auto mt-6 dark:bg-gray-800/90 px-6 py-8 border border-gray-200 dark:border-gray-700 text-lightGrey14 rounded-2xl shadow-xl"
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            <h2 className="text-[23px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-primaryColor to-blue-600 mb-6">
              {activeContent.name}
            </h2>
            <div className="mt-4">{activeContent.content}</div>
          </motion.section>
        </AnimatePresence>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl shadow-lg border border-blue-100 dark:border-gray-700 max-w-4xl mx-auto text-center"
        >
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Ready to Master Vedic Mathematics?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Join thousands of students who have transformed their mathematical skills and conquered their fear of numbers through our comprehensive Vedic Mathematics course.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-primaryColor to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all font-medium"
          >
            Enroll Today
          </motion.button>
        </motion.div>

        {/* Scroll to Top Button with improved styling */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed bottom-4 right-4 bg-gradient-to-r from-primaryColor to-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-primaryColor/90 transition-all z-50"
              onClick={() => {/* Removing scroll functionality */}}
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-6 w-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default memo(VedicOverview);
