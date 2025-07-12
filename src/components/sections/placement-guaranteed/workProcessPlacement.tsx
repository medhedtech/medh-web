import React from "react";
import { motion } from "framer-motion";
import {
  FaBookOpen,
  FaLaptopCode,
  FaHandsHelping,
  FaBriefcase,
  FaCheckCircle,
} from "react-icons/fa";

interface IProcessStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const processSteps: IProcessStep[] = [
  {
    title: "Enroll in a Course",
    description:
      "Select from our extensive array of job-oriented courses tailored to match your career goals and aspirations.",
    icon: <FaBookOpen className="w-7 h-7 text-white" />,
    color: "#3b82f6",
    bgColor: "bg-blue-500",
  },
  {
    title: "Complete the Program",
    description:
      "Participate in dynamic lessons, hands-on projects, and thorough assessments designed to build and refine your skills.",
    icon: <FaLaptopCode className="w-7 h-7 text-white" />,
    color: "#10b981",
    bgColor: "bg-emerald-500",
  },
  {
    title: "Receive Career Support",
    description:
      "Leverage our dedicated career services team for assistance with job applications, interview preparation, and more.",
    icon: <FaHandsHelping className="w-7 h-7 text-white" />,
    color: "#8b5cf6",
    bgColor: "bg-violet-500",
  },
  {
    title: "Corporate Internships",
    description:
      "Ensuring you are well-prepared for full-time employment upon completing the program.",
    icon: <FaBriefcase className="w-7 h-7 text-white" />,
    color: "#f59e0b",
    bgColor: "bg-amber-500",
  },
  {
    title: "Secure Your Job",
    description:
      "Successfully complete the course and benefit from our guarantee of job placement in a relevant role.",
    icon: <FaCheckCircle className="w-7 h-7 text-white" />,
    color: "#ec4899",
    bgColor: "bg-pink-500",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const WorkProcessPlacement: React.FC = () => {
  return (
    <section className="relative bg-white dark:bg-slate-950 pt-2 md:pt-4 pb-0 md:pb-0 overflow-hidden w-full">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20"></div>
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-blue-50/50 dark:from-emerald-950/20 dark:via-transparent dark:to-blue-950/20"></div>
      {/* Floating Elements */}
      <div className="absolute top-10 sm:top-20 left-0 w-20 h-20 sm:w-32 sm:h-32 bg-emerald-200/20 dark:bg-emerald-800/20 rounded-full blur-2xl sm:blur-3xl animate-blob"></div>
      <div className="absolute bottom-10 sm:bottom-20 right-0 w-24 h-24 sm:w-40 sm:h-40 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-2xl sm:blur-3xl animate-blob animation-delay-2000"></div>
      <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-12">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight whitespace-nowrap">
            Our Placement <span className="text-emerald-600 dark:text-emerald-400">Process</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            A step-by-step approach to landing your dream job through Medh's guaranteed placement pathway.
          </p>
        </div>
        {/* Process Steps */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center md:items-stretch px-0"
        >
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-1 min-w-[220px] max-w-xs md:max-w-sm lg:max-w-xs flex flex-col items-center text-center"
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-600 shadow-sm w-full h-full flex flex-col items-center">
                <div className={`flex-shrink-0 w-14 h-14 ${step.bgColor} rounded-xl flex items-center justify-center shadow-md mb-3`}>
                  {step.icon}
                </div>
                <div className="flex flex-col items-center mb-2">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight mb-1">
                    {step.title}
                  </h4>
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                    Step {index + 1}
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-4 md:mt-4"
        >
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-200/50 dark:border-emerald-700/50">
            <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1 sm:mb-2">5</div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">Placement Steps</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1 sm:mb-2">100%</div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">Job Guarantee</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1 sm:mb-2">18 mo</div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">Total Duration</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export { WorkProcessPlacement }; 